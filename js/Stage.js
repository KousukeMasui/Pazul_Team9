//・ｽO・ｽ・ｽ・ｽ[・ｽo・ｽ・ｽ・ｽ・ｽ・ｽ`
var player;
//Class・ｽ・ｽ・ｽ`
var Stage = function (ctx, x, y, backImageSrc,blockImageSrc,screenSize) {
    this.ctx = ctx;
    //・ｽw・ｽi・ｽ鞫・
    this.bgImg = new Image();
    this.bgImg.src = backImageSrc;
    //・ｽX・ｽN・ｽ・ｽ・ｽ[・ｽ・ｽ・ｽT・ｽC・ｽY
    this.screenSize = screenSize;
    this.stageSize = new Vector2(x, y);
    this.Initialize(x, y);
    //・ｽu・ｽ・ｽ・ｽb・ｽN・ｽﾌ画像
    this.blockImageSrc = blockImageSrc;
    //・ｽv・ｽ・ｽ・ｽC・ｽ・ｽ・ｽ[・ｽﾌ撰ｿｽ・ｽ・ｽ
    player = new Player(this);
    // ・ｽL・ｽ[・ｽ・ｽ・ｽﾍの取得・ｽ・ｽ・ｽC・ｽx・ｽ・ｽ・ｽg・ｽﾆゑｿｽ・ｽﾄ登・ｽ^
    document.addEventListener('keydown', KeyDown, true);
    //csv・ｽ・ｽ・ｽﾇみ搾ｿｽ・ｽ・ｽ ・ｽﾇみ搾ｿｽ・ｽﾝゑｿｽ・ｽI・ｽ・ｽ・ｽ・ｽ・ｽﾜで待機
    g_isPouse = true;
    this.csv = new CSV_Data(" ");
    this.createBlocks = new Array();
    new CSVReader("./src/tetrimino_patarn.csv", function (csv) {
        this.stage.csv = csv;
        this.stage.BlockSave();
        this.stage.CreateBlock();//ブロック生成
        g_isPouse = false;//ポーズ解除
    }, this.csv);

    //タイマ
    this.timer = 0;

    //this.CreateBlock();
}

Stage.prototype.BlockSave = function () {
    //this.csv.data.length;
    this.createBlocks = new Array();
    for (var i = 0; i < this.csv.row; i++) {
        this.createBlocks.push(new Array(7));
        for (var j = 0; j < 7; j++)
            this.createBlocks[i][j] = new Array(7);
    }
    var cnt = 0;
    for (var row = 0; row < this.csv.row - 1; row++)
    {
        if ((row+1) % 8 == 0) cnt++;
        for (var col = 0; col < this.csv.col; col++) {
            this.createBlocks[cnt][row%7][col] = this.csv.data[row][col];
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
    //・ｽ・ｽ・ｽ・ｽ・ｽu・ｽ・ｽ・ｽb・ｽN
    this.fallBlockArray = new Array();
    //・ｽ・ｽ・ｽ~・ｽu・ｽ・ｽ・ｽb・ｽN
    this.blockArray = new Array();
    this.blockScale = new Vector2(this.screenSize.x / x, this.screenSize.y / y);
    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            if(this.stageArray[i][j] ==1) this.blockArray.push(new Block(this.ctx, new Vector2(i, j), this.blockScale, "res/food.png", this));
        }
    }
}

//・ｽu・ｽ・ｽ・ｽb・ｽN・ｽﾇ会ｿｽ・ｽﾖ撰ｿｽ ・ｽﾊ置・ｽﾍ配・ｽ・ｽ・ｽﾌ位置
Stage.prototype.AddBlock = function(position,isCenter)
{
    //・ｽ・ｽ・ｽ・ｽ・ｽu・ｽ・ｽ・ｽb・ｽN・ｽﾉ登・ｽ^
    this.fallBlockArray.push( new Block(this.ctx,
        position, this.blockScale, this.blockImageSrc, this, isCenter));

}

