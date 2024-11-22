import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('sensor')
@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  // @Get('all')
  // @ApiOperation({ summary: 'Lấy tất cả thông tin của sensor' })
  // @ApiResponse({ status: 200, description: 'Successful response' })
  // @ApiResponse({ status: 404, description: 'Not found' })
  // async getAll(@Res() res: Response) {
  //   try {
  //     const result = await this.sensorService.getAllSensors();
  //     res.send(result);
  //   } catch (err) {
  //     res.status(404).send('Not found');
  //   }
  // }

  @Get('paginated')
@ApiOperation({ summary: 'Phân trang bao gồm tìm kiếm và sắp xếp' })
@ApiQuery({ name: 'page', required: true, description: 'Trang' })
@ApiQuery({ name: 'limit', required: true, description: 'Số bản ghi trên một trang' })
@ApiQuery({ name: 'sortBy', required: false, description: 'Sắp xếp' })
@ApiQuery({ name: 'order', required: false, description: 'Tăng hoặc giảm (asc/desc)' })
@ApiQuery({ name: 'searchField', required: false, description: 'Tìm kiếm' })
@ApiQuery({ name: 'searchValue', required: false, description: 'Giá trị tìm kiếm' })
@ApiQuery({ name: 'globalSearchValue', required: false, description: 'Tìm kiếm tổng' })
@ApiResponse({ status: 200, description: 'Successful response' })
@ApiResponse({ status: 400, description: 'Bad Request' })
async getPaginated(
  @Query('page') page: number,
  @Query('limit') limit: number,
  @Query('sortBy') sortBy: string,
  @Query('order') order: string,
  @Query('searchField') searchField: string,
  @Query('searchValue') searchValue: string,
  @Query('globalSearchValue') globalSearchValue: string,
  @Res() res: Response
) {
  try {
    console.log(page, limit, sortBy, order, searchField, searchValue, globalSearchValue);
    const result = await this.sensorService.getPaginatedSensors(page, limit, sortBy, order, searchField, searchValue, globalSearchValue);
    res.send(result);
  } catch (err) {
    res.status(400).send('Bad Request');
  }
}

  @Get('latest')
  @ApiOperation({ summary: 'Lấy thông tin mới nhất của sensor' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiResponse({ status: 400, description: 'Failed to fetch latest sensor data' })
  async getLatestRecord(@Res() res: Response) {
    try {
      const latestRecord = await this.sensorService.getLatestRecord();
      res.send(latestRecord);
    } catch (err) {
      res.status(400).send('Failed to fetch latest sensor data');
    }
  }
}