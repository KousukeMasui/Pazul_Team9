//CSVファイルを読み込む関数getCSV()の定義
var CSVReader = function (fileName, func) {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", fileName, true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行
    this.dataArray = new Array();
    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
    req.onload = function () {
        this.dataArray = ConvertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
        alert(this.dataArray);
        func(new CSV_Data(this.dataArray));
    }
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
var ConvertCSVtoArray = function (str) { // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
    //行数を取得
    var row_max = tmp.length;
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for (var i = 0; i < row_max; ++i) {
        result[i] = tmp[i].split(",");
    }

    return result;
}

//csvデータをクラス化する
var CSV_Data = function (csvData) {
    this.data = csvData;
    this.row = this.data.length;
    this.col = this.data[0].length;
}