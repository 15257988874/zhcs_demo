/**公共业务*/
layui.define(function (exports) {
  var $ = layui.$,
    layer = layui.layer,
    laytpl = layui.laytpl,
    setter = layui.setter,
    view = layui.view,
    admin = layui.admin;

  //公共业务的逻辑处理
  //全局方法
  global = {
    /**
     * @param {any} opt 
     * 
     * {
     *    url:'',   //接口地址
     *    data:'',  //发送给后台的数据
     *    success:fn //成功的回调--默认code=0
     *    error:fn   //请求失败 
     * }
     */
    ycyaAjax: function (opt) {
      ycya.http.ajax(app.url  + opt.url, {
        data: opt.data,
        success: function (data, textStatus, jqXHR) {
          if (data) {
            if (data.code == 0) {
              opt.success && opt.success(data, textStatus, jqXHR);
            } else {
              if (layer) {
                if (data.code == 25) {
                  window.top.location.href = getContentPath() + "/index.html";
                } else {
                  layer.msg(data.msg, {
                    time: 1000
                  });
                }
              }
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
    //create table grid 
    createGridObj: function (obj) {
      var defaultObj = {
        id: 'tableGrid', //容器唯一Id
        elem: '',
        url: '',
        height: 'full-100',
        cellMinWidth: 40,
        text: {
          none: '暂无相关数据'
        },
        page: true,
        request: {
          pageName: 'pageNo', //页码的参数名称，默认：page
          limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {},
        method: 'post',
        headers: {},
        where: {}, //ajax请求额外的参数
        limit: 20, //每页显示的条数
        limits: [10, 20, 30],
        cols: [],
        done: function (res, curr, count) {}
      }; //默认layui table 配置
      return $.extend({}, defaultObj, obj);
    },
    //create check obj
    createCheckObj: function (obj, dom) {
      if (!obj || $.type(obj) !== 'object' || !dom) {
        throw new Error('参数错误');
        return;
      }
      var checkObj = $.extend(true, {}, obj, {
        'filter': '',
        '$dom': dom,
        'callback': function () {}
      });
      for (var i = 0, l = checkObj.elmArr.length; i < l; i++) {
        var ce = checkObj.elmArr[i];
        ce.elmType = 4;
        ce.isRequired = false;
        ce.selectOption = '';
        ce.verify = '';
        ce.isReadonly = false;
      }
      return checkObj;
    },
    /** 
     *  create search obj
     *  @param {any} obj --继承对象 必传
     *  dom --放置片段的dom 必传
     *  callback-回调函数   必传
     *  filterArr:[]       过滤数组 labelName
     **/
    createSearchObj: function (obj, dom, callback, filterArr) {
      if (!obj || $.type(obj) !== 'object' || !dom) {
        throw new Error('参数错误');
        return;
      }
      var c = callback ? callback : function () {},
        arr = [],
        filterArr = filterArr ? filterArr : [];
      searchObj = $.extend(true, {}, obj, {
        'filter': 'advancedSearch',
        '$dom': dom,
        'isAdvanced': true,
        'callback': c
      });
      for (var i = 0, l = searchObj.elmArr.length; i < l; i++) {
        var ce = searchObj.elmArr[i];
        if ($.inArray(ce.labelName, filterArr) != -1) {
          arr.push(ce);
        }
      }
      for (var i = 0, l = arr.length; i < l; i++) {
        var ce = arr[i];
        ce.isRequired = false;
        ce.isReadonly = false;
        ce.verify = '';
      }
      searchObj.elmArr = arr;
      return searchObj;
    },
    //layer popup
    openLayer: function (opt) {
      var defaultOpt = {
        type: 1, //页面层
        title: false, //弹出层title  
        content: opt.content, //内容
        offset: 'auto', //垂直水平居中
        area: null, //宽高    
        btn: null, //按钮
        closeBtn: 1, //关闭按钮样式
        shade: 0.3, //弹层外区域透明度
        shadeClose: false, //点击遮罩不关闭
        anim: 4, //弹出动画效果
        resize: false, //不允许拉伸
        zIndex: 19891014, //默认层叠顺序
        success: function () { //层弹出后的成功回调方法
        },
        cancel: function () { //右上角关闭按钮触发的回调
        }
      }
      var newOpt = $.extend({}, defaultOpt, opt);
      var index = layer.open(newOpt);
      return index;
    },
    /** 注: 参数后跟  _的为必传参数 创建弹窗
     * @param {any} formOpt 
     * {
     *      isAdvanced:''  boolean         //是否高级查询
     *      $dom:''  , _                   //存放弹窗元素的容器
     *      filter:'', _                   //layer 表单验证 
     *      lineWidth:2, 1 2 3             //一行放置几个元素                   默认2个
     *      callBack :                     //回调函数
     *      elmArr:[      _
                 {
     *              elmType: 1 ,                   //元素类型 1 input  2 select 3 textarea 4 p    默认input
     *              type:''                        //input的type类型 
     *              isRequired:false, boolean      //是否必填
     *              isBlock: fasle,   boolean      //true false 是否独占一行           默认false
     *              labelName:''  _                //搜索字段名称
     *              name:''       _                //发送给后台的字段名段
     *              selectOption:''                //本地加载select使用字段
     *              verify:''                      //layui--验证
     *              isReadonly:''    boolean       //是否只读
                 }
     *      ]
     * }
     */
    createPopup: function (formOpt) {
      if ($.type(formOpt) !== 'object') {
        throw new Error('参数类型错误');
        return;
      } else {
        if (!formOpt.$dom || !formOpt.elmArr || $.type(formOpt.elmArr) !== 'array') {
          throw new Error('参数错误');
          return;
        }
      }
      var _ul,
        _ulDefaultStyle = 'm-popup layui-form',
        _ulLineWidth;
      if (formOpt.isAdvanced) {
        _ulDefaultStyle += ' m-advanced-popup';
      }
      if (formOpt.lineWidth) {
        if (formOpt.lineWidth == 1) {
          _ulLineWidth = ' one-item';
        } else if (formOpt.lineWidth == 3) {
          _ulLineWidth = ' three-item';
        } else {
          _ulLineWidth = ' two-item';
        }
      } else {
        _ulLineWidth = ' two-item';
      }
      _ul = $('<ul class="' + _ulDefaultStyle + _ulLineWidth + '"></ul>');
      for (var i = 0; i < formOpt.elmArr.length; i++) {
        var con = formOpt.elmArr[i],
          _li;
        var req = '',
          verify = '';
        if (con.isRequired) { //是否必填
          req = '<span class="require-option">*</span>';
        }
        if (con.verify) { //验证规则
          verify = con.verify;
        }
        if (con.isBlock) {
          _li = $('<li class="block-item layui-form-item"><label >' + req + con.labelName + ': </label></li>')
        } else {
          _li = $('<li class="layui-form-item"><label>' + req + con.labelName + ': </label></li>')
        }
        var divStyle = 'm-inline-block w-all',
          inputType = con.type ? con.type : 'text';
        /*<div class="layui-unselect layui-form-select"><div class="layui-select-title"><input type="text" placeholder="请选择" value="" readonly="" class="layui-input layui-unselect"><i class="layui-edge"></i></div><dl class="layui-anim layui-anim-upbit"><dd lay-value="" class="layui-select-tips">请选择</dd><dd lay-value="0" class="">北京</dd><dd lay-value="1" class="">上海</dd><dd lay-value="2" class="">广州</dd><dd lay-value="3" class="">深圳</dd><dd lay-value="4" class="">杭州</dd></dl></div>*/
        if (con.elmType) {
          if (con.elmType == 2) { //select
            var optionStr = '';
            if (con.selectOption && $.type(con.selectOption) == 'array') {
              $.each(con.selectOption, function (i, item) {
                optionStr += '<option value=' + i + '>' + item + '</option>'
              });
            }
            _li.append($('<div class="' + divStyle + '"><select name=' + con.name + '>' + optionStr + '</select></div>'));
          } else if (con.elmType == 3) { //textarea
            _li.append($('<div class="' + divStyle + '"><textarea name=' + con.name + ' lay-verify=' + verify + '></textarea></div>'));
          } else if (con.elmType == 4) { //p 
            _li.append($('<div class="' + divStyle + '"><p data-name=' + con.name + '></p></div>'));
          } else { //input
            if (con.isReadonly) {
              _li.append($('<div class="' + divStyle + '"><input type=' + inputType + ' name=' + con.name + ' lay-verify=' + verify + '></div>'));
            } else {
              _li.append($('<div  class="' + divStyle + '"><input readonly type=' + inputType + ' name=' + con.name + ' lay-verify=' + verify + ' ></div>'));
            }
          }
        } else {
          if (con.isReadonly) {
            _li.append($('<div  class="' + divStyle + '"><input readonly type=' + inputType + ' name=' + con.name + '  lay-verify=' + verify + '></div>'));
          } else {
            _li.append($('<div class="' + divStyle + '"><input type=' + inputType + ' name=' + con.name + '  lay-verify=' + verify + '></div>'));
          }

        }
        _ul.append(_li);
      }
      //添加按钮
      if (formOpt.filter) {
        _ul.append('<li class="form-btn-li"><a lay-filter=' + formOpt.filter + ' lay-submit class="layui-btn layui-btn-normal layui-btn-sm">确定</a><a class="layui-btn layui-btn-primary layui-btn-sm">取消</a></li>');
      }
      if (formOpt.isAdvanced) {
        _ul.append('<li class="block-item layui-form-item btn-group"><a class="layui-btn layui-btn-normal layui-btn-sm yes" lay-filter=' + formOpt.filter + ' lay-submit>确定</a><a class="layui-btn layui-btn-primary layui-btn-sm no">取消</a></li>');
      }
      if ($('.advanced-search-wrap').length > 0) {
        $('.advanced-search-wrap').remove();
      }
      formOpt.$dom.append(_ul);
      if (formOpt.callback && $.type(formOpt.callback) == 'function') {
        formOpt.callback();
      }
    },
    /**
     * 基于layer table _为必传参数
     * @param {any} tableOpt
     * {  
     *    $dom:'',            //放置html片段的容器
     *    title:''            //功能标题
     *    skin:'line/row/nob' //表格风格，默认line
     *    size:'sm/lg'        //表格尺寸，若使用默认尺寸不传该属性即可
     *    even:boolean        //隔行换色，默认不开启
     *    tableList:[  _
     *        {
     *            name:'',  _     //表格 
     *            width:'',       //宽度
     *            align:'',       //对齐方式 ，默认左对齐
     *            elmType:'' ,    //元素类型  1 span  2 input 3 select
     *            placeholder:''  //input 的提示信息
     *            selectOption:[] 
     *            handle:fn,
     *            class:'' ,         
     *        }
     *    ]
     * } 
     */
    createTable: function (tableOpt) {
      if ($.type(tableOpt) !== 'object' || !tableOpt.$dom) {
        throw new Error('参数类型错误');
        return;
      }
      var _oneDiv=$('<div></div>'), //临时放置代码片段
          t=tableOpt.title?tableOpt.title:'',
          skin=tableOpt.skin?tableOpt.skin:'line',
          size=tableOpt.size?tableOpt.size:'',
          even=tableOpt.size?tableOpt.size:false; //暂时不做皮肤，尺寸，以及隔行换色
      //添加删除
      tableOpt.tableList.push({
        'name':'操作',
        'width':'',
        'align':'center',
        'elmType':1,
        'class':'table-del' 
      });    
      //标题
      _oneDiv.append('<div class="table-wrap table-title"><span>'+t+'</span><a class="m-rt table-add">新增</a></div>');
      var _divTitle=$('<div class="table-wrap"></div>'),
          _tableTitle=$('<table class="layui-table margin0"></table>'),
          _divBody=$('<div class="table-wrap table-body"></div>'),
          _tableBody=$('<table class="layui-table margin0"></table>'),
          _colgroup=$('<colgroup></colgroup>'),
          _thead=$('<thead></thead>'),
          _tbody=$('<tbody class="table-tbody"></tbody>');
          _thead.append('<tr></tr>');
          _tbody.append('<tr class="table-row"></tr>');
          _divTitle.append(_tableTitle);
          _divBody.append(_tableBody);
          _oneDiv.append(_divTitle).append(_divBody) ;      
      for(var i=0,l=tableOpt.tableList.length;i<l;i++){
        var item= tableOpt.tableList[i],
            w=item.width?item.width:'auto',
            align=item.align?item.align:'left',
            elm=item.elmType?item.elmType:1,
            handle=item.handle?item.handle:function(){};
        _colgroup.append('<col width='+w+'>');
        _thead.find('tr').append('<th style="text-align:'+align+'">'+item.name+'</th>');
        var _td=$('<td align='+align+'></td>');
        
        if(elm==1){//span
          if(item.class && item.class=='table-del'){
            _td.append('<span class="table-del">删除</span>');
          }else{
            _td.append('<span></span>');
          }
        }else if(elm==2){//input
          item.placeholder? _td.append('<input type="text" placeholder='+item.placeholder+'>'):_td.append('<input type="text">');
        }else{//select
          var _select=$('<select></select>');
          if(item.selectOption){
              var selectStr='';
              for(var i=0,l=item.selectOption.length;i<l;i++){
                selectStr+='<option value='+i+'>'+item.selectOption[i]+'</option>';
              }
              _select.append(selectStr);
          }
          _td.append(_select);
        }
        _tbody.find('tr').append(_td);
      }
      _tableTitle.append(_colgroup).append(_thead);
      _tableBody.append(_colgroup.clone());
      _tableBody.append(_tbody);
      tableOpt.$dom.append(_oneDiv.html());
      //新增
      tableOpt.$dom.on('click','.table-add',function(){
        tableOpt.$dom.find('.table-tbody').append($('.table-row:eq(0)').clone(true));
      });
      //删除
      tableOpt.$dom.on('click','.table-del',function(){
        var tableRowLen=tableOpt.$dom.find('.table-row').length;
        if(tableRowLen>1){
          $(this).parent().parent().remove();
        }
      });
    }
  };
  //生成页面模板
  panelHtml={
    /**
     * @param {*} panelObj 页面参数配置  
     * {
     *    isBlockRow:boolean   是否左右两块,即左侧是否需要部门树,默认 true
     *    leftTitle:string,    左侧容器Title，默认'单位部门树'
     *    deptTreeId:string,   左侧放置部门树的容器ID ,默认 'panelDeptTree'  
     *    tableId:string,      table grid 容器ID(过滤ID),默认 'grid'
     *    callback:function    页面初始化完成以后的回调函数,
     *    basicSearch:{
     *        label:string,       检索名称
     *        inputName:string,   发送给后台的字段
     *        filter:string       layui 表单标记,默认'search-condition'
     *        requireHigh:blloean 是否需要高级查询,默认 true 
     *        hignBtn:string,     高级查询按钮容器ID ,默认 'highSearch'
     *        hignElm:string,     高级查询代码片段容器ID,默认 'advancedSearch'
     *    }
     * }
     */
    init:function(panelObj){
          //           <div class="layui-card-header">
          //               <form class="layui-form m-rt  basic-search relative">
          //                   <div class="layui-form-item ">
          //                     <label class="layui-form-label">用户名:</label>
          //                     <div class="layui-input-block">
          //                       <input type="text" name="userName" placeholder="请输入" autocomplete="off" class="layui-input">
          //                     </div>
          //                   </div>
          //                   <div class="layui-form-item ">
          //                     <button class="layui-btn layui-btn-small layui-btn-primary basic-search-yes" lay-submit lay-filter="search-condition"><i class="layui-icon">&#xe615;</i></button>
          //                   </div>
          //                   <div class="layui-form-item magin-left-6">
          //                       <a class="layui-btn layui-btn-small layui-btn-primary advanced-search-btn" id="highSearch"><i class="layui-icon">&#xe615;</i></a>
          //                   </div>
          //               </form>
          //               <form id="advancedSearch" class="m-none" autocomplete="off"></form>
          //           </div>       
          var _layuiFluid=$('<div class="layui-fluid height-all  box-sizing"></div>'), 
              _layuiRow=$('<div class="layui-row layui-col-space15 height-all"></div>');
              _layuiFluid.append(_layuiRow);
          var twoSide=panelObj.isBlockRow!==undefined? panelObj.isBlockRow : true;    
          //左侧树
          if(twoSide){
            var leftTitle=panelObj.leftTitle || '单位部门树',
                deptTreeId=panelObj.deptTreeId || 'panelDeptTree',
                _leftBox=$('<div class="layui-col-sm4 layui-col-md2 height-all box-sizing"> <div class="layui-card height-all"><div class="layui-card-header">'+leftTitle+'</div><div class="layui-card-body height-all box-sizing patch"><ul id='+deptTreeId+' class="ztree"></ul></div></div></div>');
                _layuiRow.append(_leftBox);
          }
          //右侧表格
          var rightBoxClass=twoSide?' layui-col-sm8 layui-col-md10 ':' layui-col-sm12 layui-col-md12',
              _rightBox=$('<div class="height-all box-sizing '+rightBoxClass+'"></div>'),
              _rightCard=$('<div class="layui-card height-all"></div>'),
              _rightCardHeader=$('<div class="layui-card-header"></div>'),
              tableId=panelObj.tableId || 'grid',
              _rightCardBody=$(' <div class="layui-card-body height-all box-sizing patch"><table class="layui-hide" id='+tableId+' lay-filter='+tableId+'></table></div>');
              if(panelObj.basicSearch && $.type(panelObj.basicSearch)=='object'){
                  if(!panelObj.basicSearch.label || !panelObj.basicSearch.inputName){
                    layer.msg('参数格式错误');
                    return ;
                  }
                  
              }
              _rightCard.append(_rightCardHeader).append(_rightCardBody);
              _rightBox.append(_rightCard);
              _layuiRow.append(_rightBox);
              $('body').append(_layuiFluid);//追加到body中
              panelObj.callback && $.type(panelObj.callback)=='function' && panelObj.callback();//执行回调函数

    } 
  }
  //table 操作
  tableHandle = {
    isCheckedRow: function (tableVariable) {
      var checkStatus = tableVariable.checkStatus('tableGrid');
      if (checkStatus.data.length == 0) {
        return false;
      }
      if (checkStatus.data.length == 1) {
        return checkStatus.data;
      } else {
        for (var i = 1; i < checkStatus.data.length; i++) {
          $('.laytable-cell-1-id').each(function () {
            if ($(this).text() == checkStatus.data[i].id) {
              $(this).parent().prev().find('.layui-form-checkbox').trigger('click');
            }
          });
        }
        return checkStatus.data[0];
      }

    }
  };
  //退出
  admin.events.logout = function () {
    //执行退出接口
    admin.req({
      url: layui.setter.base + 'json/user/logout.js',
      type: 'get',
      data: {},
      done: function (res) { //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行

        //清空本地记录的 token，并跳转到登入页
        admin.exit(function () {
          location.href = 'user/login.html';
        });
      }
    });
  };


  //对外暴露的接口
  exports('common', {});
});