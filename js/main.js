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

    this.stage = new Stage(ctx, 10, 10, "res/Background.png","res/food.png",  new Vector2(800, 600));
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
        
        Draw();
		// 再帰呼び出しによりループを実現
		// argument.callee => 自身の関数を参照できる
		if(run){setTimeout(arguments.callee, fps);}
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


