var express = require('express');
var router = express.Router();


const WebSocket = require('ws');
var _ws;

let sp = 0;
let pv = 0;
let power = 0;

const wss = new WebSocket.Server({
  port: 8081,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

wss.on("connection", ws => {
  console.log("New client connected");
  _ws = ws;
  ws.on("close", () => {
    console.log("Client disconneted");
  });

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  if (req.body.sp && req.body.pv && req.body.power){
    sp = req.body.sp;
    pv = req.body.pv;
    power = req.body.power;
    if (_ws) {
      _ws.send(JSON.stringify({
        "sp": sp,
        "pv": pv,
        "power": power
      }));
    }else {
      console.log("no Client connected");
    }
    res.status(200).json({"sp": "updated", "pv": "updated", "power": "updated", "succsess": true});
  }else {
    res.status(401).json({"data": "missing", "succsess": false});
  }
  res.status(200).json({"data": "resived"});
});

module.exports = router;
