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
Stage.prototype.AddBlock = function(position)
{
    //落下中ブロックとして登録
    this.stageArray[position.x][position.y] = 2;
    //落下ブロックに登録
    this.fallBlockArray.push( new Block(this.ctx,
        position, this.blockScale, "res/food.png", this));

}

Stage.prototype.CreateBlock = function () {
    //落下ブロッククリア
    this.fallBlockArray.length = 0;
    //ブロックの生成
    this.AddBlock(new Vector2(5, 4));
    this.AddBlock(new Vector2(3, 4));
    this.AddBlock(new Vector2(3, 3));
    this.AddBlock(new Vector2(4, 4));
    player.SetBlock(this.fallBlockArray);
}

Stage.prototype.Update = function ()
{
    this.FallFunc();
    var isFall = this.fallBlockArray[0].IsFall();
    for(var i=0;i<this.fallBlockArray.length;i++)
    {
        //落下更新処理
        this.fallBlockArray[i].Update();
        if (isFall) {
            var pos = this.fallBlockArray[i].Fall();
            this.stageArray[pos.x][pos.y] = 0;//現在のマスを空に
            this.stageArray[pos.x][pos.y + 1] = 2;//新しいマスを更新
        }
    }
    if (isFall)  player.Fall();
}

//落下時のスクリプト
Stage.prototype.FallFunc = function () {
    var isFall = false;
    for (var x = 0; x < this.stageArray.length; x++)
    {
        for (var y = 0; y < this.stageArray[0].length; y++)
        {
            if (this.stageArray[x][y] == 2 && !this.IsFall(new Vector2(x, y)))//落下ブロックの場合
            {
                //停止ブロックに登録
                this.blockArray = this.blockArray.concat(this.fallBlockArray);
                //消去処理
                this.Delete();
                //新しく落下生成
                this.CreateBlock();
                isFall = true;
                break;
            }
        }
        if (isFall) break;
    }

    if(isFall)
    {
        for(var x = 0;x < this.stageSize.x;x++)
        {
            for (var y = 0; y < this.stageSize.y; y++)
                if (this.stageArray[x][y] == 2) this.stageArray[x][y] = 1;
        }
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

}

Stage.prototype.Draw = function () {
    //背景の描画
    this.ctx.drawImage(this.bgImg, 0, 0);

    //ブロックの表示
    for (var i = 0; i < this.fallBlockArray.length; i++)
        this.fallBlockArray[i].Draw();
    for (var i = 0; i < this.blockArray.length; i++)
        this.blockArray[i].Draw();
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
