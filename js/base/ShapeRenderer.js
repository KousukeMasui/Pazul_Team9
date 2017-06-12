//canvas基本図形描画関数
var ShapeRenderer = function (ctx)
{
    this.ctx = ctx;
}
var ToRad = function (degree) {
    return degree * Math.PI / 180;
}

ShapeRenderer.prototype.CircleDraw = function (position, radius, startDeg, endDeg,isFill)
{
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, ToRad(startDeg), ToRad(endDeg), false);	// arc(x, y, radius, startAngle, endAngle, anticlockwise)
    this.Draw(isFill);
}

ShapeRenderer.prototype.Draw = function(isFill)
{
    if (isFill)
        this.ctx.fill();	//fill()だと塗りつぶし
    else
        this.ctx.stroke();
}

ShapeRenderer.prototype.DrawLine = function(p1,p2)
{
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.closePath();
    this.ctx.stroke();
}
//配列ver
ShapeRenderer.prototype.DrawLines = function (positions,isFill)
{
    if (positions.length < 2) return;//数が満たない場合早期リターン

    this.ctx.beginPath();
    this.ctx.moveTo(positions[0].x, positions[0].y);
    for(var i=1;i<positions.length;i++)
    {
        this.ctx.lineTo(positions[i].x, positions[i].y);
    }
    this.ctx.closePath();

    this.Draw(isFill);
}

ShapeRenderer.prototype.DrawRect = function(position,size,isFill)
{
    positions = new Array(4);
    positions[0] = position;
    positions[1] = new Vector2(position.x + size.x, position.y);
    positions[2] = new Vector2(position.x + size.x, position.y + size.y);
    positions[3] = new Vector2(position.x, position.y + size.y);

    this.DrawLines(positions, isFill);
}
//指定した位置を切り抜く
ShapeRenderer.prototype.ClearRect = function(position,size)
{
    this.ctx.clearRect(position.x, position.y, size.x, size.y);
}
/*
'#CCCCCC'
"rgb(192, 80, 77)"
5
*/
ShapeRenderer.prototype.SetStyle = function (fillStyle, strokeStyle, lineWidth) {
    this.ctx.fillStyle = fillStyle;			//塗りつぶし
    this.ctx.strokeStyle = strokeStyle;	//線の色：赤
    this.ctx.lineWidth = lineWidth;					//線の幅
}