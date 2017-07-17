$(function () {
  canvas_init();
  var container = null;

  // LoadQueueのインスタンス作成
  // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
  var queue = new createjs.LoadQueue(true);

  var JEWEL_GET = "jewel_get";
  var JEWEL_FAIL = "jewel_fail";
  var IMAGE_DIR = "/wedding/images/";
  // 読み込むファイルの登録。
  var manifest = [
      {"src":IMAGE_DIR+JEWEL_GET+".jpg","id":JEWEL_GET},
      {"src":IMAGE_DIR+JEWEL_FAIL+".jpg","id":JEWEL_FAIL},
  ];

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
    init();
  }


  function init() {
    createjs.Ticker.setFPS(30);

    createjs.Ticker.addEventListener("tick", function() {
      stage.update(); // 30fpsでステージの描画が更新されるようになる
    });

    container = new createjs.Container();
    stage.addChild(container);

    console.log(finish_num);
    if( finish_num == 0)
    {
      // toTitle();
    }
    else if(finish_num > 50)
    {
      addImage(container, JEWEL_FAIL, 0, 0);
    }
    else
    {
      addImage(container, JEWEL_GET, 0, 0);
    }

    canvas.addEventListener('mousedown', onDown, false);
    canvas.addEventListener('touchstart', onTouch, false);

    createjs.Touch.enable(stage);
    // Stageの描画を更新します
    stage.update();
  }

  function onDown(e) {
    toTitle();
  }
  function onTouch(e) {
    toTitle();
  }

  // タイトルページへ飛ぶ
  function toTitle()
  {
    console.log("to_title");
    window.location.href = '/wedding/index.php?page=title';
  }

});