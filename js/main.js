// ============================================================================
// 
// main.js
// 
// ============================================================================

// - global -------------------------------------------------------------------
var screenCanvas, info;
var actorManager;
var run = true;
var fps = 1000 / 30;
var mouse = new Vector2(0,0);
var ctx; // canvas2d コンテキスト格納用
var gameOverImage;//ゲームオーバー文字
//現在のステージ
var stageID;
//初期化
var Initialize = function () {
    // canvasの取得
    screenCanvas = document.getElementById('screen');
    // canvasの横幅の設定
    screenCanvas.width = 800;
    // canvasの縦幅の設定
    screenCanvas.height = 600;

    // マウスの座標取得をイベントとして登録
    screenCanvas.addEventListener('mousemove', mouseMove, true);
    // キー入力の取得をイベントとして登録
    window.addEventListener('keydown', keyDown, true);

    // infoの取得
    info = document.getElementById('info');

    // canvas2dコンテキストを取得
    ctx = screenCanvas.getContext('2d');
    //ステージを元に画像を変更する
    //?以降の文字を取得する
    var data = location.search.substring(1, location.search.length);
    //エスケープされた文字をアンエスケープする
    data = unescape(data);
    //受け渡し用にstring型にする
    data = String(data);
    //string型を受け取り、,で分割する
    var arr = "";
    arr += data;
    arr = arr.split(",");

    //数値に変換して取得
    var s = parseInt(arr[0], 10);
    var bgSrc ="res/", blSrc="res/";
    switch (s)
    {
        case 1:
            bgSrc += "background-cave.jpg";
            blSrc += "dia/dia.png";
            stageID = 1;
            break;
        case 2:
            bgSrc += "background-dia.jpg";
            blSrc += "diamond/diamond.png";
            stageID = 2;
            break;
        case 3:
            bgSrc += "background-hielo.jpg";
            blSrc += "hielo/iconhielo.png";
            stageID = 3;
            break;
        default:
            bgSrc += "Background.png";
            blSrc += "food.png";
            break;
    }
    
    this.stage = new Stage(ctx, 10, 10, bgSrc, blSrc, new Vector2(800, 600));
}

var Update = function () {
    this.stage.Update();
    //enemy.Update();
    // HTMLの更新
    info.innerHTML = mouse.x + ' : ' + mouse.y;
}

var Draw = function () {

    // screenをクリア 
    ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
    this.stage.Draw();
}

// - main ---------------------------------------------------------------------
window.onload = function(){
    Initialize();

	// メインループ
    (function () {

        Update();
        if (!run) {
            ctx.drawImage(gameOverImage, screenCanvas.width / 2 - 200, screenCanvas.height);
        }
        Draw();
		// 再帰呼び出しによりループを実現
		// argument.callee => 自身の関数を参照できる
        if (run) { setTimeout(arguments.callee, fps); }
	})();
};

// - event --------------------------------------------------------------------
function mouseMove(event){
	// canvas内のマウスの座標を代入
	mouse.x = event.clientX - screenCanvas.offsetLeft;
	mouse.y = event.clientY - screenCanvas.offsetTop;
}

function keyDown(event){
	// Escを押すことでループを停止
    if (event.keyCode == 27) { run = false; }
}


