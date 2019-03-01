"use strict";

(function ($) {
  //获取cookie
  if (getcookie('cookiesid') && getcookie('cookienum')) {
    var id = getcookie('cookiesid').split(',');
    var num = getcookie('cookienum').split(',');

    for (var i = 0; i < id.length; i++) {
      goodslist(id[i], num[i]);
    }
  }

  ; //链接数据库渲染拼接

  function goodslist(goods_id, goods_num) {
    $.ajax({
      type: "get",
      url: "http://10.31.162.198/1810-2/Project/php/goods.php",
      dataType: "json"
    }).done(function (data) {
      $.each(data, function (index, value) {
        if (goods_id == value.id) {
          var $clonebox = $('.modleul:hidden').clone(true, true);
          $clonebox.find('#pic img').attr('src', value.pic);
          $clonebox.find('#pic img').attr('sid', value.id);
          $clonebox.find('#title').html(value.title);
          $clonebox.find('.cart_price').html('￥' + value.price);
          $clonebox.find('.numinput').val(goods_num);
          $clonebox.find('.cart_subtotal').html('￥' + value.price * goods_num);
          $clonebox.css('display', 'block');
          $('.cart_list').append($clonebox);
        }
      }); //

      allprice();
    });
  }

  ; //1.计算商品总价

  function allprice() {
    var $sum = 0;
    var $count = 0;
    $('.modleul:visible').each(function (index, element) {
      if ($(element).find('.cart_allsel input').prop('checked')) {
        $sum += parseInt($(element).find('.cart_quantity .numinput').val());
        $count += parseFloat($(element).find('.cart_subtotal').html().substring(1));
      }

      $('.cart_tips').find('.f1 span').html($sum);
      $('.cart_tips').find('.f3 span').html($count);
    });
  }

  ; //2.判断cookie是否为空,显示空盒子

  empty();

  function empty() {
    if (getcookie('cookiesid') && getcookie('cookienum')) {
      $('.empty').hide();
    } else {
      $('.empty').show();
    }
  }

  ; //3.更改的数据与cookie关联  

  var arrsid = []; //商品的id

  var arrnum = []; //商品的数量
  //提前获取cookie里面id和num

  function cookietoarray() {
    if (getcookie('cookiesid') && getcookie('cookienum')) {
      arrsid = getcookie('cookiesid').split(','); //cookie商品的sid  

      arrnum = getcookie('cookienum').split(','); //cookie商品的num
    }
  }

  ;

  function setcookie(obj) {
    cookietoarray();
    var $index = obj.parents('ul').find('.cart_goods img').attr('sid');
    console.log($index);
    arrnum[$.inArray($index, arrsid)] = obj.parents('ul').find('.numinput').val();
    addcookie('cookienum', arrnum.toString(), 10);
  }

  ; //4.删除cookie

  function delcookiecart(sid, arrsid) {
    var $index = -1;
    $.each(arrsid, function (index, value) {
      if (sid == value) {
        $index = index;
      }
    });
    arrsid.splice($index, 1); //删除数组对应的值

    arrnum.splice($index, 1); //删除数组对应的值

    addcookie('cookiesid', arrsid.toString(), 10); //添加cookie

    addcookie('cookienum', arrnum.toString(), 10); //添加cookie
  }

  ; //5.增减商品数量
  //增加

  $('.goodsnum .increase').click(function () {
    var $sum = $(this).parents('.goodsnum').find('.numinput').val();
    console.log($sum);
    $sum++;
    if ($sum >= 99) $sum = 99;
    $(this).parents('.goodsnum').find('.numinput').val($sum);
    $(this).parents('ul').find('.cart_subtotal').html('￥' + singleprice($(this)));
    allprice();
    setcookie($(this));
  }); //减少

  $('.goodsnum .reduce').click(function () {
    var $sum = $(this).parents('.goodsnum').find('.numinput').val();
    console.log($sum);
    $sum--;
    if ($sum <= 1) $sum = 1;
    $(this).parents('.goodsnum').find('.numinput').val($sum);
    $(this).parents('ul').find('.cart_subtotal').html('￥' + singleprice($(this)));
    allprice();
    setcookie($(this));
  }); //手动填写

  $('.numinput').on('keyup', function () {
    var $reg = /^\d+$/g; //只能输入数字

    var $value = parseInt($(this).val());

    if ($reg.test($value)) {
      if ($value >= 99) {
        //限定范围
        $(this).val(99);
      } else if ($value <= 0) {
        $(this).val(1);
      } else {
        $(this).val($value);
      }
    } else {
      $(this).val(1);
    }

    $(this).parents('ul').find('.cart_subtotal').html('￥' + singleprice($(this))); //改变后的价格

    allprice();
    setcookie($(this));
  }); //6.计算数量改变后单个商品价格

  function singleprice(obj) {
    var $dj = parseFloat(obj.parents('ul').find('.cart_price').html().substring(1)); //单价

    var $cnum = parseInt(obj.parents('ul').find('.cart_quantity .numinput').val()); //数量

    return $dj * $cnum; //结果
  }

  ; //7.全选按钮

  $('#allsel').on('change', function () {
    $('.modleul:visible').find(':checkbox').prop('checked', $(this).prop('checked'));
    $('#allsel').prop('checked', $(this).prop('checked'));
    allprice();
  });
  var onesels = $('.modleul:visible').find('.onesel:checkbox');
  $('.cart_list').on('change', onesels, function () {
    if ($('.modleul:visible').find('.onesel:checkbox').length == $('.modleul:visible').find('.onesel:checked').length) {
      $('#allsel').prop('checked', true);
    } else {
      $('#allsel').prop('checked', false);
    }

    allprice();
  }); //8.删除按钮

  $('.cart_list').on('click', '.delbox_del', function () {
    cookietoarray();

    if (confirm('你确定要删除吗？')) {
      $(this).parents('ul').remove(); //通过当前点击的元素找到整个一行列表，删除
    }

    delcookiecart($(this).parents('ul').find('.cart_goods img').attr('sid'), arrsid);
    allprice();

    if ($(".cart_list").find(".modleul").length == 1) {
      $(".f1,.f3").find("span").html(" ");
      $(".empty").show();
    }
  }); //清空购物车

  $('#delallgoods').click(function () {
    cookietoarray();

    if (confirm('你确定要全部删除吗？')) {
      delcookie('cookiesid'); //调用封装的cookie方法

      delcookie('cookienum');
      $(".cart_list").find(".modleul:visible").remove();
      $(".f1,.f3").find("span").html(" ");
      $(".empty").show();
    }
  }); //删除选择商品

  $('#delselgoods').click(function () {
    cookietoarray();

    if (confirm('你确定要删除所选商品吗？')) {
      $(".modleul:visible").each(function (index, ele) {
        if ($('.modleul:visible').find(':checkbox').is(':checked')) {
          $('.modleul:visible').find('.onesel:checked').parents('ul').remove();
          allprice();
          delcookiecart($('.modleul:visible').find('.onesel:checked').parents('ul').find('.cart_goods img').attr('sid'), arrsid);
        }
      });
    }

    if ($(".cart_list").find(".modleul").length == 1) {
      $(".f1,.f3").find("span").html(" ");
      $(".empty").show();
    }
  }); //去结算，选择登录

  $('#gobuy').click(function () {
    if (!getcookie('username')) {
      if (confirm('请登录...')) {
        location.href = 'http://10.31.162.198/1810-2/Project/src/login.html';
      }
    } else {
      alert('应付金额：' + $('.cart_tips').find('.f3 span').html() + '元');
    }
  });
})(jQuery);
"use strict";

