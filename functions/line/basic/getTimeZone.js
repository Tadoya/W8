module.exports = function (zone) {
    var timeOffset;
    if(zone === "KR") timeOffset = 9; //한국표준시 UTC+9
    //console.log(zone, timeOffset);
    return timeOffset;
};