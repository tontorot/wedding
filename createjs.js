$(function () {
  var canvas = document.getElementById("canvas");

  // Stageオブジェクトを作成します
  var stage = new createjs.Stage("canvas");

  var resize_ratio = 1;
  var container = null;
  var background_image_width = 0;

  var canvas_scaled_width = 0;

  //当たり判定用配列
  //連想配列
  var data ={
      0:{"x":100,"y":150,"is_open":false}
      ,1:{"x":0,"y":0,"is_open":false}
      ,2:{"x":320,"y":240,"is_open":false}
  };

  init();

  createjs.Ticker.setFPS(30);

  createjs.Ticker.addEventListener("tick", function() {
    stage.update(); // 30fpsでステージの描画が更新されるようになる
  });

  canvas.addEventListener('mousedown', onDown, false);
  canvas.addEventListener('touchstart', onTouch, false);
  canvas.addEventListener('mouseup', onUp, false);
  canvas.addEventListener('touchend', onUp, false);
  canvas.addEventListener('mousemove', onMove, false);
  canvas.addEventListener('touchmove', onSwipe, false);
  //canvas.addEventListener('click', onClick, false);
  canvas.addEventListener('mouseover', onOver, false);
  canvas.addEventListener('mouseout', onOut, false);

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
    canvas_scaled_width = 640 * resize_ratio;
    canvas.setAttribute("width", canvas_scaled_width);
    canvas.setAttribute("height", 480 * resize_ratio);

    container = new createjs.Container();
    stage.addChild(container);
    addImage(container, "panorama.JPG", 0, 0);
    //TODO:preload.jsで背景画像を読み込んで、ここで使うようにする
    background_image_width = 2340 * resize_ratio;
    createjs.Touch.enable(stage);
    $("#textbox").text(total_diff_x);
    // Stageの描画を更新します
    stage.update();
  }
  /**
   * @param target_container 画像を載せるコンテナ
   * @param image_name 読み込む画像名
   * @param image_x 画像を配置する座標（画像の左上の座標を参照
   */
  function addImage(target_container,image_name,image_x,image_y)
  {
    var background_image = new createjs.ImageLoader(image_name,false);
    background_image.addEventListener("complete",function() {
      var bitmap = new createjs.Bitmap(image_name);
      console.log(bitmap);
      // console.log(bitmap.image.width,bitmap.image.height);
      // console.log(background_image_width);
      bitmap.setTransform(image_x,image_y,resize_ratio,resize_ratio);
      // console.log(bitmap.image.width,bitmap.image.height);
      target_container.addChild(bitmap);
    });
    background_image.load();
  }
  var in_drag = false;
  var before_x;
  var before_y;
  var after_x;
  var after_y;
  var total_diff_x = 0;
  var total_diff_y = 0;
  function onDown(e) {
    in_drag = true;
    before_x = e.clientX - canvas.offsetLeft;
    openCheck(e.clientX, e.clientY);
    // $("#textbox").text(JSON.stringify(e));
  }
  function onTouch(e) {
    in_drag = true;
    before_x = e.touches[0].clientX - canvas.offsetLeft;
    openCheck(e.touches[0].clientX, e.touches[0].clientY);
    // $("#textbox").text(JSON.stringify(e.touches[0].clientX));
  }
  function onUp(e) {
    in_drag = false;
    // $("#textbox").text("onUp");
  }
  function onMove(e) {
    moveContainer(e.clientX)
  }
  function onSwipe(e) {
    moveContainer(e.touches[0].clientX);
  }
  function moveContainer(x)
  {
    if(in_drag)
    {
      after_x = x - canvas.offsetLeft;
      var diff_x = after_x - before_x;
      total_diff_x += diff_x;
      before_x = after_x;
      var min_total_diff_x = canvas_scaled_width - background_image_width;
      //背景画像が一番左にいたら、それ以上右に引っ張れなくする
      if(total_diff_x > 0)
      {
        total_diff_x = 0;
      }
      //背景画像が一番右にいたら、それ以上左に引っ張れなくする
      else if(total_diff_x < min_total_diff_x)
      {
        total_diff_x = canvas_scaled_width - background_image_width;
      }

      $("#textbox").text(total_diff_x);
      container.setTransform(total_diff_x,0);
      stage.update();
    }
  }
  function onOut() {
    in_drag = false;
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
    var width = 190;
    var height = 190;
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
          addImage(container,"cat_test.png",hit_point_x,hit_point_y);
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
      // var complete_img = new Image();
      // complete_img.src = "complete.jpg";
      // /* 画像を描画 */
      // complete_img.onload = function() {
      //   console.log("img.width = "+complete_img.width);
      //   console.log("img.height = "+complete_img.height);
      //   context.drawImage(complete_img, 320 - complete_img.width/2, 240 - complete_img.height/2);
      // }
      console.log("complete");
    }
  }
  function onOver(e) {
    console.log("mouseover");
  }
});