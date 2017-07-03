//グローバル定義
var player;
//Class定義
var Stage = function (ctx, x, y, backImageSrc,blockImageSrc,screenSize) {
    this.ctx = ctx;
    //背景画像
    this.bgImg = new Image();
    this.bgImg.src = backImageSrc;
    //スクリーンサイズ
    this.screenSize = screenSize;
    this.stageSize = new Vector2(x, y);
    this.Initialize(x, y);
    //ブロックの画像
    this.blockImageSrc = blockImageSrc;
    //プレイヤーの生成
    player = new Player(this);
    // キー入力の取得をイベントとして登録
    document.addEventListener('keydown', KeyDown, true);
    //csvを読み込む 読み込みが終わるまで待機
    g_isPouse = true;
    //this.csv = new CSV_Data(" ");
    //this.createBlocks = new Array();
    //new CSVReader("./src/tetrimino_patarn.csv", function (csv) {
    //    this.stage.csv = csv;
    //    this.stage.BlockSave();
    //    this.stage.CreateBlock();//ブロック生成
    //    g_isPouse = false;//ポーズ解除
    //    alert(this.stage.csv.data);
    //},this.csv);

    this.CreateBlock();
}

Stage.prototype.BlockSave = function () {
    //this.csv.data.length;
    this.createBlocks = new Array();
    for (var i = 0; i < this.csv.row; i++) {
        this.createBlocks.push(new Array(7));
        for (var j = 0; j < 7; j++)
            this.createBlocks[i][j] = new Array(7);
    }
    var cnt = 0;//this.createBlocks.length;
    alert(this.csv.row);
    for (var row = 0; row < this.csv.row - 1; row++)
    {
        if ((row+1) % 8 == 0) { alert("add"); cnt++; }
        //alert("row = " + row + " : " + this.csv.data[row]);
        for (var col = 0; col < this.csv.col; col++) {
            alert("row = " + row + ",col = " + col + " : " + this.csv.data[row][col]);
            this.createBlocks[cnt][row][col] = this.csv.data[row][col];
        }
    }

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
    //落下ブロックに登録
    this.fallBlockArray.push( new Block(this.ctx,
        position, this.blockScale, this.blockImageSrc, this, isCenter));
    
}

Stage.prototype.CreateBlock = function () {
    //ランダム生成 0~2
    //var rand = Math.floor(Math.random() * 3);
    
    //for (var x = 0; x < 7; x++)
    //{
    //    for(var y=0;y<7;y++)
    //    {
    //        if(this.createBlocks[rand][x][y] == 1)
    //        {
    //            this.AddBlock(new Vector2(x, y), (x == 3 && y == 3));
    //        }
    //    }
    //}

    this.AddBlock(new Vector2(3, 3), true);
    for (var i = 0; i < 3;i++)
        this.AddBlock(new Vector2(3+i, 4), true);

    if (this.IsGameOver())
    {
        run = false;
        /*ここにゲームオーバーシーン開始を入れる*/
    }

    player.SetBlock(this.fallBlockArray);
}

Stage.prototype.Update = function ()
{
    //alert(this.csv.Get(1, 0));
    this.FallFunc();
    if (this.fallBlockArray.length == 0) return;
    for (var i = 0; i < this.fallBlockArray.length; i++)
        this.fallBlockArray[i].Update();
    var isFall = this.fallBlockArray[0].IsFall();
    if (isFall) {
        for (var i = 1; i < this.fallBlockArray.length; i++) {
            this.fallBlockArray[i].IsFall();
        }
        this.MoveBlocks(this.fallBlockArray, new Vector2(0, 1));
        player.Fall();
    }
}
//ゲームオーバー判定
Stage.prototype.IsGameOver = function () {
    for(var i=0;i<this.fallBlockArray.length;i++)
    {
        //生成位置に既にブロックがある場合
        if(this.stageArray[this.fallBlockArray[i].arrayPos.x][this.fallBlockArray[i].arrayPos.y] == 1)
        {
            return true;
        }
    }
    for (var i = 0; i < this.fallBlockArray.length; i++)
    {
        //落下中ブロックとして登録
        this.stageArray[this.fallBlockArray[i].arrayPos.x][this.fallBlockArray[i].arrayPos.y] = 2;
    }

    return false;

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
                isFall = true;
                break;
            }
        }
        if (isFall) break;
    }

    if(isFall)
    {

        for (var x = 0; x < this.stageSize.x; x++) {
            for (var y = 0; y < this.stageSize.y; y++)
                if (this.stageArray[x][y] == 2) this.stageArray[x][y] = 1;
        }
        //落下ブロッククリア
        this.fallBlockArray.length = 0;
        //消去処理
        this.Delete();
        //落下ブロックがなくなったら生成
        if(this.fallBlockArray.length <=0) this.CreateBlock();
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
    var deleteIndices = new Array();
    var deleteRows = new Array();//削除行
    //削除判定
    for (var y = 0; y < this.stageSize.y; y++) {
        var isDelete = true;
        for (var x = 0; x < this.stageSize.x; x++) {
            //１つでも1(停止ブロック)でない場合消去しない
            if (this.stageArray[x][y] != 1) {
                isDelete = false;
                break;
            }
        }
        //消去する場合
        if (isDelete) {
            deleteRows.push(y);
            //配列更新
            for (var x = 0; x < this.stageSize.x; x++) {
                this.stageArray[x][y] = 0;
            }
            //削除番号格納
            for (var i = 0; i < this.blockArray.length; i++) {
                if (this.blockArray[i].arrayPos.y == y)
                    deleteIndices.push(i);
            }
        }

    }

    //一行も削除しない場合終了
    if (deleteRows.length <= 0) return;
    //一番下の行番号を取得
    var underDeleteRow = deleteRows[deleteRows.length - 1];

    for (var i = 0; i < this.blockArray.length; i++) {
        //削除予定のブロックを除外
        var isFind = true;
        for (var j = 0; j < deleteRows.length; j++) {
            if (deleteRows[j] == this.blockArray[i].arrayPos.y) {
                isFind = false;
                break;
            }
        }
        if (!isFind) continue

        //削除行の一番下より上の場合
        if (this.blockArray[i].arrayPos.y < underDeleteRow) {
            //落下ブロックに追加
            this.fallBlockArray.push(this.blockArray[i]);
            //停止ブロック削除配列に追加
            deleteIndices.push(i);
            //ステージ配列に反映
            this.stageArray[this.blockArray[i].arrayPos.x][this.blockArray[i].arrayPos.y] = 2;
        }
    }
    //削除
    //重複削除
    deleteIndices = deleteIndices.filter(function (v, i, s) {
    return s.indexOf(v) === i;
});
    //配列番号を逆順にしないといけないので降順ソート
    deleteIndices.sort(function (a, b) { return -(a - b); });
    //配列から削除
    for (var i = 0; i < deleteIndices.length; i++)
    {
        this.blockArray.splice(deleteIndices[i], 1);
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
        //移動後の位置を計算
        var next = new Vector2(blockArray[i].arrayPos.x + moveVec.x, blockArray[i].arrayPos.y + moveVec.y);
        blockArray[i].SetPos(next);
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