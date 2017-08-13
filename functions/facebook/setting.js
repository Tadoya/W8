const FacebookBot = require('facebook-bot-messenger');
const setState = require("./state/setState");



/************메인메뉴*************/
exports.mainMenu = function (){
    var btn1 = new FacebookBot.PostbackButtonBuilder("Today's weight", '6.a');
    var btn2 = new FacebookBot.PostbackButtonBuilder('Analysis', '6.b');
    var btn3 = new FacebookBot.PostbackButtonBuilder('Goal', '6.c');
    var template = new FacebookBot.ButtonTemplateBuilder('[Main menu]\nSelect what you want', [btn1, btn2, btn3]);
    var builder = new FacebookBot.AttachmentMessageBuilder(template);
    return builder;
};
/********몸무게 목표 변경*************/

exports.setGoal = function (msg, user, facebookBot){
    if(msg < 9999 && msg > 0){
        const setQuery = 'goal= '+msg;
        return setState(6, user.user_key, function() {
            facebookBot.sendTextMessage(user.user_key, 'The goal setting has been completed.');
        }, setQuery);
    } 
    setState(10.2, user.user_key, function(){
       facebookBot.sendTextMessage(user.user_key, "Please re-enter\nex) 50.56");
    });
};
/********설정 알람*************/
exports.setAlarmQuick = function (user, facebookBot){
    facebookBot.getProfile(user.user_key).then(function(data) {
        var msg = ((parseInt(user.alarm_time.substr(0,2),10)+24+data.timezone)%24)+user.alarm_time.substr(2,3) 
                 +' [ON]';
        if(user.alarm_onoff === 0){
            msg = ((parseInt(user.alarm_time.substr(0,2),10)+24+data.timezone)%24)+user.alarm_time.substr(2,3) 
                 +' [OFF]';
        }
        var builder = new FacebookBot.QuickRepliesMessageBuilder(msg);
        builder.addTextOption('ON','11.a')
               .addTextOption('OFF','11.b')
               .addTextOption('TIME SET','11.c');
        facebookBot.sendMessage(user.user_key, builder);
    }).catch(function(error) {
      console.error(error);
    });
};

exports.setAlarm = function (msg, user, facebookBot){
    facebookBot.getProfile(user.user_key).then(function(data) {
        var setQuery = 'alarm_onoff= 1, alarm_time=';
        var regex1 = /([01]\d|2[0-3]):([0-5]\d)/;
        var regex2 = /([01]\d|2[0-3])([0-5]\d)/;
        if(regex1.test(msg)){
            msg = ((parseInt(msg.substr(0,2),10)+24-data.timezone)%24)+msg.substr(2);
            console.log("regex1", msg);
            setQuery+='"'+msg+'"';
            return setState(6, user.user_key, function() {
                facebookBot.sendTextMessage(user.user_key, 'the alarm setting has been completed [ON]');
            }, setQuery);
        }else if(regex2.test(msg)){
            msg = ((parseInt(msg.substr(0,2),10)+24-data.timezone)%24)+':'+msg.substr(2);
            setQuery+='"'+msg+'"';
            return setState(6, user.user_key, function() {
                facebookBot.sendTextMessage(user.user_key, 'the alarm setting has been completed [ON]');
            }, setQuery);
        }
        setState(12.2, user.user_key, function(){
           facebookBot.sendTextMessage(user.user_key, "Pleas re-enter\nex) 20:00 or 2000");
        });
    }).catch(function(error) {
      console.error(error);
    });
};

/********설정 키*************/
exports.setHeightQuick = function (user){
    var title = 'Do you want to enter your height?';
    var msg='*you can get further analysis later';
    if(user.height != undefined){
        title = 'Do you want to correct your height?';
        if(user.weight_type === 'kg') msg = user.height+'cm';
        else msg = user.height+'"';
    }
    var builder = new FacebookBot.QuickRepliesMessageBuilder(title+'\n'+msg);
    builder.addTextOption('YES', '13.a')
           .addTextOption('NO', '13.b');
    return builder;
};
exports.setHeight = function (msg, user, facebookBot) {
    if(msg < 300 && msg > 0){
        const setQuery = 'height= '+msg;
        return setState(6, user.user_key, function() {
            facebookBot.sendTextMessage(user.user_key, 'the height setting has been completed');
        }, setQuery);
    } 
    setState(14.2, user.user_key, function(){
       facebookBot.sendTextMessage(user.user_key, "Please re-enter\nex) 177.5");
    });
};
/*************단위설정***************/
exports.setWeightType = function (){
    var builder = new FacebookBot.QuickRepliesMessageBuilder('Select weight & height units');
    builder.addTextOption('kg & cm', '20.a')
           .addTextOption('lbs & inch', '20.b');
    return builder;
};
/***********예 아니오****************/
exports.yesOrNo = function(question, nextState, cancelState){
    var builder = new FacebookBot.QuickRepliesMessageBuilder(question);
    builder.addTextOption('YES',nextState)
           .addTextOption('NO',cancelState);
    return builder;
};