(function ($) {
  //数据加载部分...........................................>>
  //1.获取sid
  var picid = location.search.substring(1).split('=')[1]; //2.将当前的id传给后端获取对应的数据

  $.ajax({
    url: 'http://10.31.162.198/1810-2/Project/php/detail.php',
    data: {
      sid: picid
    },
    dataType: 'json'
  }).done(function (data) {
    $('.bigimg img').attr('src', data.pic1);
    $('.bigimg>img').attr('sid', data.id);
    $('.imglist li:eq(0) a img').attr('src', data.pic1);
    $('.imglist li:eq(1) a img').attr('src', data.pic2);
    $('.imglist li:eq(2) a img').attr('src', data.pic3);
    $('.imglist li:eq(3) a img').attr('src', data.pic4);
    $('.imglist li:eq(4) a img').attr('src', data.pic5);
    $('.info h2').html(data.title);
    $('.info h3').html(data.tips);
    $('.info #price').html('￥' + data.price);
    $('.info #sale').html(data.sale + '台');
    $('.info #evaluate').html('已有' + data.evaluate + '人评价');
  }); //3.点击按钮将商品的数量和id存放cookie中

  var arrsid = []; //商品的id

  var arrnum = []; //商品的数量
  //提前获取cookie里面id和num

  function cookietoarray() {
    if (getcookie('cookiesid') && getcookie('cookienum')) {
      arrsid = getcookie('cookiesid').split(','); //cookie商品的sid  

      arrnum = getcookie('cookienum').split(','); //cookie商品的num
    }
  }

  $('.addcart').on('click', function () {
    //点击加入购物车按钮。
    // location.reload(true);
    //判断当前的商品sid是否存在购物车(cookie)
    //判断当前的按钮对应的商品的sid和取出的cookie里面的sid进行比较
    //获取当前的按钮对应的商品的sid
    var $sid = $(this).parents('.wrapper').find('.bigimg>img').attr('sid');
    cookietoarray();

    if ($.inArray($sid, arrsid) != -1) {
      //商品存在，数量叠加 
      var num = parseInt(arrnum[$.inArray($sid, arrsid)]) + parseInt($('#buynum').val());
      arrnum[$.inArray($sid, arrsid)] = num;
      addcookie('cookienum', arrnum.toString(), 10); //数组存入cookie
    } else {
      //不存在，第一次添加。将商品的id和数量存入数组，再存入cookie.
      arrsid.push($sid); //将当前的id存入数组

      addcookie('cookiesid', arrsid.toString(), 10); //数组存入cookie

      arrnum.push($('#buynum').val());
      addcookie('cookienum', arrnum.toString(), 10); //数组存入cookie
    }

    bgbox(); //调用
  }); //效果部分...........................................>>
  //点击加入购物车按钮后弹出模态框

  function bgbox() {
    $('.bgbox').css('display', 'block');
    $('.selectbox').css('display', 'block'); //关闭按钮

    $('#bgclose').click(function () {
      $('.bgbox').css('display', 'none');
      $('.selectbox').css('display', 'none');
    }); //赋值

    $('#selectnum').html($('#buynum').val());
    var bgprice = $('#price').html().substring(1);
    $('#selectprice').html('￥' + bgprice * $('#buynum').val());
  }

  ; //增减购买数量

  calculate();

  function calculate() {
    var oVal = parseInt($('#buynum').val());
    $('.reduce').click(function () {
      oVal = parseInt($('#buynum').val());
      oVal--;
      if (oVal < 1) oVal = 1;
      $('#buynum').val(oVal);
      unuser();
    });
    $('.increase').click(function () {
      oVal = parseInt($('#buynum').val());
      oVal++;
      if (oVal > 99) oVal = 99;
      $('#buynum').val(oVal);
      unuser();
    }); //不满足条件时按钮不可点击

    unuser();

    function unuser() {
      if (oVal < 1 || oVal == 1) {
        $('.reduce').css({
          'cursor': 'not-allowed',
          'color': '#ccc'
        });
      } else {
        $('.reduce').css({
          'cursor': 'pointer',
          'color': '#333'
        });
      }
    }

    ;
  }

  ; //1.选项卡效果

  Tabs();

  function Tabs() {
    var Lis = $('.imglist>li'),
        bigimg = $('.bigimg img'),
        prev = $('.prev'),
        next = $('.next'),
        num = 0; //点击小图

    Lis.click(function () {
      num = $(this).index();
      tabs();
    }); //左右按钮切换

    next.click(function () {
      num++;
      if (num == 5) num = 0;
      tabs();
    });
    prev.click(function () {
      num--;
      if (num == -1) num = 4;
      tabs();
    }); //切换图片

    function tabs() {
      Lis.eq(num).addClass('active').siblings().removeClass('active'); //得到点击图片的src给大图显示

      bigimg.attr('src', Lis.eq(num).find('img').attr('src'));
    }

    ;
  }

  ; //2.放大镜效果

  Scale();

  function Scale() {
    $('.bigimg').hover(function () {
      $('.mouse').css('display', 'block');
      $('.show').css('display', 'block');
    }, function () {
      $('.mouse').css('display', 'none');
      $('.show').css('display', 'none');
    });
    $('.bigimg').mousemove(function (e) {
      // values: e.clientX, e.clientY, e.pageX, e.pageY
      //小盒子宽高
      var mouseWidth = $('.mouse').width();
      var mouseHeight = $('.mouse').height(); //大盒子宽高

      var bigimgWidth = $('.bigimg').width();
      var bigimgHeight = $('.bigimg').height(); //小盒子坐标

      var e = e || window.event;
      var x = e.pageX - parseInt($('.preview').offset().left) - mouseWidth / 2;
      var y = e.pageY - parseInt($('.preview').offset().top) - mouseHeight / 2; // console.log(x + '--' + y);
      // console.log($('.preview').offset())
      // console.log(e.pageX + '----' + e.pageY)
      // console.log(e.clientX + '----' + e.clientY)
      //固定小盒子坐标在大盒子里

      if (x < 0) {
        x = 0;
      } else if (x > bigimgWidth - mouseWidth) {
        x = bigimgWidth - mouseWidth;
      }

      ;

      if (y < 0) {
        y = 0;
      } else if (y > bigimgHeight - mouseHeight) {
        y = bigimgHeight - mouseHeight;
      }

      ;
      $('.mouse').css('left', x + 'px');
      $('.mouse').css('top', y + 'px'); //放大图片
      //比例

      var n = $('#showimg').width() / bigimgWidth;
      $('#showimg').css('left', -x * n + 'px');
      $('#showimg').css('top', -y * n + 'px');
    });
  }
})(jQuery);
"use strict";

