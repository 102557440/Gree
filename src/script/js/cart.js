(function($) {
    //获取cookie
    if (getcookie('cookiesid') && getcookie('cookienum')) {
        var id = getcookie('cookiesid').split(',');
        var num = getcookie('cookienum').split(',');
        for (var i = 0; i < id.length; i++) {
            goodslist(id[i], num[i]);
        }
    };
    //链接数据库渲染拼接
    function goodslist(goods_id, goods_num) {
        $.ajax({
            type: "get",
            url: "http://10.31.162.198/1810-2/Project/php/goods.php",
            dataType: "json",
        }).done(function(data) {
            $.each(data, function(index, value) {
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
            });
            //
            allprice();
        });
    };
    //1.计算商品总价
    function allprice() {
        var $sum = 0;
        var $count = 0;
        $('.modleul:visible').each(function(index, element) {
            if ($(element).find('.cart_allsel input').prop('checked')) {
                $sum += parseInt($(element).find('.cart_quantity .numinput').val());
                $count += parseFloat($(element).find('.cart_subtotal').html().substring(1));
            }
            $('.cart_tips').find('.f1 span').html($sum);
            $('.cart_tips').find('.f3 span').html($count);
        });
    };
    //2.判断cookie是否为空,显示空盒子
    empty();

    function empty() {
        if (getcookie('cookiesid') && getcookie('cookienum')) {
            $('.empty').hide();
        } else {
            $('.empty').show();
        }
    };
    //3.更改的数据与cookie关联  
    var arrsid = []; //商品的id
    var arrnum = []; //商品的数量

    //提前获取cookie里面id和num
    function cookietoarray() {
        if (getcookie('cookiesid') && getcookie('cookienum')) {
            arrsid = getcookie('cookiesid').split(','); //cookie商品的sid  
            arrnum = getcookie('cookienum').split(','); //cookie商品的num
        }
    };

    function setcookie(obj) {
        cookietoarray();
        var $index = obj.parents('ul').find('.cart_goods img').attr('sid');
        console.log($index)
        arrnum[$.inArray($index, arrsid)] = obj.parents('ul').find('.numinput').val();
        addcookie('cookienum', arrnum.toString(), 10);
    };
    //4.删除cookie
    function delcookiecart(sid, arrsid) {
        var $index = -1;
        $.each(arrsid, function(index, value) {
            if (sid == value) {
                $index = index;
            }
        });
        arrsid.splice($index, 1); //删除数组对应的值
        arrnum.splice($index, 1); //删除数组对应的值
        addcookie('cookiesid', arrsid.toString(), 10); //添加cookie
        addcookie('cookienum', arrnum.toString(), 10); //添加cookie
    };
    //5.增减商品数量
    //增加
    $('.goodsnum .increase').click(function() {
        var $sum = $(this).parents('.goodsnum').find('.numinput').val();
        console.log($sum);
        $sum++;
        if ($sum >= 99) $sum = 99;
        $(this).parents('.goodsnum').find('.numinput').val($sum);
        $(this).parents('ul').find('.cart_subtotal').html('￥' + singleprice($(this)));
        allprice();
        setcookie($(this));
    });
    //减少
    $('.goodsnum .reduce').click(function() {
        var $sum = $(this).parents('.goodsnum').find('.numinput').val();
        console.log($sum);
        $sum--;
        if ($sum <= 1) $sum = 1;
        $(this).parents('.goodsnum').find('.numinput').val($sum);
        $(this).parents('ul').find('.cart_subtotal').html('￥' + singleprice($(this)));
        allprice();
        setcookie($(this));
    });
    //手动填写
    $('.numinput').on('keyup', function() {
        var $reg = /^\d+$/g; //只能输入数字
        var $value = parseInt($(this).val());
        if ($reg.test($value)) {
            if ($value >= 99) { //限定范围
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
    });

    //6.计算数量改变后单个商品价格
    function singleprice(obj) {
        var $dj = parseFloat(obj.parents('ul').find('.cart_price').html().substring(1)); //单价
        var $cnum = parseInt(obj.parents('ul').find('.cart_quantity .numinput').val()); //数量
        return $dj * $cnum; //结果
    };
    //7.全选按钮
    $('#allsel').on('change', function() {
        $('.modleul:visible').find(':checkbox').prop('checked', $(this).prop('checked'));
        $('#allsel').prop('checked', $(this).prop('checked'));
        allprice();
    });
    var onesels = $('.modleul:visible').find('.onesel:checkbox');
    $('.cart_list').on('change', onesels, function() {
        if ($('.modleul:visible').find('.onesel:checkbox').length == $('.modleul:visible').find('.onesel:checked').length) {
            $('#allsel').prop('checked', true)
        } else {
            $('#allsel').prop('checked', false)
        }
        allprice();
    });
    //8.删除按钮
    $('.cart_list').on('click', '.delbox_del', function() {
        cookietoarray();
        if (confirm('你确定要删除吗？')) {
            $(this).parents('ul').remove(); //通过当前点击的元素找到整个一行列表，删除
        }
        delcookiecart($(this).parents('ul').find('.cart_goods img').attr('sid'), arrsid);
        allprice();
    });
    //清空购物车
    $('#delallgoods').click(function() {
        cookietoarray();
        if (confirm('你确定要全部删除吗？')) {
            delcookie('cookiesid'); //调用封装的cookie方法
            delcookie('cookienum');
        }
    });
    //删除选择商品
    $('#delselgoods').click(function() {
        cookietoarray();
        if (confirm('你确定要删除所选商品吗？')) {
            if ($('.modleul:visible').find(':checkbox').is(':checked')) {
                $('.modleul:visible').find('.onesel:checked').parents('ul').remove();
                delcookiecart($('.modleul:visible').find('.onesel:checked').parents('ul').find('.cart_goods img').attr('sid'), arrsid);
            }
        }
    });

    //去结算，选择登录
    $('#gobuy').click(function() {
        if (!getcookie('username')) {
            if (confirm('请登录...')) {
                location.href = 'http://10.31.162.198/1810-2/Project/src/login.html';
            }
        } else {
            alert('应付金额：' + $('.cart_tips').find('.f3 span').html() + '元')
        }
    });
})(jQuery);