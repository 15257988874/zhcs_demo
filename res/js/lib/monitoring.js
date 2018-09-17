var _deptId,
    globalMap;
$(function(){
    var monitor=app.ui.page.monitor.init(
        {
            map:{}, //地图 
            zoom:{},//地图缩放
            status:{//左下角平台运行状态
                title:'平台井盖运行情况',
                item:[
                    {title:'设备列表',text:'总数',status:'0',num:100000,class:'blue'},
                    {title:'报警列表',text:'报警',status:'1',num:242020,class:'red'},
                    {title:'维护列表',text:'维护',status:'2',num:242020,class:'yellow'},
                    {title:'离线列表',text:'离线',status:'3',num:242020,class:'gray'}
                ], //状态列表
                itemClick:function(data){
                    console.log(data)
                },
                check:'查看各类井盖运行情况>>',
                checkClick:{
                    header:{
                        title:'井盖设施运行情况'
                    },
                    left:{
                        title:'平台井盖',
                        allIcon:'icon-pingjiaxingxing',
                        allNum:1000,
                        typeIcon:'icon-fuwuleixing',
                        typeNum:10,
                        repairNum:200,
                        offNum:400,
                        alarmNum:100
                    },
                    right:{
                        icon:'icon-jinggai',
                        onKey:'1',
                        offKey:'2',
                        alarmKey:'3',
                        repairKey:'4',
                        nameKey:'typeName',
                        item:[
                            {
                                id:'0',
                                type:0,
                                typeName:'上水井盖',
                                '1':252030,
                                '2':252030,
                                '3':252030,
                                '4':252030
                            },
                            {
                                id:'0',
                                type:0,
                                typeName:'上水井盖',
                                '1':252030,
                                '2':252030,
                                '3':252030,
                                '4':252030
                            },
                            {
                                id:'0',
                                type:0,
                                typeName:'上水井盖',
                                '1':252030,
                                '2':252030,
                                '3':252030,
                                '4':252030
                            },
                            {
                                id:'0',
                                type:0,
                                typeName:'上水井盖',
                                '1':252030,
                                '2':252030,
                                '3':252030,
                                '4':252030
                            },
                            {
                                id:'0',
                                type:0,
                                typeName:'上水井盖',
                                '1':252030,
                                '2':252030,
                                '3':252030,
                                '4':252030
                            },

                            {
                                id:'0',
                                type:0,
                                typeName:'上水井盖',
                                '1':252030,
                                '2':252030,
                                '3':252030,
                                '4':252030
                            },
                            {
                                id:'0',
                                type:0,
                                typeName:'上水井盖',
                                '1':252030,
                                '2':252030,
                                '3':252030,
                                '4':252030
                            },
                            {
                                id:'0',
                                type:0,
                                typeName:'上水井盖',
                                '1':252030,
                                '2':252030,
                                '3':252030,
                                '4':252030
                            }
                        ]
                        ,cfg:{
                            format:'data.data.data',
                            url:'monitorList.js',
                            type:'get',
                            where:{}
                        }
                    }
                },
                toggle:true
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
                        dept.text(selectedArr[0].name);
                        _deptId=selectedArr[0].id;
                    }layer.close(index)
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
                       data:{deptId:_deptId},
                       keyName:'devNo',//搜索字段名
                       search:function(da){//
                            if(_deptId){
                                da.data.deptId=_deptId;
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
                   {class:'icon-add icon-yellow',name:'全屏',handle:function(arg){
                        if(!app.ui.screen.isFull()){//未全屏,则执行全屏操作
                            var content = document.getElementById('mapWrap');
                            app.ui.screen.fullScreen(content);
                            $(arg.exit).show();
                        }
                   }},
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
                globalMap.addPoint({ type:1,evt:doit,icon:'test',data:[{"lng":104.094578,"lat":30.646061,"id":"川A12344"}]});
            }
        }
    );
    monitor.getStatus().set({
        '0':200000
    });//设置右下角状态值
    console.log(monitor.getStatus().statusList.set({offNum:300,alarmNum:101,allNum:1000}));//设置运行情况弹窗中的值
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
    }
});