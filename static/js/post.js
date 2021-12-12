// post.js
const main = {
    init: function () {
      const _this = this;
      document.getElementById("write").onclick = function () {
        _this.write();
      };
    },
    write: function () {
      const post = {
        num: document.getElementById("num").value,
        Email: document.getElementById("Email").value,
        Phone_Number: document.getElementById("Phone_Number").value,
        Writer: document.getElementById("Writer").value,
        Content: document.getElementById("Content").value,
        Posted_time: new Date().toLocaleString(),
        Edited_time: new Date().toLocaleString(),
      };
      axios.post("/board/post", post).then(function (result) {
        if (result.data) {
          // 해당 주소에 접속한 결과값이 true이면 /board로 이동
          location.href = "/board";
        } else {
          // 만약 false라면 오류입니다 라는 문구를 띄워줌.
          alert("오류입니다.");
        }
      });
    },
  };
  
  main.init();