

window.onload = function() {
    // Canvas未サポートは実行しない
    if (!window.HTMLCanvasElement) return;
    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');

    //初期設定部分。ここで使用する変数や関数、イベントなどを定義しておく。
    var count = 0;
    var isGameStarted = false; //bool値
    var gameClearDisplayTime = 0; //bool値
    var moveLeft; //bool値
    var moveRight; //bool値
    // var _isRunning;
    var _animationID;
    //----------------------------------------ボールの変数
    var speedX; //移動速度x成分
    var speedY; //移動速度y成分
    var speed = 6; //移動速度

    var BallX; //X軸の位置
    var BallY; //y軸の位置

    //----------------------------------------自機の変数
    var rectSpeedX; //移動速度
    var rectSpeedY; //移動速度
    var rectX; //X軸の位置
    var rectY; //y軸の位置
    var rectWidth = 100; //
    var rectHeight = 10; //
    //ブロック
    var blocksMarginTop = 60;

    var countTime;
    var bestTime;

    var itemsAry = [];

    var logoImg = new Image();
    var logoImgWidth = 25;
    var logoImgHeight = 25;
    logoImg.src = "./images/gsacLogoBlue50x50.png";

    var bgImg = new Image();
    var bgImgWidth = 510;
    var bgImgHeight = 510;
    bgImg.src = "./images/gsacademylogo.jpg";


    var itemTime = 0;

    //----------------------sound
    var select06 =      document.querySelector('#select06');
    var button04a =     document.querySelector('#button04a');
    var destruction1 =  document.querySelector('#destruction1');
    var button05 =      document.querySelector('#button05');
    var bgm =           document.querySelector('#bgm');
    var fanfare =       document.querySelector('#fanfare');
    var itemGet =       document.querySelector('#itemGet');
    var powpowpow =     document.querySelector('#powpowpow');

    //ブロックを配置
    var blockAry = [
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1]
    ];
    var blockPosition = 40;
    var blockHeight = 20;
    var blockWidth = ctx.canvas.width / blockAry[0].length;

    //ブロックの色を格納する配列
    var r = [];
    var g = [];
    var b = [];
    function initblocksColor(){
        for(var i = 0; i < blockAry.length; i++){
            r[i] = [];
            g[i] = [];
            b[i] = [];
            for(var j = 0; j < blockAry[i].length; j++){
                r[i][j] = Math.floor( Math.random() * 255 );
                g[i][j] = Math.floor( Math.random() * 255 );
                b[i][j] = Math.floor( Math.random() * 255 );
            }
        }
    }
    initblocksColor();

    function Item(x, y, speed) {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
        this.setPosition(x, y, speed);
    }
    Item.prototype.setPosition = function (x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = true;
    }
    Item.prototype.move = function (){
        this.y += this.speed;
    }


    if(localStorage.getItem('bestTime')){
        bestTime = localStorage.getItem('bestTime');
    } else {
        bestTime = 0;
    }

    moveLeft = false;
    moveRight = false;
    // _isRunning = false;
    //----------------------------------------ボールの変数
    // speedX = 4; //移動速度
    speedY = -4.0; //移動速度
    speedX = Math.sqrt(Math.pow(speed,2) - Math.pow(speedY,2));

    //----------------------------------------実機の変数
    rectSpeedX = 8; //移動速度
    rectSpeedY = 1.3; //移動速度
    rectX = ctx.canvas.width/2 - rectWidth/2; //X軸の位置
    rectY = ctx.canvas.height - 60; //y軸の位置

    //----------------------------------------イベントの設定
    window.addEventListener('keydown', KeyDown, true); //キーを押した時、呼び出される関数を指定
    window.addEventListener('keyup', KeyUp, true); //キーを離した時、呼び出される関数を指定
    document.querySelector('canvas').addEventListener('click', gameStartFunc, true); //canvasをclickすると、loop関数がスタートする
    // fanfare.play();
    function KeyDown(e) {
        switch (e.keyCode) {
            case 37: // ←キー
                moveLeft = true;
                break;
            case 39: // →キー
                moveRight = true;
                break;
            case 65: // Aキー
        		moveLeft = true;
        		break;
        	case 68: // Dキー
        		moveRight = true;
        		break;
        	case 13: // enterキー
                gameStartFunc();
                break;
        	case 32: // spaceキー
                gameStartFunc();
        		break;
            default:
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
            case 65: // Aキー
        			moveLeft = false;
        		break;
        	case 68: // Dキー
        			moveRight = false;
        		break;
            default:
                break;
        }
    }

    /* フォントスタイルを定義 */
    ctx.font = "40px 'ＭＳ Ｐゴシック'";
    ctx.textAlign = "center";
    ctx.fillStyle = "#0066bb";
    ctx.fillText("click!", canvas.width / 2, 250);

    //ブロックを描画する関数
    function blockDrow(){
        for(var i = 0; i < blockAry.length; i++){
            for(var j = 0; j < blockAry[i].length; j++){
                if(blockAry[i][j]){
                    ctx.beginPath();
                    ctx.rect(blockWidth * j, blockHeight * i + blocksMarginTop, blockWidth, blockHeight);
                    ctx.fillStyle = 'rgb(' + r[i][j] + ', ' + g[i][j] + ', ' + b[i][j] + ')';//色をランダムに設定
                    ctx.fill();
                }
            }
        }
    }

    //ブロックとの当たり判定関数
    function blockHitJudgement(){
        var countBlock = 0;//現在のブロック個数をカウントする変数
        for(var i = 0; i < blockAry.length; i++){
            for(var j = 0; j < blockAry[i].length; j++){
                if(blockAry[i][j]){
                    countBlock++;//現在のブロック個数をカウントアップ
                    var hit = false;//当たったかどうかのフラグ
                    //下辺との当たり判定
                    if( BallY - ( blockHeight * ( i + 1 ) + blocksMarginTop ) < logoImgHeight/2 &&
                    BallY - ( blockHeight * i + blocksMarginTop ) > logoImgHeight/2 &&
                     speedY < 0){
                        if( blockWidth * j < BallX && BallX < blockWidth * ( j + 1 ) ){
                            speedY = -speedY;
                            hit = true;
                        }
                    }
                    //上辺との当たり判定
                    if( ((blockHeight * i) + blocksMarginTop) - BallY  < logoImgHeight/2 &&
                    (blockHeight * ( i + 1 ) + blocksMarginTop) - BallY > logoImgHeight/2 &&
                     0 < speedY ){
                        if( blockWidth * j < BallX && BallX < blockWidth * ( j + 1 )){
                            speedY = -speedY;
                            hit = true;
                        }
                    }
                    //左辺との当たり判定
                    if( (blockHeight * i) + blocksMarginTop < BallY && BallY < blockHeight * i + blockHeight + blocksMarginTop ){
                        if((blockWidth * j) - BallX < logoImgWidth/2 &&
                        blockWidth * (j+1) - BallX > logoImgWidth/2 &&
                         speedX > 0 ){
                            speedX = -speedX;
                            hit = true;
                        }
                    }
                    // //右辺との当たり判定
                    if( (blockHeight * i) + blocksMarginTop < BallY && BallY < blockHeight * (i+1) + blocksMarginTop ){
                        if( BallX - blockWidth * (j + 1) < logoImgWidth/2 &&
                        BallX - blockWidth * j > logoImgWidth/2 &&
                         speedX < 0 ){
                            speedX = -speedX;
                            hit = true;
                        }
                    }
                    if( hit ) {//もし当たってたら音を鳴らす
                        if( blockAry[i][j] === 2 ){//2が入ってたらitemを降らせる
                            var width = blockWidth * j + blockWidth/2;
                            var height = blockHeight * i + blockHeight/2 + blocksMarginTop;
                            itemsAry.push(new Item(width, height, 1));
                        }
                        blockAry[i][j] = 0;
                        button05.pause();
                        button05.currentTime = 0;
                        button05.play();
                        hit = false;
                    }
                }
            }
        }
        if( !countBlock && isGameStarted ){//現在のブロックが0個の場合
            gameClearFunc();
        }
    }
    function gameClearFunc(){
        gameClearDisplayTime = 600;//10秒間game clearの文字を表示
        if(isGameStarted){
            isGameStarted = false;//ゲーム中のフラグを下す
            bgm.pause();//BGMを停止
            bgm.currentTime = 0;//BGM再生タイムを先頭へ
            fanfare.pause();
            fanfare.currentTime = 0;
            fanfare.play();
            if(countTime < bestTime){
                bestTime = countTime;
                localStorage.setItem('bestTime', bestTime);
            }
        }
    }

    //初期化関数
    function gameStartFunc() {
        if(!isGameStarted){
            isGameStarted = true;
            count = 0;
            moveLeft = false;
            moveRight = false;
            blockAry = [
                [2,2,1,1,2,1,1,2],
                [1,1,2,1,1,2,1,2],
                [2,1,2,1,1,2,2,1],
                [2,2,2,2,2,2,2,2]
            ];
            //test
            // blockAry = [
            //     [0,0,0,0,0,0,0,0],
            //     [0,0,0,0,0,0,0,0],
            //     [0,0,0,0,0,0,0,0],
            //     [0,0,0,0,2,0,0,0]
            // ];
            itemsAry = [];
            itemTime = 0;
            rectWidth = 100;
            rectHeight = 10;
            //----------------------------------------ボールの変数
            speedY = -(Math.random() * 2 + 3 ); //移動速度
            speedX = Math.sqrt(Math.pow(speed,2) - Math.pow(speedY,2));
            if(Math.random() > 0.5){
                speedX = -speedX;
            }
            //BGMスタート
            bgm.pause();
            bgm.currentTime = 0;
            bgm.play();
        }
    }

    function drawRect(x, y, width, height, color) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
    }

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
    function animationStop() {
        cancelAnimationFrame(_animationID);
    }

    function drawBgImg() {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);//canvasをクリア
      ctx.drawImage(bgImg, (ctx.canvas.width - bgImgWidth)/2, (ctx.canvas.height - bgImgHeight)/2, bgImgWidth, bgImgHeight);
    }

    // -----------------------------------------------------------ループ関数
    //この関数内でいろんな値をupdateさせて、アニメーションさせる
    function loop() {
        _animationID = requestAnimFrame(loop);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);//canvasをクリア
        drawBgImg();//背景
        blockDrow();//ブロックを描画

        //テキストを描画
        ctx.font = "20px 'ＭＳ Ｐゴシック'";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText("G's Academy ブロック崩し", canvas.width / 2, 20);
        ctx.font = "14px 'ＭＳ Ｐゴシック'";
        ctx.textAlign = "left";
        ctx.fillText('TIME : ' + (Math.floor(count/60)), 20, 40);
        ctx.font = "14px 'ＭＳ Ｐゴシック'";
        ctx.textAlign = "right";
        ctx.fillText('BESTTIME : ' + bestTime, canvas.width - 20, 40);
        ctx.font = "14px 'ＭＳ Ｐゴシック'";
        ctx.textAlign = "center";
        ctx.fillText("スマホを傾けて操作してね", canvas.width / 2, (canvas.height - 10));
        if(gameClearDisplayTime){
            //game clear!の文字を画面に表示
            ctx.font = "40px 'ＭＳ Ｐゴシック'";
            ctx.textAlign = "center";
            ctx.fillStyle = "#CC66bb";
            ctx.fillText("game clear!!", canvas.width / 2, 250);
            gameClearDisplayTime--;
        }


        if(isGameStarted && !gameClearDisplayTime){
            count++;
            // ループ毎にxを加算し、ボールを１コマ毎に移動させる

            BallX += speedX;
            BallY += speedY;

            if(itemTime){//アイテム効力中の場合
                itemTime--;
                if(itemTime === 1){
                    //元に戻す
                    rectWidth = 100;
                    rectHeight = 10;
                    rectX += 20;
                    powpowpow.pause();
                    powpowpow.currentTime = 0;
                    powpowpow.play();
                }
            }

            // 円を描画
            // 変数xの値を変化させる
            var hitWall = false;
            if (BallX < logoImgWidth/2 && speedX < 0) {
                speedX = -speedX;
                hitWall = true;
            }
            if (ctx.canvas.width - BallX < logoImgWidth/2 && speedX > 0) {
                speedX = -speedX;
                hitWall = true;
            }
            // 変数yの値を変化させる
            if (BallY < logoImgHeight/5) {
                speedY = -speedY;
                hitWall = true;
            }
            if(hitWall){
                button04a.pause();
                button04a.currentTime = 0;
                button04a.play();
            }

            //ボールが最下部に到達してしまった場合にゲームを終了させる
            if (BallY > ctx.canvas.height) {
                speedX = 0; //移動速度
                speedY = 0; //移動速度
                destruction1.pause();
                destruction1.currentTime = 0;
                destruction1.play();
                /* フォントスタイルを定義 */
                ctx.font = "40px 'ＭＳ Ｐゴシック'";
                ctx.fillStyle = "#0066bb";
                ctx.textAlign = "center";
                ctx.fillText("game over", canvas.width / 2, 250);
                bgm.pause();
                bgm.currentTime = 0;
                isGameStarted = false;
                itemsAry = [];
                itemTime = 0;
                rectWidth = 100;
                rectHeight = 10;
                rectX = ctx.canvas.width/2 - rectWidth/2; //X軸の位置
            }
            //----------------------------------------------------------item
            if(itemsAry.length) {
                for(var i = 0; i < itemsAry.length; i++){
                    if(itemsAry[i].alive){
                        itemsAry[i].move();
                        ctx.drawImage(logoImg, itemsAry[i].x - 25/2, itemsAry[i].y - 25/2, 25, 25);
                        //自機との当たり判定
                        if (rectY - (itemsAry[i].y + 25/2) < 0 &&
                            (rectY + rectHeight) - (itemsAry[i].y - 25/2) > 0 ) {
                            if (itemsAry[i].x + 25/2 > rectX && itemsAry[i].x - 25/2 < (rectX + rectWidth)) {
                                itemsAry[i].alive = false;
                                if(!itemTime){
                                    itemTime = 300;
                                    rectWidth += 40;
                                    rectX -= 20;
                                }else{
                                    itemTime = 300;
                                }
                                itemGet.pause();
                                itemGet.currentTime = 0;
                                itemGet.play();
                            }
                        }else if(itemsAry[i].y > ctx.canvas.height + 25/2){//画面外に出た場合、配列から削除する
                            itemsAry[i].alive = false;
                        }

                    }
                }
            }

            //自機との当たり判定
            var hit = false;
            if (rectY - (BallY + logoImgHeight/2 ) < 0 &&
                (rectY + rectHeight) - ( BallY - logoImgHeight/2 ) > 0 &&
                speedY > 0) {
                if (BallX >= rectX && BallX <= (rectX + rectWidth)) {
                    if(moveLeft){
                        speedX = speedX - 1;
                    } else if (moveRight) {
                        speedX = speedX + 1;
                    }
                    if(speedX >= 6){
                        speedX = 5.4;
                    }else if(speedX <= -6){
                        speedX = -5.4;
                    }
                    hit = true;
                } else if (BallX < rectX ){
                    if(BallX + logoImgWidth/2 > rectX ){
                        speedX = -5.4;
                        hit = true;
                    }
                } else if ( BallX > (rectX + rectWidth) ){
                    if(BallX - logoImgWidth/2 < (rectX + rectWidth)){
                        speedX = 5.4;
                        hit = true;
                    }
                }
                if(hit){//当たってたら
                    speedY = Math.sqrt(Math.pow(speed,2) - Math.pow(speedX,2));
                    speedY = -speedY;
                    select06.pause();
                    select06.currentTime = 0;
                    select06.play();
                }
            }
        } else {//ゲーム中でない時
            BallX = rectX + rectWidth/2;
            BallY = rectY - logoImgHeight/2;
            if(!gameClearDisplayTime){
                /* フォントスタイルを定義 */
                ctx.font = "40px 'ＭＳ Ｐゴシック'";
                ctx.textAlign = "center";
                ctx.fillStyle = "#0066bb";
                ctx.fillText("click or enter!", canvas.width / 2, 250);
            }
        }
        ctx.drawImage(logoImg, BallX - logoImgWidth / 2, BallY - logoImgHeight / 2, 25, 25);

        //自機の変数の値を変化させる
        if (moveLeft) {//もし左キーが押されていたら
            rectX -= rectSpeedX;
        }
        if (moveRight) {//もし右キーが押されていたら
            rectX += rectSpeedX;
        }
        if (rectX < 0) {
            rectX = 0;
        } else if ((rectX + rectWidth) - ctx.canvas.width  > 0) {
            rectX = ctx.canvas.width - rectWidth;
        }

        var color;
        if(itemTime){
            color = "#84f";
        }else{
            color = "#294";
        }
        drawRect(rectX, rectY, rectWidth, rectHeight, color);//自機を描画する

        blockHitJudgement();
        countTime = Math.floor(count / 60);
        document.getElementById("count").innerHTML = 'TIME : ' + countTime;
        document.getElementById("bestTime").innerHTML = 'BEST TIME : ' + bestTime;

    }
    loop();





    // deviceorientationイベントで、デバイスの回転を継続的に取得できます。
    window.ondeviceorientation = function(event) {
      // 回転軸
      var alpha = event.alpha;   // z-axis
      var beta = event.beta;     // x-axis
      var gamma = event.gamma;   // y-axis
      // var html = '回転：　<br>alpha(z-axis)=' + alpha + "<br> beta(x-axis)=" + beta + "<br> gumma(y-axis )=" + gamma + "<br> moveLeft=" + moveLeft;
      // info.innerHTML = html;
      // var gyroscope = document.querySelector('#gyroscope');

      if(gamma < -5) {
        // alert(gamma);
        moveLeft = true;
      }else if (gamma > 5){
        moveRight = true;
      } else {
        moveLeft = false;
        moveRight = false;
      }

      // gyroscope.innerHTML = html;

    };




};
