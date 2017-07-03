//�E�O�E��E��E�[�E�o�E��E��E��E��E�`
var player;
//Class�E��E��E�`
var Stage = function (ctx, x, y, backImageSrc,blockImageSrc,screenSize) {
    this.ctx = ctx;
    //�E�w�E�i�E�摁E
    this.bgImg = new Image();
    this.bgImg.src = backImageSrc;
    //�E�X�E�N�E��E��E�[�E��E��E�T�E�C�E�Y
    this.screenSize = screenSize;
    this.stageSize = new Vector2(x, y);
    this.Initialize(x, y);
    //�E�u�E��E��E�b�E�N�E�̉摜
    this.blockImageSrc = blockImageSrc;
    //�E�v�E��E��E�C�E��E��E�[�E�̐��E��E�
    player = new Player(this);
    // �E�L�E�[�E��E��E�͂̎擾�E��E��E�C�E�x�E��E��E�g�E�Ƃ��E�ēo�E�^
    document.addEventListener('keydown', KeyDown, true);
    //csv�E��E��E�ǂݍ��E��E� �E�ǂݍ��E�݂��E�I�E��E��E��E��E�܂őҋ@
    g_isPouse = true;
    this.csv = new CSV_Data(" ");
    this.createBlocks = new Array();
    new CSVReader("./src/tetrimino_patarn.csv", function (csv) {
        this.stage.csv = csv;
        this.stage.BlockSave();
        this.stage.CreateBlock();//�u���b�N����
        g_isPouse = false;//�|�[�Y����
    }, this.csv);

    //�^�C�}
    this.timer = 0;

    //this.CreateBlock();
}

Stage.prototype.BlockSave = function () {
    //this.csv.data.length;
    this.createBlocks = new Array();
    for (var i = 0; i < this.csv.row; i++) {
        this.createBlocks.push(new Array(7));
        for (var j = 0; j < 7; j++)
            this.createBlocks[i][j] = new Array(7);
    }
    var cnt = 0;
    for (var row = 0; row < this.csv.row - 1; row++)
    {
        if ((row+1) % 8 == 0) cnt++;
        for (var col = 0; col < this.csv.col; col++) {
            this.createBlocks[cnt][row%7][col] = this.csv.data[row][col];
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
    //�E��E��E��E��E�u�E��E��E�b�E�N
    this.fallBlockArray = new Array();
    //�E��E��E�~�E�u�E��E��E�b�E�N
    this.blockArray = new Array();
    this.blockScale = new Vector2(this.screenSize.x / x, this.screenSize.y / y);
    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            if(this.stageArray[i][j] ==1) this.blockArray.push(new Block(this.ctx, new Vector2(i, j), this.blockScale, "res/food.png", this));
        }
    }
}

//�E�u�E��E��E�b�E�N�E�ǉ��E�֐� �E�ʒu�E�͔z�E��E��E�̈ʒu
Stage.prototype.AddBlock = function(position,isCenter)
{
    //�E��E��E��E��E�u�E��E��E�b�E�N�E�ɓo�E�^
    this.fallBlockArray.push( new Block(this.ctx,
        position, this.blockScale, this.blockImageSrc, this, isCenter));

}

Stage.prototype.CreateBlock = function () {
    //�����_������ 0~2
    var rand = Math.floor(Math.random() * 3);
    var up = 10;//��ԏ�̃u���b�N�̈ʒu
    for (var x = 0; x < 7; x++)
    {
        for(var y=0;y<7;y++)
        {
            if(this.createBlocks[rand][x][y] == 1)
            {
                if (up >= y) up = y;
                this.AddBlock(new Vector2(x, y), (x == 3 && y == 3));
            }
        }
    }
    //���� /2
    var centerPos = this.stageSize.x / 2 - 3;

    for (var i = 0; i < this.fallBlockArray.length; i++)
    {
        if (!this.IsToBlock(new Vector2(this.fallBlockArray[i].arrayPos.x + centerPos, this.fallBlockArray[i].arrayPos.y - up)))
        {
            run = false;
            this.MoveBlocks(this.fallBlockArray, new Vector2(centerPos, -up));
            /*�����ɃQ�[���I�[�o�[�V�[���J�n������*/
            //�Q�[���I�[�o�[������ǉ�
            gameOverImage = new Image("res/GameOver_Logo.png");
            //�V�[���`�F���W
            location.href = "./result.html?" + escape(this.timer);
            return;
        }
    }
    this.MoveBlocks(this.fallBlockArray, new Vector2(centerPos, -up));
    //this.MoveBlocks(this.fallBlockArray, new Vector2(0, -up));

    //this.AddBlock(new Vector2(3, 3), true);
    //for (var i = 0; i < 3;i++)
    //    this.AddBlock(new Vector2(3+i, 4), true);

    //if (this.IsGameOver())
    //{
    //    run = false;
    //    /*�����ɃQ�[���I�[�o�[�V�[���J�n������*/
    //    //�Q�[���I�[�o�[������ǉ�
    //    gameOverImage = new Image("res/GameOver_Logo.png");
    //    //�V�[���`�F���W
    //    location.href = "./result.html?" + escape(this.timer);
    //}

    player.SetBlock(this.fallBlockArray);
}