(function ($) {
  //1.轮播
  carousel();

  function carousel() {
    var $Uli = $('#carousel ul li'),
        $Oli = $('#carousel ol li'),
        $prev = $('#carousel .left'),
        $next = $('#carousel .right');
    var num = 0;
    var timer = null;
    clearInterval(timer); //hover显示隐藏

    $("#carousel").hover(function () {
      $prev.stop().fadeIn(400);
      $next.stop().fadeIn(400);
      clearInterval(timer);
    }, function () {
      $prev.fadeOut(400);
      $next.fadeOut(400);
      timer = setInterval(function () {
        $next.click();
      }, 3000);
    }); //按钮点击

    $Oli.click(function () {
      num = $(this).index();
      move();
    }); //左右切换

    $next.click(function () {
      num++;
      if (num == 6) num = 0;
      move();
    });
    $prev.click(function () {
      num--;
      if (num == -1) num = 5;
      move();
    }); //自动运行

    timer = setInterval(function () {
      $next.click();
    }, 3000); //运动

    function move() {
      $Oli.eq(num).addClass('active').siblings().removeClass('active');
      $Uli.eq(num).fadeIn(600).siblings().fadeOut();
    }

    ;
  }

  ; //2.楼梯导航

  sidenav();

  function sidenav() {
    $(window).on('scroll', function () {
      var $top = $(window).scrollTop(); //获取滚动条离top的距离

      if ($top >= 400) {
        $('#side_nav').show();
        $('#side_bar').show();
      } else {
        $('#side_nav').hide();
        $('#side_bar').hide();
      }
    });
    $('#side_nav ul li').not(':last-child').on('click', function () {
      var $settop = $('.content>div').not(':first-child').eq($(this).index()).offset().top;
      $('html,body').animate({
        scrollTop: $settop
      });
    });
    $('.back_top').click(function () {
      $('html,body').animate({
        scrollTop: 0
      });
    });
    $('#side_nav ul li:last-child').click(function () {
      location.href = 'http://10.31.162.198/1810-2/Project/dist/cart.html';
    });
  }

  ; //懒加载

  $(".wrapper img").addClass("lazy").attr("data-original", function () {
    return $(this).attr("src");
  });
  $("img.lazy").lazyload({
    effect: "fadeIn"
  }); //3.数据库动态加载部分

  $.ajax({
    type: "get",
    url: "http://10.31.162.198/1810-2/Project/php/goods2.php",
    // data: "data",
    dataType: "json"
  }).done(function (data) {
    var $html = '<ul>';
    console.log(data);
    $.each(data, function (index, value) {
      $html += "\n                    <li>\n                        <a href=\"http://10.31.162.198/1810-2/Project/dist/details.html?sid=".concat(value.id, "\" target=\"_blank\">\n                            <img class=\"lazy\" data-original=\"").concat(value.pic, "\" />                           \n                            <span class=\"span_price\">\xA5").concat(value.price, "</span>\n                        </a>\n                    </li>\n                ");
    });
    $html += '</ul>';
    $('.floor_2_show').html($html); //复制部分

    for (var i = 0; i < 2; i++) {
      var $copys = $('.floor_2_show').find('ul:lt(1)').clone();
      $('.floor_2_show').append($copys);
    }

    $("img.lazy").lazyload({
      effect: "fadeIn"
    });
  }); //第八层>>猜你喜欢

  $.ajax({
    type: "get",
    url: "http://10.31.162.198/1810-2/Project/php/goods.php",
    dataType: "json"
  }).done(function (data) {
    var $html = '<ul>';
    data = data.slice(5); // console.log(data);

    $.each(data, function (index, value) {
      $html += "\n                    <li>\n                        <a href=\"http://10.31.162.198/1810-2/Project/dist/details.html?sid=".concat(value.id, "\" target=\"_blank\">\n                            <img class=\"lazy\" data-original=\"").concat(value.pic, "\"/>\n                            <span class=\"span_title\">").concat(value.title, "</span>\n                            <span class=\"span_price\">\xA5").concat(value.price, "</span>\n                        </a>\n                    </li>\n                ");
    });
    $html += '</ul>';
    $('.floor_8_list').html($html); //复制部分

    for (var i = 0; i < 2; i++) {
      var $copys = $('.floor_8_list').find('ul li:lt(8)').clone();
      $('.floor_8_list').children('ul').append($copys);
    }

    $("img.lazy").lazyload({
      effect: "fadeIn"
    });
  });
})(jQuery);
"use strict";