Stage.prototype.CreateBlock = function () {
    //ランダム生成 0~2
    var rand = Math.floor(Math.random() * 3);
    var up = 10;//一番上のブロックの位置
    for (var x = 0; x < 7; x++)
    {
        for(var y=0;y<7;y++)
        {
            if(this.createBlocks[rand][x][y] == 1)
            {
                if (up >= y) up = y;
                this.AddBlock(new Vector2(x, y), (x == 3 && y == 3));
            }
        }
    }
    //横幅 /2
    var centerPos = this.stageSize.x / 2 - 3;

    for (var i = 0; i < this.fallBlockArray.length; i++)
    {
        if (!this.IsToBlock(new Vector2(this.fallBlockArray[i].arrayPos.x + centerPos, this.fallBlockArray[i].arrayPos.y - up)))
        {
            run = false;
            this.MoveBlocks(this.fallBlockArray, new Vector2(centerPos, -up));
            /*ここにゲームオーバーシーン開始を入れる*/
            //ゲームオーバー文字を追加
            gameOverImage = new Image("res/GameOver_Logo.png");
            //シーンチェンジ
            location.href = "./result.html?" + escape(this.timer);
            return;
        }
    }
    this.MoveBlocks(this.fallBlockArray, new Vector2(centerPos, -up));
    //this.MoveBlocks(this.fallBlockArray, new Vector2(0, -up));

    //this.AddBlock(new Vector2(3, 3), true);
    //for (var i = 0; i < 3;i++)
    //    this.AddBlock(new Vector2(3+i, 4), true);

    //if (this.IsGameOver())
    //{
    //    run = false;
    //    /*ここにゲームオーバーシーン開始を入れる*/
    //    //ゲームオーバー文字を追加
    //    gameOverImage = new Image("res/GameOver_Logo.png");
    //    //シーンチェンジ
    //    location.href = "./result.html?" + escape(this.timer);
    //}

    player.SetBlock(this.fallBlockArray);
}

