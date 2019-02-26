<?php  
	
	include "conn.php";

	$result=mysql_query("select * from project");
	
	$wronglist=array();
	for ($i=0; $i < 5; $i++) { 
		$wronglist[$i]=mysql_fetch_array($result,MYSQL_ASSOC);
	}

	echo json_encode($wronglist);

?>