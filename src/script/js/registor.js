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
        $('#codeval').html(str);
    };
    $('#codebtn').click(function() {
        code();
    });
    //正则
    var reg = {
        name: /^[a-zA-z]\w{3,15}$/, //用户名
        mobile: /^1[35789]\d{9}$/, //手机
        emali: /^([\w][\w\-\.]+)\@([\w][\w\-\.]+)\.([\w][\w\-\.]+)$/, //邮箱
        password: /^[a-zA-Z]\w{5,17}$/
    };

    $('#password').blur(function() { //密码
        pwd_validate();
    });
    $('#confirm').blur(function() { //密码相同
        confirm_validate();
    });
    $('#code').blur(function() { //验证码
        code_validate();
    });
    //用户名
    function user_validate() {
        if (reg.name.test($('#username').val()) || reg.emali.test($('#username').val()) || reg.mobile.test($('#username').val())) {
            $('#username').parent('li').find('em').html('√').css({
                'font-weight': '700',
                'color': 'green'
            });
        } else {
            $('#username').parent('li').find('em').html('请输入正确的格式').css({
                'font-weight': '400',
                'color': 'red'
            });
        };
    };
    //密码
    function pwd_validate() {
        if (reg.password.test($('#password').val())) {
            $('#password').parent('li').find('em').html('√').css({
                'font-weight': '700',
                'color': 'green'
            });
        } else {
            $('#password').parent('li').find('em').html('以字母开头，长度在6~18之间，只能包含字符、数字和下划线').css({
                'font-weight': '400',
                'color': 'red'
            });
        };
    };
    //密码相同
    function confirm_validate() {
        if ($('#confirm').val() == $('#password').val() && $('#confirm').val().length >= 6) {
            $('#confirm').parent('li').find('em').html('√').css({
                'font-weight': '700',
                'color': 'green'
            });
        } else {
            $('#confirm').parent('li').find('em').html('密码必须一致且不少于6位数').css({
                'font-weight': '400',
                'color': 'red'
            });
        }
    };
    //验证码
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
    $("#username").blur(function() {
        user_validate();
        if ($('#username').parent('li').find('em').html() == '√') { //满足正则条件才发送请求验证

            $.ajax({
                type: "post",
                url: "http://10.31.162.198/1810-2/Project/php/login_username.php",
                data: { username: $('#username').val() },
                dataType: "json",
                success: function(data) {
                    if (!data.res) {
                        $('#username').parent('li').find('em').html('该用户名可以使用').css({
                            'font-weight': '700',
                            'color': 'green'
                        });
                    } else {
                        $('#username').parent('li').find('em').html('抱歉，该用户名已存在').css({
                            'font-weight': '400',
                            'color': 'red'
                        });
                    }
                }
            });
        }

    });

    $('.registor_btn').click(function() {
        var num = 0;
        var timer;
        var time = 3;
        var oData = {
            username: $('#username').val(),
            password: $('#password').val(),
        };
        //全部条件满足可注册
        // ('.list em').html()=='√'
        $.each($('.list em'), function(index, value) {
            if (value.innerHTML == '√') {
                num++;
            }
        });
        console.log(num);
        if (num == 3 && $('#cheksel').is(':checked')) { //勾选同意复选框
            $.ajax({
                type: "post",
                url: "http://10.31.162.198/1810-2/Project/php/registor.php",
                data: oData,
                dataType: "json",
                success: function(data) {
                    if (data.res) {
                        $('.bgbox').css('display', 'block');
                        timer = setInterval(function() {
                            $('#bgval').html(time);
                            time--;
                            if (time == 0) {
                                clearInterval(timer);
                                location.href = 'http://10.31.162.198/1810-2/Project/src/login.html';
                            }
                        }, 800);
                    } else {
                        alert('抱歉，该用户名已存在')
                    }
                }
            });
        } else {
            alert('请填写正确的格式并勾选同意');
        }
    });

})(jQuery);