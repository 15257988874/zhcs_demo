var parkDeptId,
    globalMap;
$(function(){
    var devListGrid; //设备列表grid对象
    var monitor=app.ui.page.monitor.init(
        {
            map:{}, //地图 
            zoom:{},//地图缩放
            status:{//左下角平台运行状态
                title:'平台井盖运行情况',
                item:[
                    {title:'今日消费金额',text:'今日消费金额',status:'0',num:100000,class:'blue'},
                    {title:'今日消费次数',text:'今日消费次数',status:'1',num:242020,class:'red'},
                    {title:'今日泊位使用次数',text:'今日泊位使用次数',status:'2',num:242020,class:'yellow'},
                    {title:'平台设备数',text:'平台设备数',status:'3',num:242020,class:'gray'}
                ], //状态列表
                check:'查看各停车场运行情况>>',
                toggle:'parking'  
            },
            tool:[ //右上角工具条   
                //id 参数必传
               {cursor:true,id:'toolDept',name: '成都井盖办',up:'icon-zhankai1',event:'deptTree',cfg:{ open:true,
                type:'get',
                url:'treeJson.js',
                beforeSuccess:function(data){
                    return data.data;
                },
                yes:function(index,dept,selectedArr){//layer index,实例的dept（包括部门元素，部门树对象）,选中的节点数组
                    console.log(index,dept,selectedArr);
                    if(selectedArr.length>0){
                        dept.text(selectedArr[0].name); //修改成对应的后台字段名
                        parkDeptId=selectedArr[0].id;    
                    }
                    layer.close(index)
                },
                cfg:{
                   data:{key:{name:'name'}}
               }}},
               {id:'toolAlarm',name: '报警',class:'icon-louyutubiaobaojing'},
               {id:'toolReport',name: '上报',class:'icon-icon--1'},
               {cursor:true,id:'toolSearch',name: '搜索',class:'icon-sousuo_sousuo',event:'search',cfg:{
                   /* url:'',data:{}, */'primary-icon':'icon-sousuo_sousuo','advanced-icon':'icon-gaojisousuo2',
                   placeholder:'请输入设备编号',
                   'advanced-id':'seniorSearch',
                   base:{
                       url:'select.js',
                       type:'get',
                       data:{deptId:parkDeptId},
                       keyName:'devNo',//搜索字段名
                       search:function(da){//
                            if(parkDeptId){
                                da.data.deptId=parkDeptId;
                            }
                            ycya.http.ajax(da.url,{
                                type:da.type || 'post',
                                data:da.data,
                                success:function(data){}
                            })
                       }
                   }
               }},
               {cursor:true,id:'toolBar',name: '工具箱',class:'icon-icon--',up:'icon-zhankai1',item:[
                   {class:'icon-sousuo_sousuo  icon-green',name:'测距',id:'measure'},
                   {class:'icon-fanxiang  icon-blue',name:'测面'},
                   {class:'icon-add icon-yellow',name:'全屏'},
                   {class:'icon-jiandujiancha icon-blueess',name:'卫星'}
               ]},
            ],
            master:{//右上角控制中心按钮
                class:'icon-zonganniu',
                item:[
                    {class:'icon-sousuo_sousuo  icon-green',name:'查询',id:'masterSearch'},
                    {class:'icon-fanxiang  icon-blue',name:'反向查询',id:'masterReverseSearch'},
                    {class:'icon-add icon-yellow',name:'添加设施',id:'masterAddFac'},
                    {class:'icon-jiandujiancha icon-blueess',name:'地图显示',id:'masterMapShow',event:'mapShow',cfg:{
                        names:{
                            id:'id',  // id别名
                            name:'name',//name别名
                            type:'type' //type别名
                        },
                        // local:{
                        //     selected:[
                        //         {'id':'1','name':'污水井盖','type':1},
                        //         {'id':'2','name':'上水井预留盖','type':2},
                        //         {'id':'3','name':'下水井盖','type':3}
                        //     ],
                        //     all:[
                        //         {'id':'1','name':'污水井盖','type':1},
                        //         {'id':'2','name':'上水井预留盖','type':2},
                        //         {'id':'3','name':'下水井盖','type':3},
                        //         {'id':'4','name':'电力井盖','type':4},
                        //         {'id':'5','name':'输气井盖','type':5},
                        //         {'id':'6','name':'化粪池井盖','type':6},
                        //         {'id':'7','name':'公安井盖','type':7},
                        //         {'id':'8','name':'中水井盖','type':8}
                        //     ]
                        // },
                        yes:function(ind,showList){ //发送请求的函数
                            console.log(showList);
                            layer.close(ind)
                        },
                        cfg:{
                            url:'typeJson.js',
                            format:'data.data.data',//数据格式
                            where:{},
                            type:'get'
                        }
                    }}
                ]
            },
            ready:function(cur){
                //获取地图对象
                globalMap=cur.map;
                //绘制点
                globalMap.addPoint({ type:1,evt:doit,data:[{"lng":104.094578,"lat":30.646061,"id":"川A12344"}]});
            }
        }
    );
    monitor.getStatus().set({
        '0':200000
    });//设置右下角状态值
    pageBindEvent();
    layui.form.render('checkbox');
    //弹窗点击函数
    function doit(termJson){
        var content = $('.yy-park-detail-body','#detail').html(),
            para = {
                title: $('.yy-park-detail-title').html(),//标题
                width: 500, //宽度
                height: 258, //高度
                panel: "panel", //检索结果面板
                enableAutoPan: true, //自动平移
                searchTypes: []
            };
            globalMap.openSearchWin(content, para, termJson.target.__id);
            //加载监控通道列表
            //绑定监控事件
            $('.BMapLib_SearchInfoWindow .viedoListBox').hover(function(){
                $(this).find('dl').show();
            },function(){
                $(this).find('dl').hide();
            });
            $('.BMapLib_SearchInfoWindow .viedoList').on('click','dd',function(){
                //生成列表
                var _title=$(this).parent().attr('data-title'); 
                if( $(this).index()==0){
                    if( $('#channelList').find('div').length==2 ){//为空添加元素
                        var ddArr=$(this).parent().find('dd:gt(0)'),
                            len=ddArr.length, //通道个数
                            content1='',content2='';
                            var rowLen=len % 2==0 ?len/2 :parseInt(len/2);
                        $.each(ddArr,function(i,elm){
                            var w=len % 2==0 ?(1/rowLen-0.015) *100+'%':(i<=rowLen ?(1/(rowLen+1)-0.015) *100+'%': (1/rowLen-0.015) *100+'%'),
                                html='<div class="yy-park-channel-item" style="width:'+w+'"><div class="title">'+_title+'('+$(this).text()+')<i class="yy-rt iconfont icon-cheng yy-pointer"></i></div></div>';
                            if(len % 2==0){
                                i<rowLen ? content1+=html:content2+=html
                            }else{
                                i<=rowLen ? content1+=html:content2+=html;
                            }
                        });
                        $('.part-1','#channelList').html(content1);
                        $('.part-2','#channelList').html(content2);
                    }
                    layer.open({
                        type: 1,
                        title: _title,
                        area:'650px',
                        content:$('#channelList'),
                        btn:[],
                        success:function(){},
                        end:function(){
                            $('#channelList').hide();
                        }
                    });
                } else{
                    layer.open({
                        type: 1,
                        title: _title,
                        area:'336px',
                        content:'<div style="padding:8px 8px 0"><div class="yy-park-channel-item" style="width:320px;margin-right:0;margin-bottom:0"><div class="title">'+_title+'('+$(this).text()+')<i class="yy-rt iconfont icon-cheng yy-pointer"></i></div></div></div>',
                        btn:[],
                        success:function(){}
                    });
                }  
                
                $(this).parent().hide(); //隐藏，放置二次点击
            });
            //设备列表
            $('.BMapLib_SearchInfoWindow .devList').click(function(){
                layer.open({
                    type: 1,
                    title:'设备列表',
                    area:['460px','468px'],
                    content:$('#devList'),
                    btn:[],
                    success:function(layero, index){
                        $(layero).find('#devSearch').click(function(){
                            var inputVal= $(layero).find('#devInput').val(),
                            chks=$(layero).find('.layui-form-checkbox'),
                            chksList=[];//状态列表
                            if( $(chks[0]).hasClass('layui-form-checked')){//在线
                                chksList.push(0); 
                            }
                            if( $(chks[1]).hasClass('layui-form-checked')){//离线
                                chksList.push(1); 
                            }
                            var para={
                                deptId:parkDeptId,
                                devName:inputVal
                            };
                            chksList.length >0 && (para.status=chksList.join(','));
                            devListGrid.qry(para);
                        });
                        if($(layero).find('#yui-grid') .length>0){
                            var cfg={
                                elem:$(layero).find('#yui-grid'),
                                height:350,
                                url: 'backJson.js',
                                method:'get'
                                ,cols: [[ //表头
                                    {field: 'userName', title: '用户名', width:100, align:'center',fixed: 'left',event:'evtUser'}
                                    ,{field: 'optType', title: '日志类型', width:120, align:'center',templet:function(d){
                                        return app.getDictName('logType',d.logType);
                                    }}
                                ]]
                            }
                            devListGrid=app.ui.grid.init(cfg);
                        }
                    },
                    end:function(){
                        $('#devList').hide();
                    }
                });
            });
    }
    //事件绑定
    function pageBindEvent(){}
});