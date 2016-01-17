window.onload = function() {
  var moveLeft;
  var moveRight;

  window.addEventListener('keydown', KeyDown, true); //キーを押した時、呼び出される関数を指定
  window.addEventListener('keyup', KeyUp, true); //キーを離した時、呼び出される関数を指定

  // Canvas未サポートは実行しない
  if (!window.HTMLCanvasElement) return;
  var canvas = document.querySelector('#canvas-container');
  var ctx = canvas.getContext('2d');


  function drawCircle(x, y, scale, color) {
      ctx.beginPath();
      ctx.arc(x, y, scale, 0, 2*Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
  }
  function drawRect(x, y, width, height, color) {
      ctx.beginPath();
      ctx.rect(x, y, width, height);
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

  //----------------------------------------ボールの変数
  var speedX = 4;    //移動速度
  var speedY = 3;    //移動速度
  var x = 50;      //X軸の位置
  var y = 50;      //y軸の位置

  //----------------------------------------実機の変数
  var rectSpeedX = 6;    //移動速度
  var rectSpeedY = 1.3;    //移動速度
  var rectX = 0;      //X軸の位置
  var rectY = 400;      //y軸の位置

  // ループ処理
  function loop() {
    requestAnimFrame(loop);
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
    // ループ毎にxを加算
    x += speedX;
    y += speedY;
    // 円を描画
    drawCircle(x, y, 10, '#D0A869');
    if(x < 5 || x > 395){
      speedX = -speedX;
    }
    if(y > 495){
      speedX = 0;    //移動速度
      speedY = 0;    //移動速度

    }
    if(y < 5 ){
      speedY = -speedY;
    }

    if(y < 400 && y > 395){
      if(x > rectX && x < (rectX + 100)){
        speedY = -speedY;
      }
    }

    if(moveLeft){
      rectX -= rectSpeedX;
    }
    if(moveRight){
      rectX += rectSpeedX;
    }
    if(rectX < 0){
      rectX = 0;
    } else if(rectX > 300) {
      rectX = 300;
    }
    drawRect(rectX,rectY,100,10,"#2f6");
  }

  function KeyDown(e) {
  	switch (e.keyCode) {
  	case 37: // ←キー
  		moveLeft = true;
  		break;
  	case 39: // →キー
  		moveRight = true;
  		break;
  	}
  }
  function KeyUp(e) {
  	switch (e.keyCode) {
  	case 37: // ←キー
  		moveLeft = false;
  		break;
  	case 39: // →キー
  		moveRight = false;
  		break;
  	}
  }
};
