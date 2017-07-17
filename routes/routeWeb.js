const express = require('express');
const router = express.Router();
const goSql = require('../functions/kakao/basic/goSql');
module.exports = router;


router.get('/', function(req, res) {
    res.send(`
        <a href="http://pf.kakao.com/_bknhxl"><img src="https://www.w8.ze.am/components/w8_kakao.png"></a>
        <a href="https://line.me/R/ti/p/%40vbw9172l"><img border="0" align="top" alt="친구추가" src="https://scdn.line-apps.com/n/line_add_friends/btn/ko.png"></a>
    `);
});

router.get('/:token', function(req, res){
  const token = req.params.token;
  console.log(':token :'+token);
  const sql =  'SELECT w.*, u.goal, u.weight_type '+
                'FROM weights w, tokens t, users u '+
                'WHERE w.user_id = t.user_id and t.user_id = u.user_id and t.token_uuid="'+token+'" '+
                'ORDER BY weight_id DESC';
  goSql(sql, res, function(data, fields){
    if(data.length != 0){
        return res.render('index', {
          title: "W8 Analysis",
          data : data,
          token : token,
          type : data[0].weight_type
        });
    }
    res.send(`
      <script>alert('유효한 접근이 아닙니다.\\n최신 분석 차트로 접근하세요.');</script>
    `);
  });
});

router.post('/:token', function(req, res){
    const corrected_weight = req.body.corrected_weight;
    const token = req.params.token;
    const date = new Date(req.body.corrected_date);
    const sql_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    const sql = 'UPDATE weights, tokens '+
                'SET weights.weight='+corrected_weight+' '+
                'WHERE tokens.token_uuid="'+token+
                '" and tokens.user_id=weights.user_id and weights.date="'+sql_date+'"';
    goSql(sql, res,  function(data, fields) {
      res.send({
        response: "okay"
        }); 
    });
});