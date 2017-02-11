$(function () {
  var canvas = document.getElementById("canvas");
  //背景画像の取り込み
  var context = canvas.getContext('2d');
  var background_img = new Image();
  background_img.src = "image.jpg";
  context.drawImage(background_img,0,0);
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
    drawCat(x, y);
  }
  function onOver(e) {
    console.log("mouseover");
  }
  function onOut() {
    console.log("mouseout");
  }
  function drawCat(x, y) {
//    context.fillRect(x, y, width, height);
    var img = new Image();
    img.src = "cat_test.png";
    var width = 190;
    var height = 190;
    /* 画像を描画 */
    context.drawImage(img, x - width/2, y - height/2);
  }
  canvas.addEventListener('mousedown', onDown, false);
  canvas.addEventListener('mouseup', onUp, false);
  canvas.addEventListener('click', onClick, false);
  canvas.addEventListener('mouseover', onOver, false);
  canvas.addEventListener('mouseout', onOut, false);
  canvas.addEventListener('touchstart', onDown, false);
  canvas.addEventListener('touchend', onUp, false);
});
