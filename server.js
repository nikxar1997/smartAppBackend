// Create express app
var express = require("express");
var app = express();
var db = require("./database.js");
var md5 = require("md5");
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
  if (!req.body.sensor) {
    errors.push("No sensor values specified");
  }
  var data = {
    roomid: req.body.roomid,
    deviceid: req.body.deviceid,
    name: req.body.name,
    category: req.body.category,
    value: req.body.value,
    sensor: req.body.sensor,
    status: req.body.status,
    timer: req.body.timer,
  };
  var sql =
    "INSERT INTO devices (roomid,deviceid,name,category,value,sensor,status,timer) VALUES (?,?,?,?,?,?,?,?)";
  var params = [
    data.roomid,
    data.deviceid,
    data.name,
    data.category,
    data.value,
    data.sensor,
    data.status,
    data.timer,
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
    sensor: req.body.sensor,
    status: req.body.status,
    timer: req.body.timer,
  };
  db.run(
    `UPDATE devices set 
        name = COALESCE(?,name),
        category = COALESCE(?,category),
        value = COALESCE(?,value),
        sensor = COALESCE(?,sensor),
        status = COALESCE(?,status),
        timer = COALESCE(?,timer)
        WHERE deviceid = ?`,
    [
      data.name,
      data.category,
      data.value,
      data.sensor,
      data.status,
      data.timer,
      req.params.deviceid,
    ],
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

//Get all users
app.get("/api/users", (req, res, next) => {
  var sql = "select * from users";
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

//Add a new user
app.post("/api/register/", (req, res, next) => {
  var errors = [];
  if (!req.body.name) {
    errors.push("Name not inserted");
  }
  if (!req.body.email) {
    errors.push("Email not specified");
  }
  if (!req.body.password) {
    errors.push("Password not inserted");
  }

  var data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  var sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";
  var params = [data.name, data.email, data.password];
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

//Delete a user
app.delete("/api/user/:id", (req, res, next) => {
  db.run("DELETE FROM users WHERE id=?", req.params.id, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "deleted", changes: this.changes });
  });
});

app.post("/api/login/", (req, res, next) => {
  var errors = [];
  if (!req.body.email) {
    errors.push("Email not specified");
  }
  if (!req.body.password) {
    errors.push("Password not inserted");
  }

  var data = {
    name: "res",
    email: req.body.email,
    password: req.body.password,
  };
  var sql = "SELECT * FROM users WHERE email = ? and password = ?";
  var params = [data.email, data.password];
  db.all(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: result,
      id: this.lastID,
    });
  });
});

//Climate devices

//Get all devices
app.get("/api/climatedevices", (req, res, next) => {
  var sql = "select * from climatedevices";
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
app.get("/api/climatedevices/:K", (req, res, next) => {
  var sql = "select * from devices where K = ?";
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
app.post("/api/climatedevice/", (req, res, next) => {
  var errors = [];
  if (!req.body.K) {
    errors.push("No device id specified");
  }
  if (!req.body.roomid) {
    errors.push("No room id specified");
  }
  var data = {
    K: req.body.K,
    roomid: req.body.roomid,
    PM10: req.body.PM10,
    PM25: req.body.PM25,
    rawTemperature: req.body.rawTemperature,
    pressure: req.body.pressure,
    rawHumidity: req.body.rawHumidity,
    gasResistance: req.body.gasResistance,
    iaq: req.body.iaq,
    iaqAccuracy: req.body.iaqAccuracy,
    temperature: req.body.temperature,
    humidity: req.body.humidity,
    staticlag: req.body.staticlag,
    co2Equivalent: req.body.co2Equivalent,
    breathVocEquivalent: req.body.breathVocEquivalent,
    month: req.body.month,
    day: req.body.day,
    year: req.body.year,
    time: req.body.time,
  };
  var sql =
    "INSERT INTO climatedevices (K,roomid,PM10,PM25,rawTemperature,pressure,rawHumidity,gasResistance,iaq,iaqAccuracy,temperature,humidity,staticlag,co2Equivalent,breathVocEquivalent,month,day,year,time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  var params = [
    data.K,
    data.roomid,
    data.PM10,
    data.PM25,
    data.rawTemperature,
    data.pressure,
    data.rawHumidity,
    data.gasResistance,
    data.iaq,
    data.iaqAccuracy,
    data.temperature,
    data.humidity,
    data.staticlag,
    data.co2Equivalent,
    data.breathVocEquivalent,
    data.month,
    data.day,
    data.year,
    data.time,
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

//Delete a user
app.delete("/api/climatedevice/:K", (req, res, next) => {
  db.run(
    "DELETE FROM climatedevices WHERE K=?",
    req.params.K,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
