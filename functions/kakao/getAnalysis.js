const goSql = require("./basic/goSql");
const createChart = require('./createChartImage');
const uuidV1 = require('uuid/v1'); // Generate a v1 UUID (time-based)
const resSet = require("./basic/resSet");
const variables = require("./basic/variables");
/**********분석*********************/ 
module.exports = function(user, res, urls, initKeyboard) {
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
  goSql(sql, res, function(rows, fields){
      if(rows[0]){
        for(var key in rows){
            var date = new Date(rows[key].date);
            weightData.xDates.push((date.getMonth()+1)+"/"+date.getDate());
            weightData.yWeights.push(rows[key].weight);
            weightData.goal.push(user.goal);
        }
        createChart(weightData, function(chartTimestamp){
              var uuid = uuidV1();
              setUuid(user, uuid, res, function(){
                  return res.send({
                    "message": {
                      // "text": "차트",
                      "photo": {
                        "url": urls+"charts/kakao/"+user.user_key+"/"+chartTimestamp+".jpeg",
                        "width": 720,
                        "height": 630
                      },
                      "message_button": {
                        "label": "자세히보기",
                        "url": urls+uuid
                      }
                    },
                    "keyboard" : initKeyboard
                  });
              });
        });
    }else{
      return resSet.sendMessageButton("자료가 없습니다.", variables.initKeyboard(), res);
    }
  });
};

function setUuid(user, uuid, res, callback) {
    const sql = 'INSERT INTO tokens (user_id, token_uuid) '+
                "VALUE ('"+user.user_id+"', '"+uuid+"') "+
                'ON DUPLICATE KEY UPDATE token_uuid="'+uuid+'"';
    goSql(sql, res, function(rows, fields){
        if (typeof callback === "function") {
            return callback();
        }
        console.log('setUuidCallback error', rows);
    });
}
