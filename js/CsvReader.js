//CSV�t�@�C����ǂݍ��ފ֐�getCSV()�̒�`
var CSVReader = function(fileName){
    var req = new XMLHttpRequest(); // HTTP�Ńt�@�C����ǂݍ��ނ��߂�XMLHttpRrequest�I�u�W�F�N�g�𐶐�
    req.open("get", fileName, true); // �A�N�Z�X����t�@�C�����w��
    req.send(null); // HTTP���N�G�X�g�̔��s
	
    // ���X�|���X���Ԃ��Ă�����convertCSVtoArray()���Ă�	
    req.onload = function(){
        ConvertCSVtoArray(req.responseText); // �n�����͓̂ǂݍ���CSV�f�[�^
    }
}
 
// �ǂݍ���CSV�f�[�^��񎟌��z��ɕϊ�����֐�convertCSVtoArray()�̒�`
CSVReader.prototype.ConvertCSVtoArray = function(str){ // �ǂݍ���CSV�f�[�^��������Ƃ��ēn�����
    var result = []; // �ŏI�I�ȓ񎟌��z������邽�߂̔z��
    var tmp = str.split("\n"); // ���s����؂蕶���Ƃ��čs��v�f�Ƃ����z��𐶐�
 
    // �e�s���ƂɃJ���}�ŋ�؂����������v�f�Ƃ����񎟌��z��𐶐�
    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }
}