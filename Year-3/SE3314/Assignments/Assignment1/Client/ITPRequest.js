const HEADER_SIZE = 12;

let ver, requestType, currentTime;

module.exports = {
  requestHeader: "",
  payloadSize: 0,
  payload: "",

  init: function (vers, fullImageName, timestamp) {

    ver = vers;
    requestType = 0;
    currentTime = timestamp;

    this.requestHeader = new Buffer.alloc(HEADER_SIZE);

    storeBitPacket(this.requestHeader, ver * 1, 0, 4);
    storeBitPacket(this.requestHeader, requestType, 24, 8);

    storeBitPacket(this.requestHeader, currentTime, 32, 32);

    const imageExtension = {
      "BMP": 1,
      "JPEG": 2,
      "GIF": 3,
      "PNG": 4,
      "TIFF": 5,
      "RAW": 15
    };

    let imageName = stringToBytes(fullImageName.split(".")[0]);
    
    let imageType = imageExtension[fullImageName.split(".")[1].toUpperCase()];

    storeBitPacket(this.requestHeader, imageType, 64, 4);
    storeBitPacket(this.requestHeader, imageName.length, 68, 28);

    this.payloadSize = imageName.length;
    this.payload = new Buffer.alloc(this.payloadSize);

    for (let i = 0; i < imageName.length; i++){
      this.payload[i] = imageName[i];
    };
  },

  //--------------------------
  //getBytePacket: returns the entire packet in bytes
  //--------------------------
  getBytePacket: function () {
    let packet = new Buffer.alloc(this.payload.length + HEADER_SIZE);

    for (let head = 0; head < HEADER_SIZE; head++){
      packet[head] = this.requestHeader[head];
    }

    for (let pl = 0; pl < this.payload.length; pl++){
      packet[pl] = this.payload[pl];
    }

    return packet;
  },
};

//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

// Convert a given string to byte array
function stringToBytes(str) {
  var ch,
    st,
    re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    st = []; // set up "stack"
    do {
      st.push(ch & 0xff); // push byte to stack
      ch = ch >> 8; // shift value down by 1 byte
    } while (ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  // return an array of bytes
  return re;
}

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
