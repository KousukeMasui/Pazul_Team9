//プレイヤークラス
var Player = function (manager) {
    this.manager = manager;
    this.blockArray = new Array();
    this.rotateArray = new Array(7);
    for (var x = 0; x < 7; x++)
        this.rotateArray[x] = new Array(7);

    this.moveVelocity = new Vector2(0, 0);
}

Player.prototype.Fall = function () {
    this.moveVelocity.y++;
}

Player.prototype.RotateDataUpdate = function () {
    posArray = new Array();
    for (var i = 0; i < this.blockArray.length; i++)
        posArray.push(this.blockArray[i].arrayPos);
    //回転用配列 入っている=1
    this.rotateArray = new Array(7);
    for (var x = 0; x < 7; x++) {
        this.rotateArray[x] = new Array(7);
        for (var y = 0; y < 7; y++) {
            var result = 0;
            for (var i = 0; i < posArray.length; i++) {
                if (posArray[i].x == this.moveVelocity.x + x && posArray[i].y == this.moveVelocity.y + y) {
                    result = 1;
                    break;
                }
            }
            this.rotateArray[x][y] = result;
        }
    }
}

//落ちてくるブロックの設定
Player.prototype.SetBlock = function (blockArray) {
    this.moveVelocity = new Vector2(0, 0);
    this.blockArray = blockArray;

    var leftTop;
    for (var i = 0; i < this.blockArray.length; i++) {
        if (this.blockArray[i].isCenter) {
            leftTop = new Vector2(this.blockArray[i].arrayPos.x - 3, this.blockArray[i].arrayPos.y - 3);
        }
    }
    this.moveVelocity = leftTop;
    //回転配列の初期化
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
            this.rotateArray[x][y] = 0;
        }
    }

    //ブロックの位置を1にする
    for (var i = 0; i < this.blockArray.length; i++) {
        var pos = Sub(this.blockArray[i].arrayPos, leftTop);
        this.rotateArray[pos.x][pos.y] = 1;
    }
    //this.rotateSize.Draw();
}

Player.prototype.Move = function (x) {
    for (var i = 0; i < this.blockArray.length; i++) {
        //一つでも移動不可なら移動しない
        if (!this.manager.IsToBlock(new Vector2(this.blockArray[i].arrayPos.x + x, this.blockArray[i].arrayPos.y)))
            return;
    }
    this.manager.MoveBlocks(this.blockArray, new Vector2(x, 0));

    this.moveVelocity.x += x;
}
//配列の回転処理
Player.prototype.RotateArrayUpdate = function () {
    //入れ替わる配列を宣言
    var tempArray = new Array(7);
    for (var i = 0; i < 7; i++)
        tempArray[i] = new Array(7);

    //配列の回転処理
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
            tempArray[y][x] = this.rotateArray[6 - x][y];
        }
    }

    //位置を実際のゲームの位置に戻す
    var newPosArray = new Array();
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
            if (tempArray[y][x] == 1) {
                var gamePos = new Vector2(y + this.moveVelocity.x, x + this.moveVelocity.y);
                //新しい位置に既にブロックがあったら回転しない
                if (!this.manager.IsToBlock(gamePos))
                    return;
                newPosArray.push(gamePos);
            }
        }
    }
    //回転配列を更新
    this.rotateArray = tempArray;

    //現在の位置の配列を0にする
    for (var i = 0; i < this.blockArray.length; i++) {
        this.manager.stageArray[this.blockArray[i].arrayPos.x][this.blockArray[i].arrayPos.y] = 0;

    }
    //実際の回転処理
    for (var i = 0; i < this.blockArray.length; i++) {
        this.blockArray[i].SetPos(newPosArray[i]);
        this.manager.stageArray[newPosArray[i].x][newPosArray[i].y] = 2;
    }



}
//回転処理
Player.prototype.Rotate = function () {
    this.RotateArrayUpdate();
    return;

}
