#ifdef ESP8266
#include <ESP8266WiFi.h>  // Thêm thư viện để quản lý WiFi cho ESP8266
#else
#include <WiFi.h>  // Thêm thư viện WiFi cho các board khác
#endif
#include <stdlib.h>            // Thêm thư viện chuẩn cho các hàm như malloc, free
#include "DHTesp.h"            // Thêm thư viện cho cảm biến DHT
#include <ArduinoJson.h>       // Thêm thư viện để làm việc với JSON
#include <PubSubClient.h>      // Thêm thư viện để làm việc với MQTT
#include <WiFiClientSecure.h>  // Thêm thư viện cho kết nối WiFi an toàn

/**** Cài đặt cho cảm biến DHT11 *******/
#define DHTpin 2  // Thiết lập chân cho DHT là GPIO14 - D5
#define mqtt_topic_pub "sensor"
#define mqtt_topic_sub "led_status"
DHTesp dht;

/**** Cài đặt LED *******/
const int led1 = 5;   // Thiết lập chân cho LED là GPIO5 - D1
const int led2 = 4;   // Thiết lập chân cho LED là GPIO4 - D2
const int led3 = 16;  // Thiết lập chân cho LED là GPIO16 - D0
boolean stled1 = false;
boolean stled2 = false;
boolean stled3 = false;

unsigned long previousBlinkTime = 0;
const long blinkInterval = 25;  // Thời gian nhấp nháy nhanh hơn (0.025 giây)
  // Thời gian nhấp nháy (0.05 giây)
bool blinkState = false;

int randomValue; // Biến lưu giá trị ngẫu nhiên

/****** Chi tiết kết nối WiFi *******/
const char* ssid = "VanND";
const char* password = "00000001";
/******* Chi tiết kết nối với máy chủ MQTT *******/
const char* mqtt_server = "4e637ce896b248d690ca5d31224ae51c.s1.eu.hivemq.cloud";
const char* mqtt_username = "conghuan";
const char* mqtt_password = "0985889474";
const int mqtt_port = 8883;

/**** Khởi tạo kết nối WiFi an toàn *****/
WiFiClientSecure espClient;

/**** Khởi tạo MQTT Client sử dụng kết nối WiFi *****/
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

