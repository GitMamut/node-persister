const persister = require("./persister");
const tools = require("./tools");
const config = require("./config");

const INTERVAL_MINUTES = 10;

tools.logToConsole("Setting interval time to minutes: " + INTERVAL_MINUTES);

persister.initDb(config.db);
persister.fetchAndSave();

setInterval(persister.fetchAndSave, INTERVAL_MINUTES * 60 * 1000);