//�v���C���[�N���X
var Player = function (manager) {
    this.manager = manager;
    this.blockArray = new Array();
    this.rotateArray = new Array(7);
    for (var x = 0; x < 7;x++)
        this.rotateArray[x] = new Array(7);

    this.moveVelocity = new Vector2(0, 0);
}

Player.prototype.Fall = function()
{
    this.moveVelocity.y++;
}
//�����Ă���u���b�N�̐ݒ�
Player.prototype.SetBlock = function (blockArray) {
    this.moveVelocity = new Vector2(0, 0);
    this.blockArray = blockArray;

    var leftTop;
    for (var i = 0; i < this.blockArray.length; i++) {
        if (this.blockArray[i].isCenter) {
            leftTop = new Vector2(this.blockArray[i].arrayPos.x-3,this.blockArray[i].arrayPos.y-3);
        }
    }
    this.moveVelocity = leftTop;
    //��]�z��̏�����
    for(var x=0;x<7;x++)
    {
        for(var y=0;y<7;y++)
        {
            this.rotateArray[x][y] = 0;
        }
    }

    //�u���b�N�̈ʒu��1�ɂ���
    for (var i = 0; i < this.blockArray.length; i++) {
        var pos = Sub(this.blockArray[i].arrayPos, leftTop);
        this.rotateArray[pos.x][pos.y] = 1;
    }
    //this.rotateSize.Draw();
}

Player.prototype.Move = function (x) {
    var newPos = new Array();
    for (var i = 0; i < this.blockArray.length; i++) {
        //��ł��ړ����Ȃ��ꍇ�S�ē������Ȃ�
        if (!this.manager.IsToBlock(new Vector2(this.blockArray[i].arrayPos.x + x, this.blockArray[i].arrayPos.y))) return;
    }

    this.manager.MoveBlocks(this.blockArray, new Vector2(x, 0));

    this.moveVelocity.x += x;
}
//�z��̉�]����
Player.prototype.RotateArrayUpdate = function()
{
    //����ւ��z���錾
    var tempArray = new Array(7);
    for (var i = 0; i < 7; i++)
        tempArray[i] = new Array(7);

    //�z��̉�]����
    for (var x = 0; x < 7;x++){
        for (var y = 0; y < 7; y++) {
            tempArray[y][x] = this.rotateArray[6 - x][y];
        }
    }

    //�ʒu�����ۂ̃Q�[���̈ʒu�ɖ߂�
    var newPosArray = new Array();
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
            if (tempArray[y][x] ==1)
            {
                var gamePos = new Vector2(y + this.moveVelocity.x, x + this.moveVelocity.y);
                //�V�����ʒu�Ɋ��Ƀu���b�N�����������]���Ȃ�
                if (!this.manager.IsToBlock(gamePos))
                    return;
                newPosArray.push(gamePos);
            }
        }
    }
    //��]�z����X�V
    this.rotateArray = tempArray;

    //���݂̈ʒu�̔z���0�ɂ���
    for (var i = 0; i < this.blockArray.length; i++) {
        this.manager.stageArray[this.blockArray[i].arrayPos.x][this.blockArray[i].arrayPos.y] = 0;

    }
    //���ۂ̉�]����
    for (var i = 0; i < this.blockArray.length; i++)
    {
        this.blockArray[i].SetPos(newPosArray[i]);
        this.manager.stageArray[newPosArray[i].x][newPosArray[i].y] = 2;
    }



}
//��]����
Player.prototype.Rotate = function () {
    this.RotateArrayUpdate();
    return;

    /*
    this.RotateDataUpdate();
    tempArray = new Array(7);
    var posArray = new Array();
    for (var x = 0; x < 7; x++)
    {
        tempArray[x] = new Array(7);
        for(var y=0;y<7;y++)
        {
            tempArray[x][y] = this.rotateArray[6 - y][x];

            if (this.rotateArray[6 - y][x] == 1) {
                posArray.push(new Vector2(x, y));
                //�u���b�N��������ꏊ���m�F
                if (!this.manager.IsToBlock(new Vector2(this.moveVelocity.x + x, this.moveVelocity.y + y)))
                {
                    return;
                }
            }
        }
    }
    */

    //�����u���b�N�̈ʒu���擾
    var centerPos = new Vector2(0, 0);
    for (var i = 0; i < this.blockArray.length; i++) {
        if (this.blockArray[i].isCenter) {
            centerPos = this.blockArray[i].arrayPos;
        }
    }

    var startPos = new Vector2(centerPos.x - 3, centerPos.y - 3);
    var cnt = 0;
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
            var prevPos = new Vector2(7 - (startPos.x + x), (startPos.y + y));
            //this.rotateArray[y][x] = this.manager.stageArray[7 - (startPos.x + x)][(startPos.y + y)];
            if (this.manager.stageArray[prevPos.x][prevPos.y] == 2 &&
                !(centerPos.x == prevPos.x && centerPos.y == prevPos.y)) {
                if (cnt > this.blockArray.length)
                    alert("error");
                //center�͓��������Ɏ��̃u���b�N�𓮂���
                if (this.blockArray[cnt].arrayPos.x == centerPos.x &&
                    this.blockArray[cnt].arrayPos.y == centerPos.y) {
                    cnt++;
                }
                //alert("newPos = (" + x + "," + y + ")");
                this.manager.stageArray[prevPos.x][prevPos.y] = 0;
                this.blockArray[cnt++].SetPos(new Vector2(startPos.x + y, startPos.y +x));
                this.manager.stageArray[startPos.x + y][startPos.y + x] = 2;
                //alert((startPos.x + y) + "," + (startPos.y + x));
            }
        }
    }
}
