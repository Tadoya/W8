const goSql = require("./basic/goSql");
const setState = require("./state/setState");
module.exports = function (lineBot){
    var now = new Date();
    const sql = 'SELECT user_key '+
                'FROM users '+
                'WHERE alarm_onoff=1 and alarm_time="'+ now.getHours()+':'+now.getMinutes()+'" and activation=1 and bot_type = "LINE"';
    goSql(sql, function(rows, fields){
        for(var key in rows){
            console.log(sql);
            inputWeightPush(rows, key, lineBot);
        }
    });
};

function inputWeightPush(rows, num, lineBot) {
    setState(7.1, rows[num].user_key, function() {
        console.log("alarm",rows[num].user_key);
        lineBot.pushTextMessage(rows[num].user_key, "오늘의 몸무게는?");
    });
}