window.onload = function() {
    // Canvas未サポートは実行しない
    if (!window.HTMLCanvasElement) return;
    var canvas = document.querySelector('#canvas-container');
    var ctx = canvas.getContext('2d');

    // 円の描画
    ctx.beginPath();
    ctx.arc(100, 100, 20, 0, 2*Math.PI, false);
    ctx.fillStyle = '#D0A869';
    ctx.fill();


    function drawCircle(x, y, scale, color) {
        ctx.beginPath();
        ctx.arc(x, y, scale, 0, 2*Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    }

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame   ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback){
              window.setTimeout(callback, 1000 / 60);
          };
    })();

    loop();



  var speed = 2;    //移動速度
  var speedX = 2;    //移動速度
  var speedY = 1.3;    //移動速度
  var x = 0;      //X軸の位置
  var y = 0;      //X軸の位置

  // ループ処理
  function loop() {
    requestAnimFrame(loop);
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
    // ループ毎にxを加算
    x += speedX;
    y += speedY;
    // 円を描画
    drawCircle(x, y, 20, '#D0A869');
    if(x < 0 || x > 600){
      speedX = -speedX;
    }
    if(y < 0 || y > 300){
      speedY = -speedY;
    }
  }
};
