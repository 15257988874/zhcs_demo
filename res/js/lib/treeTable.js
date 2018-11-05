layui.config({
    base: '../../../res/dep/layui/',
});
layui.use(['treetable', 'form'], function () {
    //data为测试数据,调试完须删除
    var data = [
        {
            "id": 1,
            "pid": 0,
            "title": "系统管理",
            remark: '测试'
        },
        {
            "id": 2,
            "pid": 1,
            "title": "组织管理"
        },
        {
            "id": 3,
            "pid": 1,
            "title": "权限管理"
        },
        {
            "id": 4,
            "pid": 1,
            "title": "系统设置"
        },
        {
            "id": 5,
            "pid": 1,
            "title": "系统监控"
        },
        {
            "id": 6,
            "pid": 1,
            "title": "消息推送"
        },
        {
            "id": 7,
            "pid": 1,
            "title": "研发工具"
        }
    ];
    var o = layui.$,
        treetable = layui.treetable,
        dt = [];
    //属性菜单配置文件
    var treeCfg = {
            elem: '#test-tree-table',
            data: [],
            field: 'menuName',
            cols: [{
                    field: 'menuName',
                    title: '菜单名称',
                    width: '20%',
                },
                {
                    field: 'href',
                    title: '链接',
                    width: '10%',
                },
                {
                    field: 'menuIcon',
                    title: '菜单图标',
                    width: '10%',
                },
                {
                    field: 'isShow',
                    title: '是否可见',
                    width: '6%',
                    template: function (d) {
                        return app.getDictName('isShow', d.isShow);
                    }
                },
                {
                    field: 'sequence',
                    title: '菜单顺序',
                    width: '10%',
                },
                {
                    field: 'type',
                    title: '菜单类型',
                    width: '10%',
                    template: function (d) {
                        return app.getDictName('type', d.type);
                    }
                },
                {
                    field: 'code',
                    title: 'code码',
                    width: '4%',
                },
                {
                    field: 'buildIn',
                    title: '是否内置',
                    width: '4%',
                    template: function (d) {
                        return '<a>' + app.getDictName('buildIn', d.buildIn) + '</a>';
                    }
                },
                {
                    field: 'actions',
                    title: '操作',
                    width: '10%',
                    template: function (item) {
                        return '<a  class="layui-btn layui-btn-xs" lay-filter="add" >添加</a><a   class="layui-btn layui-btn-xs layui-btn-warm" lay-filter="edit">修改</a><a  class="layui-btn layui-btn-xs layui-btn-danger" lay-filter="del">删除</a>';
                    }
                },
            ]
        },
        optFlag = 1, // 1新增 2修改
        selectedId, //选中的数据ID
        optUrl = {
            1: 'sys/menuAdd',
            2: 'sys/menuMod'
        },
        //添加/修改配置文件
        commonObj = {
            id: 'yui-add',
            filter: 'yui-add',
            submitFn: function (data) {
                if (optFlag === 2) { //追加数据ID
                    data.id = selectedId;
                }
                ycya.http.ajax(app.url + optUrl[optFlag], {
                    data: data,
                    success: function (mm) {
                        if (mm) {
                            if (mm.code == 0) {
                                popup.close();
                                location.reload();
                                layer.msg(app.dict.optType[optFlag] + "成功");

                            } else {
                                layer.msg(app.dict.optType + "失败");
                            }
                        } else {
                            layer.msg('数据异常', {
                                time: 1000
                            });
                        }
                    },
                    error: function (e) {
                        layer.closeAll();
                        layer.msg('服务器链接异常，请稍后再试', {
                            time: 1000
                        });
                    }
                })
            },
            item: [{
                    label: '上级菜单',
                    name: "pid",
                    qt: 'eq',
                    verify: 'required',
                    eventName: 'tree',
                    treeCfg: {
                        url: '/page/default/tpl/tree.html?p=menuTree',
                        name: 'menuName',
                        title: '请选择上级菜单',
                        end: function () {}
                    }

                },
                {
                    label: '菜单类型',
                    elmType: 'select',
                    name: "type",
                    qt: 'eq',
                    verify: 'required',
                    cfg: {
                        data: {
                            '0': "菜单",
                            '1': "权限"
                        },
                        count: 1,
                        search: true
                    }
                },
                {
                    label: '菜单名称',
                    name: "menuName",
                    verify: 'required'
                },
                {
                    label: '链接',
                    name: "href",
                },
                {
                    label: '菜单图标',
                    name: "menuIcon",
                    elmType: 'select',
                    qt: 'eq',
                    cfg: {
                        data: {
                            'layui-icon-set': '<i class="layui-icon layui-icon-set">11</i>',
                            'layui-icon-refresh-3': '<i class="layui-icon layui-icon-refresh-3">222</i>'
                        },
                        count: 1
                    }
                },
                {
                    label: '菜单顺序',
                    name: "sequence",
                    verify: 'required'
                },
                {
                    label: '是否可见',
                    elmType: 'select',
                    name: "isShow",
                    qt: 'eq',
                    verify: 'required',
                    cfg: {
                        data: {
                            '0': "不可见",
                            '1': "可见"
                        },
                        count: 1,
                        search: true
                    }
                },
                {
                    label: 'code码',
                    name: "code",
                    verify: 'required'
                }
            ]
        },
        popup;
    popup = app.ui.autoform(commonObj);

    init();
    //初始化
    function init(){
        renderTable();
        addEvent();
        iconPopup();
    }

    function renderTable() {
        treeCfg.data = data;
        treetable.render(treeCfg);
        treetable.on('treetable(add)', function (data) {
            optFlag = 1;
            var layerCfg = {
                width: 600,
                title: '新增菜单信息',
            };
            popup.reset();
            popup.popup(layerCfg);

        })

        treetable.on('treetable(edit)', function (data) {
            optFlag = 2;
            selectedId = data.item.id;
            var layerCfg = {
                width: 600,
                title: '修改菜单信息'

            };
            popup.set(data.item, ['pid']);
            popup.aliasSet(data.item, {
                'pid': 'menuName'
            });
            popup.popup(layerCfg);
        })

        treetable.on('treetable(del)', function (data) {
            ycya.http.ajax(app.url + 'sys/menuDel', {
                data: {
                    "id": data.item.id
                },
                success: function (mm) {
                    if (mm) {
                        if (mm.code == 0) {
                            layer.msg("删除成功");
                            location.reload();
                        } else {
                            layer.msg("删除失败");
                        }
                    } else {
                        layer.msg('数据异常', {
                            time: 1000
                        });
                    }
                },
                error: function (e) {
                    layer.closeAll();
                    layer.msg('服务器链接异常，请稍后再试', {
                        time: 1000
                    });
                }
            })
        })
        
    }

    function addEvent() {
        o('.up-all').click(function () {
            treetable.all('up');
        })

        o('.down-all').click(function () {
            treetable.all('down');
        })
    }

});