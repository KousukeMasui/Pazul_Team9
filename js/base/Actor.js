
//画像描画する基底クラス
var Actor = function (ctx, position, imgSrc)
{
    this.ctx = ctx;
    this.position = position;
    this.img = new Image();
    this.img.src = imgSrc;
    this.isDead = false;
}
//空更新関数　overrideして使う
Actor.prototype.Update = function(){

}

Actor.prototype.Draw = function () {
    console.log("draw");
    this.ctx.drawImage(this.img, this.position.x - this.img.width / 2, this.position.y - this.img.height / 2);
}

//ActorID
var ActorID = function () {
    this.ENEMY = 0;
    this.PLAYER = 1;
}
//Actor管理クラス

var ActorManager = function () {
    this.actors = new Array();
}

ActorManager.prototype.Add = function(id,actor)
{
    this.actors.push(actor);
}

ActorManager.prototype.Update = function ()
{
    for (var i = 0; i < this.actors.length; i++)
        this.actors[i].Update();
}

ActorManager.prototype.Draw = function ()
{
    for (var i = 0; i < this.actors.length; i++)
        this.actors[i].Draw();
}