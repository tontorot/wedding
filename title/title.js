$(function () {
  var container = null;

  // LoadQueueのインスタンス作成
  // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
  var queue = new createjs.LoadQueue(true);

  var BACKGROUND_IMAGE = "title_background";
  var TO_TUTORIAL = "to_tutorial";
  var TO_GAME = "to_game";
  var TO_RANKING = "to_ranking";
  var IMAGE_DIR = "../images/";
  // 読み込むファイルの登録。
  var manifest = [
      {"src":IMAGE_DIR+BACKGROUND_IMAGE+".jpg","id":BACKGROUND_IMAGE},
      {"src":IMAGE_DIR+TO_TUTORIAL+".jpg","id":TO_TUTORIAL},
      {"src":IMAGE_DIR+TO_GAME+".jpg","id":TO_GAME},
      {"src":IMAGE_DIR+TO_RANKING+".jpg","id":TO_RANKING},
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

    container = new createjs.Container();
    // container2 = new createjs.Container();
    stage.addChild(container);
    // stage.addChild(container2);
    addImage(container, BACKGROUND_IMAGE, 0, 0);

    //チュートリアルへ飛ぶボタンを設置
    addButtonImage(container, TO_TUTORIAL, toTutorial, 160, 320);

    if(parseInt(json_user_info.is_tutorial_clear))
    {
      //本編へ飛ぶボタンを設置
      addButtonImage(container, TO_GAME, toGame, 160, 400);
      //ランキングへ飛ぶボタンを設置
      addButtonImage(container, TO_RANKING, toRanking, 160, 480);
    }

    createjs.Touch.enable(stage);
    // Stageの描画を更新します
    stage.update();
  }

  /**
   * @param target_container 画像を載せるコンテナ
   * @param image_name 読み込む画像名
   * @param image_x 画像を配置する座標（画像の左上の座標を参照
   */
  function addButtonImage(target_container,image_name,event_name,image_x,image_y)
  {
    //画像の左上の座標がimagex,image_yになる
    var added_image = new createjs.Bitmap(loaded_image_list[image_name]);
    added_image.setTransform(image_x*resize_ratio,image_y*resize_ratio,resize_ratio,resize_ratio);
    added_image.addEventListener('mousedown',event_name,false);
    added_image.addEventListener('touchstart',event_name,false);
    target_container.addChild(added_image);
    return added_image;
  }
  //チュートリアルページへ飛ぶ処理
  function toTutorial()
  {
    console.log("to_tutorial");
    window.location.href = '../tutorial/tutorial.php';
  }
  //チュートリアルページへ飛ぶ処理
  function toGame()
  {
    console.log("to_game");
    window.location.href = '../game/game.php';
  }
  //チュートリアルページへ飛ぶ処理
  function toRanking()
  {
    console.log("to_ranking");
    window.location.href = '../ranking/ranking.php';
  }
});