const getUserState = require("./getUserState");
const insertUser = require("../userControl/insertUser");
const setting = require("../setting");
const setState = require("./setState");
const inputWeight = require("../inputWeight");
const getAnalysis = require("../getAnalysis");

exports.message = function (replyToken, message, urls, lineBot){
    //const msg = message.getText();
    console.log("line_msg _1", message.getUserId(), message.getText() );
    getUserState(message.getUserId(), message.getText(), function(user, fields, msg){
       console.log("line_msg _2", user.user_key, msg);
       if(user=== undefined){
           return insertUser(message, replyToken, lineBot);
       }
       const state = user.state;
       if(state === 3.1 || state == 3.2){
           setting.initGoal(replyToken, msg, user, lineBot);
       }else if(state === 5.1 || state === 5.2){
           setting.initAlarm(replyToken, msg, user.user_key, lineBot);
       }else if(state === 7.1 || state === 7.2){
           inputWeight(replyToken, msg, user, urls, lineBot);
       }else if(state === 10.1 || state === 10.2){
           setting.setGoal(replyToken, msg, user, lineBot);
       }else if(state === 12.1 || state === 12.2){
           setting.setAlarm(replyToken, msg, user, lineBot);
       }else if(state === 14.1 || state === 14.2){
           setting.setHeight(replyToken, msg, user, lineBot);
       }else if(state === 16.1 || state === 16.2){
           setting.setAge(replyToken, msg, user, lineBot);
       }
       
       
       else setState(6, user.user_key, function() {
           lineBot.replyMessage(replyToken, setting.mainMenu());
       });
    });
};

exports.postback = function(replyToken, postback, urls, lineBot){
    console.log("line_post_1", postback.getUserId(), postback.getPostbackData() );
    getUserState(postback.getUserId(), postback.getPostbackData(), function(user, fields, postdata){
        console.log("line_post_2", user.user_key, postdata );
        if(postdata === '2.a'){
            setState(3.1, user.user_key, function() {
                lineBot.replyTextMessage(replyToken, "목표 몸무게를 입력하세요.\n예) 48.58");
            }, 'weight_type="kg"');
        }else if(postdata ==='2.b'){
            setState(3.1, user.user_key, function() {
                lineBot.replyTextMessage(replyToken, "목표 몸무게를 입력하세요.\n예) 107.12");
            }, 'weight_type="lbs"');
        }else if(postdata === '4.a'){
            setState(6, user.user_key, function(){
                lineBot.replyMessage(replyToken, setting.mainMenu());
            },'alarm_onoff=1');
        }else if(postdata === '4.b'){
            setState(6, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.mainMenu());
            },'alarm_onoff =0');
        }else if(postdata === '4.c'){
            setState(5.1, user.user_key, function() {
                lineBot.replyTextMessage(replyToken, "언제 알람을 드릴까요?\n예) 21:00 또는 2100"); 
            });
        }else if(postdata === '6'){
            setState(6, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.mainMenu()); 
            });   
        }else if(postdata === '6.a'){
            setState(7.1, user.user_key, function() {
                lineBot.replyTextMessage(replyToken, "오늘의 몸무게는?\n예) 60.5"); 
            });
        }else if(postdata === '6.b'){
            setState(8, user.user_key, function() {
               getAnalysis(replyToken, user, urls, lineBot); 
            });
        }else if(postdata === '6.c'){
            setState(9, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setGoalButton(user)); 
            });
        }else if(postdata === '6.d'){
            setState(11, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setAlarmButton(user));
            });
        }else if(postdata === '9.a'){
            setState(10.1, user.user_key, function() {
                lineBot.replyTextMessage(replyToken, "목표 몸무게를 입력하세요.\n예) 48.12");
            });
        }else if(postdata === '9.b'){
            setState(6, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.mainMenu()); 
            });
        }else if(postdata === '11.a'){
            setState(12.1, user.user_key, function() {
                lineBot.replyTextMessage(replyToken, "언제 알람을 드릴까요?\n예) 19:00 또는 1900");
            });   
        }else if(postdata === '11.b'){
            setState(13, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setHeightButton(user)); 
            });   
        }else if(postdata === '11.c'){
            setState(11, user.user_key, function() {
                getUserState(user.user_key, postdata,function(user) {
                    //console.log("11.c", user.alarm_onoff);
                    lineBot.replyMessage(replyToken, setting.setAlarmButton(user));  
                });
            },' alarm_onoff = CASE WHEN 1 THEN alarm_onoff=0 ELSE alarm_onoff=1 END'); 
        }else if(postdata === '13.a'){
            setState(14.1, user.user_key, function() {
                lineBot.replyTextMessage(replyToken, "키를 입력하세요.\n예) 165.5");
            });   
        }else if(postdata === '13.b'){
            setState(15, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setAgeButton(user));
            });   
        }else if(postdata === '15.a'){
            setState(16.1, user.user_key, function() {
                lineBot.replyTextMessage(replyToken, "나이를 입력하세요.\n예) 23");
            });
        }else if(postdata === '15.b'){
            setState(17, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setSexButton(user));
            });   
        }else if(postdata === '17.a'){
            setState(18, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setSex());
            });
        }else if(postdata === '17.b'){
            setState(19, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setWeightTypeButton(user));
            });   
        }else if(postdata === '18.a'){
            setState(19, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setWeightTypeButton(user));
            }, 'sex="M"');
        }else if(postdata === '18.b'){
            setState(19, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setWeightTypeButton(user));
            }, 'sex="F"');
        }else if(postdata === '19.a'){
            setState(20, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.setWeightType(user));
            });
        }else if(postdata === '20.a'){
            setState(6, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.mainMenu());
            }, 'weight_type="kg"');
        }else if(postdata === '20.b'){
            setState(6, user.user_key, function() {
                lineBot.replyMessage(replyToken, setting.mainMenu());
            }, 'weight_type="lbs"');
        }
    });
};