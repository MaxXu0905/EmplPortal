/**
 * 题目选择
 * zengjie
 * 2014/7/8
 */
//var tosearchCondition=window.dialogArguments || this.opener.selectsearchCondition || {  //搜索条件
var tosearchCondition = selectInfo.selectSearchCondition || {  //搜索条件
	 "qbId": 100000019,
	  "category": 1,
	  "searchCondition": {
	        "program": true,
	   }
};
/*扩展jsview.helper模板*/
(function(jsview){
	var newhelpers ={
		/*除法*/
		division: function(a, b){
			if(b==0){
				return 0;
			}else{
				var value = (a/b *100);
				return value==0?0:value.toFixed(2);
			}
		},
		/*设置选项*/
		setOptions : function(index,options){
			var charArr=['A','B','C','D','E'];
			//$.views.converters.html(options)
			return charArr[index]+"、"+options;
		},
		prettyTime : function(seconds, def) { // 格式化时间
			if (isNaN(seconds)) {
				return def || (def==0?0:'');
			}
			seconds *=1; 
			seconds = seconds.toFixed(0);
			var hour = parseInt(seconds / 3600);
			seconds = seconds - hour * 3600;
			var minute = parseInt(seconds / 60);
			seconds = seconds - minute * 60;
			var result = (hour > 0 ? (hour + '小时') : '') + (minute > 0 ? (minute + '分钟') : '')
					+ (seconds > 0 ? (seconds + '秒') : '');
			return result == '' ? '0秒' : result;
		},
		/* 格式化题干 */
		formatQusetion : function(title){
			if(!title){
				return "";
			}
			var questionHead = $.views.converters.html(title);
			return questionHead;
		}
	};
	jsview.helpers(newhelpers);
})($.views);

/*构造函数*/
function CreateQueslib(){
	this.$previousPage = $("#previous_page"); //上一页
	this.$nextPage = $("#next_page"); //下一页
	this.$submitSelect =$('#submitSelect');
	this.$quesitionlist = $('#quesitionlist');
	this.$qbType = $('#qbType');
	this.$sort=$('button.sort');
	this.$btnimport=$('div.buttons');
	this.$skillSelect = $('#skillSelect');
	this.$programSelect = $('#programSelect');
	this.$avgbtn = $('#avgbtn');
	this.$sortgroup = $('#sortgroup');//排序组
	this.$searchtext = $('#searchtext');//搜索文本框
	this.$searchbtn = $('#searchbtn');//搜索文本框
	this.searchCondition={}; //搜索条件数据
	this.ordersCondition = {};//排序条件数据
	this.tabType ='select';
	this.selectQuesArr = [];
	this.selectQuesMap = {};
	this.$selectedQuestion =$('#selectedQuestion');
	this.$tmpl ={
		qbTypeTmpl :　$("#qbTypeTmpl"),
		quesitionlistTmpl :　$("#quesitionlistTmpl"),
		skillSelecTmpl : $('#skillSelecTmpl'),
		programSelecTmpl : $('#programSelecTmpl'),
		groupQuestionsTmpl : $('#groupQuestionsTmpl')
	}
}

