// var ctx = "ycyaUI";
var ctx = "../../res/img/iconimg";

var YcyaMapCfg = { 	
	_mapType:'baidu',//地图类型，'gaode'
	_autoZoom:false,//是否自动缩放，默认为false，不自动缩放
    _autoScroll:true,
	_baiduCfg:{
		_url:"http://api.map.baidu.com/getscript?v=2.0&ak=D8hZnXeO6NRjj0zQk9G905PmWVgiWuCf&services=&t=20170517145936",
		//_urlLib:["/CarMonWeb/WebContent/"+ctx+"/map/js/TextIconOverlay.js","/CarMonWeb/WebContent/"+ctx+"/map/js/MarkerClusterer.js",
		_urlLib:["TextIconOverlay.js","MarkerClusterer.js",
            "http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js",
			"http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css",
			"minfo.js","info.css","distanceTool.js"],
		_lng:104.078659,
		_lat:30.652591
		// _lng:116.424966,
		// _lat:39.924674
	},
	_measure:$('.linebtns'),
	_gaodeCfg:{
		
	},
	icons:{
		'car_clear':{"url":ctx+"/carin.png",size:[32,32]},
		'litter':{"url":ctx+"/maplitter.png",size:[32,32]},
		'center':{"url":ctx+"/mapcenter.png",size:[32,32]},
		'garbage':{"url":ctx+"/maogarbage.png",size:[32,32]},
		'wc':{"url":ctx+"/mapwc.png",size:[32,32]},
		'transfer':{"url":ctx+"/maptransfer.png",size:[32,32]},
		'test1':{"url":ctx+"/test.png",size:[26,26],'offset':[0,0]},
		'test2':{"url":ctx+"/test.png",size:[26,26],'offset':[-31,0]}
	},
	lines:{
		"line1":{"color":"#ff6600","width":8,"opacity":0.8,"style":"solid"/*实线，或虚线dashed*/},
		"line2":{"color":"#ff6600","scolor":"red","width":2,"opacity":0.8,sopacity:08,"style":"solid"/*实线，或虚线dashed*/}
	}
};