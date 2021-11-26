// Create express app
var express = require("express");
var app = express();
var db = require("./database.js");
var md5 = require("body-parser");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

// Insert here other API endpoints

//Get all rooms
app.get("/api/rooms", (req, res, next) => {
  var sql = "select * from rooms";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

//Get room by id
app.get("/api/rooms/:roomid", (req, res, next) => {
  var sql = "select * from rooms where roomid = ?";
  var params = [req.params.roomid];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

//Create a new room
app.post("/api/room/", (req, res, next) => {
  var errors = [];
  if (!req.body.roomid) {
    errors.push("No id specified");
  }
  if (!req.body.name) {
    errors.push("No room name specified");
  }
  if (!req.body.category) {
    errors.push("No category specified");
  }
  var data = {
    roomid: req.body.roomid,
    name: req.body.name,
    category: req.body.category,
  };
  var sql = "INSERT INTO rooms (roomid,name,category) VALUES (?,?,?)";
  var params = [data.roomid, data.name, data.category];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

//Update a room
app.patch("/api/room/:roomid", (req, res, next) => {
  var data = {
    name: req.body.name,
    category: req.body.category,
  };
  db.run(
    `UPDATE rooms set
        name=COALESCE(?,name),
        category=COALESCE(?,category)
        WHERE roomid=?`,
    [data.name, data.category, req.params.roomid],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
        changes: this.changes,
      });
    }
  );
});

//Delete a room
app.delete("/api/room/:roomid", (req, res, next) => {
  db.run(
    "DELETE FROM rooms WHERE roomid=?",
    req.params.roomid,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});

//Get all devices
app.get("/api/devices", (req, res, next) => {
  var sql = "select * from devices";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

//Get device by id
app.get("/api/devices/:deviceid", (req, res, next) => {
  var sql = "select * from devices where deviceid = ?";
  var params = [req.params.deviceid];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

//Add a new device
app.post("/api/device/", (req, res, next) => {
  var errors = [];
  if (!req.body.roomid) {
    errors.push("No room id specified");
  }
  if (!req.body.deviceid) {
    errors.push("No device id specified");
  }
  if (!req.body.name) {
    errors.push("No name specified");
  }
  if (!req.body.category) {
    errors.push("No category specified");
  }
  if (!req.body.value) {
    errors.push("No value specified");
  }
  var data = {
    roomid: req.body.roomid,
    deviceid: req.body.deviceid,
    name: req.body.name,
    category: req.body.category,
    value: req.body.value,
  };
  var sql =
    "INSERT INTO devices (roomid,deviceid,name,category,value) VALUES (?,?,?,?,?)";
  var params = [
    data.roomid,
    data.deviceid,
    data.name,
    data.category,
    data.value,
  ];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

//Update a device
app.patch("/api/device/:deviceid", (req, res, next) => {
  var data = {
    name: req.body.name,
    category: req.body.category,
    value: req.body.value,
  };
  db.run(
    `UPDATE devices set 
        name = COALESCE(?,name),
        category = COALESCE(?,category),
        value = COALESCE(?,value)
        WHERE deviceid = ?`,
    [data.name, data.category, data.value, req.params.deviceid],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
        changes: this.changes,
      });
    }
  );
});

//Delete a device
app.delete("/api/device/:deviceid", (req, res, next) => {
  db.run(
    "DELETE FROM devices WHERE deviceid=?",
    req.params.deviceid,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});

//Get all device categories
app.get("/api/devicecategories", (req, res, next) => {
  var sql = "select * from devicecategories";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

//Get all room categories
app.get("/api/roomcategories", (req, res, next) => {
  var sql = "select * from roomcategories";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
