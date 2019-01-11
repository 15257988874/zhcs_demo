var _deptId,
    globalMap;
$(function(){
    var roadFlag=true; //默认不打开实时路况
    var monitor=app.ui.page.monitor.init(
        {
            map:{}, //地图 
            zoom:{},//地图缩
            tool:[ //右上角工具条   
                //id 参数必传
               {id:'toolAlarm',name: '报警',class:'icon-baojing'},
               {id:'toolReport',name: '上报',class:'icon-shangchuan'},
               {cursor:true,id:'toolBar',name: '工具箱',class:'icon-gongjuxiang',up:'icon-xiala',item:[
                   {class:'icon-ceju  icon-green',name:'测距',id:'measure'},
                   {class:'icon-ceju  icon-blue',name:'测面'},
                   {class:'icon-quanping icon-yellow',name:'全屏',handle:function(arg){
                        if(!app.ui.screen.isFull()){//未全屏,则执行全屏操作
                            var content = document.getElementById('mapWrap');
                            app.ui.screen.fullScreen(content);
                            $(arg.exit).show();
                        }
                   }}
               ]},
            ],
            ready:function(cur){
                //获取地图对象
                globalMap=cur.map;
                //绘制点
                globalMap.addPoint({ type:1,evt:doit,icon:'build',data:[{"lng":104.094578,"lat":30.646061,"id":"川A12344"}]});              
            }
        }
    );
    //设置运行情况弹窗中的值
    function doit(termJson){
        var content = /* $('.yy-park-detail-body','#detail').html() */'',
            para = {
                title: $('#detail').html(),//标题
                width: 590, //宽度
                height: 470, //高度
                panel: "panel", //检索结果面板
                enableAutoPan: true, //自动平移
                searchTypes: []
            };
            globalMap.openSearchWin(content, para, termJson.target.__id);
            //加载监控通道列表   
    }
    bindEvent();
    function bindEvent(){
        layui.laypage.render({
            elem: 'page'
            ,count: 100
            ,theme: '#1E9FFF'
        });
        
        $('#today10').on('click','.popup-tabs-title-item',function(){
            var $content=$('.today-run-content-item','#today10'),
                ind=$(this).index();
            $(this).addClass('active').siblings().removeClass('active');    
            $( $content[ind] ).addClass('active').siblings().removeClass('active');    
        });

        $('#questionBack').on('click','.popup-tabs-title-item',function(){
            var $content=$('.question-content-item ','#questionBack'),
                ind=$(this).index();
            $(this).addClass('active').siblings().removeClass('active');    
            $( $content[ind] ).addClass('active').siblings().removeClass('active');    
        });        
        //区域选择
        $('#area').hover(function(){
            $('#areaChooose').show();
        },function(){
            $('#areaChooose').hide();
        });
        //切换最优/最差排名
        $('#toggleNo').hover(function(){
            $('.toggle-No').show();
        },function(){
            $('.toggle-No').hide();
        });
        $('.toggle-No dd').click(function(){
            $('#toggleNo span').text( $(this).text() );
            $(this).parent().hide();
            //列表渲染..
        });
        //快捷块-图标事件
        $('#quickBlock>div').click(function(){
            var json={
                3:{
                    area:'340px',
                    content:$('#today10'),
                    move:$('#today10 .popup-title-top>span'),
                    success:function(layero,index){
                        $('.close','#today10').click(function(){
                            layer.close(index);
                        });
                    },
                    end:function(){
                        $('#today10').hide();
                    }
                },
                0:{
                    area:['340px','520px'],
                    content:$('#questionBack'),
                    move:$('#questionBack .popup-title-top>span'),
                    success:function(layero,index){
                        $('.close','#questionBack').click(function(){
                            layer.close(index);
                        });
                    },
                    end:function(){
                        $('#questionBack').hide();
                    }   
                }
            }
            var ind=$(this).index();
            if(ind==0 || ind==3){
                var param=$.extend(json[ind],{  
                    title:false,
                    type:1,
                    closeBtn:false
                });
                layer.open(param)
            }else if(ind==1){//跳转页面
                location.href="" ; 
            }else{//路况
                globalMap.trafficFn(roadFlag);
                roadFlag=!roadFlag;
            }
        });
    }
    var dataList=[
            {
                title:'当日扬尘情况',
                xData:['10:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35'],
                yData:[220, 182, 191, 134, 150, 120, 110, 125 ],
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(26,255,220, 1)'
                        }, {
                            offset: 0.7,
                            color: 'rgba(26,255,220, .1)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(26,236,220, 1)'
                            }, {
                                offset: 1,
                                color: 'rgba(26,236,220, 1)'
                            }])
                        }
                }
            },
            {
                title:'当日噪音监测',
                xData:['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35'],
                yData:[280, 182, 191, 134, 150, 110, 110, 125 ],
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255,215,27, 1)'
                        }, {
                            offset: 0.7,
                            color: 'rgba(255,215,27, .1)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(255,215,27, 1)'
                            }, {
                                offset: 1,
                                color: 'rgba(255,215,27, 1)'
                            }])
                        }
                }
            }
        ];
    var echartOption={ 
            backgroundColor: 'rgba(24,105,162,.8)',
            title: {
                text: '',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 12,
                    color: '#fff'
                },
                left: 46,
                top:10
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            },
            grid: {
                left: '2%',
                right: '3%',
                bottom: 20,
                top:40,
                containLabel: true
            },
            xAxis: [{
               axisTick: {
                   show: false
               },
               type: 'category',
               boundaryGap: false,
               axisLine: { 
                   lineStyle: {
                       color: 'rgba(255,255,255,.4)'
                   }
               },
               axisLabel: {
                   textStyle: {
                       fontSize: 12,
                       color:'#fff'
                   }
               },
               data: [],
           }],
            yAxis: [{
               type: 'value',
               axisTick: {
                   show: false
               },
               axisLine: { 
                   lineStyle: {
                       color: 'rgba(255,255,255,.4)'
                   }
               },
               axisLabel: {
                   margin: 10,
                   textStyle: {
                       fontSize: 12,
                       color:'#fff'
                   }
               },
               splitLine: {
                   lineStyle: {
                       color: 'rgba(255,255,255,.1)'
                   }
               }
           }],
            series: [{
                name: '扬尘情况',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 3
                    }
                },
                areaStyle:{},
                itemStyle:{},
               data: []
            } ]
    };
    //扬尘折线图
    /**
     *
     *
     * @param {*} flag 0为扬尘 1噪音
     */
    function raiseEchart(flag){
        if(typeof(flag)==='undefined'){return layer.msg('para error')}
        var d=dataList[flag];
        echartOption.title.text=d.title;
        echartOption.xAxis[0].data=d.xData;
        echartOption.series[0].data=d.yData;
        echartOption.series[0].areaStyle=d.areaStyle;
        echartOption.series[0].itemStyle=d.itemStyle;
        echarts.init( document.getElementById(flag==0?'popup-echarts1':'popup-echarts2') ).setOption(echartOption);
    }

    //详情框点击事件
    window.detailClick=function(that,inde){
        var $divs=$('.tabs-content>div');
        (inde!==2 && inde!==3)  && ($(that).addClass('active').siblings().removeClass('active'));
        if(inde==0 || inde==1){
            $( $divs[inde] ).addClass('active').siblings().removeClass('active');
        }else if(inde==2){
            $('.video-channel').show();
        }else if(inde==3){
            $('.video-channel').hide();
        }else if(inde==4){//跳转页面
            location.href="" ; 
        }else{
            layer.open({
                title:false,
                type:1,
                closeBtn:false,
                area:'782px',
                content:$('#todayRun'),
                move:$('#todayRun .popup-title>span'),
                success:function(layero,index){
                    $('.close','#todayRun').click(function(){
                        layer.close(index);
                    });
                    raiseEchart(0);
                    raiseEchart(1);
                },
                end:function(){
                    $('#todayRun').hide();
                }   
            })
        }
      
    }
});






