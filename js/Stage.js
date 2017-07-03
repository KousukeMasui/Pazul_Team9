//�O���[�o�����`
var player;
//Class���`
var Stage = function (ctx, x, y, backImageSrc,blockImageSrc,screenSize) {
    this.ctx = ctx;
    //�w�i�摜
    this.bgImg = new Image();
    this.bgImg.src = backImageSrc;
    //�X�N���[���T�C�Y
    this.screenSize = screenSize;
    this.stageSize = new Vector2(x, y);
    this.Initialize(x, y);
    //�u���b�N�̉摜
    this.blockImageSrc = blockImageSrc;
    //�v���C���[�̐���
    player = new Player(this);
    // �L�[���͂̎擾���C�x���g�Ƃ��ēo�^
    document.addEventListener('keydown', KeyDown, true);
    //csv���ǂݍ��� �ǂݍ��݂��I�����܂őҋ@
    g_isPouse = true;
    //this.csv = new CSV_Data(" ");
    //this.createBlocks = new Array();
    //new CSVReader("./src/tetrimino_patarn.csv", function (csv) {
    //    this.stage.csv = csv;
    //    this.stage.BlockSave();
    //    this.stage.CreateBlock();//�u���b�N����
    //    g_isPouse = false;//�|�[�Y����
    //    alert(this.stage.csv.data);
    //},this.csv);

    this.CreateBlock();
}

Stage.prototype.BlockSave = function () {
    //this.csv.data.length;
    this.createBlocks = new Array();
    for (var i = 0; i < this.csv.row; i++) {
        this.createBlocks.push(new Array(7));
        for (var j = 0; j < 7; j++)
            this.createBlocks[i][j] = new Array(7);
    }
    var cnt = 0;//this.createBlocks.length;
    alert(this.csv.row);
    for (var row = 0; row < this.csv.row - 1; row++)
    {
        if ((row+1) % 8 == 0) { alert("add"); cnt++; }
        //alert("row = " + row + " : " + this.csv.data[row]);
        for (var col = 0; col < this.csv.col; col++) {
            alert("row = " + row + ",col = " + col + " : " + this.csv.data[row][col]);
            this.createBlocks[cnt][row][col] = this.csv.data[row][col];
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
    //�����u���b�N
    this.fallBlockArray = new Array();
    //���~�u���b�N
    this.blockArray = new Array();
    this.blockScale = new Vector2(this.screenSize.x / x, this.screenSize.y / y);
    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            if(this.stageArray[i][j] ==1) this.blockArray.push(new Block(this.ctx, new Vector2(i, j), this.blockScale, "res/food.png", this));
        }
    }
}

//�u���b�N�ǉ��֐� �ʒu�͔z���̈ʒu
Stage.prototype.AddBlock = function(position,isCenter)
{
    //�����u���b�N�ɓo�^
    this.fallBlockArray.push( new Block(this.ctx,
        position, this.blockScale, this.blockImageSrc, this, isCenter));

}

Stage.prototype.CreateBlock = function () {
    //�����_������ 0~2
    //var rand = Math.floor(Math.random() * 3);

    //for (var x = 0; x < 7; x++)
    //{
    //    for(var y=0;y<7;y++)
    //    {
    //        if(this.createBlocks[rand][x][y] == 1)
    //        {
    //            this.AddBlock(new Vector2(x, y), (x == 3 && y == 3));
    //        }
    //    }
    //}

    this.AddBlock(new Vector2(3, 3), true);
    for (var i = 0; i < 3;i++)
        this.AddBlock(new Vector2(3+i, 4), true);

    if (this.IsGameOver())
    {
        run = false;
        /*�����ɃQ�[���I�[�o�[�V�[���J�n��������*/
    }

    player.SetBlock(this.fallBlockArray);
}

