layui.define('layer',function(exports){
    var $=layui.$,
    layer = layui.layer;

    /**
     * @param {any} deptOpt _ 为必传
     * {
     *     url:'',      //url  
     *     setting:'', _ //部门树配置--参照ztree
     *     $dom:'',     //触发弹窗的元素--jquery
     *     treeDom:'', _ //放置部门树的容器 
     *     eventName:'click',//元素事件--默认click 
     *     isPopup:boolean,  //是否弹窗
     *         
     *      
     * }
     *  
     */
    createDeptTree=function (deptOpt){
        _createDeptTree=function(deptOpt){
            var _this=this;
            this.data=[];
            this.config={
                url:'sys/deptList',
                success:function(data){
                    _this.treeInit(deptOpt,data.data);
                    _this.data=data.data;
                }
            };
            if(deptOpt.isPopup){
                _this.addStyle(deptOpt);
                _this.bindEvent(deptOpt);
            }
            global.ycyaAjax(this.config);
        }
        _createDeptTree.prototype.addStyle=function(deptOpt){
            deptOpt.treeDom.css({
                height:240,
                overflow:'auto'
            });
        };
        _createDeptTree.prototype.treeInit=function(deptOpt,treeData){
            $.fn.zTree.init(deptOpt.treeDom, deptOpt.setting, openNodes(treeData));
        }
        _createDeptTree.prototype.bindEvent=function(deptOpt){
            var _this=this;
            var domEvent=deptOpt.eventName ?deptOpt.eventName:'click';
            deptOpt.$dom.on(''+domEvent+'',function(){
                _this.reload();
                global.openLayer({
                    title: '选择部门', //弹出层title
                    content:deptOpt.treeDom.parent(),
                    area:'400px',
                    btn:['确定'],
                    success:function(){
                    }  
                });
            });
        }
        _createDeptTree.prototype.reload=function(){
            global.ycyaAjax(this.config);
        }
        return new  _createDeptTree(deptOpt);
    };
    exports('deptTree',{/* createDeptTree */});
});