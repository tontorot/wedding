

$(function () {

  var container = null;
  var container2 = null;

  // 背景画像のポインタ
  var tutorial_image = null;

  //チュートリアルステップを管理する用
  var tutorial_step = 1;
  var TUTORIAL_STEP_1 = 1;
  var TUTORIAL_STEP_2 = 2;
  var TUTORIAL_STEP_3 = 3;
  var TUTORIAL_STEP_4 = 4;
  var TUTORIAL_STEP_5 = 5;
  var TUTORIAL_STEP_6 = 6;
  var TUTORIAL_STEP_7 = 7;
  var TUTORIAL_STEP_8 = 8;
  var TUTORIAL_STEP_9 = 9;
  var TUTORIAL_STEP_10 = 10;
  var TUTORIAL_STEP_11 = 11;

  // チュートリアルで猫が隠れているポイントの中心座標
  var touch_point_x = 1045;
  var touch_point_y = 305;
  // チュートリアルで猫が隠れている円状の当たり判定の半径
  var touch_range = 100;

  // LoadQueueのインスタンス作成
  // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
  var queue = new createjs.LoadQueue(true);

  var IMAGE_DIR = "/wedding/images/";
  //読み込むファイルの登録
  var manifest = [];
  for(var i=1;i<11;i++)
  {
    manifest.push({"src":IMAGE_DIR+"tutorial"+i+".jpg","id":"tutorial"+i});
  }

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
    container2 = new createjs.Container();
    stage.addChild(container);
    stage.addChild(container2);
    tutorial_image = addImage(container, "tutorial1", 0, 0);

    createjs.Touch.enable(stage);
    // Stageの描画を更新します
    stage.update();
  }

  function onDown(e) {
    atClicked( (e.clientX-canvas_left_offset) / resize_ratio, (e.clientY-canvas_top_offset) / resize_ratio);
  }
  function onTouch(e) {
    atClicked( (e.touches[0].clientX-canvas_left_offset) / resize_ratio, (e.touches[0].clientY-canvas_top_offset) / resize_ratio);
  }
  function atClicked(click_x,click_y)
  {
    showTouchEffect(container2,click_x * resize_ratio, click_y * resize_ratio);
    in_drag = true;
    before_x = click_x - canvas.offsetLeft;

    //チュートリアルの状況に応じて、クリック時の挙動を変更
    switch(tutorial_step)
    {
      case TUTORIAL_STEP_1:
        tutorial_step = TUTORIAL_STEP_2;
        container.removeChild(tutorial_image);
        baloon_image = addImage(container, "tutorial"+tutorial_step, 0, 0);
        break;
      case TUTORIAL_STEP_2:
        tutorial_step = TUTORIAL_STEP_3;
        container.removeChild(tutorial_image);
        //ここをタッチしてみよう！という画像を表示する
        baloon_image = addImage(container, "tutorial"+tutorial_step, 0, 0);
        break;
      case TUTORIAL_STEP_3:
        // チュートリアルで唯一当たり判定を使用するところ
        var touch_dist = Math.sqrt(Math.pow(touch_point_x-click_x,2)+Math.pow(touch_point_y-click_y,2));
        if(touch_dist < touch_range)
        {
          tutorial_step = TUTORIAL_STEP_4;
          container.removeChild(tutorial_image);
          baloon_image = addImage(container, "tutorial"+tutorial_step, 0, 0);
        }
        break;
      case TUTORIAL_STEP_4:
        tutorial_step = TUTORIAL_STEP_5;
        container.removeChild(tutorial_image);
        baloon_image = addImage(container, "tutorial"+tutorial_step, 0, 0);
        break;
      case TUTORIAL_STEP_5:
        tutorial_step = TUTORIAL_STEP_6;
        container.removeChild(tutorial_image);
        baloon_image = addImage(container, "tutorial"+tutorial_step, 0, 0);
        break;
      case TUTORIAL_STEP_6:
        tutorial_step = TUTORIAL_STEP_7;
        container.removeChild(tutorial_image);
        baloon_image = addImage(container, "tutorial"+tutorial_step, 0, 0);
        break;
      case TUTORIAL_STEP_7:
        tutorial_step = TUTORIAL_STEP_8;
        container.removeChild(tutorial_image);
        baloon_image = addImage(container, "tutorial"+tutorial_step, 0, 0);
        break;
      case TUTORIAL_STEP_8:
        tutorial_step = TUTORIAL_STEP_9;
        container.removeChild(tutorial_image);
        baloon_image = addImage(container, "tutorial"+tutorial_step, 0, 0);
        break;
      case TUTORIAL_STEP_9:
        tutorial_step = TUTORIAL_STEP_10;
        container.removeChild(tutorial_image);
        baloon_image = addImage(container, "tutorial"+tutorial_step, 0, 0);
        break;
      case TUTORIAL_STEP_10:
        // Ajax通信を開始する
        $.ajax({
            url: '/wedding/common/db.php',
            type: 'post', // getかpostを指定(デフォルトは前者)
            dataType: 'text', // 「json」を指定するとresponseがJSONとしてパースされたオブジェクトになる
            data: { // 送信データを指定(getの場合は自動的にurlの後ろにクエリとして付加される)
                method: "update_tutorial_clear",
                viewer_id: json_user_info["viewer_id"]
            }
        })
        // ・ステータスコードは正常で、dataTypeで定義したようにパース出来たとき
        .done(function (response) {
            console.log(response);
            console.log("ajax success");
            window.location.href = '/wedding/index.php?page=title';
        })
        // ・サーバからステータスコード400以上が返ってきたとき
        // ・ステータスコードは正常だが、dataTypeで定義したようにパース出来なかったとき
        // ・通信に失敗したとき
        .fail(function () {
            console.log("ajax failed");
        });
        break;
      default:
        break;
    }
  }


});