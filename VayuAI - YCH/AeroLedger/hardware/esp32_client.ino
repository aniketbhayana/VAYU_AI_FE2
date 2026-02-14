/**
 * AeroLedger ESP32 Integration Example
 * 
 * Hardware Requirements:
 * - ESP32 Dev Board
 * - PM2.5 Sensor (e.g., PMS5003)
 * - CO2 Sensor (e.g., MH-Z19)
 * - CO Sensor (e.g., MQ-7)
 * - VOC Sensor (e.g., CCS811)
 * - Fan/Relay Module
 * 
 * Libraries Required:
 * - WiFi.h
 * - HTTPClient.h
 * - ArduinoJson.h
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API Configuration
const char* serverUrl = "http://YOUR_BACKEND_IP:8000/api/v1/sensor/ingest";
const char* deviceId = "ESP32_001";  // Unique device identifier

// Pin Definitions
#define FAN_PIN 25        // PWM pin for fan control
#define LED_PIN 2         // Status LED

// Sensor Reading Interval
const unsigned long readInterval = 5000;  // 5 seconds
unsigned long lastReadTime = 0;

// Function Prototypes
void connectWiFi();
float readPM25();
float readCO2();
float readCO();
float readVOC();
void sendSensorData(float pm25, float co2, float co, float voc);
void controlFan(bool fanOn, int fanIntensity);
void blinkLED(int times);

void setup() {
    Serial.begin(115200);
    
    // Initialize pins
    pinMode(FAN_PIN, OUTPUT);
    pinMode(LED_PIN, OUTPUT);
    
    // Connect to WiFi
    connectWiFi();
    
    // Initialize sensors
    // Add your sensor initialization code here
    
    Serial.println("AeroLedger ESP32 Client Ready!");
    blinkLED(3);  // Indicate successful startup
}

void loop() {
    unsigned long currentTime = millis();
    
    // Read sensors at specified interval
    if (currentTime - lastReadTime >= readInterval) {
        lastReadTime = currentTime;
        
        // Read all sensors
        float pm25 = readPM25();
        float co2 = readCO2();
        float co = readCO();
        float voc = readVOC();
        
        // Print readings to Serial
        Serial.println("=== Sensor Readings ===");
        Serial.printf("PM2.5: %.2f µg/m³\n", pm25);
        Serial.printf("CO2: %.2f ppm\n", co2);
        Serial.printf("CO: %.2f ppm\n", co);
        Serial.printf("VOC: %.2f ppb\n", voc);
        
        // Send data to backend
        sendSensorData(pm25, co2, co, voc);
    }
    
    delay(100);  // Small delay to prevent watchdog issues
}

void connectWiFi() {
    Serial.print("Connecting to WiFi");
    WiFi.begin(ssid, password);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi Connected!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\nWiFi Connection Failed!");
        blinkLED(10);  // Error indication
    }
}

void sendSensorData(float pm25, float co2, float co, float voc) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected. Reconnecting...");
        connectWiFi();
        return;
    }
    
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(5000);  // 5 second timeout
    
    // Create JSON payload
    StaticJsonDocument<256> doc;
    doc["device_id"] = deviceId;
    doc["pm25"] = pm25;
    doc["co2"] = co2;
    doc["co"] = co;
    doc["voc"] = voc;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.println("\n=== Sending to Backend ===");
    Serial.println(jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.printf("Response Code: %d\n", httpResponseCode);
        Serial.println("Response: " + response);
        
        // Parse response
        StaticJsonDocument<256> responseDoc;
        DeserializationError error = deserializeJson(responseDoc, response);
        
        if (!error) {
            bool fanOn = responseDoc["fan_on"];
            int fanIntensity = responseDoc["fan_intensity"];
            
            Serial.println("\n=== Control Decision ===");
            Serial.printf("Fan: %s\n", fanOn ? "ON" : "OFF");
            Serial.printf("Intensity: %d%%\n", fanIntensity);
            
            // Control fan based on backend decision
            controlFan(fanOn, fanIntensity);
            
            // Blink LED to indicate successful communication
            blinkLED(1);
        } else {
            Serial.println("Failed to parse response JSON");
        }
    } else {
        Serial.printf("HTTP Error: %d\n", httpResponseCode);
        Serial.println("Error: " + http.errorToString(httpResponseCode));
        blinkLED(5);  // Error indication
    }
    
    http.end();
}

void controlFan(bool fanOn, int fanIntensity) {
    if (fanOn) {
        // Map intensity (0-100) to PWM value (0-255)
        int pwmValue = map(fanIntensity, 0, 100, 0, 255);
        analogWrite(FAN_PIN, pwmValue);
        Serial.printf("Fan PWM: %d (Intensity: %d%%)\n", pwmValue, fanIntensity);
    } else {
        analogWrite(FAN_PIN, 0);
        Serial.println("Fan OFF");
    }
}

void blinkLED(int times) {
    for (int i = 0; i < times; i++) {
        digitalWrite(LED_PIN, HIGH);
        delay(100);
        digitalWrite(LED_PIN, LOW);
        delay(100);
    }
}

// ===== SENSOR READING FUNCTIONS =====
// Replace these with actual sensor reading code

float readPM25() {
    // TODO: Replace with actual PM2.5 sensor reading
    // Example for PMS5003:
    // return pms.readPM25();
    
    // Simulated reading for testing
    return 35.0 + random(-10, 30);
}

float readCO2() {
    // TODO: Replace with actual CO2 sensor reading
    // Example for MH-Z19:
    // return mhz19.getCO2();
    
    // Simulated reading for testing
    return 450.0 + random(-50, 200);
}

float readCO() {
    // TODO: Replace with actual CO sensor reading
    // Example for MQ-7:
    // return mq7.readCO();
    
    // Simulated reading for testing
    return 10.0 + random(-5, 20);
}

float readVOC() {
    // TODO: Replace with actual VOC sensor reading
    // Example for CCS811:
    // return ccs811.getTVOC();
    
    // Simulated reading for testing
    return 120.0 + random(-30, 100);
}

/*
 * WIRING GUIDE:
 * 
 * PM2.5 Sensor (PMS5003):
 * - VCC -> 5V
 * - GND -> GND
 * - TX -> RX (GPIO 16)
 * - RX -> TX (GPIO 17)
 * 
 * CO2 Sensor (MH-Z19):
 * - VCC -> 5V
 * - GND -> GND
 * - TX -> RX2 (GPIO 9)
 * - RX -> TX2 (GPIO 10)
 * 
 * CO Sensor (MQ-7):
 * - VCC -> 5V
 * - GND -> GND
 * - AOUT -> GPIO 34 (ADC)
 * 
 * VOC Sensor (CCS811):
 * - VCC -> 3.3V
 * - GND -> GND
 * - SDA -> GPIO 21
 * - SCL -> GPIO 22
 * 
 * Fan Control (Relay/MOSFET):
 * - Signal -> GPIO 25 (PWM)
 * - VCC -> 5V/12V (depending on fan)
 * - GND -> GND
 * 
 * Status LED:
 * - Anode -> GPIO 2
 * - Cathode -> GND (with 220Ω resistor)
 */