Stage.prototype.Update = function ()
{
    this.timer++;
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
//・ｽQ・ｽ[・ｽ・ｽ・ｽI・ｽ[・ｽo・ｽ[・ｽ・ｽ・ｽ・ｽ
Stage.prototype.IsGameOver = function () {
    for(var i=0;i<this.fallBlockArray.length;i++)
    {
        //・ｽ・ｽ・ｽ・ｽ・ｽﾊ置・ｽﾉ奇ｿｽ・ｽﾉブ・ｽ・ｽ・ｽb・ｽN・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ鼾・
        if(this.stageArray[this.fallBlockArray[i].arrayPos.x][this.fallBlockArray[i].arrayPos.y] == 1)
        {
            return true;
        }
    }
    for (var i = 0; i < this.fallBlockArray.length; i++)
    {
        //・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽu・ｽ・ｽ・ｽb・ｽN・ｽﾆゑｿｽ・ｽﾄ登・ｽ^
        this.stageArray[this.fallBlockArray[i].arrayPos.x][this.fallBlockArray[i].arrayPos.y] = 2;
    }

    return false;

}
//・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽﾌス・ｽN・ｽ・ｽ・ｽv・ｽg
Stage.prototype.FallFunc = function () {
    var isFall = false;
    for (var x = 0; x < this.stageSize.x; x++)
    {
        for (var y = 0; y < this.stageSize.y; y++)
        {
            if (this.stageArray[x][y] == 2 && !this.IsFall(new Vector2(x, y)))//・ｽ・ｽ・ｽ・ｽ・ｽu・ｽ・ｽ・ｽb・ｽN・ｽﾌ場合
            {
                this.stageArray[x][y] = 1;
                //・ｽ・ｽ・ｽ~・ｽu・ｽ・ｽ・ｽb・ｽN・ｽﾉ登・ｽ^
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
        //・ｽ・ｽ・ｽ・ｽ・ｽu・ｽ・ｽ・ｽb・ｽN・ｽN・ｽ・ｽ・ｽA
        this.fallBlockArray.length = 0;
        //・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ
        this.Delete();
        //・ｽ・ｽ・ｽ・ｽ・ｽu・ｽ・ｽ・ｽb・ｽN・ｽ・ｽ・ｽﾈゑｿｽ・ｽﾈゑｿｽ・ｽ・ｽ・ｽ逅ｶ・ｽ・ｽ
        if(this.fallBlockArray.length <=0) this.CreateBlock();
    }
}

Stage.prototype.IsFall = function (position)
{
    //・ｽX・ｽe・ｽ[・ｽW・ｽﾌ会ｿｽ・ｽ[・ｽﾌ場合 ・ｽ・ｽ・ｽ・ｽ・ｽﾅゑｿｽ・ｽﾈゑｿｽ
    if (position.y + 1 >= this.stageSize.y) return false;
    //・ｽ・ｽ・ｽ~・ｽu・ｽ・ｽ・ｽb・ｽN・ｽ・ｽ・ｽ・ｽ・ｽﾉゑｿｽ・ｽ・ｽ・ｽ鼾㌶alse
    return this.stageArray[position.x][position.y + 1] !=1;

}
//・ｽu・ｽ・ｽ・ｽb・ｽN・ｽ・ｽ・ｽﾚ難ｿｽ・ｽﾅゑｿｽ・ｽ驍ｩ・ｽ・ｽ・ｽ・ｽ
Stage.prototype.IsToBlock = function (position)
{
    //X・ｽ・ｽ・ｽ@・ｽO・ｽﾉ出・ｽ・ｽ・ｽ・ｽ
    if (position.x < 0 || position.x >= this.stageSize.x)
        return false;
    //Y・ｽ・ｽ
    if (position.y < 0 || position.y >= this.stageSize.y) return false;

    //・ｽu・ｽ・ｽ・ｽb・ｽN・ｽ・ｽ・ｽ・ｽ・ｽ驍ｩ・ｽ・ｽ・ｽ・ｽ
    return this.stageArray[position.x][position.y] != 1;
}
//・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽﾅゑｿｽ・ｽ・ｽ・ｽ・ｽ・ｽu・ｽ・ｽ・ｽb・ｽN・ｽ・ｽ・ｽ・ｽ
Stage.prototype.Delete = function () {
    var deleteIndices = new Array();
    var deleteRows = new Array();//・ｽ尞懶ｿｽs
    //・ｽ尞懶ｿｽ・ｽ・ｽ・ｽ
    for (var y = 0; y < this.stageSize.y; y++) {
        var isDelete = true;
        for (var x = 0; x < this.stageSize.x; x++) {
            //・ｽP・ｽﾂでゑｿｽ1(・ｽ・ｽ・ｽ~・ｽu・ｽ・ｽ・ｽb・ｽN)・ｽﾅなゑｿｽ・ｽ鼾・ｿｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽﾈゑｿｽ
            if (this.stageArray[x][y] != 1) {
                isDelete = false;
                break;
            }
        }
        //・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ鼾・
        if (isDelete) {
            deleteRows.push(y);
            //・ｽz・ｽ・ｽ・ｽX・ｽV
            for (var x = 0; x < this.stageSize.x; x++) {
                this.stageArray[x][y] = 0;
            }
            //・ｽ尞懶ｿｽﾔ搾ｿｽ・ｽi・ｽ[
            for (var i = 0; i < this.blockArray.length; i++) {
                if (this.blockArray[i].arrayPos.y == y)
                    deleteIndices.push(i);
            }
        }

    }

    //・ｽ・ｽ・ｽs・ｽ・ｽ・ｽ尞懶ｿｽ・ｽ・ｽﾈゑｿｽ・ｽ鼾・ｿｽI・ｽ・ｽ
    if (deleteRows.length <= 0) return;
    //・ｽ・ｽ・ｽﾔ会ｿｽ・ｽﾌ行・ｽﾔ搾ｿｽ・ｽ・ｽ・ｽ謫ｾ
    var underDeleteRow = deleteRows[deleteRows.length - 1];

    for (var i = 0; i < this.blockArray.length; i++) {
        //・ｽ尞懶ｿｽ\・ｽ・ｽ・ｽﾌブ・ｽ・ｽ・ｽb・ｽN・ｽ・ｽ・ｽ・ｽ・ｽO
        var isFind = true;
        for (var j = 0; j < deleteRows.length; j++) {
            if (deleteRows[j] == this.blockArray[i].arrayPos.y) {
                isFind = false;
                break;
            }
        }
        if (!isFind) continue

        //・ｽ尞懶ｿｽs・ｽﾌ茨ｿｽ・ｽﾔ会ｿｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽﾌ場合
        if (this.blockArray[i].arrayPos.y < underDeleteRow) {
            //・ｽ・ｽ・ｽ・ｽ・ｽu・ｽ・ｽ・ｽb・ｽN・ｽﾉ追会ｿｽ
            this.fallBlockArray.push(this.blockArray[i]);
            //・ｽ・ｽ・ｽ~・ｽu・ｽ・ｽ・ｽb・ｽN・ｽ尞懶ｿｽz・ｽ・ｽ・ｽﾉ追会ｿｽ
            deleteIndices.push(i);
            //・ｽX・ｽe・ｽ[・ｽW・ｽz・ｽ・ｽ・ｽﾉ費ｿｽ・ｽf
            this.stageArray[this.blockArray[i].arrayPos.x][this.blockArray[i].arrayPos.y] = 2;
        }
    }
    //・ｽ尞・
    //・ｽd・ｽ・ｽ・ｽ尞・
    deleteIndices = deleteIndices.filter(function (v, i, s) {
    return s.indexOf(v) === i;
});
    //・ｽz・ｽ・ｽ・ｽﾔ搾ｿｽ・ｽ・ｽ・ｽt・ｽ・ｽ・ｽﾉゑｿｽ・ｽﾈゑｿｽ・ｽﾆゑｿｽ・ｽ・ｽ・ｽﾈゑｿｽ・ｽﾌで降・ｽ・ｽ・ｽ\・ｽ[・ｽg
    deleteIndices.sort(function (a, b) { return -(a - b); });
    //・ｽz・ｽｩゑｿｽ・ｽ尞・
    for (var i = 0; i < deleteIndices.length; i++)
    {
        this.blockArray.splice(deleteIndices[i], 1);
    }
}

Stage.prototype.Draw = function () {
    //・ｽw・ｽi・ｽﾌ描・ｽ・ｽ
    this.ctx.drawImage(this.bgImg, 0, 0);

    //・ｽu・ｽ・ｽ・ｽb・ｽN・ｽﾌ表・ｽ・ｽ
    for (var i = 0; i < this.fallBlockArray.length; i++)
        this.fallBlockArray[i].Draw();
    for (var i = 0; i < this.blockArray.length; i++)
        this.blockArray[i].Draw();
    for (var x = 0; x < this.stageSize.x; x++)
    {
        for(var y=0;y<this.stageSize.y;y++)
        {
            drawText(this.ctx, "#000000", this.blockScale.x, "MS P・ｽS・ｽV・ｽb・ｽN", x * this.blockScale.x, (y + 1) * this.blockScale.y, this.stageArray[x][y]);
        }
    }
}
Stage.prototype.MoveBlocks = function(blockArray,moveVec)
{
    var nextPos = new Array();
    //・ｽﾊ置・ｽﾌ擾ｿｽ・ｽ・ｽ・ｽ・ｽ
    for (var i = 0; i < blockArray.length; i++) {
        this.stageArray[blockArray[i].arrayPos.x][blockArray[i].arrayPos.y] = 0;
        //・ｽﾚ難ｿｽ・ｽ・ｽ・ｽﾌ位置・ｽ・ｽ・ｽv・ｽZ
        var next = new Vector2(blockArray[i].arrayPos.x + moveVec.x, blockArray[i].arrayPos.y + moveVec.y);
        blockArray[i].SetPos(next);
        nextPos.push(next);
    }
    for (var i = 0; i < nextPos.length; i++)
        this.stageArray[nextPos[i].x][nextPos[i].y] = 2;

}
var KeyDown = function (event) {
    //A・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ・ｽ黷ｽ・ｽ・ｽ
    if (event.key == "a") {
        //・ｽ・ｽ・ｽﾉ移難ｿｽ
        player.Move(-1);
    }
    else if (event.key == "d") {
        //・ｽE・ｽﾉ移難ｿｽ
        player.Move(1);
    }
    else if (event.key == "Enter") {
        //・ｽ・ｽ・ｽ]
        player.Rotate();
    }
}
var drawText = function (ctx, color, size, font, x, y, text) {
    ctx.fillStyle = color;
    ctx.font = size + "px '" + font + "'";
    ctx.fillText(text, x, y);
}