Stage.prototype.Update = function ()
{
    //alert(this.csv.Get(1, 0));
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
//�Q�[���I�[�o�[����
Stage.prototype.IsGameOver = function () {
    for(var i=0;i<this.fallBlockArray.length;i++)
    {
        //�����ʒu�Ɋ��Ƀu���b�N�������ꍇ
        if(this.stageArray[this.fallBlockArray[i].arrayPos.x][this.fallBlockArray[i].arrayPos.y] == 1)
        {
            location.href = "./result.html?";
            return true;
        }
    }
    for (var i = 0; i < this.fallBlockArray.length; i++)
    {
        //�������u���b�N�Ƃ��ēo�^
        this.stageArray[this.fallBlockArray[i].arrayPos.x][this.fallBlockArray[i].arrayPos.y] = 2;
    }

    return false;

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
                //���~�u���b�N�ɓo�^
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
        //�����u���b�N�N���A
        this.fallBlockArray.length = 0;
        //��������
        this.Delete();
        //�����u���b�N���Ȃ��Ȃ����琶��
        if(this.fallBlockArray.length <=0) this.CreateBlock();
    }
}

Stage.prototype.IsFall = function (position)
{
    //�X�e�[�W�̉��[�̏ꍇ �����ł��Ȃ�
    if (position.y + 1 >= this.stageSize.y) return false;
    //���~�u���b�N�����ɂ����ꍇfalse
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
//���������ł������u���b�N����
Stage.prototype.Delete = function () {
    var deleteIndices = new Array();
    var deleteRows = new Array();//�폜�s
    //�폜����
    for (var y = 0; y < this.stageSize.y; y++) {
        var isDelete = true;
        for (var x = 0; x < this.stageSize.x; x++) {
            //�P�ł�1(���~�u���b�N)�łȂ��ꍇ�������Ȃ�
            if (this.stageArray[x][y] != 1) {
                isDelete = false;
                break;
            }
        }
        //���������ꍇ
        if (isDelete) {
            deleteRows.push(y);
            //�z���X�V
            for (var x = 0; x < this.stageSize.x; x++) {
                this.stageArray[x][y] = 0;
            }
            //�폜�ԍ��i�[
            for (var i = 0; i < this.blockArray.length; i++) {
                if (this.blockArray[i].arrayPos.y == y)
                    deleteIndices.push(i);
            }
        }

    }

    //���s���폜���Ȃ��ꍇ�I��
    if (deleteRows.length <= 0) return;
    //���ԉ��̍s�ԍ����擾
    var underDeleteRow = deleteRows[deleteRows.length - 1];

    for (var i = 0; i < this.blockArray.length; i++) {
        //�폜�\���̃u���b�N�����O
        var isFind = true;
        for (var j = 0; j < deleteRows.length; j++) {
            if (deleteRows[j] == this.blockArray[i].arrayPos.y) {
                isFind = false;
                break;
            }
        }
        if (!isFind) continue

        //�폜�s�̈��ԉ��������̏ꍇ
        if (this.blockArray[i].arrayPos.y < underDeleteRow) {
            //�����u���b�N�ɒǉ�
            this.fallBlockArray.push(this.blockArray[i]);
            //���~�u���b�N�폜�z���ɒǉ�
            deleteIndices.push(i);
            //�X�e�[�W�z���ɔ��f
            this.stageArray[this.blockArray[i].arrayPos.x][this.blockArray[i].arrayPos.y] = 2;
        }
    }
    //�폜
    //�d���폜
    deleteIndices = deleteIndices.filter(function (v, i, s) {
    return s.indexOf(v) === i;
});
    //�z���ԍ����t���ɂ��Ȃ��Ƃ����Ȃ��̂ō~���\�[�g
    deleteIndices.sort(function (a, b) { return -(a - b); });
    //�z�񂩂��폜
    for (var i = 0; i < deleteIndices.length; i++)
    {
        this.blockArray.splice(deleteIndices[i], 1);
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
        //�ړ����̈ʒu���v�Z
        var next = new Vector2(blockArray[i].arrayPos.x + moveVec.x, blockArray[i].arrayPos.y + moveVec.y);
        blockArray[i].SetPos(next);
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
        //���]
        player.Rotate();
    }
}
var drawText = function (ctx, color, size, font, x, y, text) {
    ctx.fillStyle = color;
    ctx.font = size + "px '" + font + "'";
    ctx.fillText(text, x, y);
}
