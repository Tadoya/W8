//카카오용 state 매핑
const variables = require("../basic/variables");
const inputWeight = require("../inputWeight");
const setState = require("./setState");
const getAnalysis = require("../getAnalysis");
const resSet = require("../basic/resSet");
const setting = require("../setting");
//"몸무게 입력", "분석", "목표", "키 입력", "나이 입력", "성별입력", "몸무게 단위", "도움말"
module.exports = function(msg, user, res){
  console.log("state_Mapping", user.user_key, msg);
  
  if(user.state === 7.1 || user.state === 7.2){
    inputWeight(msg, user, res, variables.getUrl(), variables.initKeyboard());
  }else if(user.state === 9){
    if(msg === "예"){
      return setState(10.1, user.user_key, res, function() {
        resSet.sendMessageNonButton("목표 몸무게를 입력하세요\n예)48.12", res);
        });
    }
    setState(6, user.user_key, res, function(){
      resSet.sendMessageButton("아니오를 선택하셨습니다.",variables.initKeyboard(), res);
    });
  }else if(user.state === 10.1 || user.state === 10.2){
    setting.setGoal(msg, user, res);
  }else if(user.state === 13){
    if(msg === "예"){
      return setState(14.1, user.user_key, res, function() {
        resSet.sendMessageNonButton("키 정보를 입력하세요\n예)162.3", res);
        });
    }
    setState(6, user.user_key, res, function(){
      resSet.sendMessageButton("아니오를 선택하셨습니다.",variables.initKeyboard(), res);
    });
  }else if(user.state === 14.1 || user.state === 14.2){
    setting.setHeight(msg, user, res);
  }else if(user.state === 15){
    if(msg === "예"){
      return setState(16.1, user.user_key, res, function() {
        resSet.sendMessageNonButton("나이를 입력하세요\n예)25", res);
        });
    }
    setState(6, user.user_key, res, function(){
      resSet.sendMessageButton("아니오를 선택하셨습니다.",variables.initKeyboard(), res);
    });
  }else if(user.state === 16.1 || user.state === 16.2){
    setting.setAge(msg, user, res);
  }else if(user.state === 17){
    if(msg === "예"){
      return setState(18, user.user_key, res, function() {
        resSet.sendMessageButton("성별을 선택하세요", variables.maleFemaleKeyboard(), res);
        });
    }
    setState(6, user.user_key, res, function(){
      resSet.sendMessageButton("아니오를 선택하셨습니다.",variables.initKeyboard(), res);
    });
  }else if(user.state === 18){
    setting.setSex(msg, user, res);
  }else if(user.state === 19){
    if(msg === "예"){
      return setState(20, user.user_key, res, function() {
        resSet.sendMessageButton("단위를 선택하세요", variables.kgLbsKeyboard(), res);
        });
    }
    setState(6, user.user_key, res, function(){
      resSet.sendMessageButton("아니오를 선택하셨습니다.",variables.initKeyboard(), res);
    });
  }else if(user.state === 20){
    setting.setWeightType(msg, user, res);
  }
  
  
  else if(msg === "몸무게 입력"){  //6.a
    setState(7.1, user.user_key, res, function(){
      resSet.sendMessageNonButton('오늘의 몸무게는?\n예)50.12', res);
    });
  }else if(msg === "분석"){ //6.b
    setState(8, user.user_key, res, function() {
       getAnalysis(user, res, variables.getUrl(), variables.initKeyboard()); 
    });
  }else if(msg === "목표"){ //6.c
    var goalText = '현재 목표는 '+user.goal+user.weight_type+'입니다.\n목표를 변경할까요?';
    if(user.goal === 0){
      goalText = '목표를 설정할까요?';
    }
    setState(9, user.user_key, res, function() {
       resSet.sendMessageButton(goalText, variables.yesNoKeyboard(), res ); 
    });
  }else if(msg === "키"){ //13
    var heightText = '키 정보를 입력할까요?\n*더 자세한 분석결과를 확인할 수 있습니다.';
    if(user.height != undefined){
      heightText = '키 정보를 수정할까요?';
      if(user.weight_type === 'kg'){
        heightText = '현재 키는 '+user.height+'cm 입니다.\n'+heightText;
      }else heightText = '현재 키는 '+user.height+'" 입니다.'+heightText;
    }
    setState(13, user.user_key, res, function() {
       resSet.sendMessageButton(heightText, variables.yesNoKeyboard(), res); 
    });
  }else if(msg === "나이"){
    var ageText = '나이를 입력할까요?\n*더 자세한 분석을 확인할 수 있습니다.';
    if(user.age != undefined){
        ageText = '현재 나이 : '+(new Date().getFullYear() - user.age)+'\n나이를 수정할까요?';
    }
    setState(15, user.user_key, res, function() {
       resSet.sendMessageButton(ageText, variables.yesNoKeyboard(), res); 
    });
  }else if(msg === "성별"){
    var sexText = '성별 정보를 입력할까요?\n*더 자세한 분석을 확인할 수 있습니다.';
    if(user.sex != undefined){
        sexText = '성별 정보를 수정할까요?';
        if(user.sex ==="M") sexText = '현재설정 : 남자\n'+sexText;
        else sexText = '현재설정 : 여자\n'+sexText;
    }
    setState(17, user.user_key, res, function() {
       resSet.sendMessageButton(sexText, variables.yesNoKeyboard(), res); 
    });
  }else if(msg === "단위"){
    var weightTypeText = '현재 몸무게 단위는 kg & cm 입니다.\n무게 단위를 변경할까요?';
    if(user.weight_type != 'kg') weightTypeText = '현재 몸무게 단위는 lbs & inch 입니다.\n무게 단위를 변경할까요?';
    setState(19, user.user_key, res, function() {
       resSet.sendMessageButton(weightTypeText, variables.yesNoKeyboard(), res); 
    });
  }else{
    resSet.sendMessageButton("아직 지원하고 있지 않습니다.", variables.initKeyboard(), res);
  }
  
};