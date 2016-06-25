/**
 * 导入题库
 * zengjie
 * 2014/6/24
 */

$(function(){
    $.placeholder.shim();//初始化placeholder
    var importQueslib = new ImportQueslib();
    importQueslib.init();
});
/*构造函数*/
function ImportQueslib(){
	this.qbIds=[];
	this.$searchbtn = $("#searchbtn");
	this.$searchtext = $("#searchtext");
	this.$createQbbtn = $("#createQbbtn");
	this.$createQbtext = $("#createQbtext");
	this.$quesitionlib = $("#quesitionlib");
	this.$morewrapper = $("#morewrapper");
	this.$morewrapperbtn = $("#morewrapperbtn");
	this.$previousPage = $("#previous_page"); //上一页
	this.$nextPage = $("#next_page"); //下一页
}
ImportQueslib.prototype = {
	init : function(){
		var _this =this;
		 //初始化分页
	    if(!window.createPager){
	    	throw "需要分页插件";
	    }else{
	    	_this.pager = window.createPager(10);
	    }
	    //检查flash插件
	    if (!flashChecker()) {
	    	$('#alert_no_flash').show();
	    }
		_this.bindEvent();
		$.views.helpers({
			/*初始化导入*/
			initUpload: function(id, qbId,Category){
				var upload = {};
				upload.id="#"+id+qbId;
				upload.qbId=qbId;
				upload.qbCategory=Category;
				_this.qbIds.push(upload);
			}
			});
		_this.refresh();
	},
	/*初始化分页*/
	initPage : function(pageSize,dataLength){
		var _this = this;
		//1.判断是否有下一页
		if(_this.pager.currentPage<_this.pager.tatalPage){
			_this.$nextPage.show();
			if(_this.pager.requestPage==1){
				_this.$previousPage.hide();
			}
		}else{
			_this.$nextPage.hide();
		}
	},
	/*分页*/
	goToPage : function(pageIndex,pagesize){
		var _this = this;
		 _this.pager.requestPage = pageIndex;
		 _this.pager.pageSize = pagesize;
		 _this.refresh(null,true);
	},
	/*创建题库*/
	createQuestionLib : function(){
		var _this = this;
		var qbName = _this.$createQbtext.val();
		if(!qbName){
			return;
		}
		if(/[%=\s\/\\"<>\?\*]/gi.test(qbName)){
			$('#addVarify').html("题库名格式不正确，不能包括空格和特殊字符！").show();
			return false;
		}else{
			$('#addVarify').html("").hide();
		}
		_this.$createQbtext.val('');
		var qbId = _this.createQbBase({'qbName':qbName});
		 window.open(root+'/sets/page/questionlist/'+qbId+"/skill/");
	},
	/*绑定事件*/
	bindEvent : function(){
		var _this = this;
		/*上一页*/
		_this.$previousPage.on('click',function(){
			//1.获取当前页面
			var current = _this.pager.requestPage;
			var size = _this.pager.pageSize;
			if(current>1){
				current--;
			}
			_this.goToPage(current,size);
			if(current==1){
				_this.$previousPage.hide();
			}
		});
		/*下一页*/
		_this.$nextPage.on('click',function(){
			//1.获取当前页面
			var current = _this.pager.requestPage;
			var size = _this.pager.pageSize;
			current++;
			_this.goToPage(current,size);
			if(current>0){
				_this.$previousPage.show();
			}
			if(_this.requestPage>=_this.pager.tatalPage){
				_this.$nextPage.hide();
			}
		});
		/*创建题库*/
		_this.$createQbbtn.on('click',function(){
			_this.createQuestionLib();
		}); 
		_this.$createQbtext.on('keyup',function(e){
			_this.$createQbbtn.next('[addVarify]').empty();
			var value = $(this).val();
			if(value){
				_this.$createQbbtn.removeAttr('disabled');
			}else{
				_this.$createQbbtn.attr('disabled','disabled');
			}
			var key = e.keyCode || e.which;
			if(key==13){
				_this.createQuestionLib();
			}
		});
		/*搜索*/
		_this.$searchbtn.on('click',function(){
			var qbName =_this.$searchtext.val();
			_this.refresh(qbName);
			//_this.$searchtext.val('');
			return false;
		});
		_this.$searchtext.on('keypress',function(e){
			var key = e.keyCode || e.which;
			if(key==13){
				_this.$searchbtn.triggerHandler('click');
			}
		});
		_this.$quesitionlib.on('mouseenter','li',function(){
			$(this).find(".operator").addClass('show');
		});
		_this.$quesitionlib.on('mouseleave','li',function(){
			$(this).find(".operator").removeClass('show');
		});
		//题目列表
		_this.$quesitionlib.on('click','a[questionList]',function(){
			var qbId =$(this).attr('qbId');
			var category =$(this).attr('qbCategory');
			var qbName = $(this).text();
			if(qbId && qbName){
				 if(category){
					var cateStr =  switchqbCategory(parseInt(category));
					window.open(root+'/sets/page/questionlist/'+qbId+'/'+cateStr+'/');
				 }
			}
			return false;
		});
		//加载柱状图
		_this.$quesitionlib.on('mouseenter','li[ratio]',function(e){
			e.preventDefault();
			e.stopPropagation();
			var qbId =$(this).attr('qbId');
			var popover = $(this).closest('.content').next();
			var model = popover.find('.paper-model');
			var offset = $(this).offset();
			var callback = function(){
				popover.addClass('highChartShow');
				popover.offset({ top: offset.top+30, left: offset.left-200 });
			}
			var ratio = $(this).data('ratio');
			if(ratio){
				_this.loadGraphRatio(model,ratio);
				callback();
			}else{
				if($(this).attr('ratio')=='skillRatio'){
					_this.getSkillLevelNums($(this),model,qbId,callback);
				}else if($(this).attr('ratio')=='programRatio'){
					_this.getProgramLevelNums($(this),model,qbId,callback);
				}
			}
		
		});
		//卸载柱状图
		_this.$quesitionlib.on('mouseleave','li[ratio]',function(e){
			e.preventDefault();
			e.stopPropagation();
			var popover = $(this).closest('.content').next();
			popover.removeClass('highChartShow');
		});
		//切换上传按钮样式
		_this.$quesitionlib.on('mouseenter','object.swfupload',function(){
			$(this).next().addClass('uploadify-button-hover');
		});
		_this.$quesitionlib.on('mouseleave','object.swfupload',function(){
			$(this).next().removeClass('uploadify-button-hover');
		});
	},
	/*刷新*/
	refresh : function(qbName,isJumpPage){
		var _this = this;
		var data = {};
		data.page = {
				pageSize: _this.pager.pageSize, // 每页多少个,如果是0则全取
				requestPage: _this.pager.requestPage // 当前第几页（从1开始）
		}
		if(qbName){
			data.qbName = qbName;
		}
		if(!isJumpPage){
			//非跳页的查询是全局设置
			_this.pager.requestPage=1;
			 data.page.requestPage=1;
			_this.getPageTotal(data);
		}
		_this.getQbBases(data);
	},
	/*获取页总数*/
	getPageTotal : function(data){
		var _this = this;
		var url = convertURL(root+'/sets/qbBase/getQbBasesCount/');
		$.setsAjax({
			asyn :false,
			type : 'POST',
			url : url,
			dataType: "json",
			contentType : "application/json",
			data : JSON.stringify(data),
			success :function(result){
				if(result && result.code==0){
					if(result.data){
						_this.pager.tatalCount = result.data.count;
						_this.pager.tatalPage = Math.ceil(result.data.count/_this.pager.pageSize);
					}
				}else{
					//服务端业务异常
				}
			}
		});
	},
	/*获取题库题目列表 */
	getQbBases : function(data){
		var _this = this;
		var url = convertURL(root+'/sets/qbBase/getQbBases/');
		$.setsAjax({
			type : 'POST',
			url : url,
			dataType: "json",
			contentType : "application/json",
			data : JSON.stringify(data),
			success :function(result){
				if(result && result.code==0){
					if(result.data){
						//1.判断是否有下一页
						_this.pager.currentPage =  data.page.requestPage;
						_this.initPage(data.page.pageSize);
						//2.渲染选择题模板
						var htmlOutput = $("#quesitionlibModel").render(result.data);  
						_this.$quesitionlib.html(htmlOutput); 
						//获取题库题目列表失败
					}
				}else{
					//服务端业务异常
				}
			}
		});
	},
	/*创建题库*/
	createQbBase : function(data){
		var _this = this;
		var qbId = null;
		$.setsAjax({
			async:false,
			type : 'POST',
			url : root+'/sets/qbBase/createQbBase/',
			dataType: "json",
			contentType : "application/json",
			data : JSON.stringify(data),
			success : function(result){
				if(result && result.code==0){
					if(result.data && result.data.code=='SUCCESS'){
						//刷新题库列表
						qbId = result.data.qbId;
						_this.refresh();
					}else{
						//创建题库失败
					}
				}else{
					//服务端业务异常
				}
			}
		});
		return qbId;
	},
	/*获取题库选择题技能难易程度题数*/
	getSkillLevelNums : function($this,$place,qbId,callback){
		var _this = this;
		var url = convertURL(root+'/sets/qbBase/getSkillLevelNums/'+qbId);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result.code==0 && result.data && result.data.numMapping.length>0){
					$this.data('ratio', result.data);
					_this.loadGraphRatio($place, result.data);
					callback();
				}
			}
		});
	},
	/*获取题库编程题编程语言难易程度题数*/
	getProgramLevelNums : function($this,$place,qbId,callback){
		var _this = this;
		var url = convertURL(root+'/sets/qbBase/getProgramLevelNums/'+qbId);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result.code==0 && result.data && result.data.numMapping.length>0){
					$this.data('ratio', result.data);
					_this.loadGraphRatio($place, result.data);
					callback();
				}
			}
		});
	},
	/*加载柱状图*/
	loadGraphRatio : function($place, data) {
		var _this = this;
		var low = [], medium = [], high = [];
		data.numMapping = data.numMapping || [];
		for ( var i = 0; i < data.numMapping.length; i++) {
			low.push(data.numMapping[i][0]);
			medium.push(data.numMapping[i][1]);
			high.push(data.numMapping[i][2]);
		}
		$place.highcharts({
					credits : {
						enabled : false
					},
					chart : {
						height : 170,
						width : 470,
						type : 'column',
						backgroundColor : 'rgba(255,255,255,0)'
					},
					colors : [ '#FF6666', '#FF9966', '#FFCC66' ],
					title : null,
					xAxis : {
						tickWidth : 0,
						categories : data.chartName,
						labels : {
							rotation : (data.numMapping.length > 6 ? 30 : 0),
							style : {
								// color : '#BBBBBB'
								color : '#999999'
							}
						}
					},
					yAxis : {
						title : null,
						gridLineWidth : 0,
						lineWidth : 0,
						labels : {
							formatter : function() {
								return '';
							}
						}
					},
					tooltip : {
						headerFormat : '<span style="font-size:12px">{point.key}:</span><table>',
						pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
								+ '<td style="padding:0"><b>{point.y:0f} </b></td></tr>',
						footerFormat : '</table>',
						shared : true,
						useHTML : true
					},
					plotOptions : {
						column : {
							stacking : 'normal',
							borderWidth : 0,
							pointPadding : 0.2,
							dataLabels : {
								enabled : true,
								color : '#FFF',
								formatter : function() {
									return this.y == 0 ? '' : this.y;
								}
							}
						}
					},
					series : [ {
						name : '高难度',
						data : high
					}, {
						name : '中难度',
						data : medium
					}, {
						name : '低难度',
						data : low
					} ]
				});
	}
}
/*转换题库类型*/
function switchqbCategory (category){
	switch(category){
		case 1:
			return 'skill';
			break;
		case 3:
			return 'iq';
			break;
		case 4:
			return 'interview';
			break;
		default:
			return null;
		
	}
}
var flashChecker = function() {
	var hasFlash = false; // 是否安装了flash
	if (document.all) {
		try {
			var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			if (swf) {
				hasFlash = true;
			}
		} catch (e) {
		}
	} else {
		if (navigator.plugins && navigator.plugins.length > 0) {
			var swf = navigator.plugins["Shockwave Flash"];
			if (swf) {
				hasFlash = true;
			}
		}
	}
	return hasFlash;
}
/*url添加随机数*/
function convertURL(url) { 
    //获取时间戳 
    var timstamp = (new Date()).valueOf(); 
    //将时间戳信息拼接到url上 
    //url = "AJAXServer" 
    if (url.indexOf("?") >= 0) { 
            url = url + "&t=" + timstamp; 
    } else { 
            url = url + "?t=" + timstamp; 
    } 
    return url; 
}