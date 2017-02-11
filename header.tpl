<?php
$_output .= <<<HTML
	<html>
<!-- jQuery を読み込んでおいてね -->
<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript">
 
/* タッチできる環境なら true、そうでないなら false 。
   ここで先に判別しておきます。 */
var isTouch = ('ontouchstart' in window);
var EVENT = {};
if (isTouch)
{
	/*タップイベントが使える場合*/
	EVENT.TOUCH_START = 'touchstart';
	EVENT.TOUCH_MOVE = 'touchmove';
	EVENT.TOUCH_END = 'touchend';
}
else
{
	/*タップイベントが使えない場合*/
	EVENT.TOUCH_START = 'mousedown';
	EVENT.TOUCH_MOVE = 'mousemove';
	EVENT.TOUCH_END = 'mouseup';
}
console.log("EVENT = ");
console.log(EVENT);
console.log("isTouch = "+isTouch);
$(function(){
	$('#hoge').click(function(){
		console.log("test");
	});

	$('#hoge').on(EVENT.TOUCH_START, function(e){
		// // ページが動いたり、反応を止める
		// e.preventDefault();
		 
		// // 開始位置 X,Y 座標を覚えておく
		// // （touchmove イベントを通らず終了したときのために必ず覚えておくこと）
		this.pageX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
		this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);

		console.log("TOUCH_START at ("+this.pageX+","+this.pageY+")");
		document.write('<img src="cat_test.png" width="192" height="192" />');
		// // 現在の hoge の場所を覚えておく
		// this.left = $(this).position().left;
		// this.top = $(this).position().top;
		 
		// // タッチ処理を開始したフラグをたてる
		// this.touched = true;
	});
	$('#hoge').on(EVENT.TOUCH_MOVE, function(e){
		//console.log("TOUCH_MOVE");
		// // 開始していない場合は動かないようにする
		// // 過剰動作の防止
		// if (!this.touched) {
		// 	return;
		// }
		 
		// // ページが動くのを止める
		// e.preventDefault();
		 
		// // 移動先の hoge の位置を取得する
		// this.left = this.left - (this.pageX - (isTouch ? event.changedTouches[0].pageX : e.pageX) );
		// this.top = this.top - (this.pageY - (isTouch ? event.changedTouches[0].pageY : e.pageY) );

		// // hoge を移動させる
		// $(this).css({left:this.left, top:this.top});
		 
		// // 位置 X,Y 座標を覚えておく
		// this.pageX = (isTouch ? event.changedTouches[0].pageX : e.pageX);
		// this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);
	});
	$('#hoge').on(EVENT.TOUCH_END, function(e){
		console.log("TOUCH_END");
		// if (!this.touched) {
		// 	return;
		// }
		 
		// // タッチ処理は終了したため、フラグをたたむ
		// this.touched = false;
		 
		// // 必要なら以下で最終の hoge の位置を取得し何かに使う
		// // this.pageX
		// // this.pageY
	});
});

</script>
	<body>
HTML;
?>