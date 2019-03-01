(function($) {
    //数据加载部分...........................................>>
    //1.获取sid
    var picid = location.search.substring(1).split('=')[1];

    //2.将当前的id传给后端获取对应的数据
    $.ajax({
        url: 'http://10.31.162.198/1810-2/Project/php/detail.php',
        data: {
            sid: picid
        },
        dataType: 'json'
    }).done(function(data) {
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
    });

    //3.点击按钮将商品的数量和id存放cookie中
    var arrsid = []; //商品的id
    var arrnum = []; //商品的数量

    //提前获取cookie里面id和num
    function cookietoarray() {
        if (getcookie('cookiesid') && getcookie('cookienum')) {
            arrsid = getcookie('cookiesid').split(','); //cookie商品的sid  
            arrnum = getcookie('cookienum').split(','); //cookie商品的num
        }
    }
    $('.addcart').on('click', function() { //点击加入购物车按钮。
        // location.reload(true);
        //判断当前的商品sid是否存在购物车(cookie)
        //判断当前的按钮对应的商品的sid和取出的cookie里面的sid进行比较
        //获取当前的按钮对应的商品的sid
        var $sid = $(this).parents('.wrapper').find('.bigimg>img').attr('sid');
        cookietoarray();
        if ($.inArray($sid, arrsid) != -1) { //商品存在，数量叠加 
            var num = parseInt(arrnum[$.inArray($sid, arrsid)]) + parseInt($('#buynum').val());
            arrnum[$.inArray($sid, arrsid)] = num;
            addcookie('cookienum', arrnum.toString(), 10); //数组存入cookie

        } else { //不存在，第一次添加。将商品的id和数量存入数组，再存入cookie.
            arrsid.push($sid); //将当前的id存入数组
            addcookie('cookiesid', arrsid.toString(), 10); //数组存入cookie
            arrnum.push($('#buynum').val());
            addcookie('cookienum', arrnum.toString(), 10); //数组存入cookie
        }
        bgbox(); //调用
    });
    //效果部分...........................................>>
    //点击加入购物车按钮后弹出模态框
    function bgbox() {
        $('.bgbox').css('display', 'block');
        $('.selectbox').css('display', 'block');
        //关闭按钮
        $('#bgclose').click(function() {
            $('.bgbox').css('display', 'none');
            $('.selectbox').css('display', 'none');
        });
        //赋值
        $('#selectnum').html($('#buynum').val());
        var bgprice = $('#price').html().substring(1);
        $('#selectprice').html('￥' + bgprice * $('#buynum').val());
    };
    //增减购买数量
    calculate();

    function calculate() {
        var oVal = parseInt($('#buynum').val());
        $('.reduce').click(function() {
            oVal = parseInt($('#buynum').val());
            oVal--;
            if (oVal < 1) oVal = 1;
            $('#buynum').val(oVal);
            unuser();
        });
        $('.increase').click(function() {
            oVal = parseInt($('#buynum').val());
            oVal++;
            if (oVal > 99) oVal = 99;
            $('#buynum').val(oVal);
            unuser();
        });
        //不满足条件时按钮不可点击
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
        };
    };
    //1.选项卡效果
    Tabs();

    function Tabs() {
        var Lis = $('.imglist>li'),
            bigimg = $('.bigimg img'),
            prev = $('.prev'),
            next = $('.next'),
            num = 0;
        //点击小图
        Lis.click(function() {
            num = $(this).index();
            tabs();
        });
        //左右按钮切换
        next.click(function() {
            num++;
            if (num == 5) num = 0;
            tabs();
        });
        prev.click(function() {
            num--;
            if (num == -1) num = 4;
            tabs();
        });
        //切换图片
        function tabs() {
            Lis.eq(num).addClass('active').siblings().removeClass('active');
            //得到点击图片的src给大图显示
            bigimg.attr('src', Lis.eq(num).find('img').attr('src'));
        };
    };
    //2.放大镜效果
    Scale();

    function Scale() {
        $('.bigimg').hover(function() {
            $('.mouse').css('display', 'block');
            $('.show').css('display', 'block');
        }, function() {
            $('.mouse').css('display', 'none');
            $('.show').css('display', 'none');
        });
        $('.bigimg').mousemove(function(e) {
            // values: e.clientX, e.clientY, e.pageX, e.pageY
            //小盒子宽高
            var mouseWidth = $('.mouse').width();
            var mouseHeight = $('.mouse').height();
            //大盒子宽高
            var bigimgWidth = $('.bigimg').width();
            var bigimgHeight = $('.bigimg').height();
            //小盒子坐标
            var e = e || window.event;
            var x = e.pageX - parseInt($('.preview').offset().left) - mouseWidth / 2;
            var y = e.pageY - parseInt($('.preview').offset().top) - mouseHeight / 2;
            // console.log(x + '--' + y);
            // console.log($('.preview').offset())
            // console.log(e.pageX + '----' + e.pageY)
            // console.log(e.clientX + '----' + e.clientY)
            //固定小盒子坐标在大盒子里
            if (x < 0) {
                x = 0;
            } else if (x > bigimgWidth - mouseWidth) {
                x = bigimgWidth - mouseWidth;
            };
            if (y < 0) {
                y = 0;
            } else if (y > bigimgHeight - mouseHeight) {
                y = bigimgHeight - mouseHeight
            };
            $('.mouse').css('left', x + 'px');
            $('.mouse').css('top', y + 'px');
            //放大图片
            //比例
            var n = $('#showimg').width() / bigimgWidth;
            $('#showimg').css('left', -x * n + 'px');
            $('#showimg').css('top', -y * n + 'px');
        });
    }
})(jQuery);