
//�\������u���b�N�N���X �_�X�ƈړ����Ȃ��ׂɍ쐬
var Block = function (ctx,position,size, blockImgSrc,manager)
{
    this.ctx = ctx;
    this.arrayPos = position;
    this.position = new Vector2(position.x * size.x,position.y*size.y);
    this.size = size;
    this.img = new Image();
    this.img.src = blockImgSrc;
    this.manager = manager;
    //�����^�C�}
    this.fallTimer = 0.0;
    //�����܂ł̎���
    this.fallTime = 15.0;

    this.fallSpeed = size.y / this.fallTime;
}
Block.prototype.SetPos = function(arrayPos)
{
    this.arrayPos = arrayPos;
    this.position = new Vector2(arrayPos.x * this.size.x, arrayPos.y * this.size.y);

}
//�����������@�z��ړ����s��
Block.prototype.Fall = function()
{
    return new Vector2(this.arrayPos.x, this.arrayPos.y++);
}

//�X�V
Block.prototype.Update = function()
{
    this.fallTimer++;
    this.position.y += this.fallSpeed;
}

//����������
Block.prototype.IsFall = function () {
    
    if (this.fallTimer >= this.fallTime) {
        this.fallTimer = 0.0;
        return true;
    }
    return false;

}
//�`��
Block.prototype.Draw = function()
{
    this.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
}
//�ړ�
Block.prototype.Move = function(x)
{
    this.arrayPos.x += x;

    this.position.x += (x * this.size.x);
}