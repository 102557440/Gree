(function($) {
    //1.轮播
    carousel();

    function carousel() {
        var $Uli = $('#carousel ul li'),
            $Oli = $('#carousel ol li'),
            $prev = $('#carousel .left'),
            $next = $('#carousel .right');
        var num = 0;
        var timer = null;
        clearInterval(timer);
        //hover显示隐藏
        $("#carousel").hover(function() {
            $prev.stop().fadeIn(400);
            $next.stop().fadeIn(400);
            clearInterval(timer);
        }, function() {
            $prev.fadeOut(400);
            $next.fadeOut(400);
            timer = setInterval(function() {
                $next.click();
            }, 3000)
        });
        //按钮点击
        $Oli.click(function() {
            num = $(this).index();
            move();
        });
        //左右切换
        $next.click(function() {
            num++;
            if (num == 6) num = 0;
            move();
        });
        $prev.click(function() {
            num--;
            if (num == -1) num = 5;
            move();
        });
        //自动运行
        timer = setInterval(function() {
            $next.click();
        }, 3000);
        //运动
        function move() {
            $Oli.eq(num).addClass('active').siblings().removeClass('active');
            $Uli.eq(num).fadeIn(600).siblings().fadeOut();
        };
    };
    //2.楼梯导航
    sidenav();

    function sidenav() {
        $(window).on('scroll', function() {
            var $top = $(window).scrollTop(); //获取滚动条离top的距离
            if ($top >= 400) {
                $('#side_nav').show();
                $('#side_bar').show();
            } else {
                $('#side_nav').hide();
                $('#side_bar').hide();
            }
        });
        $('#side_nav ul li').not(':last-child').on('click', function() {
            var $settop = $('.content>div').not(':first-child').eq($(this).index()).offset().top;
            $('html,body').animate({
                scrollTop: $settop
            });
        });
        $('.back_top').click(function() {
            $('html,body').animate({
                scrollTop: 0
            });
        });
        $('#side_nav ul li:last-child').click(function() {
            location.href = 'http://10.31.162.198/1810-2/Project/src/cart.html';
        });
    };
    //懒加载
    // $(".wrapper li img").addClass("lazy").css({
    //     width: 220,
    //     height: 220
    // }).attr("data-original", function() {
    //     return $(this).attr("src")
    // });
    // $("img.lazy").lazyload({
    //     effect: "fadeIn"
    // });
    //3.数据库动态加载部分
    $.ajax({
        type: "get",
        url: "http://10.31.162.198/1810-2/Project/php/goods2.php",
        // data: "data",
        dataType: "json",
    }).done(function(data) {
        var $html = '<ul>';
        $.each(data, function(index, value) {
            $html += `
                    <li>
                        <a href="http://10.31.162.198/1810-2/Project/src/details.html?sid=${value.id}" target="_blank">
                            <img class="lazy" data-original="${value.pic}" width:"220" height:"220"/>                           
                            <span class="span_price">¥${value.price}</span>
                        </a>
                    </li>
                `;
        });
        $html += '</ul>';
        $('.floor_2_show').html($html);
        //复制部分
        for (var i = 0; i < 2; i++) {
            var $copys = $('.floor_2_show').find('ul:lt(1)').clone();
            $('.floor_2_show').append($copys);
        }
        $("img.lazy").lazyload({
            effect: "fadeIn"
        });
    });
    //第八层>>猜你喜欢
    $.ajax({
        type: "get",
        url: "http://10.31.162.198/1810-2/Project/php/goods.php",
        dataType: "json",
    }).done(function(data) {
        var $html = '<ul>';
        data = data.slice(5);
        // console.log(data);
        $.each(data, function(index, value) {
            $html += `
                    <li>
                        <a href="http://10.31.162.198/1810-2/Project/src/details.html?sid=${value.id}" target="_blank">
                            <img class="lazy" data-original="${value.pic}" width="160" height="160"/>
                            <span class="span_title">${value.title}</span>
                            <span class="span_price">¥${value.price}</span>
                        </a>
                    </li>
                `;
        });
        $html += '</ul>';
        $('.floor_8_list').html($html);
        //复制部分
        for (var i = 0; i < 2; i++) {
            var $copys = $('.floor_8_list').find('ul li:lt(8)').clone();
            $('.floor_8_list').children('ul').append($copys);
        }
        $("img.lazy").lazyload({
            effect: "fadeIn"
        });
    });

})(jQuery);