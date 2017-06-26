function loadTextFile(){
$(function(){
    $.get('ranking.csv',function(data){
        var csv = $.csv()(data);
        //indexを使ってくり返し回数をカウントします
        $(csv).each(function(index){
          /*
            //indexが0の場合はタイトル行なのでリンク無し、それ以外はリンクを作成
            if(index == 0){
                if(this[0] && this[1] && this[2]){
                    $("#result table").append("<tr><td>"+this[0]+"</td><td>"+this[2]+"</td></tr>");
                }
            } else {
                if(this[0] && this[1] && this[2]){
                    $("#result table").append("<tr><td>"+this[0]+"</td><td><a href=\""+this[1]+"\">"+this[2]+"</a></td></tr>");
                }
            }
            */
            //indexが0の場合はタイトル行なのでリンク無し、それ以外はリンクを作成
            if(this[0] && this[1] && this[2]){
                $("#result table").append("<tr><td>"+this[0]+"</td></tr>");
            }


        })
    })
})
}

function LoadCSVResultScene(){
$(function(){
    $.get('ranking.csv',function(data){
        var csv = $.csv()(data);
        $(csv).each(function(index){
            if(this[0]){
                $("#csv table").append("<tr><td>"+this[0]+"</td></tr>");
            }
        })
    })
})

}

function SaveCSVResultScene(){
  var fs = WScript.CreateObject("Scripting.FileSystemObject");
  fs.CreateTextFile("test.txt");

  var file = fs.OpenTextFile("test.txt", 2, 0);
  file.Write("Hello !")

  file.Close();
}