(function ($) {
  //1.功能部分
  //验证码
  code();

  function code() {
    var arr = [];
    var str = "";
    var a;

    for (var i = 0; i < 4; i++) {
      a = Math.floor(Math.random() * 123);

      if (48 <= a && a <= 57 || 65 <= a && a <= 90 || 97 <= a && a <= 122) {
        arr[i] = a;
      } else {
        i--;
      }
    }

    for (var j = 0; j < 4; j++) {
      str += String.fromCharCode(arr[j]);
    } // str=str.toUpperCase();
    // console.log(str.toUpperCase());


    $('#codeval').html(str);
  }

  ;
  $('#codebtn').click(function () {
    code();
  }); //验证码

  $('#code').blur(function () {
    code_validate(); // console.log($('#code').val().toUpperCase());
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
  }

  ; //2.ajax
  //用户名输入框失去焦点开始验证用户名是否存在

  $("#username1").blur(function () {
    $.ajax({
      type: "post",
      url: "http://10.31.162.198/1810-2/Project/php/login_username.php",
      data: {
        username: $('#username1').val()
      },
      dataType: "json",
      success: function success(data) {
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
        }

        ;
      }
    });
  }); //点击登录按钮验证用户和密码

  $('.login_btn').click(function () {
    var num = 0;
    var timer;
    var time = 3;
    var oData = {
      username: $('#username1').val(),
      password: $('#password1').val()
    }; //满足全部条件可登录

    $.each($('.list em'), function (index, value) {
      if (value.innerHTML == '√') {
        num++;
      }
    });
    console.log(num);

    if (num == 1) {
      //条件满足发送请求验证
      $.ajax({
        type: "post",
        url: "http://10.31.162.198/1810-2/Project/php/login.php",
        data: oData,
        dataType: "json"
      }).done(function (data) {
        if (data.res) {
          //验证成功
          //         // delcookie('username'); //删除已存在的，确保只存在一个用户
          addcookie('username', $('#username1').val(), 7); //保存登录状态

          $('.bgbox').css('display', 'block'); //弹出蒙版

          timer = setInterval(function () {
            $('#bgval').html(time);
            time--;

            if (time < 0) {
              clearInterval(timer);
              location.href = 'http://10.31.162.198/1810-2/Project/dist/';
            }
          }, 800);
        } else {
          //验证失败
          alert(data.msg);
        }

        ;
      });
    } else {
      alert('请填写正确的密码和验证码');
    }
  });
})(jQuery);
"use strict";

