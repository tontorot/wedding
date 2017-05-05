

$(function () {
  var canvas = document.getElementById("canvas");

  // Stageオブジェクトを作成します
  var stage = new createjs.Stage("canvas");

  var resize_ratio = 1;
  var container = null;
  var container2 = null;
  var background_image_width = 0;

  var canvas_scaled_width = 0;
  var canvas_scaled_height = 0;
  var loaded_image_list = {};

  //猫のシルエットサイズ
  var SILHOUETTE_SIZE_RATIO = 0.3;
  //当たり判定用配列
  //連想配列
  var data ={
      0:{"x":320,"y":120,"is_open":false}
  };
  // 現在表示している猫シルエットの子ポインタを格納する配列
  var child_data = {};
  var hit_width = 118;
  var hit_offset_x = 20;
  var hit_offset_y = 20;

  //チュートリアルステップを管理する用
  var tutorial_step = 1;
  var OP_STEP_1 = 1;//開始時。ゲーム導入
  var OP_STEP_2 = 2;//画面暗転、ここをタッチしてみましょう
  var OP_STEP_3 = 3;//タッチ判定。狙いの箇所がタッチされたらうゆを表示
  var OP_STEP_4 = 4;//うゆ説明
  var OP_STEP_5 = 5;//見つけた猫は左上に表示されます
  var OP_STEP_6 = 6;//チュートリアルおわり？
  var OP_STEP_7 = 7;
  var OP_STEP_8 = 8;


  // LoadQueueのインスタンス作成
  // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
  var queue = new createjs.LoadQueue(true);

  var op_image = null;

  var OP1 = "op1";
  var OP2 = "op2";
  var OP3 = "op3";
  var OP4 = "op4";
  var OP5 = "op5";
  var OP6 = "op6";
  var IMAGE_DIR = "../images/";
  // 読み込むファイルの登録。
  var manifest = [
      {"src":IMAGE_DIR+OP1+".jpg","id":OP1},
      {"src":IMAGE_DIR+OP2+".jpg","id":OP2},
      {"src":IMAGE_DIR+OP3+".jpg","id":OP3},
      {"src":IMAGE_DIR+OP4+".jpg","id":OP4},
      {"src":IMAGE_DIR+OP5+".jpg","id":OP5},
      {"src":IMAGE_DIR+OP6+".jpg","id":OP6},
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
    console.log("resize_ratio = "+resize_ratio);
    canvas_scaled_width = need_width * resize_ratio;
    canvas.setAttribute("width", canvas_scaled_width);
    canvas.setAttribute("height", canvas_scaled_height);
    canvas.style.position = "absolute";
    canvas.style.top = canvas_top + "px";
    canvas.style.left = canvas_left + "px";

    container = new createjs.Container();
    stage.addChild(container);
    op_image = addImage(container, OP1, 0, 0);

    createjs.Touch.enable(stage);
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

    added_image.setTransform(image_x*resize_ratio,image_y*resize_ratio,resize_ratio*optional_resize_ratio,resize_ratio*optional_resize_ratio);
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
    atClicked(e.clientX, e.clientY);
  }
  function onTouch(e) {
    atClicked(e.touches[0].clientX, e.touches[0].clientY);
  }
  function atClicked(click_x,click_y)
  {
    in_drag = true;
    before_x = click_x - canvas.offsetLeft;

    //チュートリアルの状況に応じて、クリック時の挙動を変更
    switch(tutorial_step)
    {
      case OP_STEP_1:
        container.removeChild(op_image);
        op_image = addImage(container, OP2, 0, 0);
        tutorial_step = OP_STEP_2;
        break;
      case OP_STEP_2:
        container.removeChild(op_image);
        op_image = addImage(container, OP3, 0, 0);
        tutorial_step = OP_STEP_3;
        break;
      case OP_STEP_3:
        container.removeChild(op_image);
        op_image = addImage(container, OP4, 0, 0);
        tutorial_step = OP_STEP_4;
        break;
      case OP_STEP_4:
        container.removeChild(op_image);
        op_image = addImage(container, OP5, 0, 0);
        tutorial_step = OP_STEP_5;
        break;
      case OP_STEP_5:
        container.removeChild(op_image);
        op_image = addImage(container, OP6, 0, 0);
        tutorial_step = OP_STEP_6;
        break;
      case OP_STEP_6:
        //リンクを貼る
        window.location.href = '../createjs.html';
        break;
      default:
        break;
    }
  }

  function onClick(e) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
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
        added_image = addImage(container2, CAT_IMAGE, hit_offset_x + index * hit_width, hit_offset_y, SILHOUETTE_SIZE_RATIO);
        // この猫は見つけられたというフラグを立てる
        data[index]["is_open"] = true;
        is_once_open = true;
      }
    }
    return is_once_open;
  }
});