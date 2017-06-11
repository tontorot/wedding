

$(function () {
  var canvas = document.getElementById("canvas");

  // Stageオブジェクトを作成します
  var stage = new createjs.Stage("canvas");

  var cat_list_resize_ratio = 0.3;
  var container = null;
  var container2 = null;
  var background_image_width = 0;
  var background_image_height = 0;

  var canvas_scaled_width = 0;
  var canvas_scaled_height = 0;

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
       "uyu_jiji":{"x":0,  "y":100, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"uyu_jiji",  "discription_image":"cat_discription"}
      ,"uyu_bus" :{"x":200,"y":-480,   "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"uyu_bus","discription_image":"cat_discription"}
      ,"chibi"   :{"x":320,"y":240, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"chibi",     "discription_image":"cat_discription"}
      ,"milk"    :{"x":400,"y":320, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "image_buff":null, "open_image":"milk",      "discription_image":"cat_discription"}
    };
  // 今何階にいるか。初期値1階。
  var now_floor = 1;
  // 2Fに上がるための当たり判定
  var to_upstairs_rectangle = {"x":1000,"y":200,"width":132, "height":162};
  var to_downstairs_rectangle = {"x":1000,"y":-280,"width":132, "height":162};

  var cat_discription_image = null;
  var progress_image = null;
  var hit_offset_x = 20;
  var hit_offset_y = 20;

  var is_touch_forbidden = false;
  var keeped_cat_index = null;
  // LoadQueueのインスタンス作成
  // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
  var queue = new createjs.LoadQueue(true);

  var BACKGROUND_IMAGE_0F = "game_0F";
  var BACKGROUND_IMAGE_1F = "game_1F";
  var BACKGROUND_IMAGE_2F = "game_2F";
  var COMPLETE_IMAGE = "complete";
  var ARROW_TOP_IMAGE = "top_arrow";
  var ARROW_BOTTOM_IMAGE = "bottom_arrow";
  var IMAGE_DIR = "/wedding/images/";
  // 読み込むファイルの登録。
  var manifest = [
      {"src":IMAGE_DIR+BACKGROUND_IMAGE_0F+".jpg","id":BACKGROUND_IMAGE_0F},
      {"src":IMAGE_DIR+BACKGROUND_IMAGE_1F+".jpg","id":BACKGROUND_IMAGE_1F},
      {"src":IMAGE_DIR+BACKGROUND_IMAGE_2F+".jpg","id":BACKGROUND_IMAGE_2F},
      {"src":IMAGE_DIR+COMPLETE_IMAGE+".jpg","id":COMPLETE_IMAGE},
      {"src":IMAGE_DIR+"0_4.png","id":"0_4"},
      {"src":IMAGE_DIR+"1_4.png","id":"1_4"},
      {"src":IMAGE_DIR+"2_4.png","id":"2_4"},
      {"src":IMAGE_DIR+"3_4.png","id":"3_4"},
      {"src":IMAGE_DIR+"3_4.png","id":"4_4"},
      {"src":IMAGE_DIR+ARROW_TOP_IMAGE+".png","id":ARROW_TOP_IMAGE},
      {"src":IMAGE_DIR+ARROW_BOTTOM_IMAGE+".png","id":ARROW_BOTTOM_IMAGE},
  ];
  for(var index in hidden_cat_data)
  {
    var open_image_name = hidden_cat_data[index]["open_image"];
    var discription_image_name = hidden_cat_data[index]["discription_image"];
    manifest.push({"src":IMAGE_DIR+open_image_name+".png","id":open_image_name});
    manifest.push({"src":IMAGE_DIR+discription_image_name+".jpg","id":discription_image_name});
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
    // 読み込んだ画像が猫画像のとき
console.log(event.item.id + " = " + event.result.width);
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
    canvas_init();
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

    container = new createjs.Container();
    container2 = new createjs.Container();
    stage.addChild(container);
    stage.addChild(container2);
    addImage(container, BACKGROUND_IMAGE_1F, 0, 0);
console.log("resize_ratioa = "+resize_ratio);
console.log("resize_ratio = "+resize_ratio);
    background_image_width = loaded_image_list[BACKGROUND_IMAGE_1F].width * resize_ratio;
    background_image_height = loaded_image_list[BACKGROUND_IMAGE_1F].height * resize_ratio;
console.log("background_image_width = "+background_image_width);
    // 1F画像の高さがわかったので、2F画像を仕込んでおく。
    addImage(container, BACKGROUND_IMAGE_2F, 0, -loaded_image_list[BACKGROUND_IMAGE_1F].height);
    // 2F画像を表示すると、1F画像が下に表示されたままになってしまう。これを隠すために、コンテナ2に白い画像を置いておく。
    addImage(container2, BACKGROUND_IMAGE_0F, 0,  loaded_image_list[BACKGROUND_IMAGE_1F].height);

    var arrow_top_image = addImage(container, ARROW_TOP_IMAGE, 1900, 180, 0.4);
    arrow_top_image.addEventListener('mousedown',arrow_top,false);
    arrow_top_image.addEventListener('touchstart',arrow_top,false);
    var arrow_bottom_image = addImage(container, ARROW_BOTTOM_IMAGE, 2000, -200, 0.4);
    arrow_bottom_image.addEventListener('mousedown',arrow_bottom,false);
    arrow_bottom_image.addEventListener('touchstart',arrow_bottom,false);

    // html側で定義しているcanvasのサイズ
    canvas_scaled_width = 1334 * resize_ratio;

    progress_image　= addImage(container2, "0_4", 0, 0, 0.2);
    createjs.Touch.enable(stage);

    initCats();
    // Stageの描画を更新します
    stage.update();
  }
  function arrow_top(event)
  {
    console.log("arrow_top");
    createjs.Tween.get(container).to({y:background_image_height}, 1000);
    total_diff_y = background_image_height;
    now_floor = 2;
    stage.update();
  }
  function arrow_bottom(event)
  {
    console.log("arrow_bottom");
    createjs.Tween.get(container).to({y:0}, 1000);
    total_diff_y = 0;
    now_floor = 1;
    stage.update();
  }

  function initCats()
  {
    for(var index in hidden_cat_data)
    {
      var hidden_cat = hidden_cat_data[index];
      hidden_cat_data[index]["image_buff"] = addImage(container,hidden_cat["open_image"],hidden_cat["x"],hidden_cat["y"]);
      hidden_cat_data[index]["image_buff"].alpha = 0.5;
      hidden_cat_data[index]["image_buff"].addEventListener('mousedown',catsClicked(index),false);
      hidden_cat_data[index]["image_buff"].addEventListener('touchstart',catsClicked(index),false);
    }
  }

  function catsClicked(index)
  {
    return function(event)
    {
      if(is_touch_forbidden)
      {
        return;
      }
      console.log("catsClicked at "+index);
      hidden_cat_data[index]["image_buff"].alpha = 1;
      // この猫は見つけられたというフラグを立てる
      hidden_cat_data[index]["is_open"] = true;

      changeProgressImage();

      // 今回のタップにおいては、二匹目以降の発見チェックをしないというフラグを立てる
      is_once_open = true;

      // 1秒後に説明を表示する猫番号を一時変数に格納
      keeped_cat_index = index;
      // 1秒後に猫説明を表示
      var hoge = setInterval(function() {
        // 見つかった猫は消して
        // container.removeChild(get_cat);
        // 猫の説明を表示する
        cat_discription_image = addImage(container2, hidden_cat_data[index]["discription_image"], 0, 0);
        cat_discription_image.addEventListener('mousedown',deleteCatDiscription,false);
        cat_discription_image.addEventListener('touchstart',deleteCatDiscription,false);
        clearInterval(hoge);
      }, 1000);
    }
  }

  function deleteCatDiscription()
  {
    container2.removeChild(cat_discription_image);
  }

  function changeProgressImage()
  {
    container2.removeChild(progress_image);
    var found_cat_count = 0;
    for(var index2 in hidden_cat_data)
    {
      if(hidden_cat_data[index2]["is_open"])
      {
        found_cat_count ++;
      }
    }
    progress_image　= addImage(container2, found_cat_count+"_4", 0, 0, 0.2);
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
    // var touched_x = e.clientX - total_diff_x;
    // var touched_y = e.clientY - total_diff_y;
    var touched_x = e.clientX;
    var touched_y = e.clientY;
    console.log("total_diff_x = "+total_diff_x);
    var calc_right = e.clientX - canvas.offsetLeft; 
    if(before_x_for_click == calc_right)
    {
      // openCheck(touched_x, touched_y);
      change_floor(touched_x, touched_y);
    }
  }
  function touchEnd(e) {
    in_drag = false;
    // var touched_x = e.touches[0].clientX - total_diff_x;
    // var touched_y = e.touches[0].clientY - total_diff_y;
    var touched_x = e.touches[0].clientX;
    var touched_y = e.touches[0].clientY;
    console.log("total_diff_x = "+total_diff_x);
    var calc_right = e.touches[0].clientX - canvas.offsetLeft;
    if(before_x_for_click == calc_right)
    {
      // openCheck(touched_x, touched_y);
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
        if(to_upstairs_rectangle["x"] * resize_ratio < x &&
           x < (to_upstairs_rectangle["x"] + to_upstairs_rectangle["width"]) * resize_ratio &&
           to_upstairs_rectangle["y"] * resize_ratio < y &&
           y < (to_upstairs_rectangle["y"] + to_upstairs_rectangle["height"]) * resize_ratio)
        {
          createjs.Tween.get(container).to({y:background_image_height}, 1000);
          total_diff_y = background_image_height;
          now_floor = 2;
          stage.update();
        }
        break;
      case 2:
        // 1Fへ向かう当たり判定を踏んでいたら、1Fへ移動
        if(to_downstairs_rectangle["x"] * resize_ratio < x &&
           x < (to_downstairs_rectangle["x"] + to_downstairs_rectangle["width"]) * resize_ratio &&
           to_downstairs_rectangle["y"] * resize_ratio < y &&
           y < (to_downstairs_rectangle["y"] + to_downstairs_rectangle["height"]) * resize_ratio)
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
    //猫の説明画像を削除するのに成功した場合
    if(ret)
    {
      is_complete();
      // ダンボール画像を削除して、開封後画像に置換
      // container2.removeChild(hidden_cat_data[keeped_cat_index]["image_buff"]);
      // added_image = addImage(container2, hidden_cat_data[keeped_cat_index]["open_image"], hidden_cat_data[keeped_cat_index]["hit_offset_x"], hit_offset_y, cat_list_resize_ratio);
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
      var cat_image_width = hidden_cat["image_width"]; //クリックされた位置にでるネコ画像の横幅
      var cat_image_height = hidden_cat["image_height"]; //クリックされた位置にでるネコ画像の縦幅
      var hit_point_x = hidden_cat["x"]; //画像左上のx座標
      var hit_point_y = hidden_cat["y"]; //画像左上のy座標

      var calc_width=hit_point_x+cat_image_width;
      var calc_height=hit_point_y+cat_image_height;
console.log(hidden_cat);
console.log("hit_point_x = "+hit_point_x+", x = "+x+", width = "+calc_width);
console.log("hit_point_t = "+hit_point_y+", y = "+y+", height = "+calc_height);
      // 画像もresize_ratioの分引き伸ばされているので、それを加味した当たり判定チェック
      if( hit_point_x < x && x < calc_width &&
          hit_point_y < y && y < calc_height)
      {
        // 探し当てられた猫を表示する
        var get_cat = addImage(container,hidden_cat["open_image"],hidden_cat["x"],hidden_cat["y"]);
        // この猫は見つけられたというフラグを立てる
        hidden_cat["is_open"] = true;
        // 今回のタップにおいては、二匹目以降の発見チェックをしないというフラグを立てる
        is_once_open = true;

        is_touch_forbidden = true;
        // 1秒後に説明を表示する猫番号を一時変数に格納
        keeped_cat_index = index;
        // 1秒後に猫説明を表示
        var hoge = setInterval(function() {
          // 見つかった猫は消して
          // container.removeChild(get_cat);
          // 猫の説明を表示する
          cat_discription_image = addImage(container2, hidden_cat["discription_image"], 0, 0);
          is_touch_forbidden = false;
          clearInterval(hoge);
        }, 1000);

        container2.removeChild(progress_image);
        var found_cat_count = 0;
        for(var index2 in hidden_cat_data)
        {
          if(hidden_cat_data[index2]["is_open"])
          {
            found_cat_count ++;
          }
        }
        progress_image　= addImage(container2, found_cat_count+"_4", 0, 0, 0.2);
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