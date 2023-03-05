const HEADER_SIZE = 12;

module.exports = {

    responseHeader: "",
    payloadSize: "",
    payload: "",

    init: function (version, resType, sequenceNum, currentTime, imageData) {
        
        this.responseHeader = new Buffer.alloc(HEADER_SIZE);
        storeBitPacket(this.responseHeader, version, 0, 4);
        storeBitPacket(this.responseHeader, resType, 4, 8);
        storeBitPacket(this.responseHeader, sequenceNum, 12, 16);
        storeBitPacket(this.responseHeader, currentTime, 32, 32);
        storeBitPacket(this.responseHeader, imageData.length, 64, 32)

        this.payload = new Buffer.alloc(imageData.length + 4);

        for (let i = 0; i < imageData.length; i++){
            this.payload[i] = imageData[i]
        }
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function () {
        let packet = new Buffer.alloc(this.payload.length + HEADER_SIZE);
        
        for (let head = 0; head < HEADER_SIZE; head++){
            packet[head] = this.responseHeader[head];
        }
        
        for (let pl = 0; pl < this.payload.length; pl++){
            packet[pl + HEADER_SIZE] = this.payload[pl];
        }
        
        return packet;
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