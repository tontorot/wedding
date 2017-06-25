<?php

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
    <script src="https://code.createjs.com/createjs-2015.11.26.min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="/wedding/common/common.js"></script>
    <script type="text/javascript" src="/wedding/can_not_play_game/can_not_play_game.js"></script>
  </head>
  <body bgcolor="#000000">
    <canvas id="canvas" width="1334" height="750"></canvas>
  </body>
  </html>
HTML;

echo $_output;
?>