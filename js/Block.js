
//表示するブロッククラス 点々と移動しない為に作成
var Block = function (ctx,position,size, blockImgSrc,manager)
{
    this.ctx = ctx;
    this.arrayPos = position;
    this.position = new Vector2(position.x * size.x,position.y*size.y);
    this.size = size;
    this.img = new Image();
    this.img.src = blockImgSrc;
    this.manager = manager;
    //落下タイマ
    this.fallTimer = 0.0;
    //落下までの時間
    this.fallTime = 15.0;

    this.fallSpeed = size.y / this.fallTime;
}
Block.prototype.SetPos = function(arrayPos)
{
    this.arrayPos = arrayPos;
    this.position = new Vector2(arrayPos.x * this.size.x, arrayPos.y * this.size.y);

}
//落下時処理　配列移動を行う
Block.prototype.Fall = function()
{
    return new Vector2(this.arrayPos.x, this.arrayPos.y++);
}

//更新
Block.prototype.Update = function()
{
    this.fallTimer++;
    this.position.y += this.fallSpeed;
}

//落下したか
Block.prototype.IsFall = function () {
    
    if (this.fallTimer >= this.fallTime) {
        this.fallTimer = 0.0;
        return true;
    }
    return false;

}
//描画
Block.prototype.Draw = function()
{
    this.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
}
//移動
Block.prototype.Move = function(x)
{
    this.arrayPos.x += x;

    this.position.x += (x * this.size.x);
}