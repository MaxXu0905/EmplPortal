/**
 * 创建题库
 * zengjie
 * 2014/6/26
 */

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
			//$.views.converters.html(options)
			var charArr=['A','B','C','D','E'];
			return charArr[index]+"、"+options
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
//			console.log(title);
//			title = $.views.converters.html(title);
//			console.log(title);
			return title;
		}
	};
	jsview.helpers(newhelpers);
})($.views);
$(function(){
	var createQueslib = new CreateQueslib();
	createQueslib.init();
});

/*构造函数*/
function CreateQueslib(){
	this.$previousPage = $("#previous_page"); //上一页
	this.$nextPage = $("#next_page"); //下一页
	this.$morewrapperbtn = $('#morewrapperbtn');
	this.$importErrClose = $('#importErrClose');
	this.$importErr = $('#importErr ');
	this.$filetmpl = $("#filetmpl");
	this.$alertModal = $("#alertModal");
	this.$alertBtn = $("#alertBtn");
	this.$confirmbtn = $("#confirmbtn");
	this.skillTmplUrl="http://101testneeds.oss-cn-beijing.aliyuncs.com/template_xls/%E6%8A%80%E8%83%BD%E9%A2%98%E5%BA%93%E6%A8%A1%E7%89%88.xls"; //技能模板
	this.iqTmplUrl="http://101testneeds.oss-cn-beijing.aliyuncs.com/template_xls/%E6%99%BA%E5%8A%9B%E9%A2%98%E5%BA%93%E6%A8%A1%E7%89%88.xls"; //智力模板
	this.interviewTmplUrl="http://101testneeds.oss-cn-beijing.aliyuncs.com/template_xls/%E9%9D%A2%E8%AF%95%E9%A2%98%E5%BA%93%E6%A8%A1%E7%89%88.xls"; //面试模板
	this.$multiImport=$('#multi_import'); //导入file
	this.$importBtn=$('#importBtn'); //导入按钮
	this.$export=$('#export'); //导入
	this.$quesitionlist = $('#quesitionlist');
	this.$addQuestion = $('#addQuestion');
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
	this.$tmpl ={
		qbTypeTmpl :　$("#qbTypeTmpl"),
		$quesitionlistTmpl :　$("#quesitionlistTmpl"),
		quesitionlistTmpl :　"#quesitionlistTmpl",
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
	    	throw new Error("需要分页插件");
	    }else{
	    	var count = 10;
	    	if(qbCategory=="interview"){
	    		count=5;
	    	}
	    	_this.pager = window.createPager(count);
	    }
	    //初始化视图
	    _this.initView();
	    //检查flash插件
	    if (!flashChecker()) {
	    	$('#alert_no_flash').show();
	    }
		_this.bindEvent();
		if(qbId && qbCategory){
			_this.refresh(qbId);
			_this.initImportBtn(qbId);
			_this.$export.attr('href',root+'/sets/qbBase/exportQuestion/'+qbId +'/' + urlEncodeQbName+"?t="+new Date().getTime())//导出
		}
	},
	/*初始化导入按钮*/
	initImportBtn : function(qbId){
		var _this = this;
		//1.检查当前题库是否有未处理的导入错误
		//面试题暂时封住导入
		if(qbCategory=="interview"){
			_this.$filetmpl.hide();
		}else{
			_this.hasImportError(qbId,function(empty){
				if(empty){
					//1.1 没有错误，初始化file
					_this.$multiImport.show(); 
					_this.importQuestions(_this.$multiImport,qbId,qbCategory);//导入
				}else{
					//1.2 有错误，初始button
					_this.$importBtn.show();
				}
			});
		}
	},
	/*初始化视图*/
	initView : function(){
		var _this = this;
		if(qbCategory){
			if(qbCategory=="interview"){
				$('#addQuestion').html('<span class="glyphicon glyphicon-plus"></span>添加题组');
			}
			_this.initFilterList(qbCategory);
		}
	},
	/*初始化筛选列表*/
	initFilterList : function(qbCategory){
		var _this = this;
		if(qbCategory=="skill"){
			_this.$filetmpl.prop('href',_this.skillTmplUrl);
			//技能题
			var dataArr = new Array({'label':'select','desc':'选择题'},{'label':'program','desc':'编程题'},{'label':'ask','desc':'问答题'});
			_this.renderTmpl(_this.$qbType,_this.$tmpl.qbTypeTmpl,dataArr);
			_this.getQbBaseSkills(qbId); //获取技能
			_this.getProlanguage();//获取编程语言
		}else if(qbCategory=="iq"){
			_this.$filetmpl.prop('href',_this.iqTmplUrl);
			_this.tabType = "iq-select";
			//智力
			var dataArr = new Array({'label':'iq-select','desc':'选择题'},{'label':'iq-ask','desc':'问答题'});
			_this.renderTmpl(_this.$qbType,_this.$tmpl.qbTypeTmpl,dataArr);
		}else{
			_this.$filetmpl.prop('href',_this.interviewTmplUrl);
			//面试
			_this.tabType = qbCategory;
			_this.$qbType.hide();
		}
		
		_this.switchFilterList(_this.tabType);
	},
	/*切换筛选列表*/
	switchFilterList : function(tabType){
		var _this = this;
		_this.tabType = tabType;
		if(tabType=='select' ){
			_this.$skillSelect.show();
			_this.$avgbtn.children('span').html('正确率');
		}else{
			_this.$skillSelect.hide();
			_this.$avgbtn.children('span').html('平均分');
		}
		if(tabType=='program'){
			_this.$programSelect.show();
		}else{
			_this.$programSelect.hide();
		}
		if(tabType=='iq-select'){
			_this.$avgbtn.children('span').html('正确率');
		}
		if(tabType=='interview'){
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
		 _this.refresh(qbId,true);
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
		_this.$quesitionlist.on('mouseenter','li.quesitionlib-list',function(){
			$(this).find(".listbuttons").show();
		});
		_this.$quesitionlist.on('mouseleave','li.quesitionlib-list',function(){
			$(this).find(".listbuttons").hide();
		});
		_this.$btnimport.on('mouseenter','object.swfupload',function(){
			$(this).next().addClass('uploadify-button-hover');
		});
		_this.$btnimport.on('mouseleave','object.swfupload',function(){
			$(this).next().removeClass('uploadify-button-hover');
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
		/*删除题*/
		_this.$quesitionlist.on('click','button[delQuestion]',function(){
			var questionId = $(this).attr('questionId');
			confirmBox("确认要删除吗？",questionId);
		});
		_this.$confirmbtn.on('click',function(){
			var questionId = $(this).data('questionId');
			$('#confirmModal').modal('hide');
			_this.deleteQuestion(qbId,questionId,function(){
				_this.refresh(qbId);
			});
		});
		/*编辑题*/
		_this.$quesitionlist.on('click','button[editQuestion]',function(){
			var questionId = $(this).attr('questionId');
			//qblib.qbName = encodeURIComponent(encodeURIComponent(qbName));
			var qbType = _this.tabType?_this.tabType:'select';
			var url =root+"/sets/page/editQuestion/"+qbId+"/"+questionId+"/"+qbType+'/'+encodeURIComponent(encodeURIComponent(qbName));
			window.location.href=url;
		});
		/*切换题型选项卡*/
		_this.$qbType.on('click','li>a',function(){
			var tabType = $(this).attr('target');
			_this.switchFilterList(tabType);
			_this.refresh(qbId);
		});
		/*添加题目*/
		_this.$addQuestion.on('click',function(){
			var qbType = _this.tabType?_this.tabType:'select';
			var url =root+"/sets/page/addQuestion/"+qbId+"/"+qbType+'/'+encodeURIComponent(encodeURIComponent(qbName));
			window.location.href=url;
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
				_this.refresh(qbId);
		});
		/*下拉*/
		_this.$skillSelect.on('change',function(){
			//刷新列表
			_this.$searchbtn.triggerHandler('click');
		});
		_this.$programSelect.on('change',function(){
			//刷新列表
			_this.$searchbtn.triggerHandler('click');
		});
		//导入按钮
		_this.$importBtn.on('click',function(e){
			$('#alertmmsg').html("您还有导入错误没有处理，为了避免重复导入请先处理完错误再导入新的文件");
			_this.$alertModal.modal('show');
		});
		//确认处理导入错误
		_this.$alertBtn.on('click',function(e){
			var error={'qbId':qbId,'qbCategory':qbCategory};
			_this.importVerify(error);
		});
		//导入错误关闭按钮
		_this.$importErrClose.on('click',function(){
			_this.$importErr.hide();
			return false;
		});
	},
	/*获取页总数*/
	getPageTotal : function(data){
		var _this = this;
		$.setsAjax({
			async :false,
			type : 'POST',
			url : root+'/sets/qbBase/getQbQuestionsCount/',
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
	/*刷新列表*/
	refresh : function(qbId,isJumpPage){
		var _this = this;
		var data = {};
		//记录题库分类
		var category = reversferqbCategory(qbCategory);
		if(category && category!=4){
			data.category=category;
		}
		data.qbId = qbId;
		data.page = {
				pageSize: _this.pager.pageSize, // 每页多少个,如果是0则全取
				requestPage: _this.pager.requestPage // 当前第几页（从1开始）
		}
		//搜索
		_this.collectSearchCondition(data);
		//排序
		_this.collectOrderCondition(data);
		if(!isJumpPage){
			//非跳页的查询是全局设置
			_this.pager.requestPage=1;
			 data.page.requestPage=1;
			_this.getPageTotal(data);
		}
		_this.getQbQuestions(data);
	},
	/*收集搜索条件*/
	collectSearchCondition : function(data){
		var _this = this;
		var searchCondition={};
			if(data.category==1){
				//技能题型
				if(_this.tabType=='select'){
					searchCondition.choice=true;
					//技能
					var skillId = _this.$skillSelect.val();
					if(skillId && skillId !=-1){
						searchCondition.skillId=skillId;
					}
				}else if(_this.tabType=='program'){
					searchCondition.program=true;
					//编程语言
					var programLang = _this.$programSelect.val();
					if(programLang && programLang !=-1){
						searchCondition.programLang=programLang;
					}
				}else{
					//问答
					searchCondition.essay=true;
				}
			}else if(data.category==3){
				if(_this.tabType=='iq-select'){
					searchCondition.choice=true;
				}
				if(_this.tabType=='iq-ask'){
					searchCondition.essay=true;
				}
			}
			//题目描述
			var questionDesc = _this.$searchtext.val();
			if(questionDesc){
				searchCondition.questionDesc=questionDesc;
			}
				data.searchCondition = searchCondition;
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
		var url = qbCategory=="interview"? root+'/sets/qbBase/getQbGroups': root+'/sets/qbBase/getQbQuestions';
		var _this = this;
		$.setsAjax({
			type : 'POST',
			url : convertURL(url),
			dataType: "json",
			contentType : "application/json",
			data : JSON.stringify(data),
			success :function(result){
				if(result && result.code==0){
					if(result.data){
						//1.判断是否有下一页
						_this.pager.currentPage =  data.page.requestPage;
						_this.initPage(data.page.pageSize);
						if(result.data.length){
							$("#libinfo").hide();
						}else{
							$("#libinfo").show();
						}
						//渲染模板
						_this.linkData("#quesitionlist",_this.$tmpl.quesitionlistTmpl,'questionArr',result.data);
					}else{
						//获取题库列表失败
					}
				}else{
					//服务端业务异常
					_this.$quesitionlist.empty();
					_this.$morewrapperbtn.html('服务端异常了');
				}
			}
		});
	},
	/*删除题目*/
	deleteQuestion :function(qbId,questionId,callBack){
		if(!qbId || !questionId){
			return false;
		}
		var _this = this;
		var url =convertURL(root+"/sets/qbBase/deleteQuestion/"+qbId+"/"+questionId);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result && result.code==0){
					if(result.data && result.data.code=='SUCCESS'){
						//删除成功
						callBack();
					}
				}
			}
		});
	},
	/*导入校验*/
	importVerify : function(data){
		var _this = this;
		window.location.href=root+"/sets/page/importQuesVerify/"+data.qbId+"/"+data.qbCategory+'/';
	},
	/*检查是否有导入错误*/
	hasImportError : function(qbId,callBack){
		var _this = this;
		var url =convertURL(root+"/sets/qbBase/hasErrorQuestion/"+qbId);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result.code==0 && result.data.errorCode==0){
					if(callBack && typeof callBack == 'function' && result.data.empty!='undefined'){
						callBack(result.data.empty);
					}
				}
			}
		});
	},
	/*导入*/
	importQuestions : function($multiImport,qbId,qbCategory){
		var _this = this;
		var importExcelResult = false,error=null;
		$multiImport
		.uploadify({
			'height' : 34,
			'width' : 72,
			'multi' : false,
			'swf' : root + '/plugin/uploadify/uploadify.swf',
			'cancelImg' : root + '/plugin/uploadify/uploadify-cancel.png',
			'uploader' : root + '/sets/qbBase/importQuestion/'+qbId+'/80/;jsessionid=' + JESEESION_ID,
			'buttonText' : '<i class="fa fa-reply"></i> 导入',
			'auto' : true,
			'fileDesc' : '请选择Excel文件',
			'fileTypeExts' : '*.xls',
			'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
	            $('#progress').html(totalBytesUploaded + ' bytes uploaded of ' + totalBytesTotal + ' bytes.');
	        },
			'onUploadError' : function(file, errorCode, errorMsg, errorString) {
				//有错误
				error = errorMsg;
			},
			'onUploadSuccess' : function(file, data, response) {
				data = JSON.parse(data);
				if(data.code==0){
					if(data.data.errorCode==0){
						if(data.data.similarityErrors>0 || data.data.timeErrors>0 || data.data.formatErrors>0){
							importExcelResult = true;
							//有错误
							var error={'file':file,'data':data.data,'qbId':qbId,'qbCategory':qbCategory};
							_this.importVerify(error);
						}
					}else if(data.data.errorCode==15){
						$('#alertmmsg').html(data.data.errorDesc);
						_this.$alertModal.modal('show');
					}
				}else if(data.code==12) {
					//服务端有错误
					error = "服务端异常";
				}
			},
			'onUploadComplete' : function() {
				$('.uploadify-queue-item').remove();
				if (!importExcelResult) {
					//导入校验没有错误
					if(error){
						$('.alertMsg').html(error);
						_this.$importErr.addClass('in').show();
					}else{
						$('.alertMsg').html("导入成功！");
						_this.$importErr.addClass('in').show();
						window.location.reload();
					}
				}
			}
		});
	},
	/*渲染模板*/
	renderTmpl : function($wrap,$model,data){
		var htmlOutput = $model.render(data);  
		$wrap.html(htmlOutput); 
	},
	/*link数据*/
	linkData : function($wrap,$model,objArr,data){
		var _this = this;
		if(_this[objArr] && _this[objArr].length){
			$.observable(_this[objArr]).refresh(data);
		}else{
			_this[objArr] = data;
			var tmpl = $.templates($model);
			tmpl.link($wrap,_this[objArr]);
		}
	},
	/*获取编程语言*/
	getProlanguage : function(){
		var _this = this;
		var url =convertURL(root+"/sets/sys/getConfig/PROGRAM_LANGUAGE");
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result && result.code==0){
					if(result.data){
						result.data.unshift({"id":{"codeType":"PROGRAM_LANGUAGE","codeId":-1},"codeName":"全部编程语言"});
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
						result.data.unshift({"skillId":-1,"skillName":"全部技能"});
						//渲染模板
						_this.renderTmpl(_this.$skillSelect,_this.$tmpl.skillSelecTmpl,result.data);
					}
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
/*弹出确认框
 * msg:消息
 * */
function confirmBox(msg,questionId){
	//启动模态框
	//添加信息
	var a ="<p>"+msg+"</p>";
	$("#confirmbtn").data("questionId",questionId);
	$("#confirmmsg").html(a);
		$('#confirmModal').modal({
		     backdrop:'static',
		     keyboard:false,
		     show:true
		});
}