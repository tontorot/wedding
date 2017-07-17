

$(function () {
  var canvas = document.getElementById("canvas");
  canvas_init();

  var cat_list_resize_ratio = 0.3;
  var container = null;
  var container2 = null;
  var container3 = null;
  var move_container = null;
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
       "uyu_jiji":{"x":559,  "y":440, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "is_cat":true, "image_buff":null, "open_image":"uyu_jiji",  "discription_image":"uyu_jiji_discription"}
      ,"miryu"   :{"x":1044,"y":396,"image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "is_cat":true, "image_buff":null, "open_image":"miryu","discription_image":"miryu_discription"}
      ,"chibi"   :{"x":2529,"y":450, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "is_cat":true, "image_buff":null, "open_image":"chibi",     "discription_image":"chibi_discription"}
      ,"milk"    :{"x":2497,"y":-499, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "is_cat":true, "image_buff":null, "open_image":"milk",      "discription_image":"milk_discription"}
      ,"hazure1" :{"x":828,"y":266, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "is_cat":false, "image_buff":null, "open_image":"hazure1",      "discription_image":"hazure1_discription"}
      ,"hazure2" :{"x":1753,"y":327,  "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "is_cat":false, "image_buff":null, "open_image":"hazure2",      "discription_image":"hazure2_discription"}
      ,"hazure3" :{"x":907,"y":-618, "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "is_cat":false, "image_buff":null, "open_image":"hazure3",      "discription_image":"hazure3_discription"}
      ,"hazure4" :{"x":1948,"y":-534,  "image_width":0, "image_height":0, "hit_offset_x":0, "is_open":false, "is_cat":false, "image_buff":null, "open_image":"hazure4",      "discription_image":"hazure4_discription"}
    };
  // 今何階にいるか。初期値1階。
  var now_floor = 1;
  // 2Fに上がるための当たり判定
  var to_upstairs_rectangle = {"x":1000,"y":200,"width":132, "height":162};
  var to_downstairs_rectangle = {"x":1000,"y":-280,"width":132, "height":162};

  var cat_discription_image = null;
  var progress_image = null;
  var arrow_left_image = null;
  var arrow_right_image = null;
  var cat_find_effect_image = null;
  var baloon_image = null;
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
  var ARROW_TOP_IMAGE = "top_arrow";
  var ARROW_BOTTOM_IMAGE = "bottom_arrow";
  var ARROW_RIGHT_IMAGE = "right_arrow";
  var ARROW_LEFT_IMAGE = "left_arrow";
  var JEWEL_GET = "jewel_get";
  var JEWEL_FAIL = "jewel_fail";
  var CAT_FIND_SUCCESS = "mikke";
  var CAT_FIND_FAILURE = "hatena";
  var BALOON1 = "baloon1";
  var BALOON2 = "baloon2";
  var BALOON3 = "baloon3";
  var BALOON4 = "baloon4";
  var BALOON5 = "baloon5";
  var CAT_RADAR_UYU = "cat_radar_uyu";
  var CAT_RADAR_NEAR = "cat_radar_near";
  var CAT_RADAR_VERY_NEAR = "cat_radar_very_near";
  var CAT_RADAR_COMMENT = "cat_radar_comment";
  var COMPLETE = "complete";
  var IMAGE_DIR = "/wedding/images/";
  // 読み込むファイルの登録。
  var manifest = [
      {"src":IMAGE_DIR+BACKGROUND_IMAGE_0F+".jpg","id":BACKGROUND_IMAGE_0F},
      {"src":IMAGE_DIR+BACKGROUND_IMAGE_1F+".jpg","id":BACKGROUND_IMAGE_1F},
      {"src":IMAGE_DIR+BACKGROUND_IMAGE_2F+".jpg","id":BACKGROUND_IMAGE_2F},
      {"src":IMAGE_DIR+"0_4.png","id":"0_4"},
      {"src":IMAGE_DIR+"1_4.png","id":"1_4"},
      {"src":IMAGE_DIR+"2_4.png","id":"2_4"},
      {"src":IMAGE_DIR+"3_4.png","id":"3_4"},
      {"src":IMAGE_DIR+"4_4.png","id":"4_4"},
      {"src":IMAGE_DIR+ARROW_TOP_IMAGE+".png","id":ARROW_TOP_IMAGE},
      {"src":IMAGE_DIR+ARROW_BOTTOM_IMAGE+".png","id":ARROW_BOTTOM_IMAGE},
      {"src":IMAGE_DIR+ARROW_RIGHT_IMAGE+".png","id":ARROW_RIGHT_IMAGE},
      {"src":IMAGE_DIR+ARROW_LEFT_IMAGE+".png","id":ARROW_LEFT_IMAGE},
      {"src":IMAGE_DIR+JEWEL_GET+".jpg","id":JEWEL_GET},
      {"src":IMAGE_DIR+JEWEL_FAIL+".jpg","id":JEWEL_FAIL},
      {"src":IMAGE_DIR+CAT_FIND_SUCCESS+".png","id":CAT_FIND_SUCCESS},
      {"src":IMAGE_DIR+CAT_FIND_FAILURE+".png","id":CAT_FIND_FAILURE},
      {"src":IMAGE_DIR+BALOON1+".png","id":BALOON1},
      {"src":IMAGE_DIR+BALOON2+".png","id":BALOON2},
      {"src":IMAGE_DIR+BALOON3+".png","id":BALOON3},
      {"src":IMAGE_DIR+BALOON4+".png","id":BALOON4},
      {"src":IMAGE_DIR+BALOON5+".png","id":BALOON5},
      {"src":IMAGE_DIR+CAT_RADAR_UYU+".png","id":CAT_RADAR_UYU},
      {"src":IMAGE_DIR+CAT_RADAR_NEAR+".png","id":CAT_RADAR_NEAR},
      {"src":IMAGE_DIR+CAT_RADAR_VERY_NEAR+".png","id":CAT_RADAR_VERY_NEAR},
      {"src":IMAGE_DIR+COMPLETE+".png","id":COMPLETE},
  ];
  for(var index in hidden_cat_data)
  {
    var open_image_name = hidden_cat_data[index]["open_image"];
    var discription_image_name = hidden_cat_data[index]["discription_image"];
    manifest.push({"src":IMAGE_DIR+open_image_name+".png","id":open_image_name});
    manifest.push({"src":IMAGE_DIR+discription_image_name+".png","id":discription_image_name});
  }
  for(var comment = 1; comment <= 10; comment++)
  {
    manifest.push({"src":IMAGE_DIR+CAT_RADAR_COMMENT+comment+".png","id":CAT_RADAR_COMMENT+comment});
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
    init();
  }


  function init() {
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
    container3 = new createjs.Container();
    move_container = new createjs.Container();

    move_container.addChild(container);
    move_container.addChild(container2);
    stage.addChild(move_container);
    stage.addChild(container3);
    addImage(container, BACKGROUND_IMAGE_1F, 0, 0);
console.log("resize_ratioa = "+resize_ratio);
console.log("resize_ratio = "+resize_ratio);
    background_image_width = loaded_image_list[BACKGROUND_IMAGE_1F].width * resize_ratio;
    background_image_height = loaded_image_list[BACKGROUND_IMAGE_1F].height * resize_ratio;
console.log("background_image_width = "+background_image_width);
    // 1F画像の高さがわかったので、2F画像を仕込んでおく。
    addImage(container, BACKGROUND_IMAGE_2F, 0, -loaded_image_list[BACKGROUND_IMAGE_1F].height);
    // 2F画像を表示すると、1F画像が下に表示されたままになってしまう。これを隠すために、コンテナ2に白い画像を置いておく。
    addImage(container3, BACKGROUND_IMAGE_0F, 0,  loaded_image_list[BACKGROUND_IMAGE_1F].height);

    var arrow_top_image = addImage(container, ARROW_TOP_IMAGE, 100, 170, 0.2);
    // 縦に引き伸ばすアニメーションを加える
    createjs.Tween.get(arrow_top_image, {loop:true}).to({scaleY:0.25*resize_ratio}, 1000).to({scaleY:0.2*resize_ratio}, 1000);
    arrow_top_image.addEventListener('mousedown',arrow_top,false);
    arrow_top_image.addEventListener('touchstart',arrow_top,false);
    var arrow_bottom_image = addImage(container, ARROW_BOTTOM_IMAGE, 366, -408, 0.2);
    // 縦に引き伸ばすアニメーションを加える
    createjs.Tween.get(arrow_bottom_image, {loop:true}).to({scaleY:0.25*resize_ratio}, 1000).to({scaleY:0.2*resize_ratio}, 1000);
    arrow_bottom_image.addEventListener('mousedown',arrow_bottom,false);
    arrow_bottom_image.addEventListener('touchstart',arrow_bottom,false);

    //左にスワイプできるか、右にスワイプできるかどうかの画像を表示する
    arrow_right_image = addImage(container3, ARROW_RIGHT_IMAGE, 1270, 370, 0.2);
    arrow_left_image = addImage(container3, ARROW_LEFT_IMAGE, 0, 370, 0.2);
    // 最初は画面左端にいるので、左向きの矢印は非表示にしておく
    arrow_left_image.alpha = 0;

    addImage(container3, CAT_RADAR_UYU, 0, 0);
    addBaloonImage(CAT_RADAR_COMMENT+'10');

    // html側で定義しているcanvasのサイズ
    canvas_scaled_width = 1334 * resize_ratio;

    progress_image　= addImage(container3, "0_4", 0, 0, 0.7);
    createjs.Touch.enable(stage);

    initCats();
    // Stageの描画を更新します
    stage.update();
  }
  function arrow_top(event)
  {
    console.log("arrow_top");
    createjs.Tween.get(move_container).to({y:background_image_height}, 1000);
    total_diff_y = background_image_height;
    now_floor = 2;
    stage.update();
  }
  function arrow_bottom(event)
  {
    console.log("arrow_bottom");
    createjs.Tween.get(move_container).to({y:0}, 1000);
    total_diff_y = 0;
    now_floor = 1;
    stage.update();
  }

  function initCats()
  {
    for(var index in hidden_cat_data)
    {
      var hidden_cat = hidden_cat_data[index];
      hidden_cat_data[index]["image_buff"] = addImage(container2,hidden_cat["open_image"],hidden_cat["x"],hidden_cat["y"]);
      hidden_cat_data[index]["image_buff"].alpha = 0.5;
      hidden_cat_data[index]["image_buff"].addEventListener('mousedown',catsClicked(index),false);
      hidden_cat_data[index]["image_buff"].addEventListener('touchstart',catsClicked(index),false);
      hidden_cat_data[index]["image_buff"].addEventListener('pressup',catsPressup(index),false);
      hidden_cat_data[index]["image_buff"].addEventListener('ontouchend',catsPressup(index),false);
    }
  }
  var is_cat_pressed = false;
  function catsClicked(index)
  {
    return function(event)
    {
      console.log("EVENT:catsClicked at "+index);
      is_cat_pressed = true;
    }
  }

  function catsPressup(index)
  {
    return function(event)
    {
      console.log("EVENT:catsPressup at "+index);
      is_cat_pressed = false;
      if(is_touch_forbidden)
      {
        return;
      }
      if(total_diff_x != before_total_diff_x)
      {
        return;
      }
      // 猫の説明を表示している間、他の猫をタッチできなくする
      is_touch_forbidden = true;
      hidden_cat_data[index]["image_buff"].alpha = 1;
      // この猫は見つけられたというフラグを立てる
      hidden_cat_data[index]["is_open"] = true;

      var effect_scale = 2;
      var cat_center_x = hidden_cat_data[index]["x"] + hidden_cat_data[index]["image_width"] / 2;
      var effect_position_x = cat_center_x - 109 * effect_scale;
      var cat_center_y = hidden_cat_data[index]["y"] + hidden_cat_data[index]["image_height"] / 2;
      var effect_position_y = cat_center_y - 126 * effect_scale;
      if(hidden_cat_data[index]["is_cat"])
      {
        cat_find_effect_image = addImage(container, CAT_FIND_SUCCESS, effect_position_x, effect_position_y, effect_scale);
      }
      else
      {
        cat_find_effect_image = addImage(container, CAT_FIND_FAILURE, effect_position_x, effect_position_y, effect_scale);
      }
      changeProgressImage();

      // 1秒後に説明を表示する猫番号を一時変数に格納
      keeped_cat_index = index;
      // 1秒後に猫説明を表示
      var hoge = setInterval(function() {
        // 猫を見つけたエフェクトは消して
        container.removeChild(cat_find_effect_image);
        // 猫の説明を表示する
        cat_discription_image = addImage(container3, hidden_cat_data[index]["discription_image"], 0, 0);
        cat_discription_image.addEventListener('mousedown',deleteCatDiscription,false);
        cat_discription_image.addEventListener('touchstart',deleteCatDiscription,false);
        clearInterval(hoge);
      }, 1000);
    }
  }

  function deleteCatDiscription()
  {
    container3.removeChild(cat_discription_image);
    //猫の説明を消して、再度猫をタッチできるように
    is_touch_forbidden = false;
    if(is_complete())
    {
      console.log("game end");
      addFinishImage();
    }
  }

  function addFinishImage()
  {
    // Ajax通信を開始する
    $.ajax({
        url: '/wedding/common/db.php',
        type: 'post', // getかpostを指定(デフォルトは前者)
        dataType: 'text', // 「json」を指定するとresponseがJSONとしてパースされたオブジェクトになる
        data: { // 送信データを指定(getの場合は自動的にurlの後ろにクエリとして付加される)
            method: "finish",
            viewer_id: json_user_info["viewer_id"]
        }
    })
    // ・ステータスコードは正常で、dataTypeで定義したようにパース出来たとき
    .done(function (response) {
        console.log(response);
        console.log("ajax success");
        var clear_num = parseInt(response);
        var complete_image = addImage(container3, COMPLETE, 0, 0);
        stage.addEventListener('mousedown', function(){
          if(clear_num <= 50)
          {
            console.log("jewel_get : clear_num = "+clear_num);
            addImage(container3, JEWEL_GET, 0,  0);
          }
          else
          {
            console.log("jewel_fail : clear_num = "+clear_num);
            addImage(container3, JEWEL_FAIL, 0,  0);
          }
        });

    })
    // ・サーバからステータスコード400以上が返ってきたとき
    // ・ステータスコードは正常だが、dataTypeで定義したようにパース出来なかったとき
    // ・通信に失敗したとき
    .fail(function () {
        console.log("ajax failed");
    });
  }

  function changeProgressImage()
  {
    container3.removeChild(progress_image);
    var found_cat_count = 0;
    for(var index2 in hidden_cat_data)
    {
      if(hidden_cat_data[index2]["is_open"] && hidden_cat_data[index2]["is_cat"])
      {
        found_cat_count ++;
      }
    }
    progress_image　= addImage(container3, found_cat_count+"_4", 0, 0, 0.7);
  }

  function addBaloonImage(image_name)
  {
    container3.removeChild(baloon_image);
    baloon_image = addImage(container3, image_name, 0, 0);
    createjs.Tween.get(baloon_image).to({alpha: 0}, 2000);
  }

  var in_drag = false;
  var before_x_for_move_container;
  var total_diff_x = 0;
  var total_diff_y = 0;
  var before_total_diff_x;
  function onDown(e) {
    console.log("EVENT:onDown");
    in_drag = true;
    before_x_for_move_container = e.clientX - canvas.offsetLeft;
    before_x_for_click = before_x_for_move_container;
    before_total_diff_x = total_diff_x;
 }
  function touchStart(e) {
    console.log("EVENT:touchStart");
    in_drag = true;
    before_x_for_move_container = e.touches[0].clientX - canvas.offsetLeft;
    before_x_for_click = before_x_for_move_container;
    before_total_diff_x = total_diff_x;
  }
  var last_comment_num = 10;
  function checkCatDistance(x,y)
  {
    if(total_diff_x != before_total_diff_x)
    {
      return;
    }
    //現実世界系からcanvas座標系へ変換
    x /= resize_ratio;
    y /= resize_ratio;

    var shortest_distance = Number.MAX_SAFE_INTEGER;
    for(var index in hidden_cat_data)
    {
      //まだ未発見のオブジェクトについて距離を計算していく
      if(!hidden_cat_data[index]["is_open"])
      {
        cat_x = hidden_cat_data[index]["x"];
        cat_y = hidden_cat_data[index]["y"];
        var distance = Math.sqrt(Math.pow(cat_x-x,2)+Math.pow(cat_y-y,2));
        // console.log("index = "+index+", distance = "+distance);
        if(shortest_distance > distance)
        {
          shortest_distance = distance;
        }
      }
    }
    console.log("shortest_distance = "+shortest_distance);
    // 猫の説明文を表示中で、猫を探す操作が無効になってるときは猫レーダーを反応させない
    if(is_touch_forbidden)
    {
      return;
    }
    if(is_cat_pressed)
    {
      return;
    }
    //　猫レーダーの感度によって、表示する反応をかえる
    if(shortest_distance < 100)
    {
      addBaloonImage(CAT_RADAR_VERY_NEAR);
    }
    else if(shortest_distance < 300)
    {
      addBaloonImage(CAT_RADAR_NEAR);
    }
    else
    {
      var comment_num = 10;
      // 特に近くないときは適当にうゆにしゃべらせる。
      do
      {
        comment_num = Math.floor(Math.random() * (10 - 1)) + 1;
        console.log("lot comment_num:"+comment_num);
      }while(comment_num == last_comment_num);
      last_comment_num = comment_num;
      addBaloonImage(CAT_RADAR_COMMENT+comment_num);
    }
  }
  function onUp(e) {
    console.log("EVENT:onUP");
    in_drag = false;
    if(total_diff_x != before_total_diff_x)
    {
      return;
    }
    showTouchEffect(container, e.clientX-canvas_left_offset-total_diff_x, e.clientY-canvas_top_offset-total_diff_y);
    checkCatDistance(e.clientX-canvas_left_offset-total_diff_x, e.clientY-canvas_top_offset-total_diff_y);
  }
  function touchEnd(e) {
    console.log("EVENT:touchEnd");
    in_drag = false;
    if(total_diff_x != before_total_diff_x)
    {
      return;
    }
    showTouchEffect(container, e.changedTouches[0].clientX-canvas_left_offset-total_diff_x, e.changedTouches[0].clientY-canvas_top_offset-total_diff_y);
    checkCatDistance(e.changedTouches[0].clientX-canvas_left_offset-total_diff_x, e.changedTouches[0].clientY-canvas_top_offset-total_diff_y);
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
      //左端にいるので、これ以上左にいけなくする
      if(total_diff_x > 0)
      {
        total_diff_x = 0;
        arrow_left_image.alpha = 0;
      }
      else
      {
        arrow_left_image.alpha = 1;
      }
      //右端にいるので、これ以上右に行けなくする
      if(total_diff_x < min_total_diff_x)
      {
        total_diff_x = canvas_scaled_width - background_image_width;
        arrow_right_image.alpha = 0;
      }
      else
      {
        arrow_right_image.alpha = 1;
      }

      $("#textbox").text(total_diff_x);
      move_container.setTransform(total_diff_x,total_diff_y);
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

  //猫画像がすべてオープンになっているかチェックする
  function is_complete()
  {
    for(var index in hidden_cat_data)
    {
      if(!hidden_cat_data[index]["is_open"] && hidden_cat_data[index]["is_cat"])
      {
        return false;
      }
    }
    return true;
  }
  function onOver(e) {
    console.log("mouseover");
  }
});