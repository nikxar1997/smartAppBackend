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
        )`,
      (err) => {
        if (err) {
          //Table already created
        } else {
          //Table just created, creating some rows
          var insert =
            "INSERT INTO rooms (roomid,name,category) VALUES (?,?,?)";
          db.run(insert, ["room1", "Living room", "livingroom"]);
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
        ) `,
      (err) => {
        if (err) {
          //Table already created
        } else {
          //Table just created, creating some rows
          var insert =
            "INSERT INTO devices (roomid,deviceid,name,category,value) VALUES (?,?,?,?,?)";
          db.run(insert, [
            "room1",
            "device1",
            "Air condition 1",
            "climate",
            "24",
          ]);
        }
      }
    );
  }
});

module.exports = db;
