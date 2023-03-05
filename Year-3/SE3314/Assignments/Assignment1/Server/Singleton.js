
let sequenceNumber;
let timerInterval = 10;
let timer;

const timerRun = () => {
    timer++;
    if (timer == 4294967296){
        Math.floor(1000 * Math.random());
    }
}

module.exports = {
    init: function() {
       timer = Math.floor(1000 * Math.random());
       setInterval(timerRun, timerInterval);
       sequenceNumber = Math.floor(1000 * Math.random());
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function() {
        sequenceNumber++;
        return sequenceNumber;
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: function() {
        return timer;
    }


};