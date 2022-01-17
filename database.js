var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    //Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database");
    db.run(
      `CREATE TABLE IF NOT EXISTS rooms(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roomid text UNIQUE,
            name text,
            category text,
            upperTemp integer,
            lowerTemp integer,
            upperHum integer,
            lowerHum integer
        )`,
      (err) => {
        if (err) {
          //Table already created
        } else {
          //Table just created, creating some rows
          // var insert =
          //   "INSERT INTO rooms (roomid,name,category) VALUES (?,?,?)";
          // db.run(insert, ["room1", "Living room", "livingroom"]);
        }
      }
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS devices(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roomid text,
            deviceid text UNIQUE,
            name text,
            category text,
            value text,
            status text,
            timer integer,
        ) `,
      (err) => {
        if (err) {
          //Table already created
        } else {
          //Table just created, creating some rows
          // var insert =
          //   "INSERT INTO devices (roomid,deviceid,name,category,value) VALUES (?,?,?,?,?)";
          // db.run(insert, [
          //   "room1",
          //   "device1",
          //   "Air condition 1",
          //   "climate",
          //   "24",
          // ]);
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS roomcategories(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category text UNIQUE,
        ) `,
      (err) => {
        if (err) {
          //Table already created
        } else {
          //Table just created, creating some rows
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE (email)
        ) `,
      (err) => {
        if (err) {
          //Table already created
        } else {
          //Table just created, creating some rows
        }
      }
    );

    //Climate devices
    db.run(
      `CREATE TABLE IF NOT EXISTS climatedevices(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            K text,
            roomid text,
            PM10 integer,
            PM25 integer,
            rawTemperature integer,
            pressure integer,
            rawHumidity integer,
            gasResistance integer,
            iaq integer,
            iaqAccuracy integer,
            temperature integer,
            humidity integer,
            staticlag integer,
            co2Equivalent integer,
            breathVocEquivalent integer,
            month text,
            day text,
            year text,
            time text,
            ssid text,
            password text,
        ) `,
      (err) => {
        if (err) {
          //Table already created
        } else {
          //Table just created, creating some rows
        }
      }
    );

    //Climate devices history
    db.run(
      `CREATE TABLE IF NOT EXISTS devicehistory(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name,
            K text,
            roomid text,
            PM10 integer,
            PM25 integer,
            rawTemperature integer,
            pressure integer,
            rawHumidity integer,
            gasResistance integer,
            iaq integer,
            iaqAccuracy integer,
            temperature integer,
            humidity integer,
            staticlag integer,
            co2Equivalent integer,
            breathVocEquivalent integer,
            month text,
            day text,
            year text,
            time text,
        ) `,
      (err) => {
        if (err) {
          //Table already created
        } else {
          //Table just created, creating some rows
        }
      }
    );
  }
});

//Climate device categories
db.run(
  `CREATE TABLE IF NOT EXISTS devicecategories(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text,
        K text UNIQUE,
        type text,
        sensors text,
    ) `,
  (err) => {
    if (err) {
      //Table already created
    } else {
      //Table just created, creating some rows
    }
  }
);

module.exports = db;
