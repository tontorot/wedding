<?php
require("./common/db.php");
$viewer_id = get_viewer_id();
$user_info = get_by_viewer_id($viewer_id);
$json_user_info = json_encode($user_info, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
$finish_num = get_finish_number($viewer_id);
$_output = <<<HTML
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
    #canvas {
      background: #000;
    }
    </style>
    <script>var json_user_info = {$json_user_info};var finish_num = {$finish_num};</script>
    <script src="https://code.createjs.com/createjs-2015.11.26.min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="/wedding/common/common.js"></script>
    <script type="text/javascript" src="/wedding/result/result.js"></script>
  </head>
  <body bgcolor="#000000">
    <canvas id="canvas"></canvas>
  }
  </body>
  </html>
HTML;

echo $_output;
?>