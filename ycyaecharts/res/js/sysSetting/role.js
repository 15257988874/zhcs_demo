layui.config({
    base: '../../../../res/dep/layer/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index','common','jquery'],function(){
    $(function () {
   
        var treeNode = [],//存储角色树数据
            JurisdictionTreeNode = [],//存储权限树数据
            chooseNode = {},//存储选中的节点
            optFlag,
            optJson={
                1:'角色新增成功',
                2:'角色修改成功'
            },
           /*  checkPrivilege=[], //存储选中角色的权限（新增弹框） */
            leftTreeCheckPrivilege=[],//存储左侧选中角色的权限
            saveBtn=$('#btnSave'),
            cancelBtn=$('#btnCancel'),
            roleNameInput=$('#roleName'),
            rootId; //根节点ID
          //加载角色树
          var RoleSetting = {
            data: {
                key: {
                    name: 'roleName'
                },
                simpleData: {
                    enable: true,
                    pIdKey: 'pid'
                }
            },
            view: {
               /*  showIcon: false */
            },
            callback: {
                onClick: function (event, treeId, NowtreeNode, clickFlag) {
                    getParentNode(event, treeId, NowtreeNode, clickFlag);
                }
            }
        };
         //加载权限树
         var jurisdictionSetting = {
            check: {
                enable: true,
                chkDisabledInherit: true/* ,
                chkboxType: { "Y": "s", "N": "ps" } */
            },
            data: {
                key: {
                    name: 'privilegeName'
                },
                simpleData: {
                    enable: true,
                    pIdKey: 'pid'
                }
            },
            view: {
                /* showIcon: false */
            }
        };
        getRoleTree($('#RoleTree'));//左侧加载角色树
        getJurisdictionTree($('#windowTree')); //右侧加载权限树
        bindEvents();
        /**
         * 新增角色
         * */
        $('#btnAdd').click(function () {
            optFlag=1;
            controlBtn(2);
        });
        /**
         * 修改角色
         * */
        $('#btnMod').click(function () {
            if (chooseNode.id) {
                optFlag=2;
                controlBtn(2);
                roleNameInput.val(chooseNode.name);
            } else {
                layer.msg('请选择要修改的角色', {time: 1000});
            }
        });
        /**
         * 删除角色
         * */
        $('#btnDel').click(function () {
            if (chooseNode) {
                if(chooseNode.prevId){
                    global.ycyaAjax({
                        url:'roleDel',
                        data:{
                            id:chooseNode.id
                        },
                        success:function(data){
                            treeNode = [];//初始化节点数
                            chooseNode = {};//初始化选中的节点
                            roleNameInput.val('');
                            getRoleTree($('#RoleTree'));
                            layer.msg('角色删除成功', {time: 1000});
                        }
                    });
                }else{
                    layer.msg('系统内置角色,不能删除', {time: 1000});
                    return ;
                }
            } else {
                layer.msg('请选择要删除的角色', {time: 1000});
            }
        });
    
        function bindEvents(){
            cancelBtn.click(function(){
                controlBtn(1);
            });
            saveBtn.click(function(){
                var json = {};
                if( $.trim($('#roleName').val()) ==''){
                    layer.msg('请填写角色名称',{time:2000});
                    return ;
                }
                var treeObj = $.fn.zTree.getZTreeObj("windowTree"),
                    nodes = treeObj.getCheckedNodes(true),
                    privilege=[];
                json.roleName = $('#roleName').val();
                json.pid=rootId;
                if(nodes.length==0){
                    layer.msg('请分配权限',{time:2000});
                    return ;
                }else{
                    $.each(nodes,function(i,item){
                        privilege.push(item.id); 
                    })
                }
                json.privilegeIds=privilege.join(',');
                var rUrl=optFlag==1?'roleAdd':'roleMod';
                if(optFlag==2){
                    json.id=chooseNode.id;
                }
                global.ycyaAjax({
                    url:rUrl,
                    data:json,
                    success:function(data){
                        getRoleTree($('#RoleTree'));
                        layer.closeAll();
                        layer.msg(optJson[optFlag], {time: 1000});
                        controlBtn(1);
                    }
                });
            });
        }
      
        function getRoleTree($Dom) {
            global.ycyaAjax({
                url:'roleList',
                data: '',
                success:function(data, textStatus, jqXHR){
                    treeNode = data.data;
                    for (var i = 0; i < treeNode.length; i++) {
                        if (treeNode[i].pid == 0) {
                            treeNode[i].open = true;//默认展开根节点
                            rootId=treeNode[i].id;
                        }
                    }
                    $.fn.zTree.init($Dom, RoleSetting, openNodes(treeNode));
                }
            });
        }
       
        //查询所有权限树
        function getJurisdictionTree($Dom) {
            global.ycyaAjax({
                url:'powerList',
                success:function(data, textStatus, jqXHR){
                    JurisdictionTreeNode = data.data;
                    $.fn.zTree.init($Dom, jurisdictionSetting, openNodes(JurisdictionTreeNode)); 
                }
            });
        }
        //查询指定角色的权限
        function checkedRoleJurisdiction($Dom,id,isLoad){
            global.ycyaAjax({
                url:'powerList',
                data: {
                    roleId: id
                },
                success:function(data, textStatus, jqXHR){
                    if(!isLoad){
                        leftTreeCheckPrivilege.length=0;
                        $.each(data.data,function(i,item){
                            leftTreeCheckPrivilege.push(item.id);
                        });
                    }
                    //权限树配置
                    var cSetting = {
                        check: {
                            enable: true,
                            chkDisabledInherit: true,
                            chkboxType: { "Y": "s", "N": "ps" }
                        },
                        data: {
                            key: {
                                name: 'privilegeName'
                            },
                            simpleData: {
                                enable: true,
                                pIdKey: 'pid'
                            }
                        },
                        view: {
                            showIcon: false
                        }
                    };
                    if(!isLoad){
                          selectRoleJurisdiction(data.data);
                    }else{
                        var d=data.data;
                        for(var i=0;i<d.length;i++){
                            d[i].checked=true;
                        }
                        $.fn.zTree.init($Dom, cSetting, openNodes(d));
                    }
                  
                }
            });
        }
         //TODO 选中指定角色的权限
         function selectRoleJurisdiction(pCodeArr){
           /*  for(var i=0,l=JurisdictionTreeNode.length;i<l;i++){
                JurisdictionTreeNode[i].chkDisabled=false;
            } */
            $.fn.zTree.init($('#windowTree'), jurisdictionSetting, openNodes(JurisdictionTreeNode)); 
            var pTree=$.fn.zTree.getZTreeObj("windowTree"),
                pTreeNodes= pTree.transformToArray(pTree.getNodes());
            for(var i=0;i<pTreeNodes.length;i++){
                for(var j=0;j<pCodeArr.length;j++){
                    if(pTreeNodes[i].id==pCodeArr[j].id){
                        pTree.checkNode(pTreeNodes[i], true, false);
                    }
                }
            }
         }
        //获取当前选中节点的数据
        function getParentNode(event, treeId, NowtreeNode, clickFlag) {
            var json = {};
                json.name = NowtreeNode.roleName;//得到当前角色名字
                json.id = NowtreeNode.id;//得到当前角色id
                var pid = NowtreeNode.pid;
                for (var i = 0; i < treeNode.length; i++) {
                    if (treeNode[i].id == pid) {
                        json.prevName = treeNode[i].roleName;//得到父级角色名字
                        json.prevId = treeNode[i].id;//得到父级id
                    }
                }
                if(treeId=="RoleTree"){
                    chooseNode = json;//存储当前选中的节点
                }
            // if (treeId == 'RoleTree') {
                $('#roleName').val(json.name );
                checkedRoleJurisdiction($('#roleJurisdiction'), json.id);//选中角色的权限
            // }else if(treeId == 'curRole'){
            //     checkedRoleJurisdiction($('#curRolePrivilege'), json.id,true);//选中角色的权限
            // }
        }
        /**
         * 控制保存/取消按钮 显示/隐藏
         * @param {any} type  1显示 2隐藏
         */
        function controlBtn(type){
            if($.type(type)=='number'){
                if(type==1){
                    saveBtn.hide();
                    cancelBtn.hide();
                    roleNameInput.prop('disabled',true).val('');
                }else if(type==2){
                    saveBtn.show();
                    cancelBtn.show();
                    roleNameInput.prop('disabled',false).val('').focus();
                }
            }else{  
                throw new Error('参数类型错误');
            }    
        }
    });
   
});






