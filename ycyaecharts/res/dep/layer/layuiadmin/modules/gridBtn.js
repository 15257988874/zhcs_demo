/* create table btn 
 * btnArray 
 * [{   'name':'添加',   //按钮title
 *      'code':1,        //按钮权限码
 *      id:''            //按钮ID--用于绑定事件
 *      handle:callback, //按钮点击事件
 *      'class':''       //按钮class --同layerui,默认蓝色layui-btn-normal,
 * }]
 */
layui.define([
    'layer'
], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        createTableBtn = function (btnArray) {
            var layPage = $('.layui-laypage'),
                layPageBox = $('#layui-table-page1'),
                _box = $('<div style="margin-top:-2px;" class="layui-btn-group grid-btn" id="pageBtn"></div> id="gridBtns"'),//按钮默认有右边距，若要取消，layui-custom.less中取消
                _more ;
            if (!btnArray || $.type(btnArray) !== 'array') {
                throw new Error('参数格式错误');
                return;
            }
            //计算按钮组容器宽度
            var boxWidth = layPageBox.width() - layPage.width(),
                isMore = false,
                paddingVal = 20, //默认按钮两侧padding 20
                btnWidth = 20 * 2 + 12 * 2 + 1 +10, //默认按钮宽度(2字)
                btnTotalWidth = 1, //按钮容器总宽度
                btnAverageWidth=btnWidth, //按钮平均宽度
                moreBoxWidth = btnWidth; //更多按钮容器总宽度
            countBtnTotalWidth();
            createBtn();
            btnBindEvent();
            //计算按钮总宽度
            function countBtnTotalWidth() {
                for (var i = 0; i < btnArray.length; i++) {
                    var b=b = btnArray[i];
                    if (!b.name) {
                        continue;
                    } else {
                        if (b.name.length > 2) {
                            paddingVal = 10;
                            btnTotalWidth += paddingVal * 2 + 12 * b.name.length;
                            moreBoxWidth = paddingVal * 2 + 12 * b.name.length;
                        } else {
                            paddingVal=20;
                            btnTotalWidth += btnWidth;
                        }
                    }
                }1
                btnAverageWidth=btnTotalWidth/btnArray.length;
            }
            //生成按钮    
            function createBtn() {
                _more='';
                $('#gridBtns').remove();
                _box.html('');
                for(var i in btnArray){
                    if(layPageBox.width()-layPage.width()-(i-0+1)*btnAverageWidth<btnAverageWidth){
                        var str='';
                        for(var k=i-0,l=btnArray.length;k<l;k++){
                            var _btn,
                            b=btnArray[k],
                            classDefault = 'layui-btn layui-btn-sm ',
                            c = b.class ? (classDefault + b.class + ' ') : classDefault+'layui-btn-normal',
                            btnId = btnArray[k].id ? btnArray[k].id : '';
                            if(b){
                                if (b.name.length > 2) {
                                    _btn = '<button class="' + c + 'more-font" id="' + btnId + '">' + b.name + '</button>';
                                    moreBoxWidth = paddingVal * 2 + 12 * b.name.length;
                                } else {
                                    _btn = '<button class="' + c + '" id="' + btnId + '">' + b.name + '</button>';
                                }
                                str+=_btn;
                            }
                        }
                        _more='<div style="display:inline-block;margin-top:'+-(k)*31+'px;width:'+moreBoxWidth+'px;" class="more-btn">'+str+'<button class="layui-btn layui-btn-sm btn-more  layui-btn-danger" id="moreBtn" data-flag="true">更多</button></div>';
                        break ;
                    }else{
                        var _btn,
                            b = btnArray[i],
                            classDefault = 'layui-btn layui-btn-sm ',
                            c = b.class ? (classDefault + b.class + ' ') : classDefault+'layui-btn-normal',
                            btnId = btnArray[i].id ? btnArray[i].id : '';
                        if (!b.name) {
                            continue;
                        } else {
                            if(b){
                                if (b.name.length > 2) {
                                    _btn = $('<button class="' + c + 'more-font" id="' + btnId + '">' + b.name + '</button>');
                                  
                                } else {
                                    _btn = $('<button class="' + c + '" id="' + btnId + '">' + b.name + '</button>');
                                    
                                }
                                _box.append(_btn);
                            }
                        }
                    }
                }
                if(_more!==''){
                    _box.append(_more);
                }
                layPage.before(_box);
            }
            //事件绑定
            function btnBindEvent() {
                for (var i = 0; i < btnArray.length; i++) {
                    var b = btnArray[i];
                    if (b.handle && b.id) {
                        if($('#' + b.id).length>0){
                            $('#' + b.id).unbind('click');
                            $('#' + b.id).get(0).onclick = b.handle;
                        }  
                    } else {
                        continue;
                    }
                }
                $('#moreBtn').unbind('click');
                $('#moreBtn').click(function(){
                    var f=$(this).attr('data-flag'),
                        moreBtnList=$(this).parent().find('button').not('.btn-more'),
                        btnStyle= '';
                    if(f=='true'){
                        btnStyle='inline-block';
                        f='false';
                    }else{
                        btnStyle='none';
                        f='true';
                    }
                    $(this).attr('data-flag',f);
                    $.each(moreBtnList,function(){
                        $(this).css('display',btnStyle);
                    });
                });
            }
            $(window).resize(function () {
                createBtn();
                if(  layPageBox.width() - layPage.width() <80 ){
                    $('#pageBtn').hide();
                }else{
                    $('#pageBtn').show();
                }
                btnBindEvent();
            }).resize();
        }
    //对外暴露接口    
    exports('gridBtn', {
        // createTableBtn
    });
});