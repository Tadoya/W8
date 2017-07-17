const goSql = require("./basic/goSql");
const createChart = require('./createChartImage');
const uuidV1 = require('uuid/v1'); // Generate a v1 UUID (time-based)
const LINEBot = require('line-messaging');

/**********분석********************/
module.exports = function (replyToken, user, urls, lineBot) {
    var weightData = {
            xDates : [],
            yWeights : [],
            type : user.weight_type,
            goal : [],
            user_key : user.user_key
    };
    const sql = 'SELECT w.* '+
                'FROM weights w, users u '+
                'WHERE w.user_id = u.user_id and u.user_key="'+user.user_key+'" '+
                'ORDER BY weight_id DESC limit 10';
    goSql(sql, function(rows, fields){
        if(rows[0]){
              for(var key in rows){
                  var date = new Date(rows[key].date);
                  weightData.xDates.push((date.getMonth()+1)+"/"+date.getDate());
                  weightData.yWeights.push(rows[key].weight);
                  weightData.goal.push(user.goal);
              }
              createChart(weightData, function(chartTimestamp){
                    var uuid = uuidV1();
                    setUuid(user, uuid, function(){
                        return lineBot.replyMessage(replyToken, getChart(user, uuid, chartTimestamp, urls));   
                    });
              });
          }else{
            lineBot.replyTextMessage(replyToken, "자료가 없습니다.");    
          }
    });
};

function setUuid(user, uuid, callback) {
    const sql = 'INSERT INTO tokens (user_id, token_uuid) '+
                "VALUE ('"+user.user_id+"', '"+uuid+"') "+
                'ON DUPLICATE KEY UPDATE token_uuid="'+uuid+'"';
    goSql(sql, function(rows, fields){
        if (typeof callback === "function") {
            return callback();
        }
        console.log('setUuidCallback error', rows);
    });
}

function getChart(user, uuid, chartTimestamp, urls) {
    var imagemap = new LINEBot.ImagemapMessageBuilder();
    imagemap.setImageBase(urls+'charts/line/'+user.user_key+'/'+chartTimestamp);
    
    //console.log("user_id:"+user.user_id, uuid);
    imagemap.setAlternate('Analysis..');
    imagemap.setBaseSize(1040, 1040);
    
    // message/url, x, y, with, height, type 
    imagemap.addAction(urls+uuid, 0, 0, 1040, 1040, LINEBot.Action.URI);
    return imagemap; 
}