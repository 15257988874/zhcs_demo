$(function(){
    var page=app.ui.page.parking.init({
        header:{
            item:[
                {
                    text:'平台停车场个数', //标题
                    num:'2200',           //数量
                    unit:'个',            //单位
                    icon:'icon-yonghu1'//字体图标class
                },
                {
                    text:'平台泊车位',
                    num:'200',
                    unit:'个',
                    icon:'icon-dingdan3',
                    bgClass:'skyblue'
                },
                {
                    text:'当前停车数',
                    num:'200',
                    unit:'辆',
                    icon:'icon-louyutubiaobaojing',
                    bgClass:'purple'
                },
                {
                    text:'当日营收',
                    num:'200',
                    unit:'个',
                    icon:'icon-chengben1',
                    bgClass:'green'
                },
                {
                    text:'平台设备量',
                    num:'20210',
                    unit:'个',
                    icon:'icon-jiayou',
                    bgClass:'yellow'
                }
            ]
        },
        map:{},
        devRun:{//设备运行
            title:'设备运行情况',
            name:[//title :表格列标题,class:'字体颜色',field:'表格列字段(与后台对应)'
                {title:"类型",class:"black",field:'type'},
                {title:"总数",class:"blue",field:'all'},
                {title:"在线",class:"green",field:'on'},
                {title:"离线",class:"gray",field:'off'},
                {title:"异常",class:"yellow",field:'anomaly'}
            ],
            cfg:{
                url:'parkList.js',//后台地址
                data:{},        //额外数据
                type:'get',
                beforeSuccess:function(data){//过滤数据
                    return data.data.data;
                }
            }
        },
        parkSort:{//停车场分类饼图
            type:'pie', //必传
            title:'设备运行情况',
            YMPseries:{
                sradius:["40%", "60%"],
                slabelshow:false
            },
            YMPlegend:{
                lyalign:50, //距离顶部距离
                lalign:20    //距离左侧距离
            }
        },
        parkRank:{//停车场排名
            title:'停车排名',
            name:[//title :表格列标题,field:'表格列字段(与后台对应)'
                {title:"停车场名称",field:'parkName'},
                {title:"车位",field:'parkPort'},
                {title:"停车数",field:'parkNum'},
                {title:"停车率",field:'parkRate'}
            ],
            numberKey:"parkName", //序号字段
            cfg:[
                {
                    url:'parkList2.js',//后台地址
                    data:{},        //额外数据
                    type:'get',
                    beforeSuccess:function(data){//过滤数据
                        return data.data.data;
                    }
                },//停车率
                {
                    url:'parkList3.js',//后台地址
                    data:{},        //额外数据
                    type:'get',
                    beforeSuccess:function(data){//过滤数据
                        return data.data.data;
                    }
                }//停车数
            ]
        },
        parkCurve:{//停车场曲线
            type:'line', //必传
            title:'当日停车曲线',
            YMgrid:{//统计图位置
                gleft:10// 左、右、下、上 值可取0~100% 也可直接取数字
            },
            xaxisClocr:['#e1e3e5', '#666', '#444', '#f6f6f6', '#f6f6f6', '#fff'], //x轴线颜色 顺序为: 具体数值、坐标轴小标记、坐标轴、分割区域线 、间隔颜色
            yaxisClocr:['#333', '#666', '#e1e3e5', '#f6f6f6', '#f6f6f6', '#fff'],
            YMyaxis:{
                ysplitLine:true
            }
        },
        ready:function(cur){//地图加载完成
            var mapObj=cur.map; //获取地图对象  or cur.getMap()
        }
    });
    /* ajax请求获取header数据 */
    // 数组参数 
    //page.getHeader().set([20000,20000,20000,200000,20000]);
    //对象参数
    page.getHeader().set({
        1:'20000',
        4:'300000'
    }); 
    /* ajax请求获取停车场分类数据 */
    page.getParkSort().pieSet( [
        {'value':2005,"name":"视频广告1"},
        {'value':135,"name":"视频广告2"},
        {'value':135,"name":"视频广告3"},
        {'value':135,"name":"视频广告4"}
    ]);
    /*ajax请求获取停车场分类数据*/
    //备注:barlineSet方法须传入2个形参,第一个参数为x轴待显示的名称list
    page.getParkCurve().barlineSet( 
        [
            '喀什市', '疏附县', '疏勒县', '英吉沙县' , '泽普县', '岳普湖县'
        ],
        { 
            '接入率':[20, 50, 80, 58, 83, 68, 57, 80, 42, 66,12,25,36,45,25,65]
        }
    );
    function sum(arr){
       return arr.reduce(function(total,cur){
           return total + cur
        });
    }
    function multiply(arr){
        return arr.reduce(function(total,cur){
            return total * curs
         });
     }
});