var firebase = require("firebase");
const tools = require("./tools");
const sensorsMergerEndpoint = "http://raspberrypi:7001/";

exports.initDb = (db) => {
    tools.logToConsole("Initializing Firebase DB...");
    firebase.initializeApp(db);
    tools.logToConsole("Firebase DB started");

    tools.logToConsole("DB > ref('/hello/')");
    firebase.database().ref('/hello/').once('value')
        .then(snapshot => tools.logToConsole("DB < " + snapshot.val()))
        .catch(e => tools.logToConsole(e));
}

exports.fetchAndSave = () => {
    tools.logToConsole("RQ > " + sensorsMergerEndpoint)
    fetch(sensorsMergerEndpoint)
        .then(result => {
            tools.logToConsole("RS < " + result.status + result.statusText);
            return result;
        })
        .then(result => result.json())
        .then(json => saveToDb(json))
        .catch(e => tools.logToConsole(e));
}

const saveToDb = (json) => {
    const {
        date,
        sensorReadings
    } = json;
    tools.logToConsole(`DB > ${date}: ${JSON.stringify(sensorReadings)}`)
    firebase.database()
        .ref("/sensor-readings/" + date)
        .set(sensorReadings, (error) => {
            tools.logToConsole(error ? error : "DB < Saved")
            // readLast();
        })
}

const readLast = () => {
    tools.logToConsole("DB > ref('/sensor-readings/').orderByKey().limitToLast(1)");
    firebase.database().ref('/sensor-readings/').orderByKey().limitToLast(1).once('value')
        .then(snapshot => {
            tools.logToConsole("DB < Got children: " + snapshot.numChildren());
            snapshot.forEach((child) => tools.logToConsole(`DB < ${child.key}: ${JSON.stringify(child.val())}`));
        })
        .catch(e => tools.logToConsole(e));
}