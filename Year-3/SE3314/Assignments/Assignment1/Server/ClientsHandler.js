const fs = require('fs');
const ITPpacket = require('./ITPResponse');
const singleton = require('./Singleton');

let clientNames = {};
let clientIP = {};
let startTimestamp = {};

module.exports = {

    handleClientJoining: function (sock) {
        assignClientName(sock, clientNames);
        
        const chunks = [];
        
        console.log(`\n${clientNames[sock.id]} is connected at timestamp: 
        ${startTimestamp[sock.id]}\n`);   
        
        sock.on("data", (requestPacket) => handleClientRequest(requestPack, sock));
        
        sock.on("close", () => handleClientExit());
    }
};

const assignClientName = (sock, clientNames) => {
    sock.id = sock.remoteAddress + ":" + sock.remotePort;
    startTimestamp[sock.id] = singleton.getTimestamp();
    clientNames[sock.id] = `Client-${startTimestamp[sock.id]}`;
    clientIP[sock.id] = sock.remoteAddress;
}

const handleClientRequest = (requestPacket, sock) => {
    console.log("IP Packet Received: \n");
    printPacketBit(requestPacket);

    let vers = parseBitPacket(data, 0, 4);
    let requestType = parseBitPacket(data, 24, 8);
    const requestName = {
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

    let timestamp = parseBitPacket(data, 32, 32);
    
    let imageType = parseBitPacket(data, 64, 4);
    let imageTypeName = imageExtension[imageType];

    let imageNameSize = parseBitPacket(data, 68, 28);
    let imageName = bytesToString(data.slice(12,13 + imageNameSize));

    console.log(`\n ${clientNames[sock.id]} requests:
                 \n \t --ITP Version: ${vers}
                 \n \t --Timestamp: ${timestamp}
                 \n \t --Request Type: ${requestName[requestType]}
                 \n \t --Image File Extension(s): ${imageTypeName}
                 \n \t --Image File Name: ${imageName}`);

                 if (version == 7) {  
                    let imageFullName = "images/" + imageName + "." + imageTypeName;
                    let imageData = fs.readFileSync(imageFullName);   
              
                  ITPpacket.init(
                    version,
                    1, // response type
                    singleton.getSequenceNumber(), // sequence number
                    singleton.getTimestamp(), // timestamp
                    imageData, // image data
                  );
              
                  sock.write(ITPpacket.getBytePacket());
                  sock.end();
                } else {
                  console.log("The protocol version is not supported");
                  sock.end();
                }

}

const handleClientExit = () => {
    console.log("Disconnected from the server\nConnection closed ")
}

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

// Converts byte array to string
function bytesToString(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}