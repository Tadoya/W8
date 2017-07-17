exports.sendStringfyMessage = function(msg, res){
  return res.set({
    'content-type': 'application/json'
  }).send(JSON.stringify(msg));
};
exports.sendMessageNonButton = function(msg, res){
    return res.send({
        "message" : {
            "text" : msg
        }
    }); 
};
exports.sendMessageButton = function(msg, keyboard, res){
    return res.send({
        "message" : {
            "text" : msg
        },
        "keyboard" : keyboard
    }); 
};