

$(function () {
  var canvas = document.getElementById("canvas");

  // Stageオブジェクトを作成します
  var stage = new createjs.Stage("canvas");

  var canvas_resize_ratio = 1;
  var cat_list_resize_ratio = 0.3;
  var container = null;
  var container2 = null;
  var background_image_width = 0;

  var canvas_scaled_width = 0;
  var loaded_image_list = {};

  //当たり判定用配列
  //連想配列
  var hidden_cat_data ={
       0:{"x":0,  "y":100, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"uyu_jiji", "silhouette_image":"uyu_jiji_silhouette", "discription_image":"cat_discription"}
      ,1:{"x":200,"y":0,   "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"uyu_bus",  "silhouette_image":"uyu_bus_silhouette",  "discription_image":"cat_discription"}
      ,2:{"x":320,"y":240, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"chibi",    "silhouette_image":"chibi_silhouette",    "discription_image":"cat_discription"}
      ,3:{"x":400,"y":320, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"milk",     "silhouette_image":"milk_silhouette",     "discription_image":"cat_discription"}
    };
  var cat_discription_image = null;
  var hit_offset_x = 20;
  var hit_offset_y = 20;

  var is_touch_forbidden = false;
  var keeped_cat_index = null;
  // LoadQueueのインスタンス作成
  // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
  var queue = new createjs.LoadQueue(true);

  var BACKGROUND_IMAGE = "panorama";
  var COMPLETE_IMAGE = "complete";
  // 読み込むファイルの登録。
  var manifest = [
      {"src":BACKGROUND_IMAGE+".JPG","id":BACKGROUND_IMAGE},
      {"src":COMPLETE_IMAGE+".jpg","id":COMPLETE_IMAGE},
  ];
  for(var index in hidden_cat_data)
  {
    var open_image_name = hidden_cat_data[index]["open_image"];
    var silhouette_image_name = hidden_cat_data[index]["silhouette_image"];
    var discription_image_name = hidden_cat_data[index]["discription_image"];
    manifest.push({"src":open_image_name+".png","id":open_image_name});
    manifest.push({"src":silhouette_image_name+".png","id":silhouette_image_name});
    manifest.push({"src":discription_image_name+".png","id":discription_image_name});
  }

  // manifestの読込
  queue.loadManifest(manifest,true);

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
      canvas_resize_ratio = window_height / 480;
    }
    else
    {
      canvas_resize_ratio = window_width / 640;
    }
    console.log("canvas_resize_ratio = "+canvas_resize_ratio);
    canvas_scaled_width = 640 * canvas_resize_ratio;
    canvas.setAttribute("width", canvas_scaled_width);
    canvas.setAttribute("height", 480 * canvas_resize_ratio);

    container = new createjs.Container();
    container2 = new createjs.Container();
    stage.addChild(container);
    stage.addChild(container2);
    addImage(container, BACKGROUND_IMAGE, 0, 0);

    // 猫分布を表示。隠れてる猫と同じ数だけ
    $.each(hidden_cat_data,function(index,hidden_cat){
      added_image = addImage(container2, hidden_cat["silhouette_image"], hit_offset_x, hit_offset_y, cat_list_resize_ratio);
      hidden_cat_data[index]["image_buff"] = added_image;
      hidden_cat_data[index]["hit_offset_x"] = hit_offset_x;
      hit_offset_x += added_image.getBounds().width * canvas_resize_ratio * cat_list_resize_ratio;
    });
    background_image_width = loaded_image_list[BACKGROUND_IMAGE].width * canvas_resize_ratio;
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
  function addImage(target_container,image_name,image_x,image_y,optional_resize_ratio=1)
  {
    //画像の左上の座標がimagex,image_yになる
    var added_image = new createjs.Bitmap(loaded_image_list[image_name]);
    added_image.setTransform(image_x*canvas_resize_ratio,image_y*canvas_resize_ratio,canvas_resize_ratio*optional_resize_ratio,canvas_resize_ratio*optional_resize_ratio);
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
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
  }
  function openCheck(x,y)
  {
    if(is_touch_forbidden)
    {
      return;
    }
    //猫の説明画面が出ていれば、それを削除する
    var ret = container2.removeChild(cat_discription_image);
    if(ret)
    {
      is_complete();
      // ダンボール画像を削除して、開封後画像に置換
      container2.removeChild(hidden_cat_data[keeped_cat_index]["image_buff"]);
      added_image = addImage(container2, hidden_cat_data[keeped_cat_index]["open_image"], hidden_cat_data[keeped_cat_index]["hit_offset_x"], hit_offset_y, cat_list_resize_ratio);
      // 猫の説明画像が出ていて、削除された場合は、以降の猫探索処理を実行しない
      return;
    }
    keeped_cat_index = null;
    var is_once_open = false;
    var width = 190; //クリックされた位置にでるネコ画像の横幅
    var height = 190; //クリックされた位置にでるネコ画像の縦幅
    for(var index in hidden_cat_data)
    {
      if(is_once_open)
      {
        continue;
      }
      if(hidden_cat_data[index]["is_open"])
      {
        continue;
      }
      var hit_point_x = hidden_cat_data[index]["x"]; //画像左上のx座標
      var hit_point_y = hidden_cat_data[index]["y"]; //画像左上のy座標
      // 画像もresize_ratioの分引き伸ばされているので、それを加味した当たり判定チェック
      if( hit_point_x < x && x < hit_point_x + width * canvas_resize_ratio &&
          hit_point_y < y && y < hit_point_y + height * canvas_resize_ratio)
      {
        // 探し当てられた猫を表示する
        var get_cat = addImage(container,hidden_cat_data[index]["open_image"],hit_point_x,hit_point_y);
        // この猫は見つけられたというフラグを立てる
        hidden_cat_data[index]["is_open"] = true;
        is_once_open = true;

        is_touch_forbidden = true;
        // 1秒後に説明を表示する猫番号を一時変数に格納
        keeped_cat_index = index;
        // 1秒後に猫説明を表示
        var hoge = setInterval(function() {
          // 見つかった猫は消して
          container.removeChild(get_cat);
          // 猫の説明を表示する
          cat_discription_image = addImage(container2, hidden_cat_data[index]["discription_image"], 0, 0);
          is_touch_forbidden = false;
          clearInterval(hoge);
        }, 1000);
      }
    }
  }
  //猫画像がすべてオープンになっているかチェックする
  function is_complete()
  {
    for(var index in hidden_cat_data)
    {
      if(!hidden_cat_data[index]["is_open"])
      {
        return false;
      }
    }
    addImage(container,COMPLETE_IMAGE,640/2,480/2);
    return true;
  }
  function onOver(e) {
    console.log("mouseover");
  }
});