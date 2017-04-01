

$(function () {
  var canvas = document.getElementById("canvas");

  // Stageオブジェクトを作成します
  var stage = new createjs.Stage("canvas");

  var resize_ratio = 1;
  var container = null;
  var container2 = null;
  var background_image_width = 0;

  var canvas_scaled_width = 0;
  var loaded_image_list = {};

  //当たり判定用配列
  //連想配列
  var data ={
      0:{"x":0,"y":0,"is_open":false}
      ,1:{"x":200,"y":0,"is_open":false}
      ,2:{"x":320,"y":240,"is_open":false}
  };
  var child_data = {};
  var hit_width = 118;
  var hit_offset_x = 20;
  var hit_offset_y = 20;

  // LoadQueueのインスタンス作成
  // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
  var queue = new createjs.LoadQueue(true);

  var BACKGROUND_IMAGE = "panorama";
  var CAT_IMAGE = "cat_test";
  var DANBORU_IMAGE = "danbo-ru";
  var DANBORU_CAT_IMAGE = "danbo-rucat";
  var COMPLETE_IMAGE = "complete";
  // 読み込むファイルの登録。
  var manifest = [
      {"src":BACKGROUND_IMAGE+".JPG","id":BACKGROUND_IMAGE},
      {"src":CAT_IMAGE+".png","id":CAT_IMAGE},
      {"src":DANBORU_IMAGE+".jpg","id":DANBORU_IMAGE},
      {"src":DANBORU_CAT_IMAGE+".jpg","id":DANBORU_CAT_IMAGE},
      {"src":COMPLETE_IMAGE+".jpg","id":COMPLETE_IMAGE},
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
    container2 = new createjs.Container();
    stage.addChild(container);
    stage.addChild(container2);
    addImage(container, BACKGROUND_IMAGE, 0, 0);

    // ダンボール画像を表示。隠れてる猫と同じ数だけ
    $.each(data,function(index,val){
      console.log("index = "+index);
      added_image = addImage(container2, DANBORU_IMAGE, hit_offset_x + index * hit_width, hit_offset_y);
      child_data[index] = added_image;
    });
    background_image_width = loaded_image_list[BACKGROUND_IMAGE].width * resize_ratio;
    createjs.Touch.enable(stage);
    // TODO:デバコマ 削除予定
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
    //画像の左上の座標がimagex,image_yになる
    var added_image = new createjs.Bitmap(loaded_image_list[image_name]);
    added_image.setTransform(image_x,image_y,resize_ratio,resize_ratio);
    target_container.addChild(added_image);
    return added_image;
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
    console.log("(x,y) = ("+e.clientX+","+e.clientY+")");
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
    var is_once_open = false;
    var width = 190; //クリックされた位置にでるネコ画像の横幅
    var height = 190; //クリックされた位置にでるネコ画像の縦幅
    for(var index in data)
    {
      if(is_once_open)
      {
        continue;
      }
      if(data[index]["is_open"])
      {
        continue;
      }
      var hit_point_x = data[index]["x"]; //画像左上のx座標
      var hit_point_y = data[index]["y"]; //画像左上のy座標
      // 画像もresize_ratioの分引き伸ばされているので、それを加味した当たり判定チェック
      if( hit_point_x < x && x < hit_point_x + width * resize_ratio &&
          hit_point_y < y && y < hit_point_y + height * resize_ratio)
      {
        console.log("is_clicked, drawCat at ("+hit_point_x+","+hit_point_y+")");
        // 探し当てられた猫を表示する
        addImage(container,CAT_IMAGE,hit_point_x,hit_point_y);
        // ダンボール画像を削除して、開封後画像に置換
        container2.removeChild(child_data[index]);
        added_image = addImage(container2, DANBORU_CAT_IMAGE, hit_offset_x + index * hit_width, hit_offset_y);
        // この猫は見つけられたというフラグを立てる
        data[index]["is_open"] = true;
        is_once_open = true;
      }
    }
    //フラグが折れていなかったら、complete画像を表示
    if(is_complete())
    {
      // 達成画像を表示。時間差いれてもいいかも
      addImage(container,COMPLETE_IMAGE,640/2,480/2);
      console.log("complete");
    }
  }
  //猫画像がすべてオープンになっているかチェックする
  function is_complete()
  {
    var is_complete = true;
    for(var index in data)
    {
      if(!data[index]["is_open"])
      {
        is_complete = false;
      }
    }
    return is_complete;
  }
  function onOver(e) {
    console.log("mouseover");
  }
});