const setState = require("./state/setState");
const resSet = require("./basic/resSet");
const variables = require("./basic/variables");

exports.setGoal = function(msg, user, res){
    if(msg < 9999 && msg > 0){
        const setQuery = "goal= "+msg;
        return setState(6, user.user_key, res, function(){
            resSet.sendMessageButton("목표가 설정되었습니다.", variables.initKeyboard(), res);
        }, setQuery);
    } 
    setState(10.2, user.user_key, res, function(){
        resSet.sendMessageNonButton("다시 입력하세요.\n예)50.56", res);
    });
};

exports.setHeight = function(msg, user, res){
    if(msg < 300 && msg > 0){
        const setQuery = 'height= '+msg;
        return setState(6, user.user_key, res, function() {
            resSet.sendMessageButton("키 정보가 설정되었습니다.", variables.initKeyboard(), res);
        }, setQuery);
    } 
    setState(14.2, user.user_key, res, function(){
       resSet.sendMessageNonButton("다시 입력하세요.\n예)177.5", res);
    });
};

exports.setAge = function(msg, user, res){
    if(msg < 150 && msg > 0){
        const setQuery = 'age= '+(new Date().getFullYear() - msg);
        return setState(6, user.user_key, res, function() {
            resSet.sendMessageButton("나이 정보가 설정되었습니다.", variables.initKeyboard(), res);
        }, setQuery);
    } 
    setState(16.2, user.user_key, res, function(){
       resSet.sendMessageNonButton("다시 입력하세요.\n예)35", res);
    });
};

exports.setSex = function(msg, user, res){
    if(msg === "남자"){
      return setState(6, user.user_key, res, function() {
        resSet.sendMessageButton("남자를 선택하셨습니다.", variables.initKeyboard(), res);
        }, 'sex="M"');
    }
    setState(6, user.user_key, res, function(){
      resSet.sendMessageButton("여자를 선택하셨습니다.", variables.initKeyboard(), res);
    }, 'sex="F"');
};

exports.setWeightType = function(msg, user, res){
    if(msg === "kg & cm"){
      return setState(6, user.user_key, res, function() {
        resSet.sendMessageButton("kg & cm를 선택하셨습니다.", variables.initKeyboard(), res);
        }, 'weight_type="kg"');
    }
    setState(6, user.user_key, res, function(){
      resSet.sendMessageButton("lbs & inch를 선택하셨습니다.", variables.initKeyboard(), res);
    }, 'weight_type="lbs"');
};
