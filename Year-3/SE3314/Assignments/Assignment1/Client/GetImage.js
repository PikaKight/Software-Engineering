const net = require("net");
const fs = require("fs");
const open = require("open");

const ITPpacket = require("./ITPRequest"); 

let timer;
let timerInterval = 10;

const timerRun = () => {
  timer++;
  if (timer == 4294967296){
      Math.floor(1000 * Math.random());
  }
}

timer = Math.floor(1000 * Math.random());
setInterval(timerRun, timerInterval);

const responseName = {
  0: "Query",
  1: "Found",
  2: "Not found",
  3: "Busy"
};

const imageExtension = {
  1: "BMP",
  2: "JPEG",
  3: "GIF",
  4: "PNG",
  5: "TIFF",
  15: "RAW"
};

const hostServerIPandPort = process.argv[3].split(":");

const imageName = process.argv[5];

const ITPVersion = process.argv[7];

const PORT = hostServerIPandPort[1];

const HOST = hostServerIPandPort[0];

ITPpacket.init(ITPVersion, imageName, timer);

let client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log(`Connected to ImageDB server on: ${HOST}:${PORT}`);

  client.write(ITPpacket.getBytePacket());
});


const chunks = [];

client.on("data", (chunk) => {
  chunks.push(chunk);
});

client.on("pause", () => {
  console.log("pause");
});

client.on("end", () => {
  const responsePacket = new Buffer.concat(chunks);

  let header = responsePacket.slice(0, 12);
  let payload = responsePacket.slice(12);

  console.log("\n Packet Header Received: ");
  printPacketBit(header);

  fs.writeFileSync(imageName, payload);

  (async () => {
    await open(imageName, {wait: true});
    process.exit(1);
  }) ();

  const version = parseBitPacket(header, 0, 4);
  const responseType = responseName[parseBitPacket(header, 4, 8)];
  const sequenceNum = parseBitPacket(header, 12, 16);
  const timestamp = parseBitPacket(header, 32, 32);

  console.log(`\nServer sent:
               \n \t --ITP Version: ${version}
               \n \t --Response Type: ${responseType}
               \n \t --Sequence Number: ${sequenceNum}
               \n \t --Timestamp: ${timestamp}\n`);

  console.log("Disconnected From the Server");
  client.end();
});

client.on("close", () => console.log("Connection Closed"));



//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

// Returns the integer value of the extracted bits fragment for a given packet
function parseBitPacket(packet, offset, length) {
    let number = "";
    for (var i = 0; i < length; i++) {
      // let us get the actual byte position of the offset
      let bytePosition = Math.floor((offset + i) / 8);
      let bitPosition = 7 - ((offset + i) % 8);
      let bit = (packet[bytePosition] >> bitPosition) % 2;
      number = (number << 1) | bit;
    }
    return number;
  }
  
  // Prints the entire packet in bits format
  function printPacketBit(packet) {
    var bitString = "";
  
    for (var i = 0; i < packet.length; i++) {
      // To add leading zeros
      var b = "00000000" + packet[i].toString(2);
      // To print 4 bytes per line
      if (i > 0 && i % 4 == 0) bitString += "\n";
      bitString += " " + b.substr(b.length - 8);
    }
    console.log(bitString);
  }


  
