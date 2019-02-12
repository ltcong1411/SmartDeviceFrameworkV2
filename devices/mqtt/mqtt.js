var mqtt = require('mqtt');

const thingsboardHost = "localhost";
const accessToken = "7xuEICDN8rraFL8YvxB1";

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