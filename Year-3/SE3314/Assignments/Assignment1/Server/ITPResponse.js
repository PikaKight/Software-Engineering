const HEADER_SIZE = 12;

let version, responseType, sequenceNumber, timeStamp;

module.exports = {

    responseHeader: "",
    payloadSize: "",
    payload: "",

    init: function (version, resType, sequenceNum, currentTime, imageData) {
        version = version;
        
        this.responseHeader = new Buffer.alloc(HEADER_SIZE);
        storeBitPacket(this.responseHeader, version, 0, 4);
        storeBitPacket(this.responseHeader, resType, 4, 8);
        storeBitPacket(this.responseHeader, sequenceNum, 12, 16);
        storeBitPacket(this.responseHeader, currentTime, 32, 32);
        storeBitPacket(this.responseHeader, imageData.length, 64, 32)

        
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function () {
        // enter your code here
        return "this should be a correct packet";
    }
};

//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

// Store integer value into specific bit poistion the packet
function storeBitPacket(packet, value, offset, length) {
    // let us get the actual byte position of the offset
    let lastBitPosition = offset + length - 1;
    let number = value.toString(2);
    let j = number.length - 1;
    for (var i = 0; i < number.length; i++) {
        let bytePosition = Math.floor(lastBitPosition / 8);
        let bitPosition = 7 - (lastBitPosition % 8);
        if (number.charAt(j--) == "0") {
            packet[bytePosition] &= ~(1 << bitPosition);
        } else {
            packet[bytePosition] |= 1 << bitPosition;
        }
        lastBitPosition--;
    }
}