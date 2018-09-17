
    layui.config({
        base: '../../../../res/dep/layer/layuiadmin/' //静态资源所在路径
    }).extend({
        index: 'lib/index' //主入口模块
    }).use(['index','common'],function(){  
        var JurisdictionTreeNode = [];//存储权限树数据
        getJurisdictionTree($('#privilegeTree'));//加载权限树
        //加载权限树
        var jurisdictionSetting = {
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
                /* showIcon: false, */
            }
        };
        function getJurisdictionTree($Dom) {
            global.ycyaAjax({
                url:'powerList',
                data: '',
                success:function(data, textStatus, jqXHR){
                    JurisdictionTreeNode = data.data;
                    $.fn.zTree.init($Dom, jurisdictionSetting, openNodes(JurisdictionTreeNode));
                }
            })
        }
    });