(function ($) {
  //1.功能部分
  //验证码
  code();

  function code() {
    var arr = [];
    var str = "";
    var a;

    for (var i = 0; i < 4; i++) {
      a = Math.floor(Math.random() * 123);

      if (48 <= a && a <= 57 || 65 <= a && a <= 90 || 97 <= a && a <= 122) {
        arr[i] = a;
      } else {
        i--;
      }
    }

    for (var j = 0; j < 4; j++) {
      str += String.fromCharCode(arr[j]);
    }

    $('#codeval').html(str);
  }

  ;
  $('#codebtn').click(function () {
    code();
  }); //正则

  var reg = {
    name: /^[a-zA-z]\w{3,15}$/,
    //用户名
    mobile: /^1[35789]\d{9}$/,
    //手机
    emali: /^([\w][\w\-\.]+)\@([\w][\w\-\.]+)\.([\w][\w\-\.]+)$/,
    //邮箱
    password: /^[a-zA-Z]\w{5,17}$/
  };
  $('#password').blur(function () {
    //密码
    pwd_validate();
  });
  $('#confirm').blur(function () {
    //密码相同
    confirm_validate();
  });
  $('#code').blur(function () {
    //验证码
    code_validate();
  }); //用户名

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
    }

    ;
  }

  ; //密码

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
    }

    ;
  }

  ; //密码相同

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
  }

  ; //验证码

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
  }

  ; //2.ajax
  //用户名输入框失去焦点开始验证用户名是否存在

  $("#username").blur(function () {
    user_validate();

    if ($('#username').parent('li').find('em').html() == '√') {
      //满足正则条件才发送请求验证
      $.ajax({
        type: "post",
        url: "http://10.31.162.198/1810-2/Project/php/login_username.php",
        data: {
          username: $('#username').val()
        },
        dataType: "json",
        success: function success(data) {
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
  $('.registor_btn').click(function () {
    var num = 0;
    var timer;
    var time = 3;
    var oData = {
      username: $('#username').val(),
      password: $('#password').val()
    }; //全部条件满足可注册
    // ('.list em').html()=='√'

    $.each($('.list em'), function (index, value) {
      if (value.innerHTML == '√') {
        num++;
      }
    });
    console.log(num);

    if (num == 3 && $('#cheksel').is(':checked')) {
      //勾选同意复选框
      $.ajax({
        type: "post",
        url: "http://10.31.162.198/1810-2/Project/php/registor.php",
        data: oData,
        dataType: "json",
        success: function success(data) {
          if (data.res) {
            $('.bgbox').css('display', 'block');
            timer = setInterval(function () {
              $('#bgval').html(time);
              time--;

              if (time < 0) {
                clearInterval(timer);
                location.href = 'http://10.31.162.198/1810-2/Project/dist/';
              }
            }, 800);
          } else {
            alert('抱歉，该用户名已存在');
          }
        }
      });
    } else {
      alert('请填写正确的格式并勾选同意');
    }
  });
})(jQuery);