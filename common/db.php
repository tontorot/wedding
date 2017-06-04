<?php
try
{
	$user = 'root';
	$pass = '';
	$dbh = new PDO('mysql:host=localhost;', $user, $pass);

	switch ($_REQUEST['method'])
	{
		case 'update_tutorial_clear':
			$viewer_id = $_REQUEST['viewer_id'];
			$result = update_tutorial_clear($viewer_id);
			echo $result;
			break;
		
		default:
			# code...
			break;
	}
}
catch(PDOException $e)
{
    print "エラー!: " . $e->getMessage() . "<br/>";
}

function get_viewer_id()
{
	print("get_viewer_id<br>");
	if(!empty($_COOKIE['viewer_id']) && is_viewer_id_exists($_COOKIE['viewer_id']))
	{
		return $_COOKIE['viewer_id'];
	}

	$viewer_id = generate_viewer_id();
	setcookie('viewer_id',$viewer_id);
	$_COOKIE['viewer_id'] = $viewer_id;
	return $viewer_id;
}

function generate_viewer_id()
{
	global $dbh;
	$max_viewer_id = 999999999;
	$min_viewer_id = 100000000;

	do
	{
		$viewer_id = rand($min_viewer_id, $max_viewer_id);
		$sql = "SELECT * FROM wedding.user_info where viewer_id = ?";
		$stmt = $dbh->prepare($sql);
		$stmt->execute(array($viewer_id));
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
	}while($row);

	$sql = "INSERT INTO wedding.user_info (viewer_id, name, clear_time) VALUES (?, 'test', ?)";
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($viewer_id,PHP_INT_MAX));

	return $viewer_id;
}

function get_by_viewer_id($viewer_id)
{
	global $dbh;
	$sql = "SELECT * FROM wedding.user_info where viewer_id = ?";
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($viewer_id));
	return $stmt->fetch(PDO::FETCH_ASSOC);
}

function is_viewer_id_exists($viewer_id)
{
	print("is_viewer_id_exists<br>");
	if(get_by_viewer_id($viewer_id))
	{
		print("return true<br>");
		return TRUE;
	}
		print("return false<br>");
	return FALSE;
}

function update_tutorial_clear($viewer_id)
{
	global $dbh;
	$sql = "UPDATE wedding.user_info set is_tutorial_clear = 1 where viewer_id = ?";
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($viewer_id));
	return $stmt->rowCount();
}
?>