<?php
require("../common/db.php");

if(!$argv[1])
{
	print("第一引数に人数を入力してください\n");
}

$fill_up_num = (int)$argv[1];
for($i=0; $i<$fill_up_num; ++$i)
{
	$viewer_id = generate_viewer_id();
	print("viewer_id = $viewer_id\n");
	insert_finish_time($viewer_id);
}
?>