layui.config({
    base: '../../../../res/dep/layer/layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'common', 'jquery','form','gridBtn','deptTree'], function () {
    var form = layui.form,
        $ = layui.$,
        gridBtn = layui.gridBtn;
    var popupObj,
        infoList={
            1:'新增',
            2:'修改'
        },
        treeNode = [], //存储树结构数据
        chooseNode = {}, //存储选中的节点
        thisTree,
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
                    $('#chooseDeptName').text(NowtreeNode.deptName);
                    var parNode=NowtreeNode.getParentNode();
                    $('#prevDeptName').text(parNode?parNode.deptName:'无上级部门');
                }
            }
        }, //左侧单位树
        setting2 = {
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
                   $('#deptPopup').val(NowtreeNode.deptName).attr('keyid',NowtreeNode.id);
                }
            }
        }; //弹框单位部门树
    var  addModObj = {//添加/修改 对象
        '$dom': $('#addPopup'),
        'filter': 'addModObj',
        'elmArr': [{
                'labelName': '部门名称',
                'name': 'deptName',
                'verify': 'required',
                'isBlock':true,
                'isRequired': true
            },
            {
                'labelName': '上级部门',
                'name': 'superName',
                'verify': 'required',
                'isBlock':true,
                'isRequired': true
            }
        ],
        callback:popupInit
    },
    addModNum = 1; //区分 添加/修改 1添加 2修改  
    global.createPopup(addModObj); //create popup--add and mod  
    //添加/修改监听    
    form.on('submit(' + addModObj.filter + ')', function (data) {
        var formData = data.field;
        delete formData.superName;
        if($('#deptPopup').val()==$('[name="deptName"]').val()){
            layer.msg('部门名称冲突',{time:2000});
            return ;
        }
        if($('#deptPopup').val()!=='' ){
            formData.pid=$('#deptPopup').attr('keyid');
        }
        var u=addModNum==1?'deptAdd':'deptMod';
        if(addModNum==1){//新增
        }else{
            formData.id = thisTree.getSelectedNodes()[0].id;
        }
        global.ycyaAjax({
            url: u,
            data: formData,
            success: function (data) {
                //更新树
                initDeptTree($("#deptTree"));
                layer.closeAll();
                layer.msg('部门'+infoList[addModNum]+'成功', {
                    time: 2000
                });
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });    
    function init() {
        initDeptTree($("#deptTree"));
        bindEvents();
    }
    function bindEvents() {
        $('#btnAdd').click(function () {
            deptAdd();
            $(this).blur();
        });
        $('#btnMod').click(function () {
            deptMod();
            $(this).blur();
        });
        $('#btnDel').click(function () {
            deptDel();
            $(this).blur();
        });
    }
    function deptAdd() {
        addModNum=1;
        var layerIndex = global.openLayer({
            title: '部门-新增',
            area: '350px',
            content:$('#addPopupWrap'),
            btn:['确定','取消'],
            yes: function () {
                $('#addPopupWrap .form-btn-li a:eq(0)').trigger('click').trigger('submit');
            },
            success: function () {
                $('#addPopupWrap').initFormElm();
            }
        });
    }
    function deptMod() {
        if(!thisTree) return ;
        var row = thisTree.getSelectedNodes();
        if (row == '' || row == undefined || row == null) {
            layer.msg('请选择需要修改的部门信息', {
                time: 1000
            });
            return ;
        }
        addModNum=2;
        var layerIndex = global.openLayer({
            title: '部门-修改',
            area: '350px',
            content:$('#addPopupWrap'),
            btn:['确定','取消'],
            yes: function () {
                $('#addPopupWrap .form-btn-li a:eq(0)').trigger('click').trigger('submit');
            },
            success: function () {
                var prevNode=row[0].getParentNode();
                $('[name="deptName"]').val(row[0].deptName);
                $('[name="superName"]').val(prevNode.deptName).attr('keyid',prevNode.id);
            }
        });
    }
    function deptDel() {
        if(!thisTree) return ;
        var row = thisTree.getSelectedNodes(),
            isForce=false,
            promptList={
                 0:'确定删除?',
                 1:'该部门下有子部门，强制删除?'
            },
            forceDelNum; //是否强制删除 0不强制 1强制
        if (!row ) {
            layer.msg('请选择需要删除的部门信息', {
                time: 1000
            });
            return;
        }
        if (row[0].children && row[0].children.length > 0) {
            // isForce=true;
            layer.msg('该部门下有子部门,不允许删除', {
                time: 1000
            });
            return;
        }
        forceDelNum=isForce?1:0;
        layer.confirm(promptList[forceDelNum], {
            icon: 2,
            title: '提示'
        }, function (index) {
            layer.msg('正在删除中', {
                icon: 16,
                shade: 0.01
            });
            global.ycyaAjax({
                url: 'deptDel',
                data: {
                    id: row[0].id,
                    forceDel:forceDelNum
                },
                success: function (data, textStatus, jqXHR) {
                    layer.msg('部门删除成功', {
                        time: 1000
                    });
                    initDeptTree($("#deptTree"));
                }
            });
        });
    }
    //加载部门结构树
    function initDeptTree($Dom) {
        global.ycyaAjax({
            url: 'deptList',
            data: '',
            success: function (data, textStatus, jqXHR) {
                treeNode = data.data;
                thisTree = $.fn.zTree.init($Dom, setting, openNodes(treeNode));
            }
        });
    }
    //弹框初始化
    function popupInit(){
        var superName=addModObj.$dom.find('[name="superName"]');
        superName.prop('readonly',true).attr('id','deptPopup');
        popupObj=createDeptTree({
            'setting':setting2,
            '$dom':$('#deptPopup'),
            'treeDom':$('#deptTreePop'),
            'isPopup':true
        });
    }
    init();
});