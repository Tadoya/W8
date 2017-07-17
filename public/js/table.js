var urls = 'https://www.w8.ze.am/';

/**
 * button : 테이블 set버튼
 * input_weight : 몸무게 변경 or 입력 변수
 * undoValue : 몸무게 변경 시 변동 값
 * originalValue : 몸무게 변경 전 값
 * tdDate : 테이블 행당 년도-월-일 값
 **/
var button = [];
var input_weight = [];
var undoValue = [];
var originalValue = [];
var tdDate = [];
for(var key in data){
    button.push(document.getElementById("button"+key));
    input_weight.push(document.getElementById("weight"+key));
    originalValue.push(input_weight[key].value);
    undoValue.push(input_weight[key].value);
    tdDate.push(document.getElementById("td-date"+key).getAttribute("value"));
    addListener(key);
}
//왜 이렇게 분리시켜야하는지 의문.. 포문안에 한번에 넣으면 마지막 넘버 리스너만 연결됨.
function addListener(number){
    button[number].addEventListener("click", function(){
        buttonClickHandler(number);
    });
    input_weight[number].addEventListener("input", function(){
        var regex = /^(([1-9]\d{0,3})?([.]\d{0,2})?)?$/;    //1~9999.99까지의 범위(정수4자리-소수2자리 or 소수2지리)
        if(!regex.test(input_weight[number].value)){
            input_weight[number].value = undoValue[number];
            console.log(undoValue[number]);
            return alert("Range(1~9999.99)");
        }    
        input_weight[number].setAttribute("value", input_weight[number].value); 
        undoValue[number] = input_weight[number].value;
    });
}
/**
 * SET버튼 클릭 핸들러
 **/
function buttonClickHandler(number){
    var regex = /^([1-9]\d{0,3}([.]\d{0,2})?)?$/;
    console.log(number,button[number].getAttribute("value"));
    if(button[number].getAttribute("value") === "Set"){
        input_weight[number].removeAttribute("readonly");
        return button[number].setAttribute("value", "OK");
    }
    if(!regex.test(input_weight[number].value)){
        input_weight[number].value = undoValue[number];
        console.log("input_empty error");
        return alert("Range(1~9999.99)");
    }
    var corrected_weight = input_weight[number].getAttribute("value");
    var corrected_date = tdDate[number];
    console.log(corrected_weight, corrected_date);
    input_weight[number].setAttribute("readonly", true);
    button[number].setAttribute("value", "Set");
    if(undoValue[number]===originalValue[number]){
        return console.log(number, "same value");
    }
    sendAjax(urls+token, corrected_weight, corrected_date, number);
    // weightData.yWeights[weightData.yWeights.length-1] = input;
    // return lineChart.update();
}

function sendAjax(url, corrected_weight, corrected_date, number) {
    var oReq = new XMLHttpRequest();
    var params ="corrected_weight="+corrected_weight+
                "&corrected_date="+corrected_date;
    console.log("sendData:",params);
    oReq.open('POST', url);
    oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//'Content-Type', "application/json"); // json 형태로 보낸다                         
    oReq.send(params);
 
    oReq.addEventListener('load', function() {
        var result = JSON.parse(oReq.responseText);
        if(result.response === "okay"){
            console.log(result);
            if(weightData.yWeights.length>0){
                weightData.yWeights[weightData.yWeights.length-number-1] = corrected_weight;
                console.log(weightData.yWeights.length-number-1, corrected_weight);
                lineChart.update();
            }
        }
    });
}
