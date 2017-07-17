const express = require('express');
const router = express.Router();

/****variable*****/
const variables = require("../functions/kakao/basic/variables");
/****fucntions***/
const resSet = require("../functions/kakao/basic/resSet");
const insertUser = require("../functions/kakao/userControl/insertUser");
const blockUser = require("../functions/kakao/userControl/blockUser");
const getUserState = require("../functions/kakao/state/getUserState");
const stateMapping = require("../functions/kakao/state/stateMapping");

module.exports = router;

/***************keyboard*****************/
router.get('/keyboard', function (req, res) {
  resSet.sendStringfyMessage(variables.initKeyboard(), res);
});

/************************message***********************/
router.post('/message', function(req, res){
  const user_key = req.body.user_key;
  //const type = req.body.type;
  console.log("beforeMapping", user_key, req.body.content);
  getUserState(req.body.user_key, res, req, function(rows, fields, msg){
    if(rows === undefined){
        return   insertUser(req.body.user_key, "KAKAO", res, function(user_key) {
                   getUserState(user_key, res, req, function(rows, fields, msg) {
                     console.log("rows undefined");
                     stateMapping(msg, rows, res);    
                   });
                });
    }
    stateMapping(msg, rows, res);
  });
});

/************************친구추가***********************/
router.post('/friend', function(req, res){
  const user_key = req.body.user_key;
  console.log(`${user_key}님이 채팅방에 참가했습니다.`);
  if(user_key === "test"){
    return  resSet.sendStringfyMessage({success: true}, res);
  }
  insertUser(user_key, "KAKAO", res, function(){
    resSet.sendStringfyMessage({success: true}, res);
    return console.log(user_key+"등록완료");
  });
});

/************************block***********************/
router.delete('/friend/:user_key', function(req, res){
  const user_key = req.params.user_key;
  console.log(`${user_key}님이 채팅방을 차단했습니다.`);
  if(user_key ==="test"){
    return  resSet.sendStringfyMessage({success: true}, res);
  }
  blockUser(user_key, res);
});

/************************leave***********************/
router.delete('/chat_room/:user_key', function(req, res){
  const user_key = req.params.user_key;
  console.log(`${user_key}님이 채팅방에서 나갔습니다.`);
  
  resSet.sendStringfyMessage({success: true}, res);
});
