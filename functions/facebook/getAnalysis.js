const goSql = require("./basic/goSql");
const createChart = require('./createChartImage');
const uuidV1 = require('uuid/v1'); // Generate a v1 UUID (time-based)
const FacebookBot = require('facebook-bot-messenger');

/**********분석********************/
module.exports = function (user, urls, facebookBot) {
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
                        // facebookBot.sendImageMessage(user.user_key, urls+'charts/facebook/'+user.user_key+'/'+chartTimestamp+'.jpeg', false);
                        // return facebookBot.sendTextMessage(user.user_key, urls+uuid);
                        return facebookBot.sendMessage(user.user_key, getChart(user, uuid, chartTimestamp, urls));   
                    });
              });
          }else{
            facebookBot.sendTextMessage(user.user_key, "No data available.");    
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
    var element = new FacebookBot.GenericElementTemplateBuilder('analysis', urls+uuid, urls+'charts/facebook/'+user.user_key+'/'+chartTimestamp+'.jpeg');
    var template = new FacebookBot.GenericTemplateBuilder();
    template.addElement(element);
    var builder = new FacebookBot.AttachmentMessageBuilder(template);
    
    return builder;
    
}