Stage.prototype.Update = function ()
{
    this.timer++;
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
//�E�Q�E�[�E��E��E�I�E�[�E�o�E�[�E��E��E��E�
Stage.prototype.IsGameOver = function () {
    for(var i=0;i<this.fallBlockArray.length;i++)
    {
        //�E��E��E��E��E�ʒu�E�Ɋ��E�Ƀu�E��E��E�b�E�N�E��E��E��E��E��E��E�ꍁE
        if(this.stageArray[this.fallBlockArray[i].arrayPos.x][this.fallBlockArray[i].arrayPos.y] == 1)
        {
            return true;
        }
    }
    for (var i = 0; i < this.fallBlockArray.length; i++)
    {
        //�E��E��E��E��E��E��E�u�E��E��E�b�E�N�E�Ƃ��E�ēo�E�^
        this.stageArray[this.fallBlockArray[i].arrayPos.x][this.fallBlockArray[i].arrayPos.y] = 2;
    }

    return false;

}
//�E��E��E��E��E��E��E�̃X�E�N�E��E��E�v�E�g
Stage.prototype.FallFunc = function () {
    var isFall = false;
    for (var x = 0; x < this.stageSize.x; x++)
    {
        for (var y = 0; y < this.stageSize.y; y++)
        {
            if (this.stageArray[x][y] == 2 && !this.IsFall(new Vector2(x, y)))//�E��E��E��E��E�u�E��E��E�b�E�N�E�̏ꍇ
            {
                this.stageArray[x][y] = 1;
                //�E��E��E�~�E�u�E��E��E�b�E�N�E�ɓo�E�^
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
        //�E��E��E��E��E�u�E��E��E�b�E�N�E�N�E��E��E�A
        this.fallBlockArray.length = 0;
        //�E��E��E��E��E��E��E��E�
        this.Delete();
        //�E��E��E��E��E�u�E��E��E�b�E�N�E��E��E�Ȃ��E�Ȃ��E��E��E�琶�E��E�
        if(this.fallBlockArray.length <=0) this.CreateBlock();
    }
}

Stage.prototype.IsFall = function (position)
{
    //�E�X�E�e�E�[�E�W�E�̉��E�[�E�̏ꍇ �E��E��E��E��E�ł��E�Ȃ�
    if (position.y + 1 >= this.stageSize.y) return false;
    //�E��E��E�~�E�u�E��E��E�b�E�N�E��E��E��E��E�ɂ��E��E��E�ꍇfalse
    return this.stageArray[position.x][position.y + 1] !=1;

}
//�E�u�E��E��E�b�E�N�E��E��E�ړ��E�ł��E�邩�E��E��E��E�
Stage.prototype.IsToBlock = function (position)
{
    //X�E��E��E�@�E�O�E�ɏo�E��E��E��E�
    if (position.x < 0 || position.x >= this.stageSize.x)
        return false;
    //Y�E��E�
    if (position.y < 0 || position.y >= this.stageSize.y) return false;

    //�E�u�E��E��E�b�E�N�E��E��E��E��E�邩�E��E��E��E�
    return this.stageArray[position.x][position.y] != 1;
}
//�E��E��E��E��E��E��E��E��E�ł��E��E��E��E��E�u�E��E��E�b�E�N�E��E��E��E�
Stage.prototype.Delete = function () {
    var deleteIndices = new Array();
    var deleteRows = new Array();//�E�����s
    //�E������E��E��E�
    for (var y = 0; y < this.stageSize.y; y++) {
        var isDelete = true;
        for (var x = 0; x < this.stageSize.x; x++) {
            //�E�P�E�ł�1(�E��E��E�~�E�u�E��E��E�b�E�N)�E�łȂ��E�ꍁE���E��E��E��E��E��E�Ȃ�
            if (this.stageArray[x][y] != 1) {
                isDelete = false;
                break;
            }
        }
        //�E��E��E��E��E��E��E��E��E�ꍁE
        if (isDelete) {
            deleteRows.push(y);
            //�E�z�E��E��E�X�E�V
            for (var x = 0; x < this.stageSize.x; x++) {
                this.stageArray[x][y] = 0;
            }
            //�E�����ԍ��E�i�E�[
            for (var i = 0; i < this.blockArray.length; i++) {
                if (this.blockArray[i].arrayPos.y == y)
                    deleteIndices.push(i);
            }
        }

    }

    //�E��E��E�s�E��E��E������E��E�Ȃ��E�ꍁE��I�E��E�
    if (deleteRows.length <= 0) return;
    //�E��E��E�ԉ��E�̍s�E�ԍ��E��E��E�擾
    var underDeleteRow = deleteRows[deleteRows.length - 1];

    for (var i = 0; i < this.blockArray.length; i++) {
        //�E�����\�E��E��E�̃u�E��E��E�b�E�N�E��E��E��E��E�O
        var isFind = true;
        for (var j = 0; j < deleteRows.length; j++) {
            if (deleteRows[j] == this.blockArray[i].arrayPos.y) {
                isFind = false;
                break;
            }
        }
        if (!isFind) continue

        //�E�����s�E�̈��E�ԉ��E��E��E��E��E��E��E�̏ꍇ
        if (this.blockArray[i].arrayPos.y < underDeleteRow) {
            //�E��E��E��E��E�u�E��E��E�b�E�N�E�ɒǉ�
            this.fallBlockArray.push(this.blockArray[i]);
            //�E��E��E�~�E�u�E��E��E�b�E�N�E�����z�E��E��E�ɒǉ�
            deleteIndices.push(i);
            //�E�X�E�e�E�[�E�W�E�z�E��E��E�ɔ��E�f
            this.stageArray[this.blockArray[i].arrayPos.x][this.blockArray[i].arrayPos.y] = 2;
        }
    }
    //�E����E
    //�E�d�E��E��E����E
    deleteIndices = deleteIndices.filter(function (v, i, s) {
    return s.indexOf(v) === i;
});
    //�E�z�E��E��E�ԍ��E��E��E�t�E��E��E�ɂ��E�Ȃ��E�Ƃ��E��E��E�Ȃ��E�̂ō~�E��E��E�\�E�[�E�g
    deleteIndices.sort(function (a, b) { return -(a - b); });
    //�E�z�E�񂩂��E����E
    for (var i = 0; i < deleteIndices.length; i++)
    {
        this.blockArray.splice(deleteIndices[i], 1);
    }
}

Stage.prototype.Draw = function () {
    //�E�w�E�i�E�̕`�E��E�
    this.ctx.drawImage(this.bgImg, 0, 0);

    //�E�u�E��E��E�b�E�N�E�̕\�E��E�
    for (var i = 0; i < this.fallBlockArray.length; i++)
        this.fallBlockArray[i].Draw();
    for (var i = 0; i < this.blockArray.length; i++)
        this.blockArray[i].Draw();
    for (var x = 0; x < this.stageSize.x; x++)
    {
        for(var y=0;y<this.stageSize.y;y++)
        {
            drawText(this.ctx, "#000000", this.blockScale.x, "MS P�E�S�E�V�E�b�E�N", x * this.blockScale.x, (y + 1) * this.blockScale.y, this.stageArray[x][y]);
        }
    }
}
Stage.prototype.MoveBlocks = function(blockArray,moveVec)
{
    var nextPos = new Array();
    //�E�ʒu�E�̏��E��E��E��E�
    for (var i = 0; i < blockArray.length; i++) {
        this.stageArray[blockArray[i].arrayPos.x][blockArray[i].arrayPos.y] = 0;
        //�E�ړ��E��E��E�̈ʒu�E��E��E�v�E�Z
        var next = new Vector2(blockArray[i].arrayPos.x + moveVec.x, blockArray[i].arrayPos.y + moveVec.y);
        blockArray[i].SetPos(next);
        nextPos.push(next);
    }
    for (var i = 0; i < nextPos.length; i++)
        this.stageArray[nextPos[i].x][nextPos[i].y] = 2;

}
var KeyDown = function (event) {
    //A�E��E��E��E��E��E��E�ꂽ�E��E�
    if (event.key == "a") {
        //�E��E��E�Ɉړ�
        player.Move(-1);
    }
    else if (event.key == "d") {
        //�E�E�E�Ɉړ�
        player.Move(1);
    }
    else if (event.key == "Enter") {
        //�E��E��E�]
        player.Rotate();
    }
}
var drawText = function (ctx, color, size, font, x, y, text) {
    ctx.fillStyle = color;
    ctx.font = size + "px '" + font + "'";
    ctx.fillText(text, x, y);
}
