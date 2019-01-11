// var ctx = "../../../res/img";
var ctx = "../../../res/css/build";
var YcyaMapCfg = { 	
	_mapType:'baidu',//地图类型，'gaode'
	_autoZoom:false,//是否自动缩放，默认为false，不自动缩放
    _autoScroll:true,
	_baiduCfg:{
		_url:"http://api.map.baidu.com/getscript?v=2.0&ak=D8hZnXeO6NRjj0zQk9G905PmWVgiWuCf&services=&t=20170517145936",
		_urlLib:["TextIconOverlay.js","MarkerClusterer.js",
            "http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js",
			"http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css",
			"http://api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min.js",
			"minfo.js","info.css","distanceTool.js"],
		_lng:104.078659,
		_lat:30.652591
	},
	_measure:$('#measure'),
	_gaodeCfg:{},
	icons:{
		build:{"url":ctx+"/map_buildicon.svg",size:[80,80],'offset':[0,0]},
		abuild:{"url":ctx+"/map_abuildicon.svg",size:[80,80],'offset':[0,0]}
	},
	lines:{
		"line1":{"color":"#ff6600","width":8,"opacity":0.8,"style":"solid"/*实线，或虚线dashed*/},
		"line2":{"color":"#ff6600","scolor":"red","width":2,"opacity":0.8,sopacity:08,"style":"solid"/*实线，或虚线dashed*/}
	}
};