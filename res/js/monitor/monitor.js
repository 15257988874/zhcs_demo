layui.config({
    base: '../../../../res/dep/layer/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table', 'gridBtn', 'form','deptTree','element'], function () {
    
    var map,
    curSelectList= [
        {'name':'污水井盖'},
        {'name':'上水井预留盖'}/* ,
        {'name':'下水井盖'},
        {'name':'电力井盖'},
        {'name':'输气井盖'},
        {'name':'化粪池井盖'},
        {'name':'公安井盖'},
        {'name':'中水井盖'}  */
    ],
    allList=[
        {'name':'污水井盖'},
        {'name':'上水井预留盖'},
        {'name':'下水井盖'},
        {'name':'电力井盖'},
        {'name':'输气井盖'},
        {'name':'化粪池井盖'},
        {'name':'公安井盖'},
        {'name':'中水井盖'}
    ];
    pageInit();
    /* 功能函数---------------------------------------------------------------------------------- */
    function  pageInit(){
        map=new YcyaMap('ycyaMap');
        map.ready(function(){
            // map.setMapStyle('midnight');
        });
        createTypeList(
            allList,
            curSelectList
        );//生成地图显示弹窗中的井盖类型
        bindEvents(); //事件绑定
    }
    function bindEvents(){
        //左上总按钮
        $('#masterBtn').click(function(){
            $(this).find('#masterList,.master-list-triangle').toggle(500);
            $('.map-search').hide();
            $('#toolBox').find('.master-list,.master-list-triangle').hide();
        });
        //搜索框
        $('#searchBox').click(function(){
            $('.map-search').toggle(500);
            $('#toolBox').find('.master-list,.master-list-triangle').hide();
            $('#masterBtn').find('#masterList,.master-list-triangle').hide();
        });
        //工具箱
        $('#toolBox').click(function(){
            $(this).find('.master-list,.master-list-triangle').toggle(500);
            $('.map-search').hide();
            $('#masterBtn').find('.master-list,.master-list-triangle').hide();
        });
        //选择部门
        var deptLiLeft=$('.map-wrap').width()-86-355;
        $('#deptLi').click(function(){
            var elm=$('#deptBox');
            app.openLayer({
                title:'选择部门',
                offset:['82px',deptLiLeft],
                btn:['确定','关闭'],
                shade:0,
                area:'392px',
                content:elm,
                end:function(){
                    elm.hide();
                }
            });
        });
        //运行情况
        $('#runToggle').click(function(){
            $('.run-status-box').toggle();
            if($(this).css('left')=='23px'){
                $(this).css('left',330);
            }else{
                $(this).css('left',23);
            }
        });
        //地图显示
        $('#selectShow').click(function(){
            var elm=$('#mapShow');
            app.openLayer({
                title:'地图显示设置',
                offset:['82px',deptLiLeft],
                btn:['确定','关闭'],
                shade:0,
                area:'384px',
                content:elm,
                end:function(){
                    elm.hide();
                }
            });
        });
        //地图显示-当前选择-取消
        $('.choosed-type').on('click','.choosed-type-item-close',function(){
            var text= $(this).parent().text();
            $(this).parent().remove();
            $('.to-choose-type li').each(function(){
                if( $(this).text()==text){
                    $(this).removeClass('active');
                    return false;
                }
            });
            if($('.to-choose-type-all').hasClass('active')){
                $('.to-choose-type-all').removeClass('active');
            }
            if($('.choosed-type .choosed-type-item').length==0){
                $('.choosed-type').hide(500);
            }
        });
        //地图显示-全部
        $('#chooseTypeAll .to-choose-type-all').click(function(){
            if($(this).hasClass('active')){
                $(this).removeClass('active');
                $('.to-choose-type li').each(function(){
                    $(this).removeClass('active');
                });
                $('.choosed-type').hide(500).html('');
            }else{
                $(this).addClass('active');
                $('.to-choose-type li').each(function(){
                    $(this).addClass('active');
                });
                var arr=[];
                $('.to-choose-type li').each(function(){
                    $(this).addClass('active');
                    arr.push('<span class="choosed-type-item">'+$(this).text()+'<i class="choosed-type-item-close"></i></span>');
                });
                $('.choosed-type').show().html(arr.join(''));
            }
        });
        //地图显示-选择
        $('.to-choose-type').on('click','.to-choose-type-item',function(){
            if( $(this).hasClass('active') ){
                var text= $(this).text();
                $(this).removeClass('active');
                
                $('.choosed-type .choosed-type-item').each(function(){
                   if( $(this).text()==text){
                        $(this).remove();
                        return false;
                   }
                });
                if( $('.choosed-type .choosed-type-item').length==0){
                    $('.choosed-type ').hide(500);                
                }
                var a=$('#chooseTypeAll .to-choose-type-all');
                if(a.hasClass('active')){
                    a.removeClass('active');
                }   
                
            }else{
                $('.choosed-type').show();
                $(this).addClass('active');
                if( $('.to-choose-type .active').length== allList.length){
                    $('#chooseTypeAll .to-choose-type-all').addClass('active');
                }
                $('.choosed-type').append('<span class="choosed-type-item">'+$(this).text()+'<i class="choosed-type-item-close"></i></span>')
            }
        });
        //查看各类井盖运行情况
        var checkWellTop=$('.map-wrap').height()-$('.run-status-box').height()-$('#wellCoverOperation').height()-70;
        $('#checkWell').click(function(){
            var elm=$('#wellCoverOperation');
            app.openLayer({
                title:'井盖设施运行情况',
                offset:[checkWellTop,'38px'],
                shade:0,
                area:'500px',
                content:elm,
                end:function(){
                    elm.hide();
                }
            })
        });
        //高级查询
        $('#seniorSearchBtn').click(function(){
            var elm=$('#seniorSearch');
            app.openLayer({
                title:'设施查询',
                offset:['82px',deptLiLeft],
                btn:['确定','关闭'],
                shade:0,
                area:'392px',
                content:elm,
                end:function(){
                    elm.hide();
                }
            });
        });
        //各类状态具体信息toConditionList
        $('.run-status-list>li').click(function(){
            openConditionList( $(this).attr('data-title'),$(this).attr('data-status'));
        });
        //地图层级缩放
        $('#zoomIn').click(function(){
            map.zoomIn();
        });
        $('#zoomOut').click(function(){
            map.zoomOut();
        });
    }
    /**
     *生成地图显示弹窗中的井盖类型
     *
     * @param {*} typeList array 井盖数组
     * @param {*} selectList array 已选中的井盖数组
     */
    function createTypeList(typeList,selectList){
        var la=[],
            sa=[];
        for(var i=0;i<typeList.length;i++){
            la.push('<li class="to-choose-type-item">'+typeList[i].name+'<i class="item-choosed"></i></li>');
        }
        $('.to-choose-type').html(la.join(''));
        if(selectList.length>0){
            if(selectList.length==typeList.length){
                $('.to-choose-type li').each(function(){
                    $(this).addClass('active');
                    sa.push('<span class="choosed-type-item">'+$(this).text()+'<i class="choosed-type-item-close"></i></span>');
                });
            }else{
                $('.to-choose-type li').each(function(){
                    for(var i=0;i<selectList.length;i++){
                       if( selectList[i].name==$(this).text()){
                           $(this).addClass('active');
                           sa.push('<span class="choosed-type-item">'+selectList[i].name+'<i class="choosed-type-item-close"></i></span>');
                       }
                    } 
                });
            }
            $('.choosed-type').html(sa.join(''));
        }
    }
    function openConditionList(titleName,searchStatus,searchTypeId){
        var elm=$('#toConditionList');
        app.openLayer({
            title:titleName,
            shade:0,
            area:'462px',
            content:elm,
            success:function(){
                
            },
            end:function(){
                elm.hide();
            }
        });
    }
});