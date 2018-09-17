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
            createDicList();               //load dictionary list 
        var gridBtn = layui.gridBtn,
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
                        'isRequired': true,
                        'isReadonly':true
                    },
                    {
                        'labelName': '密码',
                        'name': 'pwd',
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
                        'isRequired': true
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
            checkObj = global.createCheckObj(addModObj, $('#checkPopup')),
            //高级搜索对象
            searchObj=global.createSearchObj(addModObj, $('#advancedSearch'),advancedFn)
            //table  按钮对象
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
                            width: 180
                        },
                        {
                            field: 'regTime',
                            title: '注册时间',
                            minWidth: 150,
                            align: 'center'
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    gridBtn.createTableBtn([{
                            name: '添加',
                            handle: addDic,
                            id: 'gridAdd'
                        }
                    ]);
                }
            }),
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
            };
      
        global.createPopup(addModObj); //create popup--add and mod
        global.createPopup(checkObj);  //create popup--check
        global.createPopup(searchObj); //create popup--advancedSearch
        //var tableIns = table.render(gridObj); //load data
        // 监听 table tool
        table.on('tool(dicGrid)', function (obj) {
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; 
            var tr = obj.tr,
                rData=obj.data;
            if (layEvent === 'detail') { //查看
                //do somehing
                checkUser();
            } else if (layEvent === 'del') { //删除
                layer.confirm('真的删除行么', function (index) {
                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                    layer.close(index);
                    //向服务端发送删除指令
                });
            } else if (layEvent === 'edit') { //修改
                //do something
                modDic(rData);
                //同步更新缓存对应的值
                /* obj.update({
                    username: '123',
                    title: 'xxx'
                }); */
            }
        });
        //自定义 form 验证
        form.verify({
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
            var formData = data.field;
            console.log(formData); //当前容器的全部表单字段，名值对形式：{name: value}
            console.log(addModNum);
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
        /* 功能函数----------------------------------------- */
        // 添加/修改
        function addDic() {
            addModNum = 1;
            addAndMod();
        }
        function modDic(rowData) {
            addModNum = 2;
            addAndMod(rowData);
        }
        function addAndMod(dataRow) {
            var titleText = addModNum == 1 ? '添加' : '修改';
            global.openLayer({
                title: '字典-' + titleText + '',
                content: $('#addPopupWrap'), //内容
                area: '550px',
                success: function () {
                    if (dataRow) { //修改

                    } else { //添加

                    }
                },
                btn: ['确定', '关闭'],
                yes: function () {
                    $('#addPopupWrap .form-btn-li a:eq(0)').trigger('click').trigger('submit');
                }
            });
        }
        //添加/修改弹窗 生成回调
        function addElm() {
            addModObj.$dom.find('[name="deptName"]').attr('id','deptPopup');
           /*  createDeptTree({
                'setting':settingPopup,
                '$dom':$('#deptPopup'),
                'treeDom':$('#deptTreePop'),
                'isPopup':true
            }); */
            addModObj.$dom.find('[name="deptName"]').click(function(){
                var _this=this;
                
            }); 

        }
        //高级查询 生成回调
        function advancedFn(){
            $('#highSearch').click(function(){
                searchObj.$dom.toggle("slow");
            });
           /*  addModObj.$dom. */
        }
        //数据字典列表
        function createDicList(){
            var dic=[];
            $.each(dicMap,function(i,item){
                dic.push('<input type="checkbox" name='+item+' title='+item+' lay-skin="primary"><div class="layui-unselect layui-form-checkbox padding-right-40" lay-skin="primary" data-id='+i+' data-flag="false"><span>'+item+'</span><i data-id='+i+'  class="layui-icon layui-icon-ok" ></i></div>');
            });
            $('#dicList').html(dic.join(' '));

            $('#dicList').on('click','.layui-form-checkbox',function(){
                $(this).toggleClass('layui-form-checked');
                $(this).siblings('.layui-form-checked').each(function(){
                    $(this).removeClass('layui-form-checked');
                });
                var f=$(this).attr('data-flag');
                if(f=='false'){
                    $(this).attr('data-flag','true');
                }else{
                    $(this).attr('data-flag','false');
                }
            })
        }

    });    
}(window);