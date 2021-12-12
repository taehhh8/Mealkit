const express = require('express');
const router = express.Router();
// express는 라우팅을 지원합니다. 
// 그 기능을 사용하기 위해서 express를 require으로 불러옵니다. 
// 그리고 router라는 변수안에 express의 Router기능을 넣습니다.

/* GET home page. */
// 이제 라우팅을 위해 router 변수를 사용해줍니다. get 메소드는 REST API의 GET 통신을 위한 메소드입니다.
// 첫 번째 인자인 '/' 은 주소값입니다. 만약 사용자가 http:내사이트.com/ 으로 접속했다면 바로 이어지는 두 번째 인자로 들어온 함수를 실행합니다.

router.get('/', function(req, res, next) { 
  res.render('notice');
});
router.post('/post', function(req, res, next) { 
  console.log(req.body)
});

module.exports = router;