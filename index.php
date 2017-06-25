<?php
require('./common/config.php');
$page = $_REQUEST['page'];
if(time() < strtotime($event_start_time))
{
	require('./can_not_play_game/can_not_play_game.php');
}
else
{
	switch ($page) {
	case 'op':
		require('./op/op.php');
		break;
	case 'title':
		require('./title/title.php');
		break;
	case 'tutorial':
		require('./tutorial/tutorial.php');
		break;
	case 'game':
		require('./game/game.php');
		break;
	// case 'title':
	// 	require('./title/title.php');
	// 	break;
	
	default:
		# code...
		break;
	}
}


?>