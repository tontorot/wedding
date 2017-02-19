

$(function () {
  var canvas = document.getElementById("canvas");

  // Stageオブジェクトを作成します
  var stage = new createjs.Stage("canvas");

  var resize_ratio = 1;
  var container = null;
  var background_image_width = 0;

  var canvas_scaled_width = 0;
  var loaded_image_list = {};

  //当たり判定用配列
  //連想配列
  var data ={
      0:{"x":100,"y":150,"is_open":false}
      ,1:{"x":0,"y":0,"is_open":false}
      ,2:{"x":320,"y":240,"is_open":false}
  };

  // LoadQueueのインスタンス作成
  // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
  var queue = new createjs.LoadQueue(true);

  // 読み込むファイルの登録。
  var manifest = [
      {"src":"panorama.JPG","id":"background_image"},
      {"src":"cat_test.png","id":"cat"},
  ];
  // src,idともに省略可能。省略した場合はパスがsrcとidにセットされる
  // var manifest = ["./image1.jpg","./image2.jpg","./image3.jpg"];

  // manifestの読込
  queue.loadManifest(manifest,true);
  // 任意のタイミングで読込を開始したい場合、第2引数にfalseを指定し、queue.load()を実行する
  // queue.loadManifest(manifest,false);
  // queue.load();

  // ファイルが1つ読込完了するたびにfileloadイベントが発生
  // fileloadイベントにメソッドを割り当てる
  queue.addEventListener("fileload",handleFileLoad);  
  // 全ファイルの読み込みが終わった時completeイベントが発生する
  queue.addEventListener("complete",handleComplete);

  // ファイルが1つ読込完了すると呼ばれる。引数にファイルの読込結果を含むオブジェクトが渡される
  function handleFileLoad(event){
    // .itemにはファイルの情報が格納されています。詳細は後述
    var item = event.item;
    if(item.type === createjs.LoadQueue.IMAGE){
      loaded_image_list[item.id] = event.result;
    }
  }

  // ファイルがすべて読込完了すると呼ばれる
  function handleComplete(event){
    // completeハンドラに渡される引数が持っているgetResult()にidを指定してファイルオブジェクトを取得する
    // var file = event.getResult(id); manifestで指定したid
    init();
  }


  function init() {
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
    addImage(container, "background_image", 0, 0);
    //TODO:preload.jsで背景画像を読み込んで、ここで使うようにする
    background_image_width = loaded_image_list["background_image"].width * resize_ratio;
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
    var added_image = new createjs.Bitmap(loaded_image_list[image_name]);
    added_image.setTransform(image_x,image_y,resize_ratio,resize_ratio);
    target_container.addChild(added_image);
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
          addImage(container,"cat",hit_point_x,hit_point_y);
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