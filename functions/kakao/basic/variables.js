var initUrl = '';
const init_keyboard = {
  "type" : "buttons",
  buttons : ["몸무게 입력", "분석", "목표", "키", "나이", "성별", "단위", "도움말"]
};
const yes_no_keyboard = {
  "type" : "buttons",
  buttons : ["예", "아니오"]
};
const male_female_keyboard = {
  "type" : "buttons",
  buttons : ["남자", "여자"]
};
const kg_lbs_keyboard = {
  "type" : "buttons",
  buttons : ["kg & cm", "lbs & inch"]
};

exports.initKeyboard = function(){
  return init_keyboard;
};
exports.yesNoKeyboard = function(){
  return yes_no_keyboard;
};
exports.maleFemaleKeyboard = function(){
  return male_female_keyboard;
};
exports.kgLbsKeyboard = function(){
  return kg_lbs_keyboard;
};
exports.setUrl = function(url){
  initUrl = url;
};
exports.getUrl = function(){
    return initUrl;
};