const getUserState = require("./getUserState");
const insertUser = require("../userControl/insertUser");
const setting = require("../setting");
const setState = require("./setState");
const inputWeight = require("../inputWeight");
const getAnalysis = require("../getAnalysis");

exports.message = function (senderId, message, urls, facebookBot){
    getUserState(senderId, message, function(user, fields, message){
       if(user=== undefined){
            return insertUser(senderId, facebookBot);
       }
       if(!message.isTextMessage() && !message.isQuickReply()){
           return facebookBot.sendTextMessage(senderId, 'Sorry, Only text input is supported.');
       }
       const state = user.state;
       const msg = message.getText();
       console.log("facebook_message", state, msg, message.isQuickReply());
       
       if(message.isQuickReply()){
          if(message.getData() === '9.a'){
              setState(10.1, user.user_key, function() {
                  facebookBot.sendTextMessage(user.user_key, "Please enter your Goal\nex) 48.12");
              });
          }else if(message.getData() === '9.b'){
              setState(6, user.user_key, function() {
                  facebookBot.sendTextMessage(user.user_key, 'You selected "NO"'); 
              });
          }else if(message.getData() === '11.a'){
              setState(6, user.user_key, function() {
                  facebookBot.sendTextMessage(user.user_key, 'Alarm ON');
              },' alarm_onoff = 1');
          }else if(message.getData() === '11.b'){
              setState(6, user.user_key, function() {
                  facebookBot.sendTextMessage(user.user_key, 'Alarm OFF');
              },' alarm_onoff = 0');
          }else if(message.getData() === '11.c'){
              setState(12.1, user.user_key, function() {
                  facebookBot.sendTextMessage(user.user_key, 'Please enter alarm time\nex) 20:00 or 2000');
              });
          }else if(message.getData() === '13.a'){
              setState(14.1, user.user_key, function() {
                  facebookBot.sendTextMessage(user.user_key, "Please enter height\nex) 165.5");
              });   
          }else if(message.getData() === '13.b'){
              setState(6, user.user_key, function() {
                   facebookBot.sendTextMessage(user.user_key, 'You selected "NO"'); 
               });   
          }else if(message.getData() === '20.a'){
              setState(6, user.user_key, function() {
                  facebookBot.sendTextMessage(user.user_key, 'The weight & height unit settings have been completed.');
              }, 'weight_type="kg"');
          }else if(message.getData() === '20.b'){
              setState(6, user.user_key, function() {
                  facebookBot.sendTextMessage(user.user_key, 'The weight & height unit settings have been completed.');
              }, 'weight_type="lbs"');
          }
      }else {
          if(state === 7.1 || state === 7.2){
              inputWeight(msg, user, urls, facebookBot);
          }else if(state === 10.1 || state === 10.2){
              setting.setGoal(msg, user, facebookBot);
          }else if(state === 12.1 || state === 12.2){
              setting.setAlarm(msg, user, facebookBot);
          }else if(state === 14.1 || state === 14.2){
              setting.setHeight(msg, user, facebookBot);
          }else if(state === 16.1 || state === 16.2){
              setting.setAge(msg, user, facebookBot);
          }else setState(6, user.user_key, function() {
              facebookBot.sendTextMessage(user.user_key, "When you enter any word, Main menu appears.");
              facebookBot.sendMessage(user.user_key, setting.mainMenu());
          });
        }
    });
};

exports.postback = function(senderId, postback, urls, facebookBot){
    getUserState(senderId, postback, function(user, fields, postback){
        const postdata = postback.getPostbackData();
        console.log('facebook_postdata : ', postdata);
        
        if(user=== undefined){
           return insertUser(senderId, facebookBot);
        }
        if(postdata==='GET_STARTED_PAYLOAD'){
            facebookBot.getProfile(senderId).then(function(data) {
                facebookBot.sendTextMessage(user.user_key, "What if you can build a slim and healthy body with a weight scale?\n"+
                                                    "W8 will manage and analyze  your weight data systematically!\n"+
                                                    "Take your health while measuring your weight periodically with W8!\n"+
                                                    "Chart graphs are normally displayed after the 2nd day.");
                if(user.alarm_onoff) facebookBot.sendTextMessage(user.user_key, 'W8 will send you a "Today\'s weight?" alarm message at '
                    + ((parseInt(user.alarm_time.substr(0,2),10)+24+data.timezone)%24)+user.alarm_time.substr(2,3)
                    + "\nYou can turn off the alarm, if you don't want to.\n(Setting >> Alarm >> OFF)");
                return facebookBot.sendMessage(user.user_key, setting.mainMenu());
            }).catch(function(error) {
               console.error(error);
            });
        }
        
        if(postdata === '6'){
            facebookBot.sendMessage(user.user_key, setting.mainMenu()); 
        }else if(postdata === '6.a'){
            setState(7.1, user.user_key, function() {
                facebookBot.sendTextMessage(user.user_key, "What is your weight today?\nex) 60.5"); 
            });
        }else if(postdata === '6.b'){
            setState(8, user.user_key, function() {
              getAnalysis(user, urls, facebookBot); 
            });
        }else if(postdata === '6.c'){
            setState(9, user.user_key, function() {
                facebookBot.sendMessage(user.user_key, setting.yesOrNo('Do you want to set your goal?','9.a','9.b'));
            });
        }else if(postdata === '11'){
            setState(11, user.user_key, function() {
                setting.setAlarmQuick(user, facebookBot);    
            });
        }else if(postdata === '13'){
            setState(13, user.user_key, function() {
                facebookBot.sendMessage(user.user_key, setting.setHeightQuick(user));    
            });
        }else if(postdata === '20'){
            setState(20, user.user_key, function() {
                facebookBot.sendMessage(user.user_key, setting.setWeightType());
            });
        }
    });
};