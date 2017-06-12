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
Stage.prototype.AddBlock = function(position)
{
    //�������u���b�N�Ƃ��ēo�^
    this.stageArray[position.x][position.y] = 2;
    //�����u���b�N�ɓo�^
    this.fallBlockArray.push( new Block(this.ctx,
        position, this.blockScale, "res/food.png", this));

}

Stage.prototype.CreateBlock = function () {
    //�����u���b�N�N���A
    this.fallBlockArray.length = 0;
    //�u���b�N�̐���
    this.AddBlock(new Vector2(5, 4));
    this.AddBlock(new Vector2(3, 4));
    this.AddBlock(new Vector2(3, 3));
    this.AddBlock(new Vector2(4, 4));
    player.SetBlock(this.fallBlockArray);
}

Stage.prototype.Update = function ()
{
    this.FallFunc();
    var isFall = this.fallBlockArray[0].IsFall();
    for(var i=0;i<this.fallBlockArray.length;i++)
    {
        //�����X�V����
        this.fallBlockArray[i].Update();
        if (isFall) {
            var pos = this.fallBlockArray[i].Fall();
            this.stageArray[pos.x][pos.y] = 0;//���݂̃}�X�����
            this.stageArray[pos.x][pos.y + 1] = 2;//�V�����}�X���X�V
        }
    }
    if (isFall)  player.Fall();
}

//�������̃X�N���v�g
Stage.prototype.FallFunc = function () {
    var isFall = false;
    for (var x = 0; x < this.stageArray.length; x++)
    {
        for (var y = 0; y < this.stageArray[0].length; y++)
        {
            if (this.stageArray[x][y] == 2 && !this.IsFall(new Vector2(x, y)))//�����u���b�N�̏ꍇ
            {
                //��~�u���b�N�ɓo�^
                this.blockArray = this.blockArray.concat(this.fallBlockArray);
                //��������
                this.Delete();
                //�V������������
                this.CreateBlock();
                isFall = true;
                break;
            }
        }
        if (isFall) break;
    }

    if(isFall)
    {
        for(var x = 0;x < this.stageSize.x;x++)
        {
            for (var y = 0; y < this.stageSize.y; y++)
                if (this.stageArray[x][y] == 2) this.stageArray[x][y] = 1;
        }
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

}

Stage.prototype.Draw = function () {
    //�w�i�̕`��
    this.ctx.drawImage(this.bgImg, 0, 0);

    //�u���b�N�̕\��
    for (var i = 0; i < this.fallBlockArray.length; i++)
        this.fallBlockArray[i].Draw();
    for (var i = 0; i < this.blockArray.length; i++)
        this.blockArray[i].Draw();
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
