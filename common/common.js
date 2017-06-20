var resize_ratio = 1;
var canvas_scaled_width = 0;
var canvas_scaled_height = 0;
var canvas = null;
// Stageオブジェクトを作成します
var stage = null;
var canvas_top_offset = 0;
var canvas_left_offset = 0;
function canvas_init()
{
  canvas = document.getElementById("canvas");
  // Stageオブジェクトを作成します
  stage = new createjs.Stage("canvas");
  var window_width = window.innerWidth;
  var window_height = window.innerHeight;
  var need_width = 1334;
  var need_height = 750;
  if(window_width/window_height > need_width/need_height)
  {
    //想定より横長だったので、縦幅を画面に合わせて、canvasを画面中央にするためちょっと右にずらす
    resize_ratio = window_height / need_height;
    canvas_scaled_width = need_width * resize_ratio;
    canvas_scaled_height = need_height * resize_ratio;
    canvas_left_offset = (window_width - canvas_scaled_width) / 2;
  }
  else
  {
    //想定より縦長だったので、横幅を画面に合わせて、canvasを画面中央にするためちょっと下にずらす
    resize_ratio = window_width / need_width;
    canvas_scaled_width = need_width * resize_ratio;
    canvas_scaled_height = need_height * resize_ratio;
    canvas_top_offset = (window_height - canvas_scaled_height) / 2;
  }
  canvas_scaled_width = need_width * resize_ratio;
  canvas.setAttribute("width", canvas_scaled_width);
  canvas.setAttribute("height", canvas_scaled_height);
  canvas.style.position = "absolute";
  canvas.style.top = canvas_top_offset + "px";
  canvas.style.left = canvas_left_offset + "px";
}


var loaded_image_list = {};
/**
 * @param target_container 画像を載せるコンテナ
 * @param image_name 読み込む画像名
 * @param image_x 画像を配置する座標（画像の左上の座標を参照
 */
function addImage(target_container,image_name,image_x,image_y,optional_resize_ratio = 1)
{
  //画像の左上の座標がimagex,image_yになる
  var added_image = new createjs.Bitmap(loaded_image_list[image_name]);
  added_image.setTransform(image_x*resize_ratio,image_y*resize_ratio,resize_ratio*optional_resize_ratio,resize_ratio*optional_resize_ratio);
  target_container.addChild(added_image);
  return added_image;
}

var prev_ripple_x = 0;
var prev_ripple_y = 0;

//タッチ演出を作る
function showTouchEffect(target_container,x,y)
{console.log("showTouchEffect x:"+x+", y:"+y);
  // 肉球画像をロード
  var bitmap = new createjs.Bitmap('/wedding/images/nikukyu.png');

  // 座標設定
  bitmap.x = x;
  bitmap.y = y;

  // 基準点設定
  bitmap.regX = 200;
  bitmap.regY = 200;

  // サイズ設定
  bitmap.scaleX = 0.2 * resize_ratio;
  bitmap.scaleY = 0.2 * resize_ratio;

  // 前回タップした場所から足跡が延びるように回転
  var diff_x = prev_ripple_x - x;
  var diff_y = prev_ripple_y - y;
  var theta = Math.atan2(diff_y,diff_x);
  bitmap.rotation = theta * 180 / Math.PI - 90;

  // 今回タップした場所を保存
  prev_ripple_x = x;
  prev_ripple_y = y;

  createjs.Tween.get(bitmap).to({alpha: 0}, 2000);
  // stageにBitmapオブジェクトを配置
  target_container.addChild(bitmap);
}