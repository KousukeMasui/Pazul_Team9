//�O���[�o����`
var player;
//Class��`
var Stage = function (ctx, x, y, backImageSrc,screenSize) {
    this.ctx = ctx;
    //�w�i�摜
    this.bgImg = new Image();
    this.bgImg.src = backImageSrc;
    //�X�N���[���T�C�Y
    this.screenSize = screenSize;
    this.stageSize = new Vector2(x, y);
    this.Initialize(x, y);
    //�v���C���[�̐���
    player = new Player(this);
    // �L�[���͂̎擾���C�x���g�Ƃ��ēo�^
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
    //�����u���b�N
    this.fallBlockArray = new Array();
    //��~�u���b�N
    this.blockArray = new Array();
    this.blockScale = new Vector2(this.screenSize.x / x, this.screenSize.y / y);
    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            if(this.stageArray[i][j] ==1) this.blockArray.push(new Block(this.ctx, new Vector2(i, j), this.blockScale, "res/food.png", this));
        }
    }
}

//�u���b�N�ǉ��֐� �ʒu�͔z��̈ʒu
Stage.prototype.AddBlock = function(position,isCenter)
{
    //�������u���b�N�Ƃ��ēo�^
    this.stageArray[position.x][position.y] = 2;
    //�����u���b�N�ɓo�^
    this.fallBlockArray.push( new Block(this.ctx,
        position, this.blockScale, "res/food.png", this, isCenter));

}

Stage.prototype.CreateBlock = function () {
    //�����u���b�N�N���A
    this.fallBlockArray.length = 0;
    //�u���b�N�̐���
    this.AddBlock(new Vector2(6, 3),false);
    this.AddBlock(new Vector2(4, 3),true);
    this.AddBlock(new Vector2(4, 4),false);
    this.AddBlock(new Vector2(5, 3),false);
    player.SetBlock(this.fallBlockArray);
}

Stage.prototype.Update = function ()
{
    this.FallFunc();
    if (this.fallBlockArray[0].IsFall()) {
        for (var i = 1; i < this.fallBlockArray.length; i++)
            this.fallBlockArray[i].IsFall();
        this.MoveBlocks(this.fallBlockArray, new Vector2(0, 1));
        player.Fall();
    }
    for(var i=0;i<this.fallBlockArray.length;i++)
    {
        //�����X�V����
        this.fallBlockArray[i].Update();
    }
}

//�������̃X�N���v�g
Stage.prototype.FallFunc = function () {
    var isFall = false;
    for (var x = 0; x < this.stageSize.x; x++)
    {
        for (var y = 0; y < this.stageSize.y; y++)
        {
            if (this.stageArray[x][y] == 2 && !this.IsFall(new Vector2(x, y)))//�����u���b�N�̏ꍇ
            {
                this.stageArray[x][y] = 1;
                //��~�u���b�N�ɓo�^
                this.blockArray = this.blockArray.concat(this.fallBlockArray);
                //��������
                this.Delete();
                isFall = true;
                break;
            }
        }
    }

    if(isFall)
    {
        for (var x = 0; x < this.stageSize.x; x++) {
            for (var y = 0; y < this.stageSize.y; y++)
                if (this.stageArray[x][y] == 2) this.stageArray[x][y] = 1;
        }
        //�V������������
        this.CreateBlock();
    }
}

Stage.prototype.IsFall = function (position)
{
    //�X�e�[�W�̉��[�̏ꍇ �����ł��Ȃ�
    if (position.y + 1 >= this.stageSize.y) return false;
    //��~�u���b�N�����ɂ���ꍇfalse
    return this.stageArray[position.x][position.y + 1] !=1;

}
//�u���b�N���ړ��ł��邩����
Stage.prototype.IsToBlock = function (position)
{
    //X���@�O�ɏo����
    if (position.x < 0 || position.x >= this.stageSize.x)
        return false;
    //Y��
    if (position.y < 0 || position.y >= this.stageSize.y) return false;

    //�u���b�N�����邩����
    return this.stageArray[position.x][position.y] != 1;
}
//������ł�����u���b�N����
Stage.prototype.Delete = function () {
    for (var y = 0; y < this.stageSize.y; y++) {
        var isDelete = false;
        for (var x = 0; x < this.stageSize.x; x++) {
            //�P�ł�1(��~�u���b�N)�łȂ��ꍇ�������Ȃ�
            if (this.stageArray[x][y] != 1) {
                isDelete = false;
                break;
            }
        }

        if(isDelete)
        {
            for(var i=0;i<this.blockArray.length;i++)
            {
                //�폜�s�ɂ���u���b�N��S�č폜
                if(this.blockArray[i].arrayPos.y == y)
                {
                    this.blockArray.splice(i, 1);
                }
            }
            for (var x = 0; x < this.stageSize.x; x++) {
                this.stageArray[x][y] = 0;
            }
        }
    }

}

Stage.prototype.Draw = function () {
    //�w�i�̕`��
    this.ctx.drawImage(this.bgImg, 0, 0);

    //�u���b�N�̕\��
    for (var i = 0; i < this.fallBlockArray.length; i++)
        this.fallBlockArray[i].Draw();
    for (var i = 0; i < this.blockArray.length; i++)
        this.blockArray[i].Draw();

    for (var x = 0; x < this.stageSize.x; x++)
    {
        for(var y=0;y<this.stageSize.y;y++)
        {
            drawText(this.ctx, "#000000", this.blockScale.x, "MS P�S�V�b�N", x * this.blockScale.x, (y + 1) * this.blockScale.y, this.stageArray[x][y]);
        }
    }
}
Stage.prototype.MoveBlocks = function(blockArray,moveVec)
{
    var nextPos = new Array();
    //�ʒu�̏�����
    for (var i = 0; i < blockArray.length; i++) {
        this.stageArray[blockArray[i].arrayPos.x][blockArray[i].arrayPos.y] = 0;
        var next = blockArray[i].Move(moveVec);
        nextPos.push(next);
    }

    for (var i = 0; i < nextPos.length; i++)
        this.stageArray[nextPos[i].x][nextPos[i].y] = 2;

}
var KeyDown = function (event) {
    //A�������ꂽ��
    if (event.key == "a") {
        //���Ɉړ�
        player.Move(-1);
    }
    else if (event.key == "d") {
        //�E�Ɉړ�
        player.Move(1);
    }
    else if (event.key == "Enter") {
        //��]
        player.Rotate();
    }
}
var drawText = function (ctx, color, size, font, x, y, text) {
    ctx.fillStyle = color;
    ctx.font = size + "px '" + font + "'";
    ctx.fillText(text, x, y);
}