const goSql = require("./facebook/basic/goSql");
const setState = require("./facebook/state/setState");
module.exports = function (lineBot, facebookBot){
    var now = new Date();
    const sql = 'SELECT user_key, bot_type '+
                'FROM users '+
                'WHERE alarm_onoff=1 and alarm_time="'+ now.getUTCHours()+':'+now.getUTCMinutes()+'" and activation=1 and not bot_type = "KAKAO"';
    goSql(sql, function(rows, fields){
        for(var key in rows){
            console.log(sql);
            inputWeightPush(rows, key, lineBot, facebookBot);
        }
    });
};

function inputWeightPush(rows, num, lineBot, facebookBot) {
    setState(7.1, rows[num].user_key, function() {
        console.log("alarm",rows[num].user_key, rows[num].bot_type);
        if(rows[num].bot_type === "LINE")  lineBot.pushTextMessage(rows[num].user_key, "오늘의 몸무게는?");
        else if(rows[num].bot_type ==="FACEBOOK") facebookBot.sendTextMessage(rows[num].user_key, "What is your weight today?\nex) 60.5"); 
    });
}