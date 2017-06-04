$(function () {

  var container = null;

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

  // OP画像のポインタ格納用
  var op_image = null;

  var OP1 = "op1";
  var OP2 = "op2";
  var OP3 = "op3";
  var OP4 = "op4";
  var OP5 = "op5";
  var OP6 = "op6";
  var IMAGE_DIR = "/wedding/images/";
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
    canvas_init();
    init();
  }


  function init() {
    createjs.Ticker.setFPS(30);

    createjs.Ticker.addEventListener("tick", function() {
      stage.update(); // 30fpsでステージの描画が更新されるようになる
    });

    canvas.addEventListener('mousedown', onDown, false);
    canvas.addEventListener('touchstart', onTouch, false);

    container = new createjs.Container();
    stage.addChild(container);
    op_image = addImage(container, OP1, 0, 0);

    createjs.Touch.enable(stage);
    // Stageの描画を更新します
    stage.update();
  }

  function onDown(e) {
    atClicked(e.clientX, e.clientY);
  }
  function onTouch(e) {
    atClicked(e.touches[0].clientX, e.touches[0].clientY);
  }
  function atClicked(click_x,click_y)
  {
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
        window.location.href = '/wedding/index.php?page=title';
        break;
      default:
        break;
    }
  }
});