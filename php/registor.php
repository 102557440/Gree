<?php
	include "conn.php";
	
	$username=$_POST['username'];
    $password=md5($_POST['password']);

    $sql1 = "SELECT * FROM `user` WHERE (`username`='$username')";  //查询前台传入的手机号
    $data = mysql_query($sql1);//执行sql语句
    $result = mysql_fetch_array($data); //将查询结果提取成数组
    // print_r($result);
    if($result){
        echo '{"status":200,"msg":"该账号已注册","res":false}';
    }else{
        $sql2 = "INSERT INTO `user`(`username`,`password`,`zhucetime`) VALUES ('$username','$password',NOW())";
        $count = mysql_query($sql2); // 增加 删除 修改 返回受影响的行数
        if($count==1){
            echo '{"status":200,"msg":"注册成功","res":true}';
        }
    }


    // $result=mysql_query("select * from user");

	// $wronglist=mysql_fetch_array($result,MYSQL_ASSOC);
	
	// echo json_encode($wronglist);

?>