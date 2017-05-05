var resize_ratio = 1;
var canvas_scaled_width = 0;
var canvas_scaled_height = 0;
var canvas = null;
// Stageオブジェクトを作成します
var stage = null;
function canvas_init()
{
  canvas = document.getElementById("canvas");
  // Stageオブジェクトを作成します
  stage = new createjs.Stage("canvas");
  var window_width = window.innerWidth;
  var window_height = window.innerHeight;
  var need_width = 1334;
  var need_height = 750;
  var canvas_top = 0;
  var canvas_left = 0;
  if(window_width/window_height > need_width/need_height)
  {
    //想定より横長だったので、縦幅を画面に合わせて、canvasを画面中央にするためちょっと右にずらす
    resize_ratio = window_height / need_height;
    canvas_scaled_width = need_width * resize_ratio;
    canvas_scaled_height = need_height * resize_ratio;
    canvas_left = (window_width - canvas_scaled_width) / 2;
  }
  else
  {
    //想定より縦長だったので、横幅を画面に合わせて、canvasを画面中央にするためちょっと下にずらす
    resize_ratio = window_width / need_width;
    canvas_scaled_width = need_width * resize_ratio;
    canvas_scaled_height = need_height * resize_ratio;
    canvas_top = (window_height - canvas_scaled_height) / 2;
  }
  canvas_scaled_width = need_width * resize_ratio;
  canvas.setAttribute("width", canvas_scaled_width);
  canvas.setAttribute("height", canvas_scaled_height);
  canvas.style.position = "absolute";
  canvas.style.top = canvas_top + "px";
  canvas.style.left = canvas_left + "px";
}