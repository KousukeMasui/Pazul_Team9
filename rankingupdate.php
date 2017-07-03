<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="utf-8">
  <meta http-equiv="ROBOTS" content="index,follow">
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <meta NAME="keywords" CONTENT="jQuery,Ajax,Excel,CSV読み込みサンプル">
	<title>ランキングを更新</title>
	<link rel="stylesheet" href="css/resultscene.css">
  <script type="text/javascript" src="js/jquery.min.js"></script>
  <script type="text/javascript" src="js/jquery.csv.js"></script>
	<!--
  <script type="text/javascript" src="js/readcsv.js"></script>
	-->
</head>

<body>
  <?php
  //ランキングとしてcsvに保存
  function SaveCSV($first,$second,$third)
  {
    $file = file('ranking.csv');
    unset($file[0]);
    unset($file[1]);
    unset($file[2]);

    file_put_contents('ranking.csv', $file);

    $fp = fopen('ranking.csv', 'a');
		fwrite($fp, implode(",",
		[
			$first, "１位" ,"(".date('Y-m-d H:i:s').")"
		]));
		fwrite($fp,"\r\n");

    fwrite($fp, implode(",",
    [
      $second, "２位" ,"(".date('Y-m-d H:i:s').")"
    ]));
    fwrite($fp,"\r\n");

		fwrite($fp, implode(",",
    [
      $third, "３位" ,"(".date('Y-m-d H:i:s').")"
    ]));
    fwrite($fp,"\r\n");

    fclose($fp);
  }


  $f = 300;
  $s = 200;
  $t = 50;

	'<script type="text/javascript">document.write(screen.width);</script>';
  SaveCSV($f,$s,$t);

  ?>

  <noscript>
      <p>JavaScriptがオフになっています。オンにして実行してください。</p>
  </noscript>

<script>

$(document).ready(function()
{
	alert("stop");
	//シーン移行
	location.href = "./result.html";

	//遷移時のデータ受け取り
	function DataReceive(){
		//?以降の文字を取得する
		var data = location.search.substring(1, location.search.length);
		//エスケープされた文字をアンエスケープする
		data = unescape(data);
		//受け渡し用にstring型にする
		data = String(data);

		//string型を受け取り、,で分割する
		var arr = "";
		arr += data;
		arr = arr.split(",");

		//数値に変換して取得
		/*
		knowledge = parseInt(arr[0],10);
		communication = parseInt(arr[1],10);
		mental = parseInt(arr[2],10);
		hp = parseInt(arr[3],10);
		count = parseInt(arr[4],10);
		*/
	}
});
</script>

</body>
</html>
