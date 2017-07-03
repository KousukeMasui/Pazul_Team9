//CSV�t�@�C����ǂݍ��ފ֐�getCSV()�̒�`
var CSVReader = function (fileName, func) {
    var req = new XMLHttpRequest(); // HTTP�Ńt�@�C����ǂݍ��ނ��߂�XMLHttpRrequest�I�u�W�F�N�g�𐶐�
    req.open("get", fileName, true); // �A�N�Z�X����t�@�C�����w��
    req.send(null); // HTTP���N�G�X�g�̔��s
    this.dataArray = new Array();
    // ���X�|���X���Ԃ��Ă�����convertCSVtoArray()���Ă�
    req.onload = function () {
        this.dataArray = ConvertCSVtoArray(req.responseText); // �n�����͓̂ǂݍ���CSV�f�[�^
        alert(this.dataArray);
        func(new CSV_Data(this.dataArray));
    }
}

// �ǂݍ���CSV�f�[�^��񎟌��z��ɕϊ�����֐�convertCSVtoArray()�̒�`
var ConvertCSVtoArray = function (str) { // �ǂݍ���CSV�f�[�^��������Ƃ��ēn�����
    var result = []; // �ŏI�I�ȓ񎟌��z������邽�߂̔z��
    var tmp = str.split("\n"); // ���s����؂蕶���Ƃ��čs��v�f�Ƃ����z��𐶐�
    //�s�����擾
    var row_max = tmp.length;
    // �e�s���ƂɃJ���}�ŋ�؂����������v�f�Ƃ����񎟌��z��𐶐�
    for (var i = 0; i < row_max; ++i) {
        result[i] = tmp[i].split(",");
    }

    return result;
}

//csv�f�[�^���N���X������
var CSV_Data = function (csvData) {
    this.data = csvData;
    this.row = this.data.length;
    this.col = this.data[0].length;
}