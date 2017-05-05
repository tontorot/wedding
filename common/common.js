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