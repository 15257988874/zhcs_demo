! function (win) {
    layui.config({
        base: '../../../../res/dep/layer/layuiadmin/' //静态资源所在路径
    }).extend({
        index: 'lib/index' //主入口模块
    }).use(['index', 'table', 'gridBtn', 'form','deptTree'], function () {
        var admin = layui.admin,
            table = layui.table,
            form = layui.form,
            $ = layui.$;
        var typeJson={
                1:'系统管理员',
                2:'所属部门管理员',
                3:'所在部门管理员',
                4:'本人'
            },
            gridBtn = layui.gridBtn,
            //添加/修改 对象
            addModObj = {
                '$dom': $('#addPopup'),
                'filter': 'addModObj',
                'elmArr': [{
                        'labelName': '用户名',
                        'name': 'userName',
                        'verify': 'required|maxLength8',
                        'isRequired': true
                    },
                    {
                        'labelName': '昵称',
                        'name': 'fullName',
                        'verify': 'required',
                        'isRequired': true
                    },
                    {
                        'labelName': '角色',
                        'name': 'roleNames',
                        'verify': 'required',
                        'isRequired': true,
                        'isReadonly':true
                    },
                    {
                        'labelName': '密码',
                        'name': 'pwd',
                        'type':'password',
                        'verify': 'maxLength8'
                    },
                    {
                        'labelName': '部门名称',
                        'name': 'deptName',
                        'verify': 'required',
                        'isRequired': true,
                        'isReadonly':true
                    },
                    {
                        'elmType': 2,
                        'labelName': '用户类型',
                        'name': 'userType',
                        'isRequired': true/* ,
                        'selectOption': [
                            '普通用户',
                            '部门管理员',
                            '系统管理员'
                        ] */
                    },
                    {
                        'labelName': '电话',
                        'name': 'mobile',
                        'verify': 'pwd'
                    }
                ],
                callback: addElm
            },
            addModNum = 1, //区分 添加/修改 1添加 2修改
            //查看对象
            // checkObj = global.createCheckObj(addModObj, $('#checkPopup')),
            //高级搜索对象
            searchObj=global.createSearchObj(addModObj, $('#advancedSearch'),advancedFn,['用户名','电话','用户类型'])
            //table对象
            gridObj = global.createGridObj({
                elem: '#grid',
                url: 'userList',
                where: {
                },
                cols: [
                    [{
                            type: 'numbers',
                            fixed: 'left'
                        },
                        /* {
                            type: 'checkbox',
                            fixed: 'left'
                        }, */ 
                        {
                            field: 'userName',
                            title: '用户名',
                            width: 100,
                            align: 'center'
                        }, {
                            field: 'fullName',
                            title: '姓名',
                            width: 150,
                            align: 'center'
                        }, {
                            field: 'deptName',
                            title: '部门',
                            align: 'center',
                            width: 120,
                        }, {
                            field: 'mobile',
                            title: '手机',
                            align: 'center',
                            width: 120,
                        },{
                            field: 'userType',
                            title: '用户类型',
                            align: 'center',
                            width: 180,
                            templet:function(d){
                                return '<span>'+ typeJson[d.userType] +'</span>';
                            }
                        },
                        {
                            field: 'rolesName',
                            title: '角色',
                            align: 'center',
                            minWidth: 120
                        },
                        {
                            field: 'regTime',
                            title: '注册时间',
                            width: 180,
                            align: 'center'
                        }, {
                            fixed: 'right',
                            title: '操作',
                            width: 180,
                            align: 'center',
                            toolbar: '#barTool'
                        } //这里的toolbar值是模板元素的选择器
                    ]
                ],
                done: function (res, curr, count) {
                    //创建按钮
                    gridBtn.createTableBtn([{
                            name: '添加',
                            handle: addUser,
                            id: 'gridAdd'
                        }
                    ]);
                }
            }),
            //左侧单位部门树
            setting = {
                data: {
                    key: {
                        name: 'deptName'
                    },
                    simpleData: {
                        enable: true,
                        pIdKey: 'pid'
                    }
                },
                callback: {
                    onClick: function (event, treeId, NowtreeNode) {
                        tableIns.reload({
                            where: {
                                deptId:NowtreeNode.id
                            },
                            page: {
                                curr: 1
                            }
                        });
                    }
                }
            },
            settingPopup = {
                data: {
                    key: {
                        name: 'deptName'
                    },
                    simpleData: {
                        enable: true,
                        pIdKey: 'pid'
                    }
                },
                callback: {
                    onClick: function (event, treeId, NowtreeNode) {
                       $('#deptPopup').attr('keyid',NowtreeNode.id).val(NowtreeNode.deptName);
                    }
                }
            },
            //角色树
            roleSetting = {
                check: {
                    enable: true,
                    chkDisabledInherit: true,
                    chkboxType: { "Y": "", "N": "p" }
                },
                data: {
                    key: {
                        name: 'roleName'
                    },
                    simpleData: {
                        enable: true,
                        pIdKey: 'pid'
                    }
                },
                callback: {
                    onClick: function (event, treeId, NowtreeNode, clickFlag) {
                        
                    }
                }
            },
            roleData=[],//角色树数组
            roleRoot={};//角色树根节点
        createDeptTree({
            'setting':setting,
            'treeDom':$('#deptTree')
        }) ;  
        global.createPopup(addModObj); //create popup--add and mod
        //global.createPopup(checkObj);  //create popup--check
        global.createPopup(searchObj); //create popup--advancedSearch
        getRoleTree($('#roleTree'));   //roleTree
        var tableIns = table.render(gridObj); //load data
        // 监听 table tool
        table.on('tool(grid)', function (obj) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; 
            var tr = obj.tr,
                rData=obj.data;
            if (layEvent === 'allot') { //分配
                roleAllot();
            } else if (layEvent === 'del') { //删除
                layer.confirm('确定删除？', function (index) {
                    // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    global.ycyaAjax({
                        url:'userDel',
                        data:{
                            id:data.id
                        },
                        success:function(){
                            layer.msg('用户删除成功',{time:2000});
                            tableIns.reload({
                                where: queryParam,
                                page: {
                                    curr: 1
                                }
                            });
                        }
                    });
                });
            } else if (layEvent === 'edit') { //修改
                modUser(rData);
            }
        });
        //自定义 form 验证
        form.verify({
            maxLength8:function(value){
                if($.trim(value).length>8){return '字符长度过长,至多8位'}
            },
            maxLength16:function(value){
                if($.trim(value).length<=16){return '字符长度过长,至多16位'}
            },
            pwd: function(value, item){ //value：表单的值、item：表单的DOM对象
              if($.trim(value)==''){
                  return ;
              } 
              if(!new RegExp("/^1\d{10}$/").test(value)){
                return '请输入正确的手机号';
              } 
            }
          });          
        // 添加/修改弹窗--提交监听 
        form.on('submit(' + addModObj.filter + ')', function (data) {
            var formData = data.field,
                u=addModNum==1?'userAdd':'userMod';

            delete formData.deptName;
            delete formData.roleNames;
            if(addModNum==2){//修改
                var checked = table.checkStatus('grid');
                formData.id=checked.data.id;
            }else{
                 /* if( $.trim(addModObj.$dom.find('[name="pwd"]').val())!=='' ){
                    formData.pwd=$('#hiddenInput').val();
                } */
            }
            formData.pwd=hex_md5(formData.pwd);
            formData.deptId=addModObj.$dom.find('[name="deptName"]').attr('keyid');
            formData.roleIds=addModObj.$dom.find('[name="roleNames"]').attr('keyid');
            global.ycyaAjax({
                url:u,
                data:formData,
                success:function(){
                    layer.closeAll();
                    layer.msg('用户'+infoList[addModNum]+'成功',{time:2000});
                    tableIns.reload({
                        where: queryParam,
                        page: {
                            curr: 1
                        }
                    });
                }
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        // 初级搜索--提交监听  
        form.on('submit(search-condition)', function (data) {
            var formData = data.field;
            console.log(formData) //当前容器的全部表单字段，名值对形式：{name: value}
            tableIns.reload({
                where: formData,
                page: {
                    curr: 1
                }
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        // 高级搜索--提交监听  
        form.on('submit(advancedSearch)', function (data) {
            var formData = data.field;
            console.log(formData) //当前容器的全部表单字段，名值对形式：{name: value}
            tableIns.reload({
                where: formData,
                page: {
                    curr: 1
                }
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        /* 功能函数 */
        // 添加/修改
        function addUser() {
            addModNum = 1;
            addModObj.$dom.find('[name="pwd"]').parent().parent().show();
            addModObj.$dom.initFormElm();
            addAndMod();
        }
        function modUser(rowData) {
            addModNum = 2;
            addModObj.$dom.find('[name="pwd"]').parent().parent().hide();
            addModObj.$dom.find('[name="userType"]').val(rowData.userType+'');
            addModObj.$dom.paddingFormElm(rowData);
            addAndMod(rowData);
        }
        function addAndMod(dataRow) {
            var titleText = addModNum == 1 ? '添加' : '修改';
            global.openLayer({
                title: '用户-' + titleText + '',
                content: $('#addPopupWrap'), //内容
                area: '550px',
                success: function () {
                },
                btn: ['确定', '关闭'],
                yes: function () {
                    $('#addPopupWrap .form-btn-li a:eq(0)').trigger('click').trigger('submit');
                }
            });
        }
        //查看
        function checkUser() {
            var index = global.openLayer({
                title: '用户-查看',
                content: $('#checkPopupWrap'), //内容
                area: '500px',
                success: function () {

                },
                btn: ['确定']
            });
        }
        //添加/修改弹窗 生成回调
        function addElm() {
            addModObj.$dom.find('[name="deptName"]').attr('id','deptPopup');
            createDeptTree({
                'setting':settingPopup,
                '$dom':$('#deptPopup'),
                'treeDom':$('#deptTreePop'),
                'isPopup':true
            });
            //text=>password
            /*addModObj.$dom.find('[name="pwd"]') .on('input',function(){
                var self=$(this).get(0);
                var nowLength = self.value.length;// 变化后的长度
                if(nowLength > beforeLength){//长度增加时
                    trueValue.push(self.value[nowLength-1]);
                    ++beforeLength;
                }else{//长度减少时
                    trueValue.pop();
                    --beforeLength;
                }
                document.getElementById('hiddenInput').value = trueValue.join('');//数组转化为字符串，并填充入隐藏框
                let nowValue = '';//转换为圆点
                for(let i = 0; i < nowLength; ++i){
                    nowValue += '•';
                }
                self.value = nowValue;
            })*/; 
            var typeStr='';
            for(var key in typeJson){
                typeStr+='<option value='+key+'>'+typeJson[key]+'</option>';
            }
            addModObj.$dom.find('[name="userType"]').html(typeStr);
            addModObj.$dom.find('[name="roleNames"]').click(function(){
                var _this=this;
                roleAllot( $(_this) );
               /*  global.openLayer({
                    title:'角色-分配',
                    area:'400px',
                    content:$('#rolePopup'),
                    btn:['确定','取消'],
                    yes:function(){
                        var treeObj = $.fn.zTree.getZTreeObj("roleTree"),
                            nodes = treeObj.getCheckedNodes(true),
                            checkedArr=[],
                            nameArr=[],
                            isRoot=false;//是否有管理员
                            if(nodes.length==0){
                                layer.msg('请选择角色',{time:2000});
                                return ;
                            }
                            $.each(nodes,function(i,item){
                                if(item.pid===null){
                                    isRoot=true;
                                    return false;
                                }else{
                                    checkedArr.push(item.roleId);
                                    nameArr.push(item.roleName)
                                }
                            });
                            if(isRoot){
                               $(_this).attr('keyid',roleRoot.roleId).val(roleRoot.roleName);
                            }else{
                                $(_this).attr('keyid',checkedArr.join(',')).val(nameArr.join(','));
                            }
                            layer.close(layer.index);
                            
                    },
                    success:function(){
                        $.fn.zTree.init($('#roleTree'), roleSetting, openNodes(roleData)); 
                    }
                }); */
            }); 
            addModObj.$dom.find('[name="deptName"]').click(function(){
                var _this=this;
                
            }); 
        }
        /**  角色分配
        *   dom:''  存在就是角色input弹窗，否则就是分配按钮弹窗
        **/
        function roleAllot(dom){
            global.openLayer({
                title:'角色-分配',
                area:'400px',
                content:$('#rolePopup'),
                btn:['确定','取消'],
                yes:function(){
                    var treeObj = $.fn.zTree.getZTreeObj("roleTree"),
                        nodes = treeObj.getCheckedNodes(true),
                        checkedArr=[],
                        nameArr=[],
                        isRoot=false;//是否有管理员
                        if(nodes.length==0){
                            layer.msg('请选择角色',{time:2000});
                            return ;
                        }
                        $.each(nodes,function(i,item){
                            if(item.pid===null){
                                isRoot=true;
                                return false;
                            }else{
                                checkedArr.push(item.roleId);
                                nameArr.push(item.roleName)
                            }
                        });
                        if(dom){
                            if(isRoot){
                                dom.attr('keyid',roleRoot.roleId).val(roleRoot.roleName);
                            }else{
                                dom.attr('keyid',checkedArr.join(',')).val(nameArr.join(','));
                            }
                        } 
                        layer.close(layer.index);
                },
                success:function(){
                    $.fn.zTree.init($('#roleTree'), roleSetting, openNodes(roleData)); 
                }
            });
        }
        //高级查询 生成回调
        function advancedFn(){
            $('#highSearch').click(function(){
                searchObj.$dom.toggle("slow");
            });
            searchObj.$dom.find('.no').click(function(){
                searchObj.$dom.hide("slow");
            });
            searchObj.$dom.find('.yes').click(function(){
               
            });
           /*  addModObj.$dom. */
        }
        //角色树
        function getRoleTree($Dom) {
            global.ycyaAjax({
                url:'roleList',
                success:function(data, textStatus, jqXHR){
                    roleData = data.data;
                    for (var i = 0; i < roleData.length; i++) {
                        if (roleData[i].pid == 0) {
                            roleData[i].open = true;//默认展开根节点
                            roleRoot=roleData[i];
                        }
                    }
                    $.fn.zTree.init($Dom, roleSetting, openNodes(roleData));
                }
            });
        }
    });    
}(window);
/* var trueValue = [];//保存真实数据的数组
var beforeLength = 0;//隐藏框value的长度 */