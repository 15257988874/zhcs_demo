layui.config({
    base: '../../../res/dep/layer/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use('index',function(){
    //  ycya.http.tokenTimer();//启动token检查  

    var navOption=[
        {
            name:'首页',
            selected:true,
            url:'',
            iconClass:'layui-icon layui-icon-set',
            code:'',
            subNav:[
                {
                    name:'首页',
                    url:'../views/home/home.html',
                    code:'',
                    subNav:[
                       {
                            name:'首页1',
                            url:'../views/home/home.html',
                            code:''
                       }
                    ]
                }
            ]
        }
    ];
});


(function(win){
    var Ycyanav=function(option,prilege,cfg){
        this.id= (cfg && cfg.id) || 'LAY-system-side-menu';
        if(!option ||  Object.prototype.toString.call(option)!=='[object Function]'  ||option.length==0){
            return alert('nav para error');
        }
        this.init(option,prilege);
    }
    Ycyanav.prototype={
        init:function(option,prilege){
            var p=prilege,
                liArr=[];
            for(var i=0;i<option.length;i++){
                var oi=option[i],
                    _li=$('<li/>',{class:'layui-nav-item'});
                if(prilege){
                    if( !ycya.util.checkPrivilege( p,oi.code) ){//验证权限
                        continue;
                     }else{
                         _li.append(this.createOne(oi));
                         if(oi){}
                     }
                }else{
                    _li.append(this.createOne(oi));
                }    
            }
            $('#'+this.id).html(liArr.join(''));
        },
        createOne:function(one){
            var _a=$('<a/>',{'lay-tips':one.name});
            if(a.url){_a.attr('lay-href',a.url)}
            if(one.class){_a.append( $('<i/>',{class:one.class}) )}
            _a.append($('<cite/>',{text:one.name}));
            if(one.subNav){_a.append($('<span/>',{class:'layui-nav-more'}))}
            return _a;
        }
    }
    win.Ycyanav=Ycyanav;
})(window)