var mqtt = require('mqtt');

const thingsboardHost = "localhost";
const accessToken = "VJZJvYQJMkdf4fte1vtZ";

const minTemperature = 17.5, maxTemperature = 30, minHumidity = 12, maxHumidity = 90;

var data = {
    temperature: minTemperature + (maxTemperature - minTemperature) * Math.random() ,
    humidity: minHumidity + (maxHumidity - minHumidity) * Math.random()
};

console.log('Connecting to: %s using access token: %s', thingsboardHost, accessToken);

var client  = mqtt.connect('mqtt://'+ thingsboardHost,{
    username: accessToken
});

client.on('connect', function () {
    console.log('Client connected!');
    client.publish('v1/devices/me/attributes', JSON.stringify({"firmware_version":"1.0.1", "serial_number":"SN-001"}));
    console.log('Attributes published!');
    client.publish('v1/devices/me/telemetry', JSON.stringify({"temperature":21, "humidity":55.0, "active": false}));
    console.log('Telemetry published!');
    client.end();
});