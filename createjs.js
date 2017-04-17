

$(function () {
  var canvas = document.getElementById("canvas");

  // Stageオブジェクトを作成します
  var stage = new createjs.Stage("canvas");

  var image_resize_ratio = 1;
  var cat_list_resize_ratio = 0.3;
  var container = null;
  var container2 = null;
  var background_image_width = 0;
  var background_image_height = 0;

  var canvas_scaled_width = 0;
  var canvas_scaled_height = 0;
  var loaded_image_list = {};

  /**
   * 隠れている猫のデータ
   * @param x ネコ画像を表示する位置。画像の左上のx座標。
   * @param y ネコ画像を表示する位置。画像の左上のy座標。
   * @param image_width ネコ画像の横幅。当たり判定チェックに使う。
   * @param image_height ネコ画像の縦幅。当たり判定チェックに使う。
   * @param hit_offset_x 画面左上の猫リストを表示する位置。
   * @param is_open このねこ画像がすでに見つかったかどうか。
   * @param image_buff addImageしたあとのポインタを格納。画像を削除するときに使う。
   * @param open_image 見つかる猫の画像名。拡張子抜き。
   * @param silhouette_image 見つかる猫のシルエットのの画像名。拡張子抜き。
   * @param discription_image 見つかる猫説明をする画像名。拡張子抜き。
   */
  var hidden_cat_data ={
       "uyu_jiji":{"x":0,  "y":100, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"uyu_jiji", "silhouette_image":"uyu_jiji_silhouette", "discription_image":"cat_discription"}
      ,"uyu_bus" :{"x":200,"y":-480,   "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"uyu_bus",  "silhouette_image":"uyu_bus_silhouette",  "discription_image":"cat_discription"}
      ,"chibi"   :{"x":320,"y":240, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"chibi",    "silhouette_image":"chibi_silhouette",    "discription_image":"cat_discription"}
      ,"milk"    :{"x":400,"y":320, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"milk",     "silhouette_image":"milk_silhouette",     "discription_image":"cat_discription"}
    };
  // 今何階にいるか。初期値1階。
  var now_floor = 1;
  // 2Fに上がるための当たり判定
  var to_upstairs_rectangle = {"x":1000,"y":200,"width":132, "height":162};
  var to_downstairs_rectangle = {"x":1000,"y":-280,"width":132, "height":162};

  var cat_discription_image = null;
  var hit_offset_x = 20;
  var hit_offset_y = 20;

  var is_touch_forbidden = false;
  var keeped_cat_index = null;
  // LoadQueueのインスタンス作成
  // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
  var queue = new createjs.LoadQueue(true);

  var BACKGROUND_IMAGE_0F = "0F_white";
  var BACKGROUND_IMAGE_1F = "1F";
  var BACKGROUND_IMAGE_2F = "2F";
  var COMPLETE_IMAGE = "complete";
  // 読み込むファイルの登録。
  var manifest = [
      {"src":BACKGROUND_IMAGE_0F+".png","id":BACKGROUND_IMAGE_0F},
      {"src":BACKGROUND_IMAGE_1F+".png","id":BACKGROUND_IMAGE_1F},
      {"src":BACKGROUND_IMAGE_2F+".png","id":BACKGROUND_IMAGE_2F},
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

  // 画面幅が変わったとき、キャンバスサイズを変更するためのイベントを追加
  var resize_queue = null;
  var resize_container = document.getElementById("canvasContainer");
  setCanvasSize();
  window.addEventListener("resize", function() {
    console.log("container1 size = ("+resize_container.offsetWidth+","+resize_container.offsetHeight+")");

    clearTimeout( resize_queue );
    resize_queue = setTimeout(function() {
      setCanvasSize();
    }, 300 );
  }, false );

  function setCanvasSize() {
    canvas.width = resize_container.offsetWidth;
    canvas.height = resize_container.offsetHeight;
    canvas_scaled_width = canvas.width;
  }


  // ファイルが1つ読込完了すると呼ばれる。引数にファイルの読込結果を含むオブジェクトが渡される
  function handleFileLoad(event){
    // .itemにはファイルの情報が格納されています。詳細は後述
    // 読み込んだ画像が猫画像のとき
    if(hidden_cat_data[event.item.id])
    {
      // 読み込んだ画像がネコ画像であったなら、その画像の横幅・縦幅の情報を更新
      hidden_cat_data[event.item.id]["image_width"] = event.result.width;
      hidden_cat_data[event.item.id]["image_height"] = event.result.height;
    }
    if(event.item.type === createjs.LoadQueue.IMAGE){
      loaded_image_list[event.item.id] = event.result;
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
    canvas.addEventListener('touchstart', touchStart, false);
    canvas.addEventListener('mouseup', onUp, false);
    canvas.addEventListener('touchend', touchEnd, false);
    canvas.addEventListener('mousemove', onMove, false);
    canvas.addEventListener('touchmove', onSwipe, false);
    //canvas.addEventListener('click', onClick, false);
    canvas.addEventListener('mouseover', onOver, false);
    canvas.addEventListener('mouseout', onOut, false);

    var window_width = window.innerWidth;
    var window_height = window.innerHeight;
    if(window_width > window_height)
    {
      image_resize_ratio = window_height / 480;
    }
    else
    {
      image_resize_ratio = window_width / 640;
    }
    // console.log("image_resize_ratio = "+image_resize_ratio);
    // canvas_scaled_width = 640 * image_resize_ratio;
    // canvas.setAttribute("width", canvas_scaled_width);
    // canvas.setAttribute("height", 480 * image_resize_ratio);

    container = new createjs.Container();
    container2 = new createjs.Container();
    stage.addChild(container);
    stage.addChild(container2);
    addImage(container, BACKGROUND_IMAGE_1F, 0, 0);

    // 猫分布を表示。隠れてる猫と同じ数だけ
    $.each(hidden_cat_data,function(index,hidden_cat){
      added_image = addImage(container2, hidden_cat["silhouette_image"], hit_offset_x, hit_offset_y, cat_list_resize_ratio);
      hidden_cat_data[index]["image_buff"] = added_image;
      hidden_cat_data[index]["hit_offset_x"] = hit_offset_x;
      hit_offset_x += added_image.getBounds().width * cat_list_resize_ratio;
    });
    background_image_width = loaded_image_list[BACKGROUND_IMAGE_1F].width * image_resize_ratio;
    background_image_height = loaded_image_list[BACKGROUND_IMAGE_1F].height * image_resize_ratio;

    // 1F画像の高さがわかったので、2F画像を仕込んでおく。
    addImage(container, BACKGROUND_IMAGE_2F, 0, -loaded_image_list[BACKGROUND_IMAGE_1F].height);
    // 2F画像を表示すると、1F画像が下に表示されたままになってしまう。これを隠すために、コンテナ2に白い画像を置いておく。
    addImage(container2, BACKGROUND_IMAGE_0F, 0,  loaded_image_list[BACKGROUND_IMAGE_1F].height);

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
    added_image.setTransform(image_x*image_resize_ratio,image_y*image_resize_ratio,image_resize_ratio*optional_resize_ratio,image_resize_ratio*optional_resize_ratio);
    target_container.addChild(added_image);
    return added_image;
  }

  var in_drag = false;
  var before_x_for_move_container;
  var total_diff_x = 0;
  var total_diff_y = 0;
  function onDown(e) {
    in_drag = true;
    before_x_for_move_container = e.clientX - canvas.offsetLeft;
    before_x_for_click = before_x_for_move_container;
  }
  function touchStart(e) {
    in_drag = true;
    before_x_for_move_container = e.touches[0].clientX - canvas.offsetLeft;
    before_x_for_click = before_x_for_move_container;
  }
  function onUp(e) {
    in_drag = false;
    var touched_x = e.clientX - total_diff_x;
    var touched_y = e.clientY - total_diff_y;
    var calc_right = e.clientX - canvas.offsetLeft; 
    if(before_x_for_click == calc_right)
    {
      openCheck(touched_x, touched_y);
      change_floor(touched_x, touched_y);
    }
  }
  function touchEnd(e) {
    in_drag = false;
    var touched_x = e.touches[0].clientX - total_diff_x;
    var touched_y = e.touches[0].clientY - total_diff_y;
    var calc_right = e.touches[0].clientX - canvas.offsetLeft;
    if(before_x_for_click == calc_right)
    {
      openCheck(touched_x, touched_y);
      change_floor(touched_x, touched_y);
    }
  }
  function onMove(e) {
    moveContainer_x(e.clientX)
  }
  function onSwipe(e) {
    moveContainer_x(e.touches[0].clientX);
  }
  function moveContainer_x(x)
  {
    if(in_drag)
    {
      var after_x = x - canvas.offsetLeft;
      var diff_x = after_x - before_x_for_move_container;
      total_diff_x += diff_x;
      before_x_for_move_container = after_x;
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
      container.setTransform(total_diff_x,total_diff_y);
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

  var is_change_floor_forbidden = false;
  function change_floor(x,y)
  {
    //　二重発火対策
    if(is_change_floor_forbidden)
    {
      return;
    }
    is_change_floor_forbidden = true;
    switch(now_floor)
    {
      case 1:
        // 2Fへ向かう当たり判定を踏んでいたら、2Fへ移動
        if(to_upstairs_rectangle["x"] * image_resize_ratio < x &&
           x < (to_upstairs_rectangle["x"] + to_upstairs_rectangle["width"]) * image_resize_ratio &&
           to_upstairs_rectangle["y"] * image_resize_ratio < y &&
           y < (to_upstairs_rectangle["y"] + to_upstairs_rectangle["height"]) * image_resize_ratio)
        {
          createjs.Tween.get(container).to({y:background_image_height}, 1000);
          total_diff_y = background_image_height;
          now_floor = 2;
          stage.update();
        }
        break;
      case 2:
        // 1Fへ向かう当たり判定を踏んでいたら、1Fへ移動
        if(to_downstairs_rectangle["x"] * image_resize_ratio < x &&
           x < (to_downstairs_rectangle["x"] + to_downstairs_rectangle["width"]) * image_resize_ratio &&
           to_downstairs_rectangle["y"] * image_resize_ratio < y &&
           y < (to_downstairs_rectangle["y"] + to_downstairs_rectangle["height"]) * image_resize_ratio)
        {
          createjs.Tween.get(container).to({y:0}, 1000);
          total_diff_y = 0;
          now_floor = 1;
          stage.update();
        }
        break;
    }
    var hoge = setInterval(function() {
      is_change_floor_forbidden = false;
      clearInterval(hoge);
    }, 1000);
    console.log("total_diff_y = "+total_diff_y);

  }
  function openCheck(x,y)
  {
    console.log("openCheck(x,y) = ("+x+","+y+")");
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
    for(var index in hidden_cat_data)
    {
      var hidden_cat = hidden_cat_data[index];
      if(is_once_open)
      {
        continue;
      }
      if(hidden_cat["is_open"])
      {
        continue;
      }
      var cat_image_width = hidden_cat["image_width"] * image_resize_ratio; //クリックされた位置にでるネコ画像の横幅
      var cat_image_height = hidden_cat["image_height"] * image_resize_ratio; //クリックされた位置にでるネコ画像の縦幅
      var hit_point_x = hidden_cat["x"] * image_resize_ratio; //画像左上のx座標
      var hit_point_y = hidden_cat["y"] * image_resize_ratio; //画像左上のy座標

      // 画像もresize_ratioの分引き伸ばされているので、それを加味した当たり判定チェック
      if( hit_point_x < x && x < hit_point_x + cat_image_width &&
          hit_point_y < y && y < hit_point_y + cat_image_height)
      {
        // 探し当てられた猫を表示する
        var get_cat = addImage(container,hidden_cat["open_image"],hidden_cat["x"],hidden_cat["y"]);
        // この猫は見つけられたというフラグを立てる
        hidden_cat["is_open"] = true;
        is_once_open = true;

        is_touch_forbidden = true;
        // 1秒後に説明を表示する猫番号を一時変数に格納
        keeped_cat_index = index;
        // 1秒後に猫説明を表示
        var hoge = setInterval(function() {
          // 見つかった猫は消して
          container.removeChild(get_cat);
          // 猫の説明を表示する
          cat_discription_image = addImage(container2, hidden_cat["discription_image"], 0, 0);
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