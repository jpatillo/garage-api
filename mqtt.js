const mqtt = require('mqtt');
var MQTTPattern = require("mqtt-pattern");
var firebase    = require('./firebase-service');
var moment      = require('moment')

const host = process.env.MQTTHOST
const client = process.env.GARAGEMQTTID
const username = process.env.GARAGEMQTTUSER
const password = process.env.GARAGEMQTTPASS

var mqttClient = mqtt.connect(host, {clientId:client, username:username, password:password});

const topic_prefix= "garage/+/";


// Mqtt error calback
mqttClient.on('error', (err) => {
    console.log(err);
    mqttClient.end();
});

// Connection callback
mqttClient.on('connect', () => {
    console.log(`mqtt client connected`);
    
    // mqtt subscriptions
    mqttClient.subscribe(topic_prefix+'telemetry/#', {qos: 1}, function(err,granted){
        if(err) console.log("subscribe error ",err);
        if(granted) console.log("subscribe granted ",granted);
    });
});
    
// When a message arrives, console.log it
mqttClient.on('message', function (topic, message) {
    console.log(message.toString());
});

mqttClient.on('close', () => {
    console.log(`mqtt client disconnected`);
});

mqttClient.on('offline', () => {
    console.log('mqtt client is offline')

    // Set a timer to reconnect
    reconnectTimer()
});


function reconnectTimer() {
    setTimeout(() => {
        if(mqttClient.connected) return //we are connected now, so do nothing
        if(!mqttClient.reconnecting){ //we are disconnected and not attempting to reconnect
            mqttClient.reconnect()//reconnect
        }
        reconnectTimer()// set a timer to try reconnecting regardless of reconnecting state
    }, 1500);
}

function publish(topic,message){
    mqttClient.publish(topic_prefix+topic,message);
    console.log("publishing message: "+topic_prefix+topic);
}


exports.publish = publish;