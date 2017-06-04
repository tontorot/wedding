<?php
$page = $_REQUEST['page'];
print("page = $page");
print("file = ".__DIR__);
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
	// case 'title':
	// 	require('./title/title.php');
	// 	break;
	// case 'title':
	// 	require('./title/title.php');
	// 	break;
	
	default:
		# code...
		break;
}

?>