//Requires node.js and mqtt library installed.
var mqtt = require('mqtt');

const thingsboardHost = "localhost";
const accessToken = "vgpRxVGLUnSgEqjprUqs";//process.argv[2];

const deviceId = "RN3";
var firmware = "1.0.0";
var address = "IC room, TMA Solution Lab 6";
var latitude = 10.8549204;
var longitude = 106.6289907;

// Reads the access token from arguments
const minEnergy = 0.0062, maxEnergy = 0.0129;
const minAmperage = 3.10, maxAmperage = 6.20;
const minVoltage = 230.12, maxVoltage = 235.23;
const minFrequency = 48.12, maxFrequency = 52.32
const minPower = minVoltage*minAmperage, maxPower = maxVoltage*maxAmperage;

var att = {};
att.deviceId = deviceId;
att.firmware = firmware;
att.address = address;
att.longitude = longitude;
att.latitude = latitude;

// Initialization of temperature and humidity data with random values
var data = {
    energy: minEnergy + (maxEnergy - minEnergy) * Math.random() ,
    amperage: minAmperage + (maxAmperage - minAmperage) * Math.random(),
	voltage: minVoltage + (maxVoltage - minVoltage) * Math.random() ,
    frequency: minFrequency + (maxFrequency - minFrequency) * Math.random(),
    power: minPower + (maxPower - minPower) * Math.random(),
	cb1: 1,
	cb2: 0
};

// Initialization of mqtt client using Thingsboard host and device access token
console.log('Connecting to: %s using access token: %s', thingsboardHost, accessToken);
var client  = mqtt.connect('mqtt://'+ thingsboardHost, { username: accessToken });

// Triggers when client is successfully connected to the Thingsboard server
client.on('connect', function () {
    console.log('Client connected!');
    // Uploads firmware version as device attribute using 'v1/devices/me/attributes' MQTT topic
    client.publish('v1/devices/me/attributes', JSON.stringify(att));
    // Schedules telemetry data upload once per second
    console.log('Uploading temperature and humidity data once per second...');
    setInterval(publishTelemetry, 1000);
});

// Uploads telemetry data using 'v1/devices/me/telemetry' MQTT topic
function publishTelemetry() {
    data.energy = genNextValue(data.energy, minEnergy, maxEnergy);
    data.amperage = genNextValue(data.amperage, minAmperage, maxAmperage);
	data.voltage = genNextValue(data.voltage, minVoltage, maxVoltage);
    data.frequency = genNextValue(data.frequency, minFrequency, maxFrequency);
	data.power = genNextValue(data.power, minPower, maxPower);
	data.cb1 = 1;
	data.cb2 = 0;
    client.publish('v1/devices/me/telemetry', JSON.stringify(data));
}

// Generates new random value that is within 3% range from previous value
function genNextValue(prevValue, min, max) {
    var value = prevValue + ((max - min) * (Math.random() - 0.5)) * 0.03;
    value = Math.max(min, Math.min(max, value));
    return value;
}

//Catches ctrl+c event
process.on('SIGINT', function () {
    console.log();
    console.log('Disconnecting...');
    client.end();
    console.log('Exited!');
    process.exit(2);
});

//Catches uncaught exceptions
process.on('uncaughtException', function(e) {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
});