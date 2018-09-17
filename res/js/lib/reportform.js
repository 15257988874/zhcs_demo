$(function(){
    var report=app.ui.report.init({
        title:{
            item:[
                {name:'本月漏油',unit:'升'},
                {name:'上月漏油',unit:'升'},
                {name:'环比增长率',unit:'%',vClass:'yy-m-report-c-red'}
            ]  
        },
        search:{
            yearNum:2 ,
            // quickQuery:[ {name:'月统计数据'}],
            // conditionQuery:{
            //     show:false
            // },
            item:[
                {'label':'选择部门','name':'deptId','type':'input','qt':'eq','click':function(opt){
                    app.ui.reportSearch.treePopup(opt,[{//数据联动select
                        name:'type',
                        aliasName:'deptIds', //当前input id别名(与后台一致)
                        data:{
                            test:1111
                        }
                    }]);
                },cfg:{'url':'/page/default/tpl/tree.html?p=tree','title':'请选择部门',end:function(){

                }}},
                {'label':'选择车型','name':'type','type':'select',
                    'option':{
                        '1':'扫地车',
                        '2':'装甲车'
                    },
                    render:true,
                    cfg:{
                        url:'select.js',
                        type:'get',
                        where:{},
                        beforeSuccess:function(data){
                            return data.data.data.data;
                        },
                        keyName: 'foodName', //自定义返回数据中name的key, 默认 name
                        keyVal: 'id', //自定义返回数据中value的key, 默认 id
                    }
                },
                {'label':'时间段','name':'time','len':140,'dt':'date','qt':'btw','cfg':{type: 'datetime',format:'yyyy-MM-dd HH:mm:ss'}}
            ],
            ready:function(){console.log(2)},
            refreshFn:updateFn
        },
        echart:{
            type:'line',
            YMyaxis:{
                yname:'单位(元)'
            },
            YMtitle:{
                ttext:'一级标题',
                tsubtext:'二级标题'
            } 
        },
        // echart:{
        //     type:'pie',
        //     YMPseries:{
        //         sradius:["40%", "60%"],
        //         // slabelshow:false  //是否需要外部显示
        //     },
        //     YMPlegend:{
        //         lyalign:20,
        //         lorient:'horizontal'
        //     }
        // },
        grid:{
            // url: app.url + 'sys/logList' //数据接口
            height:400,
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
                {title:'添加',handle:function(){},name:'yui-table-add'}
            ],
            parent:$('.yy-m-report-grid')
        },
        gridHandle:{//table cell click
            id:'yui-grid-pop',  //容器ID,默认 yui-grid-popup
            width:800, //容器宽度,,默认400
            height:300,//容器宽度,,默认300
            url: 'backJson.js',
            method:'get',
            where:{}
            ,cols: [[ //表头
                {type:'numbers',align:'center',fixed: 'left'}
                ,{field: 'userName', title: '用户名', width:100, align:'center',fixed: 'left',event:'evtUser'}
                ,{field: 'optTime', title: '操作时间', width:180, align:'center'}
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
                {title:'添加',handle:function(){},name:'yui-table-add'}
            ]
        }
    });
    report.getTitle().set([99,4,5]);
    layui.table.on('tool(yui-grid-filter)', function(obj){
        if(obj.event=="evtUser"){
            //获取弹窗表格的配置
            var par=report.popupGridCfg,
                expra={
                    deptId:report.getSearch().deptId
                };//额外参数
            //若有额外参数,则继承
            $.extend(par.where,expra);
            layer.open({
                type:1,
                area:'800px',
                content:$('#yui-grid-pop'),
                success:function(){
                    app.ui.grid.init(par)
                },
                end:function(){
                    $('#yui-grid-pop').hide();
                }
            })
           
        }
    });
    
    report.getEchart().barlineSet([
        '喀什市', '疏附县', '疏勒县', '英吉沙县' , '泽普县'/* , '岳普湖县', '巴楚县', '伽师县' , '叶城县', '莎车县 ','3333','3333','3333','3333','3333','3333','999' */
    ],{ 
        '接入率':[20, 50, 80, 58, 83, 68, 57, 80, 42, 66,12,25,36,45,25,65,80] ,
        '在线率':[50, 51, 53, 61, 75, 87, 60, 62, 86, 46,12,25,36,45,25,65,80] ,
        '完好率':[70, 48, 73, 68, 53, 47, 50, 72, 96, 86,12,25,36,45,25,65] ,
        'jing' :[44, 70, 60, 61, 75, 87, 60, 62, 86, 46,12,25,36,45,25,65],
        'light':[44, 70, 60, 61, 75, 87, 60, 62, 86, 46,12,25,36,45,25,65],
        'test':[32, 70, 60, 61, 75, 87, 60, 62, 86, 46,12,25,36,45,25,65],
        'one':[66, 70, 60, 61, 75, 87, 60, 62, 86, 46,12,25,36,45,25,65]/*,
        'two':[75, 70, 60, 61, 75, 87, 60, 62, 86, 46,12,25,36,45,25,65]  */
    });
    // setInterval(function(){
    //     report.getEchart().pieSet( [
    //         {'value':2005,"name":"视频广告1",},
    //         {'value':135,"name":"视频广告2",},
    //         {'value':135,"name":"视频广告3",},
    //         {'value':135,"name":"视频广告4",}
    //     ] );
    // },2000)


    function updateFn(a){
        console.log(a);
        console.log(report.getSearch().getStatus())
    }
   
});