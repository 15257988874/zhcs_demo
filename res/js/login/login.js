layui.config({
    base: '../..'+location.pathname+'res/dep/layer/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'user'], function () {
    var $ = layui.$,
        setter = layui.setter,
        admin = layui.admin,
        form = layui.form,
        router = layui.router(),
        search = router.search;
    form.render();
    $('.layui-form .layui-icon-close').click(function(){
        $(this).hide().siblings('input').val('').focus();
    });
    emptyInput($('#LAY-user-login-username'));
    emptyInput($('#LAY-user-login-password'));
    //提交
    form.on('submit(LAY-user-login-submit)', function (obj) {    
        obj.field.pwd=hex_md5(obj.field.pwd);
        app.ycyaAjax({
            url:'sys/login',
            data:obj.field,
            success:function(data){
                ycya.http.setToken(data.data.token,app.url +'sys/token',data.data);
                    layer.msg('登入成功', {
                        offset: '15px',
                        icon: 1,
                        time: 500
                    },function () {
                        $("#bar").animate({right: 0},1000, 'swing',function(){
                        location.href = 'page/default/main/main.html'; //后台主页
                    });	    
                });
            },
            // 测试
            error:function(){
                $("#bar").animate({right: 0},1000, 'swing',function(){
                    location.href = 'page/default/main/main.html'; //后台主页
                });	
            }
        })
    });

    /**
     * 清空input 
     * 
     * @param {any} dom jquery元素
     */
    function emptyInput(dom){
        dom.keyup(function(){
            var closeElm=$(this).siblings('.layui-icon-close');
            $(this).val()!==''?closeElm.show():closeElm.hide();
        });
    }
});