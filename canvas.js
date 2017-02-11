$(function () {
  var canvas = document.getElementById("canvas");
  //背景画像の取り込み
  var context = canvas.getContext('2d');
  var background_img = new Image();
  background_img.src = "image.jpg";
  background_img.onload = function() {
    context.drawImage(background_img,0,0);
  }
  //当たり判定用配列
  //連想配列
  var data ={
      0:{"x":100,"y":150,"is_open":false}
      ,1:{"x":0,"y":0,"is_open":false}
      ,2:{"x":320,"y":240,"is_open":false}
  };

  var width = 190;
  var height = 190;

  function onDown(e) {
    console.log("down");
  }
  function onUp(e) {
    console.log("up");
  }
  function onClick(e) {
    console.log("click");
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    console.log("x:", x, "y:", y);
    openCheck(x,y);
  }
  function openCheck(x,y)
  {
    var is_complete = true;
    for(var key in data)
    {
      if(!data[key]["is_open"])
      {
        var hit_point_x = data[key]["x"];
        var hit_point_y = data[key]["y"];
        if( hit_point_x - width/2 < x && x < hit_point_x + width/2 &&
            hit_point_y - height/2 < y && y < hit_point_y + height/2)
        {
          console.log("is_clicked, drawCat at ("+hit_point_x+","+hit_point_y+")");
          drawCat(hit_point_x,hit_point_y);
          data[key]["is_open"] = true;
        }
        else
        {
          is_complete = false;
        }
      }
    }
    //フラグが折れていなかったら、complete画像を表示
    if(is_complete)
    {
      var complete_img = new Image();
      complete_img.src = "complete.jpg";
      /* 画像を描画 */
      complete_img.onload = function() {
        console.log("img.width = "+complete_img.width);
        console.log("img.height = "+complete_img.height);
        context.drawImage(complete_img, 320 - complete_img.width/2, 240 - complete_img.height/2);
      }
    }
  }
  function onOver(e) {
    console.log("mouseover");
  }
  function onOut() {
    console.log("mouseout");
  }
  function drawCat(x, y) {
    var img = new Image();
    img.src = "cat_test.png";
    //gifは動かなかった
    //img.src = "mew_cat.gif";
    /* 画像を描画 */
    img.onload = function() {
      context.drawImage(img, x - width/2, y - height/2);
    }
  }
  canvas.addEventListener('mousedown', onDown, false);
  canvas.addEventListener('mouseup', onUp, false);
  canvas.addEventListener('click', onClick, false);
  canvas.addEventListener('mouseover', onOver, false);
  canvas.addEventListener('mouseout', onOut, false);
  canvas.addEventListener('touchstart', onDown, false);
  canvas.addEventListener('touchend', onUp, false);
});
