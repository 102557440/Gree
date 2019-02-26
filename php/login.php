<?php
    include "conn.php";
    
	$username=$_POST['username'];
    $password=md5($_POST['password']);

    $sql1 = "SELECT * FROM `user` WHERE (`username`='$username' and  `password`='$password')";  //查询前台传入的
    $data = mysql_query($sql1);

   $result = mysql_fetch_array($data); //将查询结果提取成数组
    // print_r($result);
   if($result){
       echo '{"status":200,"msg":"登录成功" ,"res":true}';
   }else{
       echo '{"status":200,"msg":"登录失败，密码或账号错误，请核对后重新登陆" ,"res":false}';
   }

?>