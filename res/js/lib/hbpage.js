var app = ycya.page || {};
app.ui=app.ui || {};
app.ui.iconItem={//生成左侧图标，右侧标题
    _cfg:{
        height:70,//单个item的高度
        width:'20%'
    },
    init:function(cfg){
        var h=cfg.height || this._cfg.height; //高度 
            var _box= $('<div/>',{class:'yy-box-sizing yy-padding-all-8 yy-lf ',height:h,width:cfg.width || this._cfg.width}),
                _childBox=$('<div/>',{class:'yy-padding-r-8 yy-padding-b-8 yy-item-bg yy-height-all' }),
                _leftbox=$('<div/>',{class:'yy-icon-item-box yy-lf '+cfg.bg}),
                _left=$('<div/>',{class:'yy-icon-item-size '+cfg.icon}),
                _text=$('<a/>',{text:cfg.title || '',class:'yy-icon-blcok  yy-item-title'}),
                _num=$('<p/>',{text:cfg.num || 0,class:'yy-item-num'}),
                _right=$('<span/>',{class:'yy-lf'});
                _left.css({margin:'8px auto'});
                _right.css({marginTop:'8px'});
                _leftbox.append(_left);
                if(cfg.type==2){
                    _text.css({
                        'fontSize':'18px',
                        'color':'#424242',
                        'marginTop':'10px'
                    });
                    _text.attr('href',cfg.href || 'javascript:void(0)');
                    _right.append(_text);
                  
                }else{
                   _right.append(_text).append(_num); 
                }
                _childBox.append(_leftbox).append(_right);
                _box.append(_childBox);
        return _box[0].outerHTML;
    }
};
app.ui.summary={//汇总
    _cfg:{
        id:'#yySummary',
    },
    init:function(cfg){
        if(!cfg.left || !cfg.right || !cfg.title){return new TypeError();}
        var c=this._cfg,
            that=this;
        if( $(c.id).length==0 ){throw new Error('id元素不存在')}
        $(c.id).siblings('.layui-card-header').append($('<span/>',{text:cfg.title|| '',class:'yy-border-left'}));
        this.left=$('.left',c.id);
        this.right=$('.right',c.id);
        this.createLeft(cfg.left);
        if(cfg.right.cfg){
            var crc=cfg.right.cfg;
            ycya.http.ajax(crc.url,{
                data:crc.data,
                type:crc.type || 'post',
                success:function(data){
                    var d=crc.beforeSuccess?crc.beforeSuccess(data):data.data,
                        html='',
                        iconList=cfg.right.iconList || [];
                        aliasArr=[];
                    $.each(d,function(i,val){
                        var bg=i<9?'yy-bg-'+(i-0+1):'yy-bg-1';
                        aliasArr.push({
                            title:val[cfg.right.nameKey],
                            num:val[cfg.right.numKey],
                            icon:iconList[i] || 'yy-icon-else',
                            bg:bg
                        })
                    })
                    $.each(aliasArr,function(i,val){
                        html+=app.ui.iconItem.init(val);
                    });
                    that.right.html(html);
                }
            })
        }
        return this;
    },
    createLeft:function(cfg){
        var title=cfg.title || '',
            icon='yy-icon-blcok yy-icon-total-size '+cfg.icon,
            num= cfg.num!==undefined ? cfg.num:0,
            bg=cfg.bg?cfg.bg:'yy-gradient-blue';
        var parentElm=$('<div/>',{class:'yy-height-all yy-wdith-all yy-box-sizing yy-padding-all-8 '+bg})
            titleElm=$('<h6/>',{text:title}),
            iconElm=$('<i/>',{class:icon}),
            numElm=$('<p/>',{text:num,class:"yy-p-summary-num"});
            parentElm.append(titleElm).append(iconElm).append(numElm);
        this.left.html('').append(parentElm);
        this.leftNum=$('.yy-p-summary-num',this._cfg.id);
    }
};
(function(au){
    var  CardList=function(){};
    CardList.prototype={
        init:function(cfg){
            if(!cfg.name || !cfg.cfg){
                return ;
            }
            $.extend(true,{},cfg);
            this.numberKey=cfg.numberKey;
            var _parent=cfg.parent || '#yyDeptSort',
                _this=this;
            $('.layui-card-header',_parent).prepend( $('<span/>',{text:cfg.title||'',class:'yy-border-left'}) );
            var thead=$('<thead/>'),
                theadtr=$('<tr/>'),
                fields=[];   
            $.each(cfg.name,function(i,item){
                theadtr.append( $('<th>'+item.title+'</th>'));
                fields.push(item.field);
            });
            this.fields=fields;
            thead.append(theadtr);
            $('.thead',_parent).html('<colgroup><col width="150"><col></colgroup>'+thead[0].outerHTML);
            _this.render(cfg.cfg[0],_parent);
            return this;
        },
        render:function(cfg,par){
            var _this=this,
            tbody=$('<tbody/>');
            ycya.http.ajax(cfg.url,{
                data:cfg.data,
                type:cfg.type || 'post',
                success:function(data){
                    var d=cfg.beforeSuccess ?cfg.beforeSuccess(data):(data.data || []);
                    $.each(d,function(i,item){
                        if(i<7){
                            var cla=i<3?'yy-parking-tr'+(1+i):'',
                                _tr=$('<tr/>',{class:cla});
                            for(var j=0;j<_this.fields.length;j++){
                                var cur=_this.fields[j];
                                if(cur==_this.numberKey){
                                        var _no;
                                        if(i<3){
                                        _no='<i class="yy-parking-no-position yy-no yy-no'+i+'"></i>';
                                        }else{
                                        _no='<i class= "yy-no" style="margin-right:6px">'+(1+i)+'</i>';
                                        }
                                    _tr.append( $('<td/>',{html:_no+item[cur]}))
                                }else{
                                    _tr.append( $('<td/>',{text:item[cur]}) )
                                }
                            }
                            tbody.append(_tr);
                        }
                    });
                    $('.tbody',par).html('').html('<colgroup><col width="150"><col></colgroup>'+tbody[0].outerHTML);
                }
            });
        }
    };
    
    au.cardList={
        init:function(cfg){
            return new CardList().init(cfg);
        }
    }
})(app.ui);
app.ui.goodsApply={
    _cfg:{
        parent:'#goodsApply'
    },
    init:function(cfg){
        if(!cfg.name || !cfg.cfg){
            return layer.msg('parking devRun para error');
        }
        $.extend(true,this._cfg,cfg);
        var _parent=$(this._cfg.parent),
            c=this._cfg,
            _this=this;
        $('.layui-card-header',c.parent).append($('<span/>',{text:c.title||'',class:'yy-border-left'}));
        var thead=$('<thead/>'),
            tbody=$('<tbody/>'),
            theadtr=$('<tr/>'),
            fields=[],
            cla=[];    
        $.each(c.name,function(i,item){
            theadtr.append( $('<th>'+item.title+'</th>'));
            fields.push(item.field);
            cla.push(item.class);
        });
        this.fields=fields;
        thead.append(theadtr);
        $('.thead',c.parent).html(thead[0].outerHTML);
        ycya.http.ajax(cfg.cfg.url,{
            data:cfg.cfg.data,
            type:cfg.cfg.type || 'post',
            success:function(data){
                var d=cfg.cfg.beforeSuccess ?cfg.cfg.beforeSuccess(data):(data.data || []);
                $.each(d,function(i,item){
                    var _tr=$('<tr/>');
                    for(var j=0;j<_this.fields.length;j++){
                        var cur=_this.fields[j];   
                        _tr.append( $('<td/>',{text:item[cur],class:'yy-color-'+cla[j]}) );
                    }
                    tbody.append(_tr);
                });
                $('.tbody',c.parent).html(tbody[0].outerHTML);
            }
        });
        return this;
    }
};
app.ui.entry={
    _cfg:{
        id:'#entry'
    },
    init:function(cfg){
        $('.layui-card-header','#entry').append($('<span/>',{text:cfg.title|| '',class:'yy-border-left'}));
        if(cfg.items){
            var html='';
            $.each(cfg.items,function(i,val){
                val.type=2;
                val.width='100%';
                val.bg='yy-bg-5';
                html+=app.ui.iconItem.init(val);
            });
            $('.layui-card-body',this._cfg.id).html(html);
        }
        return this;
    }
};
app.ui.echarts={
    barlineCfg:{
        id:'yui-report-echart',              //容器ID
        type:'line',        //图标类型 line bar
        maxBarWidth:40,
        minBarWidth:12,
        colorList:['#ff2600', '#ffc000', '#00ad4e', '#0073c2', '#165868', '#e76f00', '#316194', '#723761', '#00b2f1', '#4d6022', '#4b83bf', '#f9c813', '#0176c0'], //统计图颜色
        stbackgrond:['#fff'], //统计图背景色
        datalName:[],  //数据题目
        valueJson:{},  //显示数值 {'接入率':[1,,2,3]}
        YMlegend:{
            lshow: true,//是否显示
            lalign: "center",//注解位置 center：居中  left：左 right：右
            lcolor: '#444', //字体颜色
            lorient: 'horizontal',//注解显示格式 horizontal,水平分布 vertical，垂直分布
            licon: 'circle',//注解前面图形 circle：园，triangle：三角形，diamond：菱形，rect：矩形,roundRect:圆角矩形
        },
        YMtitle:{      //标题
            tshow: true,      // 是否显示
            ttext: '',        //一级标题
            ttcolor: '#000',  //一级标题颜色
            ttfontsize: 16,   //一级标题大小
            tsubtext: '',     //二级标题
            tstcolor: '#333', //二级标题颜色
            tstfontsize: 14,  //二级标题字号
            txalign: 'left'   //位置 center 居中 left 局左 right 局右
        }, 
        dataxName:[],         //x轴name
        YMTtooltip:"",        //鼠标提示,加在头部
        YMBtooltip:"",        //鼠标提示,加在尾部
        xaxisClocr:['#333', '#666', '#444', '#f6f6f6', '#f6f6f6', '#fff'], //x轴线颜色 顺序为: 坐标轴、坐标轴小标记、具体数值、分割区域线 、间隔颜色
        yaxisClocr:['#333', '#666', '#444', '#f6f6f6', '#f6f6f6', '#fff'], //y轴线颜色 顺序为: 具体数值、坐标轴小标记、坐标轴、分割区域线 、间隔颜色
        YMxaxis : {  //X轴设置
            xrotate: 30,//字体倾斜角度
            xaxisLine: true,//坐标轴线
            xaxisTick: false,//坐标轴小标记
            xsplitLine: false,//分割区域线
            xaxisLabel: true, //y轴具体数值
            xmargin: 10,//标题与轴线距离
            xsplitArea: false,//间隔区域
        },
        YMyaxis :{ //Y轴设置
            yminInterval: 20, //最小刻度值
            yrotate: 60,//字体倾斜角度
            yaxisLine: true,//坐标轴线
            yaxisTick: false,//坐标轴小标记
            ysplitLine: false,//分割区域线
            yaxisLabel: true, //y轴具体数值
            ytextStyle: '#666',//y轴数值颜色
            yvalue: 'value',//y轴值
            ysplitArea: false,//间隔区域
            ymargin: 10,//标题与轴线距离
            yname:'',//y轴提示
        },
        // 多个y轴情况下（最多3个）第二根y轴
        YMsyaxis :{
            syshow:false,//是否显示
            syminInterval: 40, //最小刻度值
            syrotate: 60,//字体倾斜角度
            syaxisLine: true,//坐标轴线
            syaxisTick: true,//坐标轴小标记
            sysplitLine: false,//分割区域线
            syaxisLabel: true, //y轴具体数值
            sytextStyle: '#444',//y轴数值颜色
            syvalue: 'value',//y轴值
            sysplitArea: false,//间隔区域
            symargin: 10,//标题与轴线距离
            syname:'',//y轴提示
        },
        // 多个y轴情况下（最多3个）第三根y轴
        YMtyaxis : {
            tyshow:false,//是否显示
            tyminInterval: 20, //最小刻度值
            tyrotate: 60,//字体倾斜角度
            tyaxisLine: true,//坐标轴线
            tyaxisTick: false,//坐标轴小标记
            tysplitLine: false,//分割区域线
            tyaxisLabel: true, //y轴具体数值
            tytextStyle: '#444',//y轴数值颜色
            tyvalue: 'value',//y轴值
            tysplitArea: false,//间隔区域
            tymargin: 10,//标题与轴线距离
            tyname:'',//y轴提示
        } ,
        YMgrid:{   //统计图位置
            // 左、右、下、上 值可取0~100% 也可直接取数字
            gleft: '4%',
            gright: '4%',
            gbottom: 0,
            gtop:'10%',
        },
        YMtoolbar:{  // 工具栏
            itemSize: 14,   // 工具栏图标大小
            toorshow: true, //工具栏是否显示 true  false
            magicType: true, //统计类型切换是否显示 true false
            restore: true,    //刷新是否显示  true false
            saveAsImage: true, //保存是否显示 true false
            dataView: true, //是否显示数据视图
            type: ['line', 'bar', 'stack', 'tiled']  //统计图切换类型 line：折线  bar 柱状图 stack：堆砌显示 tited：分类显示 必须在magicType为true时使用
        },
        YMdataZoom:{
            dzshow:false, //是否出现
            dzend:90,//滑块开始位置
            dzheight:26,//高度
            dzfillerColor:'rgba(167,183,204,0.4)',//选中区域颜色
            dzbackgroundColor:'rgba(47,69,84,0)',//整体的背景色 
        }
    },
    barlineInit:function(cfg){
        $.extend(true,this.barlineCfg,cfg);
        var bl=this.barlineCfg,
            _this=this;
        this.blChart = echarts.init( document.getElementById( bl.id) );
            option = {
            // 各统计注解
                legend: {
                    show: bl.YMlegend.lshow,
                    type: 'scroll',
                    orient: bl.YMlegend.lorient,
                    icon:  bl.YMlegend.licon,
                    data: bl.datalName,
                    align: 'left',
                    x:bl.YMlegend.lalign,
                    textStyle: {
                    color: bl.YMlegend.lcolor,
                    fontSize: 14,
                    },
                    itemWidth: 20,
                    itemHeight: 10
            },
            // 统计图背景色
            backgroundColor: bl.stbackgrond,
            //统计图名称
            title: {
                x: bl.YMtitle.txalign,
                show: bl.YMtitle.tshow,
                text: bl.YMtitle.ttext,
                textStyle: {
                    fontSize: bl.YMtitle.ttfontsize,
                    color: bl.YMtitle.ttcolor
                },
                subtext: bl.YMtitle.tsubtext,
                subtextStyle: {
                    fontSize: bl.YMtitle.tstfontsize,
                    color: bl.YMtitle.tstcolor
                }
            },
            // 各统计颜色
            color: bl.colorList,
            // 鼠标移入显示
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    {
                        var relVal = bl.YMTtooltip + params[0].name + "<br/>";
                        for (j = 0; j < params.length; j++) {
                            relVal += params[j].seriesName + ' : ' + params[j].value + "<br/>";
                        }
                        return relVal+bl.YMBtooltip;
                    }
                }
            },
            // 工具栏视图
            toolbox: {
                itemSize: bl.YMtoolbar.itemSize,
                feature: {
                    dataView: { show: bl. YMtoolbar.dataView },
                    magicType: {
                        show: bl.YMtoolbar.magicType,
                        type: bl.YMtoolbar.type //折线图与柱状图转化 堆砌与分散
                    },
                    restore: {
                        show: bl.YMtoolbar.restore  //刷新
                    },
                    saveAsImage: {
                        show: bl.YMtoolbar.saveAsImage //保存
                    }
                }
            },
            // 控制显示个数
            dataZoom: [
                {
                    height:bl.YMdataZoom.dzheight,
                    type: 'slider',
                    show:bl.YMdataZoom .dzshow,
                    fillerColor:bl.YMdataZoom.dzfillerColor,
                    start: 0,
                    end: bl.YMdataZoom.dzend,
                    handleSize: 0,
                    backgroundColor:bl.YMdataZoom.dzbackgroundColor//背景色
                }
            ],
            //统计图位置
            grid: {
                left: bl.YMgrid.gleft,
                right: bl.YMgrid.gright,
                bottom: bl.YMgrid.gbottom,
                top: bl.YMgrid.gtop,
                containLabel: true
            },
            xAxis:[{
                show:true,
                type: 'category',
                data: [], //bl.dataxName
                axisLine: {
                    show: bl.YMxaxis.xaxisLine,
                    lineStyle: {
                        color: bl.xaxisClocr[0],
                        width: 1,
                        type: "solid"
                    }
                },
                axisTick: {
                    show: bl.YMxaxis.xaxisTick,
                    lineStyle: {
                        color: bl.xaxisClocr[1]
                    }
                },
                axisLabel: {
                    show: bl.YMxaxis.xaxisLabel,
                    margin: bl.YMxaxis.xmargin,
                    rotate: bl.YMxaxis.xrotate,
                    textStyle: {
                        color: bl.xaxisClocr[2]
                    }
                },
                splitLine: {
                    show: bl.YMxaxis.xsplitLine,
                    textStyle: {
                        color: bl.xaxisClocr[3]
                    }
                },
                splitArea: {
                    show: bl.YMxaxis.xsplitArea,
                    areaStyle: {
                        color: [bl.xaxisClocr[4],bl.xaxisClocr[5]]
                    }
                }
            }],
            yAxis: [
                {
                min: 0,
                minInterval: bl.YMyaxis.yminInterval,
                    type:bl.YMyaxis.yvalue,
                name:bl.YMyaxis.yname,
                axisLabel: {
                    margin: bl.YMyaxis.ymargin,
                    rotate: bl.YMyaxis.yrotate,
                    textStyle: {
                        color: bl.yaxisClocr[0]
                    }
                },
                axisTick: {
                    show: bl.YMyaxis.yaxisTick,
                    lineStyle: {
                        color: bl.yaxisClocr[1]
                    }
                },
                axisLine: {
                    show: bl.YMyaxis.yaxisLine,
                    lineStyle: {
                        color: bl.yaxisClocr[2]
                    }
                },
                splitLine: {
                    show: bl.YMyaxis.ysplitLine,
                    lineStyle: {
                        color: bl.yaxisClocr[3]
                    }
                },
                splitArea: {
                        show: bl.YMyaxis.ysplitArea,
                        areaStyle: {
                            color:[ bl.yaxisClocr[4], bl.yaxisClocr[5]]
                        }
                    }  
            },
            // 第二根坐标轴
            {
                show:bl.YMsyaxis.syshow,
                name:bl.YMsyaxis.syname,
                min: 0,
                minInterval: bl. YMsyaxis.syminInterval,
                type: bl.YMsyaxis.syvalue,
                position:'right',
                axisLabel: {
                    margin: bl.YMsyaxis.symargin,
                    rotate: bl.YMsyaxis.syrotate,
                    textStyle: {
                        color: bl.yaxisClocr[0]
                    }
                },
                axisTick: {
                    show: bl.YMsyaxis.syaxisTick,
                    lineStyle: {
                        color: bl.yaxisClocr[1]
                    }
                },
                axisLine: {
                    show: bl.YMsyaxis.syaxisLine,
                    lineStyle: {
                        color: bl.yaxisClocr[2]
                    },
                },
                splitLine: {
                    show: bl.YMsyaxis.sysplitLine,
                    lineStyle: {
                        color: bl.yaxisClocr[3]
                    },
                },
                splitArea: {
                        show: bl.YMsyaxis.sysplitArea,
                        areaStyle: {
                            color: [bl.yaxisClocr[4], bl.yaxisClocr[5]]
                        }
                    }              
            }
            ],
            // 具体数值
            series:[] //seriesList
            };
        this.blChart .setOption(option);
        this.blChart .showLoading();
        $(window).resize(function(){
            _this.blChart .resize();
        }).resize();
        return this;
    },
    barlineSet:function(dName,valJson){
        var bl=this.barlineCfg;
        //处理数据，展示题目
        valJson && ( bl.datalName.length=0);
        for(var key in valJson){
            bl.datalName.push(key);
        }
        //处理数据成echart格式
        var seriesList=[];
        //处理barWidth
        var viewWh=$('#'+bl.id).width()*(1-parseInt( bl.YMgrid.gleft)/100- parseInt(bl.YMgrid.gright)/100 )/* -160 */,//160为默认间距
            oneWh=viewWh/ dName.length,
            // oneBarWh=(oneWh-40)/bl.datalName.length; 
            oneBarWh=(oneWh/bl.datalName.length-0.9)/2.9; 
            // var bwh=Math.ceil(bl.minBarWidth*1.3)*bl.datalName.length,
            var bwh=Math.ceil(bl.minBarWidth*1.3*bl.datalName.length+bl.minBarWidth*0.3),
                bbnumber=parseInt(viewWh/bwh),
                dataZoom_end,
                bwh_max=Math.ceil(bl.maxBarWidth*1.3*bl.datalName.length+bl.minBarWidth*0.3);
            if (dName.length > bbnumber) {
                dataZoom_end = 100 - ((dName.length -bbnumber+1) / dName.length) * 100;
            } else {
                dataZoom_end = 90;
            }
            var flag;
        for(var i=0;i< bl.datalName.length;i++){
            var oneItem={
                name: bl.datalName[i],
                type:bl.type,
                data:valJson[bl.datalName[i]]
            };
            if(bl.type=="line"){
                oneItem.symbol='circle';//拐点样式
                oneItem.symbolSize= 6;//拐点大小
                oneItem.smooth=true;  //设置平滑
            }
            if(oneBarWh<bl.minBarWidth){
                oneItem.barWidth=bl.minBarWidth;
                flag=true;
            }else if(oneBarWh>bl.maxBarWidth){
                oneItem.barWidth=bl.maxBarWidth;
            }else{
                oneItem.barWidth=Math.ceil(oneBarWh);
            }
            seriesList.push(oneItem);
        }
        var op={
            xAxis:[{
                data:dName
            }],
            dataZoom:[{
                show:bl.YMdataZoom .dzshow,
                end:100
            }],
            series:seriesList
        };
        if(bwh>oneWh){
            op.dataZoom[0].show=true;
            op.dataZoom[0].end=dataZoom_end;
        }
        // if(bwh>oneWh){
        //     op.dataZoom[0].show=true;
        //     op.dataZoom[0].end=dataZoom_end;
        // }
        this.blChart.setOption(op);
        this.blChart.hideLoading();
    },
    pieCfg:{
    id:'yui-report-echart', 
    valueJson:[],
        //统计图颜色
        YMPcolorList :['#ffc000', '#00ad4e', '#0073c2', '#165868', '#e76f00', '#316194', '#723761', '#00b2f1', '#4d6022', '#4b83bf', '#f9c813', '#0176c0'],
        //统计图背景色
        YMPstbackgrond : ['#fff'],
        // 各统计注解
        YMPlegend :{
            lshow: true,//是否显示
            lalign: 'center',//注解位置 center：居中  left：左 right：右
            lcolor: '#444', //字体颜色
            lorient: 'vertical',//注解显示格式 horizontal,水平分布 vertical，垂直分布
            licon: 'circle',//注解前面图形 circle：园，triangle：三角形，diamond：菱形，rect：矩形,roundRect:圆角矩形
            ldata:[],
            lyalign: 'center'//垂直位置
        },
        //题目
        YMPtitle : {
            tshow: true,// 是否显示
            ttext: '',//一级标题
            ttcolor: '#444',//一级标题颜色
            ttfontsize: 16,//一级标题大小
            tsubtext: '',//二级标题
            tstcolor: '#666',//二级标题颜色
            tstfontsize: 14,//二级标题字号
            txalign: 'left'//位置 center 居中 left 局左 right 局右
        },

        // 需要居中显示具体数据与题目 环形图可以使用 饼状图不建议使用
        YMPtotaltitle :{
            totalshow: false,
            totalnshow: false,
            totaltext: '',  //题目
            totaltextsize: 14, //题目大小
            totalnumber: '', //总数值
            totalnumbersize: 26, //数值大小
            totalColor: ["#999", '#333'] //居中值颜色设置 前为标题 后为数值
        },
        //鼠标提示
        YMPtooltip :{
            YMPTtooltip: "",//加在头部
            YMPBtooltip: "",//加在尾部
            YMPcontent: '{b}:{c}({d}%)'
        },
        //控制图形
        YMPseries : {
            sname: '',
            sradius: ["0%", "70%"], //控制图形类型 取值0~100%（控制0~80%） 当前值为0%时 为饼状图 其他为环形图（推荐取值在前后差20）页可为具体数值
            slabelshow: false, //是否需要外部显示
            sastyle: ['', '16'], //百分比数值的颜色与字号行高 颜色传空时 字体颜色对应每部分颜色
            sbstyle: ['', '14'], //数值标题的颜色与字号行高 颜色传空时 字体颜色对应每部分颜色
            scstyle: ['', '18'], //具体数值标题的颜色与字号行高 颜色传空时 字体颜色对应每部分颜色
            scontent: '{a}{c}{a|{d}%}\n{b|{b}}' //外围显示值'{c}{a|{d}%}\n{b|{b}}' c 选项具体数值 d 百分比 b 选项 a 为标题(sname)
        },
        // 工具栏
        YMPtoolbar : {
            itemSize: 14,   // 工具栏图标大小
            toorshow: true, //工具栏是否显示 true  false
            restore: true,    //刷新是否显示  true false
            saveAsImage: true, //保存是否显示 true false
            dataView: true //是否显示数据视图
        }
    },
    pieInit:function(cfg){
        var _this=this;
        $.extend(true,this.pieCfg,cfg);
        var pie=this.pieCfg;
        this.pieChart = echarts.init( document.getElementById( pie.id) );
        var option = {
            color: pie.YMPcolorList, // 各统计颜色
            legend: {// 各统计注解
                show: pie.YMPlegend.lshow,
                type: 'scroll',
                orient: pie.YMPlegend.lorient,
                icon: pie.YMPlegend.licon,
                data: pie.YMPlegend.ldata,
                align: 'left',
                x: pie.YMPlegend.lalign,
                y: pie.YMPlegend.lyalign,
                textStyle: {
                    color: pie.YMPlegend.lcolor,
                    fontSize: 14
                },
                itemWidth: 20,
                itemHeight: 10
            },
            backgroundColor: pie.YMPstbackgrond, // 统计图背景色
            title: [  //统计图名称
                {
                    show: pie.YMPtitle.tshow,
                    x: pie.YMPtitle.txalign,
                    text: pie.YMPtitle.ttext,
                    textStyle: {
                        fontSize: pie.YMPtitle.ttfontsize,
                        color: pie.YMPtitle.ttcolor
                    },
                    subtext: pie.YMPtitle.tsubtext,
                    subtextStyle: {
                        fontSize: pie.YMPtitle.tstfontsize,
                        color: pie.YMPtitle.tstcolor
                    }
                },
                // 需要中间出现值
                {
                    show: pie.YMPtotaltitle.totalshow,
                    text: pie.YMPtotaltitle.totaltext,
                    left: '49%',
                    top: '46%',
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textStyle: {
                        color: pie.YMPtotaltitle.totalColor[0],
                        fontWeight: 'normal',
                        fontSize: pie.YMPtotaltitle.totaltextsize
                    }
                },
                {
                    show: pie.YMPtotaltitle.totalnshow,
                    text: pie.YMPtotaltitle.totalnumber,
                    left: '49%',
                    top: '51%',
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textStyle: {
                        color: pie.YMPtotaltitle.totalColor[1],
                        fontWeight: 'normal',
                        fontSize: pie.YMPtotaltitle.totalnumbersize
                    }
                }
            ],
            // 鼠标移入显示
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: '#000'
                },
                axisPointer: {
                    type: 'shadow'
                },
                trigger: 'item',
                formatter: pie.YMPtooltip.YMPTtooltip + pie.YMPtooltip.YMPcontent + pie.YMPtooltip.YMPBtooltip
            },
            // 工具栏视图
            toolbox: {
                itemSize: pie.YMPtoolbar.itemSize,
                feature: {
                    dataView: { show: pie.YMPtoolbar.dataView },
                    restore: {
                        show: pie.YMPtoolbar.restore  //刷新
                    },
                    saveAsImage: {
                        show: pie.YMPtoolbar.saveAsImage //保存
                    }
                }
            },
            series:[
                {
                name: pie.YMPseries.sname,
                type: 'pie',
                radius: pie.YMPseries.sradius,
                labelLine: {
                    normal: {
                        length: 20,
                        length2: 80,
                        lineStyle: {
                            color: '#333'
                        }
                    }
                },
                label: {
                    normal: {
                        show: pie.YMPseries.slabelshow,
                        formatter: pie.YMPseries.scontent,
                        borderWidth: 0,
                        borderRadius: 4,
                        padding: [0, 12],
                        textStyle: {
                            color: pie.YMPseries.scstyle[0],
                            fontSize: pie.YMPseries.scstyle[1]
                        },
                        rich: {
                            a: {
                                color: pie.YMPseries.sastyle[0],
                                fontSize: pie.YMPseries.sastyle[1],
                                padding: [0, 0, 0, 6]
                            },
                            b: {
                                fontSize: pie.YMPseries.sbstyle[1],
                                padding: 4,
                                color: pie.YMPseries.sbstyle[0]
                            }
                        }
                    }
                },
                data:[]//pie.valueJson 
            }
            ] 
        };
        this.pieChart.setOption(option);
        this.pieChart.showLoading();
        $(window).resize(function(){
            _this.pieChart.resize();
        }).resize();
        return this;
    },
    pieSet:function(vJson){
        var pie=this.pieCfg,
            dataNumberkey=[];
        for(var key in vJson){
            dataNumberkey.push(vJson[key].name);
        } 
        this.pieChart.setOption({
            legend:{
                data:dataNumberkey
            },
            series:[
                {
                name: pie.YMPseries.sname,
                type: 'pie',
                radius: pie.YMPseries.sradius,
                labelLine: {
                    normal: {
                        length: 20,
                        length2: 80,
                        lineStyle: {
                            color: '#333'
                        }
                    }
                },
                label: {
                    normal: {
                        show: pie.YMPseries.slabelshow,
                        formatter: pie.YMPseries.scontent,
                        borderWidth: 0,
                        borderRadius: 4,
                        padding: [0, 12],
                        textStyle: {
                            color: pie.YMPseries.scstyle[0],
                            fontSize: pie.YMPseries.scstyle[1],
                        },
                        rich: {
                            a: {
                                color: pie.YMPseries.sastyle[0],
                                fontSize: pie.YMPseries.sastyle[1],
                                padding: [0, 0, 0, 6]
                            },
                            b: {
                                fontSize: pie.YMPseries.sbstyle[1],
                                padding: 4,
                                color: pie.YMPseries.sbstyle[0]
                            }
                        }
                    }
                },
                data:vJson
            }
            ] 
        });
        this.pieChart.hideLoading();
    }
};
app.ui.hbpage={
    init:function(cfg){
        if(cfg.summary){
            this.summary=app.ui.summary.init(cfg.summary);
        }
        if(cfg.deptSort){
            this.deptSort=app.ui.cardList.init(cfg.deptSort);
        }
        if(cfg.classSort){
            $.extend(cfg.classSort,{parent:'#yyClassSort'});
            this.classSort=app.ui.cardList.init(cfg.classSort);
        }
        if(cfg.goodsApply){
            this.goodsApply=app.ui.goodsApply.init(cfg.goodsApply);
        }
        if(cfg.curve){
            if(cfg.curve && (cfg.curve.type=="bar" ||  cfg.curve.type=="line")){
                var curseId='parkcurse';
                $('.layui-card-body','#bodyCurve').append($('<div/>',{height:300,id:curseId}));
                $('.layui-card-header','#bodyCurve').append($('<span/>',{text:cfg.curve.title|| '',class:'yy-border-left'}));
                $.extend(cfg.curve,{id:curseId});
                this.curve=app.ui.echarts.barlineInit(cfg.curve);
            }
        }
        if(cfg.entry){
            this.entry=app.ui.entry.init(cfg.entry) ;
        }
        return this;
    }
};