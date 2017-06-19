//グローバル定義
var player;
//Class定義
var Stage = function (ctx, x, y, backImageSrc,screenSize) {
    this.ctx = ctx;
    //背景画像
    this.bgImg = new Image();
    this.bgImg.src = backImageSrc;
    //スクリーンサイズ
    this.screenSize = screenSize;
    this.stageSize = new Vector2(x, y);
    this.Initialize(x, y);
    //プレイヤーの生成
    player = new Player(this);
    // キー入力の取得をイベントとして登録
    document.addEventListener('keydown', KeyDown, true);
}
Stage.prototype.Initialize = function (x, y) {

    this.stageArray = new Array(x);
    for(var i=0;i<x;i++)
    {
        this.stageArray[i] = new Array(y);
        for (var j = 0; j < y; j++)
            this.stageArray[i][j] = 0;
    }
    //落下ブロック
    this.fallBlockArray = new Array();
    //停止ブロック
    this.blockArray = new Array();
    this.blockScale = new Vector2(this.screenSize.x / x, this.screenSize.y / y);
    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            if(this.stageArray[i][j] ==1) this.blockArray.push(new Block(this.ctx, new Vector2(i, j), this.blockScale, "res/food.png", this));
        }
    }
}

//ブロック追加関数 位置は配列の位置
Stage.prototype.AddBlock = function(position,isCenter)
{
    //落下中ブロックとして登録
    this.stageArray[position.x][position.y] = 2;
    //落下ブロックに登録
    this.fallBlockArray.push( new Block(this.ctx,
        position, this.blockScale, "res/food.png", this, isCenter));

}

Stage.prototype.CreateBlock = function () {
    //落下ブロッククリア
    this.fallBlockArray.length = 0;
    //ブロックの生成
    this.AddBlock(new Vector2(6, 3),false);
    this.AddBlock(new Vector2(4, 3),true);
    this.AddBlock(new Vector2(4, 4),false);
    this.AddBlock(new Vector2(5, 3),false);
    player.SetBlock(this.fallBlockArray);
}

Stage.prototype.Update = function ()
{
    this.FallFunc();
    if (this.fallBlockArray[0].IsFall()) {
        for (var i = 1; i < this.fallBlockArray.length; i++)
            this.fallBlockArray[i].IsFall();
        this.MoveBlocks(this.fallBlockArray, new Vector2(0, 1));
        player.Fall();
    }
    for(var i=0;i<this.fallBlockArray.length;i++)
    {
        //落下更新処理
        this.fallBlockArray[i].Update();
    }
}

//落下時のスクリプト
Stage.prototype.FallFunc = function () {
    var isFall = false;
    for (var x = 0; x < this.stageSize.x; x++)
    {
        for (var y = 0; y < this.stageSize.y; y++)
        {
            if (this.stageArray[x][y] == 2 && !this.IsFall(new Vector2(x, y)))//落下ブロックの場合
            {
                this.stageArray[x][y] = 1;
                //停止ブロックに登録
                this.blockArray = this.blockArray.concat(this.fallBlockArray);
                //消去処理
                this.Delete();
                isFall = true;
                break;
            }
        }
    }

    if(isFall)
    {
        for (var x = 0; x < this.stageSize.x; x++) {
            for (var y = 0; y < this.stageSize.y; y++)
                if (this.stageArray[x][y] == 2) this.stageArray[x][y] = 1;
        }
        //新しく落下生成
        this.CreateBlock();
    }
}

Stage.prototype.IsFall = function (position)
{
    //ステージの下端の場合 落下できない
    if (position.y + 1 >= this.stageSize.y) return false;
    //停止ブロックが下にある場合false
    return this.stageArray[position.x][position.y + 1] !=1;

}
//ブロックが移動できるか判定
Stage.prototype.IsToBlock = function (position)
{
    //X軸　外に出たら
    if (position.x < 0 || position.x >= this.stageSize.x)
        return false;
    //Y軸
    if (position.y < 0 || position.y >= this.stageSize.y) return false;

    //ブロックがあるか判定
    return this.stageArray[position.x][position.y] != 1;
}
//一列並んでいたらブロック消去
Stage.prototype.Delete = function () {
    for (var y = 0; y < this.stageSize.y; y++) {
        var isDelete = false;
        for (var x = 0; x < this.stageSize.x; x++) {
            //１つでも1(停止ブロック)でない場合消去しない
            if (this.stageArray[x][y] != 1) {
                isDelete = false;
                break;
            }
        }

        if(isDelete)
        {
            for(var i=0;i<this.blockArray.length;i++)
            {
                //削除行にいるブロックを全て削除
                if(this.blockArray[i].arrayPos.y == y)
                {
                    this.blockArray.splice(i, 1);
                }
            }
            for (var x = 0; x < this.stageSize.x; x++) {
                this.stageArray[x][y] = 0;
            }
        }
    }

}

Stage.prototype.Draw = function () {
    //背景の描画
    this.ctx.drawImage(this.bgImg, 0, 0);

    //ブロックの表示
    for (var i = 0; i < this.fallBlockArray.length; i++)
        this.fallBlockArray[i].Draw();
    for (var i = 0; i < this.blockArray.length; i++)
        this.blockArray[i].Draw();

    for (var x = 0; x < this.stageSize.x; x++)
    {
        for(var y=0;y<this.stageSize.y;y++)
        {
            drawText(this.ctx, "#000000", this.blockScale.x, "MS Pゴシック", x * this.blockScale.x, (y + 1) * this.blockScale.y, this.stageArray[x][y]);
        }
    }
}
Stage.prototype.MoveBlocks = function(blockArray,moveVec)
{
    var nextPos = new Array();
    //位置の初期化
    for (var i = 0; i < blockArray.length; i++) {
        this.stageArray[blockArray[i].arrayPos.x][blockArray[i].arrayPos.y] = 0;
        var next = blockArray[i].Move(moveVec);
        nextPos.push(next);
    }

    for (var i = 0; i < nextPos.length; i++)
        this.stageArray[nextPos[i].x][nextPos[i].y] = 2;

}
var KeyDown = function (event) {
    //Aが押されたら
    if (event.key == "a") {
        //左に移動
        player.Move(-1);
    }
    else if (event.key == "d") {
        //右に移動
        player.Move(1);
    }
    else if (event.key == "Enter") {
        //回転
        player.Rotate();
    }
}
var drawText = function (ctx, color, size, font, x, y, text) {
    ctx.fillStyle = color;
    ctx.font = size + "px '" + font + "'";
    ctx.fillText(text, x, y);
}