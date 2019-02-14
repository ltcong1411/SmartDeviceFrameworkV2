#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "TIC2";
const char* password = "Agiftfromtheheart";
const char* mqtt_server = "192.168.16.75";
#define Token "gW83nfMSi30l7YBuLxaL"

//init GPIO
#define lightPin  34
#define ledPin  27

int lightVal = 0;
bool led1Status = false;

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;
unsigned long lastSend;
char buffer_package[256];

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("test", Token, NULL)) {
      Serial.println("connected");
      client.subscribe("v1/devices/me/rpc/request/+");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.println("Message arrived: ");
  Serial.print("Topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  char json[length + 1];
  strncpy (json, (char*)payload, length);
  json[length] = '\0';
  Serial.println(json);

  StaticJsonBuffer<200> jsonBuffer;
  JsonObject  &data = jsonBuffer.parseObject((char*)json);
  if (!data.success()) {
    Serial.println("parseObject() failed");
    return;
  }
  String methodName = String((const char*)data["method"]);
  if (methodName.equals("led1")) {
    if (data["params"] == true) {
      digitalWrite(ledPin, HIGH);
      led1Status = true;
    }
    else {
      digitalWrite(ledPin, LOW);
      led1Status = false;
    }
    sprintf(buffer_package, "{\"led1\": \"%s\"}", led1Status?"true":"false");
    Serial.println(buffer_package);
    client.publish("v1/devices/me/attributes", buffer_package);
  }

}

void getSensorData() {
  lightVal = map(analogRead(lightPin), 0, 2048, 0, 100);
  sprintf(buffer_package, "{\"light\":%d}", lightVal);
  Serial.println(buffer_package);
  client.publish( "v1/devices/me/telemetry", buffer_package);
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(lightPin, INPUT);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  lastSend = 0;
}

void loop() {
  if (!client.connected()) {
    reconnect();
  };
  if (millis() - lastSend > 1000) {
    getSensorData();
    lastSend = millis();
  }
  client.loop();
}