/*扩展*/
CreateQueslib.prototype = {
	/*初始化*/
	init : function(){
		var _this = this;
		 //初始化分页
	    if(!window.createPager){
	    	throw "需要分页插件";
	    }else{
	    	var count= 10;
	    	if(tosearchCondition.category && tosearchCondition.category==4){
	    		count= 5;
	    	}
	    	_this.pager = window.createPager(5);
	    }
	    //初始化视图
	    _this.initView();
		_this.bindEvent();
		_this.refresh(tosearchCondition);
		_this.linkSelected();
	},
	/*初始化视图*/
	initView : function(){
		var _this = this;
			_this.initFilterList();
	},
	/*初始化筛选列表*/
	initFilterList : function(qbCategory){
		var _this = this;
		if(tosearchCondition.category && tosearchCondition.category==1){
			if(tosearchCondition.searchCondition.program){
				//编程
				_this.getProlanguage();//获取编程语言
			}
		}
		if(tosearchCondition.category==3){
			_this.tabType = "iq-select";
			//智力
			var dataArr = new Array({'label':'iq-select','desc':'选择题'},{'label':'iq-ask','desc':'问答题'});
			_this.renderTmpl(_this.$qbType,_this.$tmpl.qbTypeTmpl,dataArr);
		}
		/*if(qbCategory=="skill"){
			_this.$filetmpl.prop('href',_this.skillTmplUrl);
			//技能题
			var dataArr = new Array({'label':'select','desc':'选择题'},{'label':'program','desc':'编程题'},{'label':'ask','desc':'问答题'});
			_this.renderTmpl(_this.$qbType,_this.$tmpl.qbTypeTmpl,dataArr);
			_this.getQbBaseSkills(qbId); //获取技能
			
		}else if(qbCategory=="iq"){
			_this.tabType = "iq-select";
			//智力
			var dataArr = new Array({'label':'iq-select','desc':'选择题'},{'label':'iq-ask','desc':'问答题'});
			_this.renderTmpl(_this.$qbType,_this.$tmpl.qbTypeTmpl,dataArr);
		}else{
			//面试
			_this.tabType = qbCategory;
			_this.$qbType.hide();
		}*/
		_this.switchFilterList();
	},
	/*切换筛选列表*/
	switchFilterList : function(tabType){
		var _this = this;
		_this.$skillSelect.hide();
		if(tosearchCondition.searchCondition){
			if(tosearchCondition.searchCondition.choice){
				_this.$avgbtn.children('span').html('正确率');
			}else{
				_this.$avgbtn.children('span').html('平均分');
			}
		}
		if(tabType=='iq-select'){
			_this.$avgbtn.children('span').html('正确率');
		}
		if(tabType=='iq-ask'){
			_this.$avgbtn.children('span').html('平均分');
		}
		if(tosearchCondition.category && tosearchCondition.category==1){
			//技能
			if(tosearchCondition.searchCondition){
				if(tosearchCondition.searchCondition.choice){
					_this.$avgbtn.children('span').html('正确率');
				}else{
					_this.$avgbtn.children('span').html('平均分');
				}
				if(tosearchCondition.searchCondition.program){
					_this.$programSelect.show();
				}else{
					_this.$programSelect.hide();
				}
				
			}
		}
			
		if(tosearchCondition.category && tosearchCondition.category==4){
			_this.$avgbtn.hide();
		}else{
			_this.$avgbtn.show();
		}
		/*恢复默认条件*/
		_this.fiterToDefault();
		
	},
	/*恢复默认条件*/
	fiterToDefault : function(){
		var _this = this;
		//1.恢复按钮组
		//1.去除当前选中的排序
		_this.$sortgroup.find('button.btn-info').removeClass('btn-info').addClass('btn-default');
		var firstsort = $('button.sort').first();
		firstsort.addClass('btn-info');
		_this.switchOrder(firstsort,false);
		//2.恢复下拉框
		_this.$skillSelect.val('');
		_this.$programSelect.val('');
		//3.清空搜索框
		_this.$searchtext.val('');
	},
	/*设定排序*/
	switchOrder : function($sort,isreverse){
		var _this = this;
		var order =  $sort.attr('order');
		var name =  $sort.prop('name');
		if(isreverse){
			if(order=='desc'){
				order = 'asc';
			}else if(order=='asc'){
				order = 'desc';
			}
		}
		$sort.attr('order',order);
		_this.ordersCondition.key = name;
		_this.ordersCondition.value = order=='asc'?true:false;
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
		 _this.refresh(tosearchCondition,true);
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
		/*列表移动特效*/
		_this.$btnimport.on('mouseenter','object.swfupload',function(){
			$(this).next().addClass('uploadify-button-hover');
		});
		_this.$btnimport.on('mouseleave','object.swfupload',function(){
			$(this).next().removeClass('uploadify-button-hover');
		});
		_this.$submitSelect.on('click',function(){
			if(tosearchCondition.category==4){
				//面试要取面试题组下的题
				var groupId = _this.dealReturnResult('group');
				if(groupId){
					_this.getGroupQuestionsById(groupId,function(result){
						result.questionId = groupId;
						if(selectInfo.handler){
							selectInfo.handler(JSON.stringify(result));
						}
					});
				}else{
					selectInfo.handler();
				}
			}else{
				if(selectInfo.handler){
					selectInfo.handler(_this.dealReturnResult());
				}
			}
		
		});
		/*排序*/
		_this.$sort.on('click',function(){
			var isreverse = true;
			//1.判断当前btn是否是选中的
			if($(this).hasClass('btn-info')){
				//1.切换图标
				$(this).children('i').toggleClass('fa-long-arrow-up','fa-long-arrow-down');
			   //2.设置排序条件
			}else{
				isreverse = false; //按默认排序
				//1.去除当前选中的排序
				var currentActive = _this.$sortgroup.find('button.btn-info');
				currentActive.removeClass('btn-info').addClass('btn-default');
				currentActive.children('i').removeClass('fa-long-arrow-up');
				$(this).addClass('btn-info').removeClass('btn-default');
			}
			
			_this.switchOrder($(this),isreverse);
			//刷新列表
			_this.$searchbtn.triggerHandler('click');
			
		});
		/*隐藏显示选项*/
		_this.$quesitionlist.on('click','i.title-arrow',function(){
			var $options = $(this).parent().nextAll('.select-options');
			if($options.length){
				$options.toggle();
				var $group = $options.find('ul[group]');
				if($group.length){
					if(!$group.data('groupQuestions')){
						//1.取题组下的题
						var questionId = $group.attr('questionId');
						_this.getGroupQuestionsById(questionId,function(data){
							//2.回调渲染
							$group.data('groupQuestions',data);
							_this.renderTmpl($group,_this.$tmpl.groupQuestionsTmpl,data);
						});
						
					}
				}
			}
			if($(this).is('.down-arrow')){
				$(this).removeClass('down-arrow fa fa-sort-desc').addClass('up-arrow fa fa-sort-up');
			}else{
				$(this).removeClass('up-arrow fa fa-sort-up').addClass('down-arrow fa fa-sort-desc');
			}
		});
	
		/*切换题型选项卡*/
		_this.$qbType.on('click','li>a',function(){
			var tabType = $(this).attr('target');
			_this.tabType=tabType;
			_this.switchFilterList(tabType);
			_this.refresh(tosearchCondition);
		});
		_this.$programSelect.on('change',function(){
			//刷新列表
			_this.$searchbtn.triggerHandler('click');
		});
		//搜索
		_this.$searchtext.on('keyup',function(e){
			var key = e.keyCode || e.which;
			if(key==13){
				//搜索
				_this.$searchbtn.triggerHandler('click');
			}
		});
		_this.$searchbtn.on('click',function(e){
				//搜索
			_this.refresh(tosearchCondition);
		});
		
	},
	/*获取页总数*/
	getPageTotal : function(data){
		var _this = this;
		$.setsAjax({
			async :false,
			type : 'POST',
			url : convertURL(root+'/sets/qbBase/getQbQuestionsCount'),
			dataType: "json",
			contentType : "application/json",
			data : JSON.stringify(data),
			success :function(result){
				result.error="total";
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
	/*刷新列表*/
	refresh : function(tosearchCondition,isJumpPage){
		var _this = this;
		var data = {};
		if(tosearchCondition.qbId){
			data.qbId = tosearchCondition.qbId;
		}
		if(tosearchCondition.category && tosearchCondition.category!=4){
			data.category = tosearchCondition.category;
		}
		data.page = {
				pageSize: _this.pager.pageSize, // 每页多少个,如果是0则全取
				requestPage: _this.pager.requestPage // 当前第几页（从1开始）
		}
		data.searchCondition={};
		$.extend(data.searchCondition,tosearchCondition.searchCondition);
		//搜索
		_this.collectSearchCondition(data);
		//排序
		_this.collectOrderCondition(data);
		if(!isJumpPage){
			//非跳页
			//非跳页的查询是全局设置
			_this.pager.requestPage=1;
			 data.page.requestPage=1;
			//1.获取页面总数
			_this.getPageTotal(data);
			//2.重新选择
			_this.selectQuesArr=[];
		}
		_this.getQbQuestions(data);
	},
	/*收集搜索条件*/
	collectSearchCondition : function(data){
		var _this = this;
		//编程语言
		var programLang = _this.$programSelect.val();
		if(programLang){
			data.searchCondition.program=true;
			data.searchCondition.programLang=programLang;
		}
		 if(data.category==3){
			if(_this.tabType=='iq-select'){
				data.searchCondition.choice=true;
				delete data.searchCondition.essay;
			}
			if(_this.tabType=='iq-ask'){
				data.searchCondition.essay=true;
				delete data.searchCondition.choice;
			}
		}		
		//题目描述
		var questionDesc = _this.$searchtext.val();
		if(questionDesc){
			data.searchCondition.questionDesc=questionDesc;
		}
	},
	/*收集排序条件*/
	collectOrderCondition : function(data){
		var _this = this;
		//排序对象
		var key = _this.ordersCondition.key;
		var value = _this.ordersCondition.value;
		if(key){
			data.searchCondition[key]=value;
		}
	},
	/*获取题库题目信息*/
	getQbQuestions : function(data){
		var url = tosearchCondition.category==4? root+'/sets/qbBase/getQbGroups': root+'/sets/qbBase/getQbQuestions';
		var _this = this;
		$.setsAjax({
			type : 'POST',
			url : url,
			dataType: "json",
			contentType : "application/json",
			data : JSON.stringify(data),
			success :function(result){
				result.error="result";
				if(result && result.code==0){
					if(result.data){
						_this.pager.currentPage =  data.page.requestPage;
						_this.initPage(data.page.pageSize);
						if(result.data.length){
							$("#libinfo").html('');
						}else{
							$("#libinfo").html('您的题库还是空的，快点添加吧！');
						}
						//渲染模板
						_this.linkData(result.data);
					}else{
						//获取题库列表失败
					}
				}else{
					//服务端业务异常
				}
			}
		});
	},
	linkSelected : function(){
		var _this = this;
		var tmpl = $.templates("");
		tmpl.link("#selectedQuestion", _this.selectQuesArr);
	    _this.$quesitionlist.on('click','button[selectQuestion]',function(){
			//转样式
			var dataItem = $.view(this).data;
			var index = $.view(this).index;
			var $active = $('button.active.btn-info');
			var $activeI = $('i.fa-check-square-o');
			if(dataItem.questionType=='group' && $active.length){
				//面试题只能单选
				//1.处理样式
				$active.removeClass("active btn-info");
				$activeI.removeClass("fa-check-square-o").addClass('fa-square-o');
				//2.处理数据
				_this.selectQuesArr=[];
				_this.selectQuesMap={};
			}

			$(this).toggleClass("active btn-info");
			$(this).children('i').toggleClass('fa-square-o').toggleClass('fa-check-square-o');
			
			var questionId = $(this).attr('questionId');
			if($(this).hasClass('active')){
				//选择
				_this.selectQuesMap[questionId]=dataItem;
				//$.observable(_this.selectQuesArr).insert(dataItem);
			}else{
				//不选
				if(_this.selectQuesMap.hasOwnProperty(questionId)){
					delete _this.selectQuesMap[questionId];
					//$.observable(_this.selectQuesArr).remove(index);
				}
			}
			return false;
		});
	},
	linkData : function(data){
		var _this = this;
		if(!_this.dataArr){
			_this.dataArr = data;
			var tmpl = $.templates("#quesitionlistTmpl");
			tmpl.link("#quesitionlist", _this.dataArr);
		}else{
			for(var i in data){
				var questionId = data[i].questionId;
				if(_this.selectQuesMap[questionId]){
					data[i].isSelected=true;
				}
			}
			 $.observable(_this.dataArr).refresh(data);
		}
	},
	/*渲染模板*/
	renderTmpl : function($wrap,$model,data){
		var htmlOutput = $model.render(data);  
		$wrap.html(htmlOutput);
	},
	/*获取编程语言*/
	getProlanguage : function(){
		var _this = this;
		var url = convertURL(root+"/sets/sys/getConfig/PROGRAM_LANGUAGE");
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result && result.code==0){
					if(result.data){
						result.data.unshift({"id":{"codeType":"PROGRAM_LANGUAGE","codeId":""},"codeName":"全部编程语言"});
						//渲染模板
						_this.renderTmpl(_this.$programSelect,_this.$tmpl.programSelecTmpl,result.data);
					}
				}
			}
		});
	},
	/*获取全部技能*/
	getQbBaseSkills : function(qbId){
		var _this = this;
		var url = convertURL(root+'/sets/qbBase/getQbBaseSkills/'+qbId);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result && result.code==0){
					if(result.data){
						result.data.unshift({"skillId":"","skillName":"全部技能"});
						//渲染模板
						_this.renderTmpl(_this.$skillSelect,_this.$tmpl.skillSelecTmpl,result.data);
					}
				}
			}
		});
	},
	/*获取题库题目列表 */
	getQbBases : function(data){
		var _this = this;
		$.setsAjax({
			type : 'POST',
			url : root+'/sets/qbBase/getQbBases/',
			dataType: "json",
			contentType : "application/json",
			data : JSON.stringify(data),
			success :function(result){
				if(result && result.code==0){
					if(result.data){
						//获取题库题目列表
						//渲染选择题模板
						var htmlOutput = $("#quesitionlibModel").render(result.data);  
						_this.$quesitionlib.html(htmlOutput); 
					}else{
						//获取题库题目列表失败
					}
				}else{
					//服务端业务异常
				}
			}
		});
	},
	/*根据题组获取题*/
	getGroupQuestionsById : function(questionId,callBack){
		var _this = this;
		var url = convertURL(root+'/sets/qbBase/getGroup/'+questionId);
		$.setsAjax({
			type:'POST',
			url :url,
			success :function(result){
				if(result.code==0 && result.data.errorCode==0){
					callBack(result.data.group);
				}
			}
		});
	},
	/*处理返回结果*/
	dealReturnResult : function(isgroup){
		var _this = this;
		if(_this.selectQuesMap){
			for(var i in _this.selectQuesMap){
				_this.selectQuesArr.push(_this.selectQuesMap[i]);
			}
		}
		if(isgroup=='group'){
			return _this.selectQuesArr.length?_this.selectQuesArr[0].questionId:null;
		}else{
			return JSON.stringify(_this.selectQuesArr);
		}
	}
}

/*转换题库类型*/
function reversferqbCategory (category){
	switch(category){
		case 'iq':
			return 3;
			break;
		case 'interview':
			return 4;
			break;
		default:
			return 1;
		
	}
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


$(function(){
	var createQueslib = new CreateQueslib();
	createQueslib.init();
});