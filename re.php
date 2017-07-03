<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="utf-8">
  <meta http-equiv="ROBOTS" content="index,follow">
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <meta NAME="keywords" CONTENT="jQuery,Ajax,Excel,CSV読み込みサンプル">
	<title>ランキング</title>
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
    $file = file('re.csv');
    unset($file[0]);
    unset($file[1]);
    unset($file[2]);

    file_put_contents('re.csv', $file);

    $fp = fopen('re.csv', 'a');
    fwrite($fp, implode(",",
    [
      $third, "３位" ,"(".date('Y-m-d H:i:s').")"
    ]));
    fwrite($fp,"\n");
    fwrite($fp, implode(",",
    [
      $second, "２位" ,"(".date('Y-m-d H:i:s').")"
    ]));
    fwrite($fp,"\n");
    fwrite($fp, implode(",",
    [
      $first, "１位" ,"(".date('Y-m-d H:i:s').")"
    ]));
    fwrite($fp,"\n");

    fclose($fp);
  }

  $f = 100;
  $s = 50;
  $t = 10;
  SaveCSV($f,$s,$t);
  ?>


  <noscript>
      <p>JavaScriptがオフになっています。オンにして実行してください。</p>
  </noscript>


<canvas id="bg" width="800" height="600"></canvas>


<form>
	<button id="start" disabled>START</button>
	<button id="stop">STOP</button>
</form>



<script>
var ANIMATION_ID;
$(document).ready(function(){
  //ゲーム結果
	var score = 160;

  //描画オブジェクト
	var canvas = $("#bg").get(0);
	var ctx    = canvas.getContext('2d');
	var bgImage = new Image();
	var x = 0;
	var y = 0;
	var step = 3;
	var image = new Image();

  //ランキング保存用配列
	var ranking = [0,0,0,0];

	LoadCSVResultScene();

	image.src = "res/food.png";

	bgImage.src = "res/bgs.png";
	bgImage.onload = function() {
		 update();
	};

	function update(){
		draw();
		ANIMATION_ID = window.requestAnimationFrame(update);	//See. https://developer.mozilla.org/ja/docs/Web/API/Window/requestAnimationFrame
																// コールバックの回数は、たいてい毎秒 60 回ですが、一般的に多くのブラウザーでは W3C の勧告に従って、ディスプレイのリフレッシュレートに合わせて行われます。
	}

	function draw(){
		//alert( "aft:" + ranking[2]);
		// Canvas全体をクリア
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillRect(0,0,800,600);
		ctx.drawImage(bgImage,0,0);

		//画像を描画
		ctx.drawImage(image, x, y);

		//方向の調整
		if( (x >= (canvas.width-image.width)) || (x < 0) ){		// 毎回Canvasと画像サイズを参照するので、本来は別の変数などに入れる
			step *= -1;
		}

		//座標移動
		x += step;

		DrawText(ctx,"#000000",16,"メイリオ",0,0,"１ｓｔ" + ranking[0]);
		DrawText(ctx,"#000000",16,"メイリオ",0,30,"２ｎｄ" + ranking[1]);
		DrawText(ctx,"#000000",16,"メイリオ",0,60,"３ｒｄ" + ranking[2]);


  }


	function LoadCSVResultScene(){
		$(function(){
		    $.get('re.csv',function(data){
		        var csv = $.csv()(data);
		        $(csv).each(function(index){
		            if(this[0]){
									ranking[index] = Number(this[0]);
                  alert(this[0]);
		            }
		        })
		    })
		})
	}

	function DrawText(ctx,color,size,font,x,y,word)
	{
		ctx.fillStyle = color;
		ctx.font = size + "px '" + font + "'";
		ctx.fillText(word, x, y + size);
	}

  //タイトル画面移行処理
  function GoToTitle()
  {

  }
	//-----------------------------------------
	// STOPボタン
	//-----------------------------------------
	$("#stop").on("click", function(e){
		var csv = document.getElementById('t');
		alert(csv.rows[0].innerHTML);


		//アニメーションを停止
		window.cancelAnimationFrame(ANIMATION_ID);

		//STARTボタンを有効にする
		$("#start").removeAttr("disabled");

		//次の画面に遷移するのキャンセル
		return(false);
	});

	//-----------------------------------------
	// STARTボタン
	//-----------------------------------------
	$("#start").on("click", function(e){
		//アニメーションを再開する
		update();

		//STARTボタンを無効にする
		$(this).attr("disabled", true);

		//次の画面に遷移するのキャンセル
		return(false);
	});
});
</script>



<h1>ああ</h1>

</body>
</html>
