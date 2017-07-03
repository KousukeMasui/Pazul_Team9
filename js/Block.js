
//表示するブロッククラス 点々と移動しない為に作成
var Block = function (ctx,position,size, blockImgSrc,manager,isCenter)
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
    this.fallTime = 10.0;

    this.fallSpeed = size.y / this.fallTime;
    //中央どうか
    this.isCenter = isCenter;
}
Block.prototype.SetPos = function(arrayPos)
{
    this.arrayPos = arrayPos;
    this.position = new Vector2(arrayPos.x * this.size.x, arrayPos.y * this.size.y + this.fallTimer * this.fallSpeed);
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
Block.prototype.Move = function(moveVec)
{
    this.SetPos(new Vector2(this.arrayPos.x + moveVec.x,
        this.arrayPos.y + moveVec.y));
    //新しい位置を返す
    return this.arrayPos;
}