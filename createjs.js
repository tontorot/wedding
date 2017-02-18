$(function () {
  var canvas = document.getElementById("canvas");

  // Stageオブジェクトを作成します
  var stage = new createjs.Stage("canvas");

  var resize_ratio = 1;
  var container = null;

  init();

  createjs.Ticker.setFPS(30);

  createjs.Ticker.addEventListener("tick", function() {
    stage.update(); // 30fpsでステージの描画が更新されるようになる
  });

  canvas.addEventListener('mousedown', onDown, false);
  canvas.addEventListener('mouseup', onUp, false);
  canvas.addEventListener('click', onClick, false);
  canvas.addEventListener('mouseover', onOver, false);
  canvas.addEventListener('mouseout', onOut, false);
  canvas.addEventListener('touchstart', onDown, false);
  canvas.addEventListener('touchend', onUp, false);

  function init() {
    var window_width = window.innerWidth;
    var window_height = window.innerHeight;
    if(window_width > window_height)
    {
      resize_ratio = window_height / 480;
    }
    else
    {
      resize_ratio = window_width / 640;
    }
    console.log("resize_ratio = "+resize_ratio);
    canvas.setAttribute("width", 640 * resize_ratio);
    canvas.setAttribute("height", 480 * resize_ratio);

    container = new createjs.Container();
    stage.addChild(container);
    //画像ローダークラスでチェック
    var background_image = new createjs.ImageLoader("panorama.JPG",false);
    background_image.addEventListener("complete",function() {
      var bitmap = new createjs.Bitmap("panorama.JPG");
      bitmap.setTransform(0,0,resize_ratio,resize_ratio);
      container.addChild(bitmap);
    });
    background_image.load();
    // Stageの描画を更新します
    stage.update();
  }

  var before_x;
  var before_y;
  var after_x;
  var after_y;
  var total_diff_x = 0;
  var total_diff_y = 0;
  function onDown(e) {
    before_x = e.clientX - canvas.offsetLeft;
    before_y = e.clientY - canvas.offsetTop;
    console.log("before_x:", before_x, "before_y:", before_y);
    console.log("down");
  }
  function onUp(e) {
    after_x = e.clientX - canvas.offsetLeft;
    after_y = e.clientY - canvas.offsetTop;
    console.log("after_x:", after_x, "after_y:", after_y);
    var diff_x = after_x - before_x;
    var diff_y = after_y - before_y;
    total_diff_x += diff_x;
    total_diff_y += diff_y;
    before_x = 0;
    before_y = 0;
    after_x = 0;
    after_y = 0;
    console.log("up "+diff_x+","+diff_y);
    container.setTransform(total_diff_x,0);
    stage.update();
  }
  function onClick(e) {
    // console.log("click");
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    // console.log("x:", x, "y:", y);
    //openCheck(x,y);
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
    // console.log("mouseover");
  }
  function onOut() {
    // console.log("mouseout");
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
});