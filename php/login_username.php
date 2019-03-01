<?php
    include "conn.php";
    
	$username=$_POST['username'];

    $sql1 = "SELECT * FROM `user` WHERE (`username`='$username')";  //查询前台传入的
    $data = mysql_query($sql1);

   $result = mysql_fetch_array($data); //将查询结果提取成数组
    // print_r($result);
   if($username == $result[0]){
       echo '{"msg":"√" ,"res":true}';
   }else{
       echo '{"msg":"该用户名不存在，请核对后重新登陆" ,"res":false}';
   }

?>