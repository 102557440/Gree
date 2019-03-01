(function($) {
    //1.功能部分
    //验证码
    code();

    function code() {
        var arr = [];
        var str = "";
        var a;
        for (var i = 0; i < 4; i++) {
            a = Math.floor(Math.random() * 123);
            if ((48 <= a && a <= 57) || (65 <= a && a <= 90) || (97 <= a && a <= 122)) {
                arr[i] = a;
            } else {
                i--;
            }
        }
        for (var j = 0; j < 4; j++) {
            str += String.fromCharCode(arr[j]);
        }
        // str=str.toUpperCase();
        // console.log(str.toUpperCase());
        $('#codeval').html(str);
    };
    $('#codebtn').click(function() {
        code();
    });
    //验证码
    $('#code').blur(function() {
        code_validate();
        // console.log($('#code').val().toUpperCase());
    });

    function code_validate() {
        if ($('#codeval').html().toUpperCase() === $('#code').val().toUpperCase()) {
            $('#code').parent('li').find('em').html('√').css({
                'font-weight': '700',
                'color': 'green'
            });
        } else {
            $('#code').parent('li').find('em').html('验证码不正确').css({
                'font-weight': '400',
                'color': 'red'
            });
            code();
        }
    };

    //2.ajax
    //用户名输入框失去焦点开始验证用户名是否存在
    $("#username1").blur(function() {
        $.ajax({
            type: "post",
            url: "http://10.31.162.198/1810-2/Project/php/login_username.php",
            data: { username: $('#username1').val() },
            dataType: "json",
            success: function(data) {
                if (data.res) {
                    $('#username1').parent('li').find('em').html('').css({
                        'font-weight': '700',
                        'color': 'green'
                    });
                } else {
                    $('#username1').parent('li').find('em').html(data.msg).css({
                        'font-weight': '400',
                        'color': 'red'
                    });
                };
            }
        });
    });
    //点击登录按钮验证用户和密码
    $('.login_btn').click(function() {
        var num = 0;
        var timer;
        var time = 3;
        var oData = {
            username: $('#username1').val(),
            password: $('#password1').val(),
        };
        //满足全部条件可登录
        $.each($('.list em'), function(index, value) {
            if (value.innerHTML == '√') {
                num++;
            }
        });
        console.log(num);
        if (num == 1) { //条件满足发送请求验证
            $.ajax({
                type: "post",
                url: "http://10.31.162.198/1810-2/Project/php/login.php",
                data: oData,
                dataType: "json",
            }).done(function(data) {
                if (data.res) { //验证成功
                    //         // delcookie('username'); //删除已存在的，确保只存在一个用户
                    addcookie('username', $('#username1').val(), 7); //保存登录状态
                    $('.bgbox').css('display', 'block'); //弹出蒙版
                    timer = setInterval(function() {
                        $('#bgval').html(time);
                        time--;
                        if (time < 0) {
                            clearInterval(timer);
                            location.href = 'http://10.31.162.198/1810-2/Project/dist/';
                        }
                    }, 800);
                } else { //验证失败
                    alert(data.msg)
                };
            });
        } else {
            alert('请填写正确的密码和验证码');
        }
    });
})(jQuery);