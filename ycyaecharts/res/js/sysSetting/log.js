$(function(){
    var page = app.ui.page.list.init({
        title:"日志管理123",
        search:{
            title:'日志管理',
            items:[
                {label:'用户名',dt:'text',qt:'like',name:"userName"},
                {label:'操作时间',dt:'date',qt:'btw',name:"optTime",len:140,cfg:{type: 'datetime',format:'yyyy-MM-dd HH:mm:ss'}},
                {label:'定位时间',dt:'date',qt:'eq',name:"gpsTime",len:140,cfg:{type: 'datetime',format:'yyyy-MM-dd HH:mm:ss'}}
            ],
            btns:{
                base:function(){
                    var jsonQry = page.getSearch().getValueQry(/*['carNo']*/);
                    alert(JSON.stringify(page.getSearch().getValueQry(/*['userName']*/)));
                    alert(JSON.stringify(page.getSearch().getValue(/*['userName']*/)));
                    page.getGrid().qry(jsonQry);
                },
                advance:function(){
                }
            }
        },
        grid:{
            // url: app.url + 'sys/logList' //数据接口
            url: 'backJson.js',
            method:'get'
            ,cols: [[ //表头
                {type:'numbers',align:'center',fixed: 'left'}
                ,{field: 'userName', title: '用户名', width:100, align:'center',fixed: 'left',event:'evtUser'}
                ,{field: 'optTime', title: '操作时间', width:180, align:'center'}
                ,{field: 'optTime', title: '操作时间1', width:180, align:'center'}
                ,{field: 'optTime', title: '操作时间2', width:180, align:'center'}
                ,{field: 'optTime', title: '操作时间3', width:180, align:'center'}
                ,{field: 'optTime', title: '操作时间4', width:180, align:'center'}
                ,{field: 'optType', title: '日志类型', width:120, align:'center',templet:function(d){
                    return app.getDictName('logType',d.optType);
                }}
                ,{field: 'opt', width:400,title: '详细信息'}
                ,{fixed: 'right', width: 130, align: 'center',templet:function(d){
                    return app.ui.grid.rowBtn({title:'修改',event:'modOne'})
                        + app.ui.grid.rowBtn({title:'删除',css:['layui-btn-danger'],event:'del'});
                }}
            ]],
            btns:[
                {title:'添加',handle:addEvt,name:'yui-table-add'},
                {title:'查看',handle:yuiCheck,css:['layui-btn-danger'],name:'yui-table-add2'},
                {title:'删除',handle:function(){console.log(2)},css:['layui-btn-danger'],name:'yui-table-add3'},
                {title:'设备',handle:function(){console.log(2)},css:['layui-btn-danger'],name:'yui-table-add4'}
            ]
        }
    });
    var table = layui.table;
    table.on('tool(yui-grid-filter)', function(obj){
        var data = obj.data;
        if(obj.event === 'evtUser'){
            alert(JSON.stringify(data));
        }
        if(obj.event=== 'modOne'){
            modEvt(obj.data);
        }
        if(obj.event=== 'del'){
            alert('del:'+data.id);
        }
    });
    var optFlag=1, // 1新增 2修改
        selectedId, //选中的数据ID
        optUrl={
            1:'',
            2:''
        };
    //添加/修改
    var commonObj={
        id: 'yui-add',
        filter: 'yui-add',
        submitFn: function (data) {
            console.log(data);
            // popup.close(this.index);
            if(optFlag===2){//追加数据ID
                
            }
            //发送请求
            console.log(selectedId)   
        },
        item: [
            {label:'开始时间',name: "startTime",isRequired: true,verify:'required'/* ,qt: 'btw' */,dt: 'date',
                cfg:{type: 'datetime',format:'yyyy-MM-dd HH:mm:ss'}
            },
            {label:'结束时间',name: "endTime",isRequired: true,verify:'required'/* ,qt: 'btw' */,dt: 'date',
                cfg:{type: 'datetime',format:'yyyy-MM-dd HH:mm:ss'}
            },
            {label:'性别',elmType:'select',name: "userSex",isRequired:true,verify:'required',selectOption:['男','女','保密']},
            {label:'名字',name:"userName",isRequired:true,verify:'required'/* ,qt:'like' */,handle:userNameClick,eventName:'tree',treeCfg:{
                url:'/page/default/tpl/tree.html?p=tree',
                title:'请选择部门'
            }},
            {label: '描述',elmType: 'textarea',name: "remark",isBlock:true}
        ]
    },popup ;
    //checkPopup=new ycyaAq(app.createCheck(commonObj,'yui-check')),
    //advanceQryPopup=new ycyaAq(app.createSearchObj(commonObj,'yui-qry-advance',yuiAdvance,['名字','性别']));
    popup = app.ui.autoform(commonObj);
    function addEvt(){
        optFlag=1;
        var layerCfg={
            title:'添加用户'/* ,
            btns:[
                {'title':'确定',handle:'',class:''},
                {'title':'继续添加',handle:function(){
                    console.log(1);
                    return false;
                },class:''},
                {'title':'取消',handle:'',class:''}
            ] */
        };
        popup.reset();
        popup.popup(layerCfg);
        
    }
    function modEvt(jsonData){
        optFlag=2;
        selectedId=jsonData.id;
        var layerCfg={
            title:'修改用户'
        };
        popup.set(jsonData);
        popup.popup(layerCfg);
        
    }

    function yuiCheck(){
        /*
        app.openLayer({
            title: '查看',
            content: $('#'+checkPopup._cfg.id), //内容
            area: '450px',
            success: function () {},
            btn:'确定',
            end:function(){
                $('#'+checkPopup._cfg.id).hide();
            }
        });*/
    }
    function yuiAdvance(){
        console.log(1);
    }

    function userNameClick(){
        alert(2);
    }
})