/************* Kết nối đến WiFi ***********/
void setup_wifi() {
  delay(10);
  Serial.print("\nĐang kết nối đến ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);  // Thiết lập chế độ WiFi là station
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("\nKết nối WiFi thành công\nĐịa chỉ IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Lặp cho đến khi kết nối thành công
  while (!client.connected()) {
    Serial.print("Đang cố gắng kết nối MQTT...");
    String clientId = "ESP8266Client-";  // Tạo một ID ngẫu nhiên cho client
    clientId += String(random(0xffff), HEX);
    // Thử kết nối
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("đã kết nối");

      client.subscribe(mqtt_topic_sub);
      Serial.print("Đã đăng ký topic ");
      Serial.println(mqtt_topic_sub);  // Đăng ký topic tại đây

    } else {
      Serial.print("thất bại, rc=");
      Serial.print(client.state());
      Serial.println(" thử lại sau 5 giây");  // Đợi 5 giây trước khi thử lại
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String incommingMessage = "";
  for (int i = 0; i < length; i++) incommingMessage += (char)payload[i];

  Serial.println("Tin nhắn đến [" + String(topic) + "]" + incommingMessage);
  // Kiểm tra tin nhắn đến
  if (strcmp(topic, mqtt_topic_sub) == 0) {
    // Phân tích đối tượng JSON
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, incommingMessage);
    int led_id = doc["led_id"];
    String status = doc["status"];
    // Giải mã JSON/Lấy giá trị
    Serial.print("Led id: ");
    Serial.print(led_id);
    Serial.println(" Trạng thái: " + status);
    if (led_id == 1) {
      if (status.equals("ON")) {
        stled1 = true;
        digitalWrite(led1, HIGH);  // Bật LED1
      } else {
        stled1 = false;
        digitalWrite(led1, LOW);  // Tắt LED1
      }
    } else if (led_id == 2) {
      if (status.equals("ON")) {
        stled2 = true;
        digitalWrite(led2, HIGH);  // Bật LED 2
      } else {
        stled2 = false;
        digitalWrite(led2, LOW);  // Tắt LED 2
      }
    } else if (led_id == 3) {
      if (status.equals("ON")) {
        stled3 = true;
        digitalWrite(led3, HIGH);  // Bật LED 3
      } else {
        stled3 = false;
        digitalWrite(led3, LOW);  // Tắt LED 3
      }
    }
    char mqtt_message[256];
    serializeJson(doc, mqtt_message);
    client.publish("ledesp8266_data", mqtt_message);
  }
}

void publishMessage(const char* topic, String payload, boolean retained) {
  if (client.publish(topic, payload.c_str(), true))
    Serial.println("[" + String(topic) + "]: " + payload);
}

void setup() {
  dht.setup(DHTpin, DHTesp::DHT11);  // Cài đặt cảm biến DHT11
  pinMode(led1, OUTPUT);
  pinMode(led3, OUTPUT);
  pinMode(led2, OUTPUT);  // Cài đặt chân LED
  Serial.begin(9600);
  // while (!Serial) delay(1);
  setup_wifi();

#ifdef ESP8266
  espClient.setInsecure();
#else
  espClient.setCACert(root_ca);  // Kích hoạt dòng này và thêm mã "chứng chỉ" để kết nối an toàn
#endif

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  randomSeed(analogRead(0));  // Khởi tạo bộ tạo số ngẫu nhiên
}

void loop() {
  if (!client.connected()) reconnect();  // Kiểm tra nếu client chưa kết nối
  client.loop();

  long now = millis();
  if (now - lastMsg > 1000) {
    // Đọc thông số nhiệt độ và độ ẩm từ cảm biến DHT11
    int sensorValue = analogRead(A0);  // Đọc giá trị từ chân ADC (A0)
    float light = sensorValue;
    float humidity = dht.getHumidity();
    float temperature = dht.getTemperature();
    
    // Tạo giá trị ngẫu nhiên từ 1 đến 100
    randomValue = random(78, 101);
    
    lastMsg = now;
    if(randomValue > 80) {
      blinkLEDs();
    }
    // if (light > 800) {
    //   // Nếu ánh sáng > 200, bật đèn 1
    //   digitalWrite(led1, HIGH);
    //   stled1 = true;
    // } else if (light < 50) {
    //   // Nếu ánh sáng < 50, tắt đèn 1
    //   digitalWrite(led1, LOW);
    //   stled1 = false;
    // } else {
    //   // Nếu ánh sáng trong khoảng 50 đến 200, đặt lại trạng thái LED 1 theo giá trị hiện tại
    //   digitalWrite(led1, stled1 ? HIGH : LOW);
    // }
    
    DynamicJsonDocument doc(1024);
    doc["humidity"] = humidity;
    doc["temperature"] = temperature;
    doc["light"] = light;
    doc["ran"] = randomValue;  // Thêm giá trị ngẫu nhiên vào JSON
    doc["led1"]["id"] = 1;
    doc["led1"]["status"] = stled1;
    doc["led2"]["id"] = 2;
    doc["led2"]["status"] = stled2;
    doc["led3"]["id"] = 3;
    doc["led3"]["status"] = stled3;
    
    char mqtt_message[256];
    serializeJson(doc, mqtt_message);
    publishMessage("esp8266_data", mqtt_message, true);
  }
}


void blinkLEDs() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousBlinkTime >= blinkInterval) {
    previousBlinkTime = currentMillis;
    blinkState = !blinkState;

    if (blinkState) {
      // Khi đèn LED sáng (HIGH)
      digitalWrite(led1, HIGH);
      digitalWrite(led2, HIGH);
      digitalWrite(led3, HIGH);
      stled1 = true;
      stled2 = true;
      stled3 = true;
    } else {
      // Khi đèn LED tắt (LOW)
      digitalWrite(led1, LOW);
      digitalWrite(led2, LOW);
      digitalWrite(led3, LOW);
      stled1 = false;
      stled2 = false;
      stled3 = false;
    }
  }
}
