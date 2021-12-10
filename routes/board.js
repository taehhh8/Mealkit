// board.js
const express = require('express');
const router = express.Router();
const getConnection = require("../model/maria");

/* 게시판 관련 컨트롤러 */
/* "/board" */

// 게시판 목록으로 이동
router.get('/', function (req, res) {
    getConnection((conn) => {
        var myQ = "select * from Board"
        conn.query(myQ, (err, result, fields) => {
            if (err) throw err;
            else {
                console.log(result)
                res.render('board/list', { boardList: result });
            }
        })
    })
});
// 게시글 삭제
router.get('/delete', function (req, res) {
    getConnection((conn) => {
        var myQ = "select * from Board"
        conn.query(myQ, (err, result, fields) => {
            if (err) throw err;
            else {
                console.log(result)
                res.render('board/list', { boardList: result });
            }
        })
    })
});

router.get('/faq', function (req, res) {
    res.render('board/faq')
});


router.get('/notice', function (req, res) {
    res.render('board/notice')
});

// 게시판 작성 페이지로 이동
router.get('/post', function (req, res) {
    res.render('board/post');
});

//작성된 게시판으로 이동
router.get('/view', function (req, res) {
    res.render('board/view', { boardList: ["보드리스트"] });
})

// 게시글 작성
router.post('/post', function (req, res) {
    const post = req.body;
    console.log(req.body)
    const sql = 'INSERT INTO Board(Email, Phone_Number, Writer, Content, Posted_time, Edited_time) values ';
    const sqlValue = `('${post.Email1}@${post.Email2}', '${post.Q_MOBILE1}-${post.Phone_Number1}-${post.Phone_Number2}', '${post.Writer}', '${post.Content}', NOW(), NOW());`;

    getConnection((conn) => {
        conn.query(sql + sqlValue, function (err, rows, fields) {
            if (!err) {
                res.redirect('/board');
                // res.json(true);
            } else {
                console.log(err);
                res.json(false);
            }
        })
    })
})
//게시글 삭제
router.post('/delete', function (req, res) {
    const num = req.body.num;
    // console.log("num123123::::::::::::::::::::::::::",num)
    const sql = `DELETE FROM Board WHERE num = ${num};`;

    getConnection((conn) => {
        conn.query(sql, function (err, rows, fields) {
            if (!err) {
                // console.log("여긴가?")
                res.redirect('/board');
            } else {
                console.log(err);
                res.json(false);
            }
        })
    })
})


module.exports = router;