const getWorldTime = require("../getWorldTime");
const setState = require("./state/setState");
const goSql = require("./basic/goSql");
const getAnalysis = require("./getAnalysis");
const resSet = require("./basic/resSet");

module.exports = function(msg, user, res, urls, initKeyboard){
    if(msg < 9999 && msg > 0){
        //if(user.weight_type === "lbs") msg *= 0.453592;
        var date = getWorldTime(+9);
        const sql = 'INSERT INTO weights (user_id, weight, date, type) '+
                    "VALUE ('"+user.user_id+"', '"+msg+"', '"+date+"', '"+user.weight_type+"') "+
                    'ON DUPLICATE KEY UPDATE date="'+date+'" , user_id='+user.user_id
                    +', weight='+msg+', type="'+user.weight_type+'"';
        goSql(sql, res, function(rows, fields){
            setState(6, user.user_key, res,function() {
                getAnalysis(user, res, urls, initKeyboard);
            });
        });
    }else setState(7.2, user.user_key, res, function(){
        resSet.sendMessageNonButton("다시 입력하세요\n예)52.34", res);
    });
};