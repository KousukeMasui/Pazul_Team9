// ============================================================================
// 
// common.js
// 
// ============================================================================

// - point --------------------------------------------------------------------
function Vector2(x,y){
	this.x = x;
	this.y = y;
}
Vector2.prototype.Distance = function (p) {
    var q = new Vector2();
    q.x = p.x - this.x;
    q.y = p.y - this.y;
    return q.Length();
};

Vector2.prototype.Length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

var Sub = function(my,other)
{
    return new Vector2(my.x - other.x, my.y - other.y);
}

Vector2.prototype.Normalize = function () {
    var i = this.Length();
    if (i > 0) {
        var j = 1 / i;
        this.x *= j;
        this.y *= j;
    }
};
