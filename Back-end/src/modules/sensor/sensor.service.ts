import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MqttService } from 'src/base/mqtt/mqtt.service';
import { SensorGateway } from './sensor.gateway';
import { DateTime } from 'luxon';

@Injectable()
export class SensorService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly mqttService: MqttService,
    private sensorGateway: SensorGateway,
  ) {
    this.subscribeToEsp8266Data();
  }

  async getAllSensors(): Promise<any> {
    const sql = 'SELECT * FROM data_sensor';
    try {
      const rows = await this.dataSource.query(sql);
      // console.log(rows);
      return rows;
    } catch (err) {
      throw new Error('Not found');
    }
  }

  async getPaginatedSensors(
    page: number,
    limit: number,
    sortBy?: string,
    order?: string,
    searchField?: string,
    searchValue?: string,
    globalSearchValue?: string,
  ) {
    // Giả sử bạn có một mảng cảm biến để phân trang
    let sensors = await this.getAllSensors();

    if (globalSearchValue) {
      const searchValueLower = String(globalSearchValue).toLowerCase();
      console.log(searchValueLower);
      sensors = sensors.filter((sensor) => {
        const humidity = String(sensor['humidity']).toLowerCase();
        const temperature = String(sensor['temperature']).toLowerCase();
        const light = String(sensor['light']).toLowerCase();
        const timeUpdated: string = String(
          sensor['time_updated'],
        ).toLowerCase();
        console.log(timeUpdated);

        // Chuyển đổi timeUpdated thành đối tượng Date
        const date: Date = new Date(timeUpdated);

        // Tạo hàm để thêm số 0 vào trước nếu số chỉ có một chữ số
        const padZero = (num: number): string =>
          num.toString().padStart(2, '0');

        // Định dạng lại thành YYYY-MM-DD HH:mm:ss
        const formattedDate: string = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;

        console.log(formattedDate);

        // Chuyển giá trị ngày thành chuỗi theo định dạng dễ tìm kiếm (YYYY-MM-DD HH:mm:ss)
        const sensorDate = new Date(timeUpdated);
        const sensorDateStr = sensorDate.toISOString().split('T')[0]; // Chỉ lấy phần ngày 'YYYY-MM-DD'
        const sensorDateTimeStr = sensorDate
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19); // Lấy cả ngày và giờ 'YYYY-MM-DD HH:mm:ss'

        // Tìm kiếm theo thứ tự các cột
        return (
          humidity.includes(searchValueLower) ||
          temperature.includes(searchValueLower) ||
          light.includes(searchValueLower) ||
          sensorDateStr.includes(searchValueLower) ||
          sensorDateTimeStr.includes(searchValueLower) ||
          formattedDate.includes(searchValueLower)
        );
      });
    } else if (searchField && searchValue) {
      sensors = sensors.filter((sensor) => {
        const sensorValue = String(sensor[searchField]).toLowerCase();
        const searchValueLower = String(searchValue).toLowerCase();

        // Kiểm tra nếu trường tìm kiếm là thời gian
        if (searchField === 'time_updated') {
          const date: Date = new Date(sensorValue);

          // Tạo hàm để thêm số 0 vào trước nếu số chỉ có một chữ số
          const padZero = (num: number): string =>
            num.toString().padStart(2, '0');

          // Định dạng lại thành YYYY-MM-DD HH:mm:ss
          const formattedDate: string = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;

          console.log(formattedDate);
          if (
            formattedDate.includes(searchValueLower)
          ) {
            return true;
          }

          // Ngoài ra, vẫn tìm kiếm dựa trên chuỗi gốc
          return sensorValue.includes(searchValueLower);
        }

        // Tìm kiếm cho các trường khác (humidity, temperature, light)
        return sensorValue.includes(searchValueLower);
      });
    }

    // Sắp xếp nếu có tham số sortBy và order
    if (sortBy && order) {
      sensors.sort((a, b) => {
        if (order === 'asc') {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });
    }

    // Tính toán vị trí bắt đầu và kết thúc của trang
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Lấy dữ liệu cảm biến cho trang hiện tại
    const paginatedSensors = sensors.slice(startIndex, endIndex);

    return {
      page,
      limit,
      total: sensors.length,
      data: paginatedSensors,
    };
  }

  private subscribeToEsp8266Data() {
    this.mqttService.subscribe(
      'esp8266_data',
      async (topic: string, payload: Buffer) => {
        const data = JSON.parse(payload.toString());
        console.log(`Received data from topic ${topic}:`, data);

        await this.processReceivedData(data);
        this.sensorGateway.sendSensorData(data);
      },
    );
  }

  private async processReceivedData(data: any) {
    try {
      const now = DateTime.now().setZone('Asia/Ho_Chi_Minh');
      const temp = now.toFormat('yyyy-MM-dd HH:mm:ss');
      console.log(temp);
      const sql = `
        INSERT INTO data_sensor (temperature, humidity, light, time_updated)
        VALUES (?, ?, ?, ?)
      `;
      await this.dataSource.query(sql, [
        Number(data.temperature),
        Number(data.humidity),
        Number(data.light),
        temp,
      ]);
      console.log('Data from ESP8266 inserted into database');
    } catch (err) {
      console.error('Failed to insert data into database', err);
    }
  }

  async getLatestRecord(): Promise<any> {
    const sql = `
      SELECT * FROM data_sensor
      ORDER BY time_updated DESC
      LIMIT 1
    `;
    try {
      const rows = await this.dataSource.query(sql);
      return rows[0];
    } catch (err) {
      console.error('Failed to fetch latest sensor data', err);
      throw new Error('Failed to fetch latest sensor data');
    }
  }
}
