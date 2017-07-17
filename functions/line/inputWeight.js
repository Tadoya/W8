const getAnalysis = require("./getAnalysis");
const getWorldTime = require("../getWorldTime");
const setState = require("./state/setState");
const goSql = require("./basic/goSql");

module.exports = function (replyToken, msg, user, urls, lineBot){
    if(msg < 9999 && msg > 0){
        //if(user.weight_type === "lbs") msg *= 0.453592;
        var date = getWorldTime(+9);
        const sql = 'INSERT INTO weights (user_id, weight, date, type) '+
                    "VALUE ('"+user.user_id+"', '"+msg+"', '"+date+"', '"+user.weight_type+"') "+
                    'ON DUPLICATE KEY UPDATE date="'+date+'" , user_id='+user.user_id
                    +', weight='+msg+', type="'+user.weight_type+'"';
        goSql(sql, function(rows, fields){
            setState(8, user.user_key, function() {
                getAnalysis(replyToken, user, urls, lineBot);
            }); 
        });
    }else   setState(7.2, user.user_key, function(){
                lineBot.replyTextMessage(replyToken, "다시 입력하세요.\n예) 48.22");
            });
};