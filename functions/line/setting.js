const LINEBot = require('line-messaging');
const setState = require("./state/setState");
const getTimeZone = require("./basic/getTimeZone");

/******초기설정*******/
/******몸무게 단위 설정*****/
exports.initWeightTypeButton = function (){
    const title = '몸무게 단위?';
    const msg = '몸무게 단위?';
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setMessage(msg);
    button.addAction('kg & cm', '2.a', LINEBot.Action.POSTBACK);
    button.addAction('lbs & inch', '2.b', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder(title, button);
    return button_template;
};
/*****몸무게 목표설정********/
exports.initGoal = function (replyToken, msg, user, lineBot){
    if(msg < 9999 && msg > 0){
        const setQuery = 'goal= '+msg;
        return setState(4, user.user_key, function() {
            lineBot.replyMessage(replyToken, exports.initAlarmButton(user.alarm_time));
        }, setQuery);
    } 
    setState(3.2, user.user_key, function(){
       lineBot.replyTextMessage(replyToken, "다시 입력하세요.\n예) 50.56");
    });
};

/***********몸무게 입력 알람설정*********/
exports.initAlarmButton = function (alarm_time){
    const msg = '현재 알람은 '
                +((parseInt(alarm_time.substr(0,2),10)+24+getTimeZone("KR"))%24)+alarm_time.substr(2,3) 
                +' 입니다.';
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setTitle('몸무게 입력 알람을 드릴까요?');
    button.setMessage(msg);
    button.addAction('예', '4.a', LINEBot.Action.POSTBACK);
    button.addAction('아니오', '4.b', LINEBot.Action.POSTBACK);
    button.addAction('변경', '4.c', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder('몸무게 입력 알람', button);
    return button_template;
};

exports.initAlarm = function (replyToken, msg, user_key, lineBot){
    var setQuery = 'alarm_onoff= 1, alarm_time=';
    var regex1 = /([01]\d|2[0-3]):([0-5]\d)/;
    var regex2 = /([01]\d|2[0-3])([0-5]\d)/;
    if(regex1.test(msg)){
        msg = ((parseInt(msg.substr(0,2),10)+24-getTimeZone("KOR"))%24)+msg.substr(2);
        setQuery+='"'+msg+'"';
        return setState(6, user_key, function() {
            lineBot.replyMessage(replyToken, exports.mainMenu());
        }, setQuery);
    }else if(regex2.test(msg)){
        msg = ((parseInt(msg.substr(0,2),10)+24-getTimeZone("KOR"))%24)+':'+msg.substr(2);
        setQuery+='"'+msg+'"';
        //console.log("regex2", msg);
        return setState(6, user_key, function() {
            lineBot.replyMessage(replyToken, exports.mainMenu());
        }, setQuery);
    }
    setState(5.2, user_key, function(){
       lineBot.replyTextMessage(replyToken, "다시 입력하세요.\n예) 18:00 또는 1800");
    });
};
/*********초기설정 끝****************/
/************메인메뉴*************/
exports.mainMenu = function (){
    const msg = '메인메뉴를 호출 하시려면 아무 말이나 입력하세요.\n설정[알람, 키, 나이, 성별, 단위]';
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setTitle('메인메뉴');
    button.setMessage(msg);
    button.addAction('몸무게 입력', '6.a', LINEBot.Action.POSTBACK);
    button.addAction('분석', '6.b', LINEBot.Action.POSTBACK);
    button.addAction('목표','6.c', LINEBot.Action.POSTBACK);
    button.addAction('설정','6.d', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder('메인메뉴', button);
    return button_template;
};
/********몸무게 목표 변경*************/
exports.setGoalButton = function (user) {
    const msg = '현재 목표는 '+user.goal+user.weight_type+' 입니다.';
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setTitle('목표를 변경할까요?');
    button.setMessage(msg);
    button.addAction('예', '9.a', LINEBot.Action.POSTBACK);
    button.addAction('아니오', '9.b', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder('목표 몸무게', button);
    return button_template;
};

exports.setGoal = function (replyToken, msg, user, lineBot){
    if(msg < 9999 && msg > 0){
        const setQuery = 'goal= '+msg;
        return setState(6, user.user_key, function() {
            lineBot.replyMessage(replyToken, exports.mainMenu());
        }, setQuery);
    } 
    setState(10.2, user.user_key, function(){
       lineBot.replyTextMessage(replyToken, "다시 입력하세요.\n예) 50.56");
    });
};
/********설정 알람*************/
exports.setAlarmButton = function (user){
    var msg = '현재 알람은 '
                +((parseInt(user.alarm_time.substr(0,2),10)+24+getTimeZone("KR"))%24)+user.alarm_time.substr(2,3) 
                +' 입니다. [알람 켜짐]';
    var onoff = '알람끄기';
    if(user.alarm_onoff === 0){
        msg = '현재 알람은 '
                +((parseInt(user.alarm_time.substr(0,2),10)+24+getTimeZone("KR"))%24)+user.alarm_time.substr(2,3) 
                +' 입니다. [알람 꺼짐]';
        onoff = '알람켜기';
    }
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setTitle('몸무게 입력 알람을 변경할까요?');
    button.setMessage(msg);
    button.addAction('예', '11.a', LINEBot.Action.POSTBACK);
    button.addAction('아니오', '11.b', LINEBot.Action.POSTBACK);
    button.addAction(onoff, '11.c', LINEBot.Action.POSTBACK);
    button.addAction('설정종료', '6', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder('몸무게 입력 알람', button);
    return button_template;
};

exports.setAlarm = function (replyToken, msg, user, lineBot){
    var setQuery = 'alarm_onoff= 1, alarm_time=';
    var regex1 = /([01]\d|2[0-3]):([0-5]\d)/;
    var regex2 = /([01]\d|2[0-3])([0-5]\d)/;
    if(regex1.test(msg)){
        msg = ((parseInt(msg.substr(0,2),10)+24-getTimeZone("KR"))%24)+msg.substr(2);
        console.log("regex1", msg);
        setQuery+='"'+msg+'"';
        return setState(13, user.user_key, function() {
            lineBot.replyMessage(replyToken, exports.setHeightButton(user));
        }, setQuery);
    }else if(regex2.test(msg)){
        msg = ((parseInt(msg.substr(0,2),10)+24-getTimeZone("KR"))%24)+':'+msg.substr(2);
        setQuery+='"'+msg+'"';
        //console.log("regex2", msg);
        return setState(13, user.user_key, function() {
            lineBot.replyMessage(replyToken, exports.setHeightButton(user));
        }, setQuery);
    }
    setState(12.2, user.user_key, function(){
       lineBot.replyTextMessage(replyToken, "다시 입력하세요.\n예) 20:00 또는 2000");
    });
};

/********설정 키*************/
exports.setHeightButton = function (user){
    var title = '키 정보를 입력할까요?';
    var msg='*더 자세한 분석을 확인할 수 있습니다.';
    if(user.height != undefined){
        title = '키 정보를 수정할까요?';
        if(user.weight_type === 'kg') msg = '현재 키는 '+user.height+'cm 입니다.';
        else msg = '현재 키는 '+user.height+'" 입니다.';
    }
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setTitle(title);
    button.setMessage(msg);
    button.addAction('예', '13.a', LINEBot.Action.POSTBACK);
    button.addAction('아니오', '13.b', LINEBot.Action.POSTBACK);
    button.addAction('설정종료', '6', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder('키 정보 설정', button);
    return button_template;
};
exports.setHeight = function (replyToken, msg, user, lineBot) {
    if(msg < 300 && msg > 0){
        const setQuery = 'height= '+msg;
        return setState(15, user.user_key, function() {
            lineBot.replyMessage(replyToken, exports.setAgeButton(user));
        }, setQuery);
    } 
    setState(14.2, user.user_key, function(){
       lineBot.replyTextMessage(replyToken, "다시 입력하세요.\n예) 177.5");
    });
};
/********설정 나이*************/
exports.setAgeButton = function (user){
    var title = '나이를 입력할까요?';
    var msg = '*더 자세한 분석을 확인할 수 있습니다.';
    if(user.age != undefined){
        title = '나이를 수정할까요?';
        msg = '현재 나이 : '+(new Date().getFullYear() - user.age);
    }
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setTitle(title);
    button.setMessage(msg);
    button.addAction('예', '15.a', LINEBot.Action.POSTBACK);
    button.addAction('아니오', '15.b', LINEBot.Action.POSTBACK);
    button.addAction('설정종료', '6', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder('나이 설정', button);
    return button_template;
};
exports.setAge = function (replyToken, msg, user, lineBot) {
    if(msg < 150 && msg > 0){
        const setQuery = 'age= '+(new Date().getFullYear() - msg);
        return setState(17, user.user_key, function() {
            lineBot.replyMessage(replyToken, exports.setSexButton(user));
        }, setQuery);
    } 
    setState(16.2, user.user_key, function(){
       lineBot.replyTextMessage(replyToken, "다시 입력하세요.\n예) 23");
    });
};

/********설정 성별*************/
exports.setSexButton = function (user){
    var title = '성별 정보를 입력할까요?';
    var msg = '*더 자세한 분석을 확인할 수 있습니다.';
    if(user.sex != undefined){
        title = '성별 정보를 수정할까요?';
        if(user.sex ==="M") msg = '현재설정 : 남자';
        else msg = '현재설정 : 여자';
    }
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setTitle(title);
    button.setMessage(msg);
    button.addAction('예', '17.a', LINEBot.Action.POSTBACK);
    button.addAction('아니오', '17.b', LINEBot.Action.POSTBACK);
    button.addAction('설정종료', '6', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder('성별 설정', button);
    return button_template;
};

exports.setSex = function () {
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setMessage('성별 선택');
    button.addAction('남자', '18.a', LINEBot.Action.POSTBACK);
    button.addAction('여자', '18.b', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder('성별 선택', button);
    return button_template;
};

/********설정 몸무게 단위*************/
exports.setWeightTypeButton = function (user){
    var msg = '현재 몸무게 단위는 kg & cm 입니다.';
    if(user.weight_type != 'kg') msg = '현재 몸무게 단위는 lbs & inch 입니다.';
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setTitle('몸무게 단위를 변경할까요?');
    button.setMessage(msg);
    button.addAction('예', '19.a', LINEBot.Action.POSTBACK);
    button.addAction('아니오(설정종료)', '6', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder('몸무게 단위 설정', button);
    return button_template;
};
exports.setWeightType = function (){
    const title = '몸무게 단위 선택';
    const msg = '몸무게 단위';
    var button = new LINEBot.ButtonTemplateBuilder();
    button.setMessage(msg);
    button.addAction('kg & cm', '20.a', LINEBot.Action.POSTBACK);
    button.addAction('lbs & inch', '20.b', LINEBot.Action.POSTBACK);
    const button_template = new LINEBot.TemplateMessageBuilder(title, button);
    return button_template;
};