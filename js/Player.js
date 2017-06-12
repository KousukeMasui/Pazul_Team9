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

Player.prototype.RotateDataUpdate = function () {
    posArray = new Array();
    for (var i = 0; i < this.blockArray.length; i++)
        posArray.push(this.blockArray[i].arrayPos);
    //��]�p�z�� �����Ă���=1
    this.rotateArray = new Array(7);
    for (var x = 0; x < 7; x++) {
        this.rotateArray[x] = new Array(7);
        for (var y = 0; y < 7; y++) {
            var result = 0;
            for (var i = 0; i < posArray.length; i++) {
                if (posArray[i].x == this.moveVelocity.x + x && posArray[i].y == this.moveVelocity.y + y) {
                    result = 1;
                    break;
                }
            }
            this.rotateArray[x][y] = result;
        }
    }
}
//�����Ă���u���b�N�̐ݒ�
Player.prototype.SetBlock = function (blockArray) {
    this.blockArray.length = 0;
    this.moveVelocity = new Vector2(0, 0);
    this.blockArray = blockArray;
}

Player.prototype.Move = function (x) {
    for (var i = 0; i < this.blockArray.length; i++) {
        //��ł��ړ����Ȃ��ꍇ�S�ē������Ȃ�
        if (!this.manager.IsToBlock(new Vector2(this.blockArray[i].arrayPos.x + x, this.blockArray[i].arrayPos.y))) return;
    }
    for (var i = 0; i < this.blockArray.length; i++) {
        //x�����Ɉړ�������
        this.blockArray[i].Move(x);
    }

    this.moveVelocity.x += x;
}

//��]����
Player.prototype.Rotate = function () {
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
    for(var i=0;i<posArray.length;i++)
    {
        this.blockArray[i].SetPos(new Vector2(this.moveVelocity.x + posArray[i].x,this.moveVelocity.y + posArray[i].y));
    }
}
