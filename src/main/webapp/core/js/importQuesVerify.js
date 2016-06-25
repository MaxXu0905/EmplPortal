/**
 * 导入校验 zengjie 2014/7/4
 */
(function($){
		$.fn.serializeToObj = function() {
			var obj = new Object();
			var arr = this.serializeArray();
			for ( var i=0 ;i <arr.length;i++) {
				if(arr[i].name=='group'){
					continue;
				}
				if(arr[i].name=='options'){
					if(obj[arr[i].name]){
						obj[arr[i].name].push(arr[i].value);
					}else{
						obj[arr[i].name]=new Array(arr[i].value);
					}
				}else{
					if(arr[i].value){
						if(obj[arr[i].name]){
							obj[arr[i].name] = obj[arr[i].name] +arr[i].value;
						}else{
							obj[arr[i].name] = arr[i].value;
						}
					}
				}
				
			}
			return obj;
		};
})(jQuery);
/* 扩展jsview.helper模板 */
(function(jsview){
	var newhelpers ={
		/*数组转字符串*/
		arr2String : function(arr){
			if(arr instanceof Array && arr.length){
				return arr.join(',');
			}else{
				return '';
			}
		},
		/* 除法 */
		division: function(a, b){
				return b==0?0: (a/b *100).toFixed(0);
		},
		/* 设置选项 */
		setOptions : function(index){
			var charArr=['A','B','C','D','E'];
			return charArr[index]?charArr[index]:"";
		},
		/* 格式化题干 */
		formatQusetion : function(title){
			if(!title){
				return "";
			}
			var questionHead = title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,"<br>");
			return questionHead;
		},
		/* 设置是否选中 */
		isSelect : function(current,value,type){
			if( !value || !type){
				return "";
			}
			if(type=='checked'){
				var charArr=['A','B','C','D','E'];
				if(value.indexOf(charArr[current])!=-1){
					return type;
				}
			}else if(type=='selected'){
				if(current==value){
					return type;
				}
			}
			
		},
		/*获取难度*/
		getLevel : function (selectValue){
			if(!selectValue){
				selectValue= "";
			}
			
			if(window.importVerify){
				window.importVerify.qBdifficultySelect = selectValue;
				//window.importVerify.getQBdifficulty(window.importVerify,selectValue);
			}
		},
		/*获取编程语言*/
		getProlanguage : function(selectValue){
			if(!selectValue){
				selectValue= "";
			}
			if(window.importVerify){
				window.importVerify.prolanguageSelect = selectValue;
				//window.importVerify.getProlanguage(window.importVerify,prolanguageSelect);
			}
		},
		/*获取技能*/
		getQbBaseSkills : function(){
			if(window.importVerify){
				
			}
		}
	};
	jsview.helpers(newhelpers);
})($.views);
$(function(){
	var importVerify = new ImportVerify();
	importVerify.init();
	window.importVerify = importVerify;
});
var verifyObj = {};
var question = {
		"sheetType":0,
		"rows":[],
	};
/* 构造函数 */
function ImportVerify(){
	this.$export=$('#export'); //导入
	this.$multiImport=$('#multi_import'); //导入file
	this.$batchProcess=$('#batchProcess'); //导入file
	this.$formatErrors=$('#formatErrors'); //格式错误
	this.$goSingleton=$('#goSingleton'); //单条处理
	this.$confirmbtn = $('#confirmbtn');
	this.$cancelbtn= $('#cancelbtn');
	this.$qbType = $('#qbType');
	this.$errorAlertInfo = $('#errorAlertInfo');
	this.$tabContent = $('#tabContent');
	this.currentForm = new Object();
	this.$tmpl={
			$quesitionlistTmpl : $("#quesitionlistTmpl"),
			quesitionlistTmpl : "#quesitionlistTmpl",
			qbTypeTmpl :　$("#qbTypeTmpl"),
			errorAlertInfoTmpl	: $('#errorAlertInfoTmpl'),
			adjustTimeTmpl	: $('#adjustTimeTmpl'),
			adjustSimilarTmpl	: $('#adjustSimilarTmpl'),
			adjustFormatTmpl	: $('#adjustFormatTmpl'),
			configTmpl : $("#configTmpl"), //配置模板
			skillsTmpl : $('#skillsTmpl')//技能模板
	},
	this.similarityErrors = []; // 相似度错误数组
	this.timeErrors = [];// 时间错误数组
	this.formatErrors = [];// 格式错误数组
	this.handleArrr = [];//当前操作的题型数组
}
ImportVerify.prototype = {
	init : function(){
		var _this = this;
		//初始化导入按钮
		_this.importQuestions(_this.$multiImport,qbId);//导入
		_this.$export.attr('href',root+'/sets/qbBase/exportErrorQb/'+qbId +'/' + urlEncodeQbNameError+"?t="+new Date().getTime())//导出
		// 1.获取错误qb
		_this.getErrorQb(function(){
			// 1.1 数据分组
			_this.initErrorData();
			// 1.2 初始化tab页
			 _this.initTab();
			// 1.3 初始化错误列表
			 _this.initError();
		});
		// 2.绑定事件
		_this.bindEvent();
		// 3.工具辅助类
		RenderUtils.init();
	},
	/* 初始化错误 */
	initError : function(){
		var _this = this;
		// 1.初始化错误类型
		if(verifyObj){
			var alert = {'similarityErrors' : verifyObj.similarityErrors,'timeErrors' : verifyObj.timeErrors,'formatErrors' : verifyObj.formatErrors };
			_this.initAlertList(alert);
		}
		  // 2.2 初始化列表
		 _this.initErrorList();
	},
	/* 初始化数据,以错误格式分组 */
	initErrorData : function(){
		var _this = this;
		// 遍历groups
		var groups = verifyObj.groups;
		for(var i in groups){
			// 数组分组
			var recodes = groups[i];
			_this.switchErrorType(recodes.errorType,recodes.rows);
		}
	},
	/* 初始化错误列表 */
	initErrorList : function(){
		var _this = this;
		if(_this.similarityErrors.length){
			_this.renderError("similarity",0);
		}
		if(_this.timeErrors.length){
			_this.renderError("time",0);
		}
		if(_this.formatErrors.length){
			_this.renderError("format",0);
		}
	},
	/* 渲染错误 */
	renderError : function(type,index){
		var _this = this;
		var pagetype=getPageType(qbCategory);
		var url = root+"/sets/page/questionlist/"+qbId+'/'+pagetype+'/';
		if(!type){
			if(!_this.similarityErrors.length && !_this.timeErrors.length && !_this.formatErrors.length){
				leavePage("您的导入错误列表已经全部处理完毕。",'题目管理',1,url);
			}
			return;
		}
		if(_this[type+'Errors'].length){
			var row = _this[type+'Errors'][index];
			row.errorType = type;
			if(row){
				var $wrap ="#"+type+"Errors";
				_this.linkData($wrap,_this.$tmpl.quesitionlistTmpl,type,row);
			}
		
		}else{
			if(!_this.similarityErrors.length && !_this.timeErrors.length && !_this.formatErrors.length){
				_this.leavePage("您的导入错误列表已经全部处理完毕。",'题目管理',1,url);
			}
		}
		
	},
	/*对link的数据做处理*/
	bindLinkEvent : function(){
		var _this = this;
		/************************相似度错误*******************/
		//1.保留这两道题
		_this.$tabContent.on('click','#keppAll',function(e){
			 e.preventDefault();
			 e.stopPropagation();
			//导入新题
			var data = $.view(this).data;
			if(!data.sheetType){
				return;
			}
			var submitData ={};
			$.extend(submitData,data);
			//删除多余的属性
			delete submitData.errorType;
			delete submitData.cause;
			delete submitData.origQbName;
			delete submitData.origQuestionId;
			delete submitData.origRow;
			//2.添加新题,不需要检查相似度
			var serialNo = data.serialNo;
			_this.dealAdd(serialNo,submitData,false,0);
		});
		//2.替换原题
		_this.$tabContent.on('click','#delOldQuestion',function(e){
			 e.preventDefault();
			 e.stopPropagation();
			 console.log('tihuan');
			var data = $.view(this).data;
			//var submitData ={};
			//$.extend(submitData,data);
			//1.获取原题id
			var questionId = data.origQuestionId;
			//删除多余的属性
			delete data.errorType;
			delete data.cause;
			delete data.origQbName;
			delete data.origQuestionId;
			delete data.origRow;
			if(!data.sheetType){
				return;
			}
			//2.删除题目
			if(!qbId || !questionId){
				return false;
			}
			
			//1.编辑原题
			_this.dealEdit(questionId,data);
		});
		//3.不导入新题
		_this.$tabContent.on('click','#delNewQuestion',function(e){
			 e.preventDefault();
			 e.stopPropagation();
			//删除当前错误列表
			var data = $.view(this).data;
			var serialNo = data.serialNo;
			var serialNo= $(this).attr('serialNo');
			confirmBox("确认取消导入当前题吗？",serialNo);
			return false;
		/*	_this.dealError(serialNo,function(){
				_this.cleanErrorArr();
			});*/
		});
		/************************时间错误*******************/
		//1.采用原题时间
		_this.$tabContent.on('click','#useOriginTime',function(e){
			 e.preventDefault();
			 e.stopPropagation();
			//直接导入
			var data = $.view(this).data;
			delete data.errorType;
			delete data.cause;
			delete data.suggestTime;
			if(!data.sheetType){
				return;
			}
			var serialNo = data.serialNo;
			//2.添加新题,不检查时间
			_this.dealAdd(serialNo,data,false,80);
		});
		//2.采用建议时间
		_this.$tabContent.on('click','#useSuggestTime',function(e){
			e.preventDefault();
			e.stopPropagation();
			//取建议时间导入
			var data = $.view(this).data;
			delete data.errorType;
			delete data.cause;
			if(!data.sheetType){
				return;
			}
			var suggestTime = data.suggestTime;
			if(suggestTime){
				data.suggestSeconds=suggestTime;
				delete data.suggestTime;
				var serialNo = data.serialNo;
				//2.添加新题,不检查时间
				_this.dealAdd(serialNo,data,false,80);
			}
		});
	},
	bindEvent : function(){
		var _this = this;
		/*技能搜索添加*/
		_this.$tabContent.on('click','#dropdownMenu',function(){
			$('#skillsearch').val('');
			if(_this.skills){
				$("#currentskill").show();
				$("#noskillfilter").hide();
			}
		});
		_this.$tabContent.on('click','ul.selections>li',function(){
			var skill = $(this).attr('skillid');
			if(skill){
				$('#skill').text(skill);
				$('[name="skill"]').val(skill).change();
				$(this).closest('.dropdown').toggleClass('open');
			}
		});
		_this.$tabContent.on('click','#addSkill',function(e){
			var value = $('#skillsearch').val();
			if(!value){
				return;
			}
			$('#skill').text(value);
			$('[name="skill"]').val(value).change();
			$(this).closest('.dropdown').toggleClass('open');
			return false;
		});
		_this.$tabContent.on('click','#skillsearch',function(e){
			 e.preventDefault();
			 e.stopPropagation();
			$(this).closest('.dropdown').addClass('open');
		});
		_this.$tabContent.on('keyup','#skillsearch',function(e){
			var value = $(this).val();
			if(!value){
				if(_this.skills){
					_this.renderTmpl($("#currentskill"),_this.$templates.skillsTmpl,_this.skills);
				}
				return;
			}
			var key = e.keyCode || e.which;
			if(key==13){
				//添加技能
				$('#addSkill').triggerHandler('click');
			}else{
				if(_this.skills){
					//搜索
					var skills = _this.searchSkills(value);
					if(skills && skills.length>0){
						//加载
						$("#noskillfilter").hide();
						$("#currentskill").show();
					}else{
						//添加
						$("#noskillfilter").show();
						$("#currentskill").hide();
						$('#noskill').html('添加“'+value+'”');
					}
				}else{
					//添加
					$("#noskillfilter").show();
					$("#currentskill").hide();
					$('#noskill').html('添加“'+value+'”');
				}
			}
		});
		_this.$batchProcess.on('mouseenter','object.swfupload',function(){
			$(this).next().addClass('uploadify-button-hover');
		});
		_this.$batchProcess.on('mouseleave','object.swfupload',function(){
			$(this).next().removeClass('uploadify-button-hover');
		});
	    // checkbox
		_this.$tabContent.on('click','.correctOptions input[type="checkbox"]',function(e){
			$(this).parent().find('i.check').toggleClass("checked");
			// 校验
			var flag = _this.requireVarify($(this));
			// 遍历看是不是都有值
			if(flag){
				$(this).closest('form').find('button.add').removeAttr('disabled');
			}else{
				$(this).closest('form').find('button.add').attr('disabled','disabled');
			}
		});
		_this.$tabContent.on('click','button.cancel',function(){
			var serialNo= $(this).attr('serialNo');
			confirmBox("确认取消导入当前题吗？",serialNo);
			return false;
		});
		//补充解释
		_this.$tabContent.on('click','#refExplain_checkbox',function(){
			$(this).toggleClass('active');
			$(this).children().toggleClass('glyphicon-unchecked','glyphicon-check');
			$(this).next('[name="refExplain"]').toggle();
			if($(this).hasClass('active')){
				_this.$questionForm.find('[name="explainReqired"]').val('是');
			}else{
				_this.$questionForm.find('[name="explainReqired"]').val('否');
			}
		});
		/*检查选项*/
		/*_this.$tabContent.on('blur','textarea[name="options"]',function(){
			var val = $(this).val();
			var option = $(this).parent().children('span').html();
			if(val){
				$('#correctoption_'+option).show();
			}else{
				$('#correctoption_'+option).hide();
			}
		});*/
		/*取消导入*/
		_this.$confirmbtn.on('click',function(){
			var serialNo = $(this).data('serialNo');
			_this.dealError(serialNo,function(){
				//渲染下一题
				$('#confirmModal').modal('hide');
				_this.cleanErrorArr();
			});
		});
		_this.$tabContent.on('blur keyup','[number]',function(){
			var flag = true;
			if(!$(this).val()){
				return;
			}else{
				flag=$(this).setsValidation('isNumber',$(this).val());
				if(!flag){
					_this.formValid=false;
					$(this).setsValidationErr("请输入正整数");
					$('#addInterview').attr('disabled','disabled');
					$('#toSubmit').attr('disabled','disabled');
				}else{
					_this.formValid=true;
					$(this).removeValidationErr($(this));
					$('#addInterview').removeAttr('disabled');
					if(qbType!='interview'){
						$('#toSubmit').removeAttr('disabled');
					}
				}
			}
			
		});
		_this.$tabContent.on('blur keyup change','[required]',function(){
			var flag = true;
			if(!$(this).val()){
				flag =  false;
			}else{
				flag = _this.requireVarify($(this));
			}
			// 遍历看是不是都有值
			if(flag){
				$('button.add').removeAttr('disabled');
			}else{
				$('button.add').attr('disabled','disabled');
			}
		});
		_this.$tabContent.on('click','button.add',function(){
			var serialNo= $(this).attr('serialNo');
			var form = $(this).closest('form').serializeToObj();
			//格式错误保存
			_this.dealAdd(serialNo,form,true,80);
			return false;
		});
		//切换批量还是单条处理错误
		_this.$tabContent.on('click','#goBatch',function(){
			//切换文字
			//切换选项卡
			_this.$formatErrors.removeClass('active in');
			_this.$batchProcess.addClass('active in');
			return false;
		});
		_this.$goSingleton.on('click',function(){
			_this.$formatErrors.addClass('active in');
			_this.$batchProcess.removeClass('active in');
			return false;
		});
		
	},
	/*编辑原题*/
	dealEdit : function(questionId,data){
		var _this = this;
		var sheetType = data.sheetType;
		question.sheetType = sheetType;
		//相似度：0，不检查相似
		var url = convertURL(root+"/sets/qbBase/editQuestion/"+qbId+"/"+questionId+"/0/true");
		delete data.sheetType;
		_this.submitQuestion(url,data,function(result){
			//添加成功后处理缓存错误列表，数据库的后台会处理
			_this.cleanErrorArr();
		});
	},
	/* 校验必填 */
	requireVarify : function($this){
		var flag = true;
		var checked =false;
		var require = $this.closest('form').find('[required]');
		require.each(function(i,ele){
			var value = $(ele).val();
			if(!value){
				flag =false;
				return false;
			}else{
				var type =$(ele).prop('type');
				if(type=='checkbox'){
					if(checked){
						//continue
						return true;
					}else{
						if(!$(ele).prop('checked')){
							flag =false;
						}else{
							flag =true;
							checked = true;
						}
					}
				}
			}
			
		});
		return flag;
	},
	/* 渲染模板 */
	renderTmpl : function($wrap,$modal,data){
		var htmlOutput = $modal.render(data);  
		$wrap.html(htmlOutput); 
	},
	/*link数据*/
	linkData : function($wrap,$modal,type,data){
		if(data.sheetType){
			//需要处理
			dealOptions(data);
		}
		var _this = this;
		if(!_this[type+'Arr']){
			_this[type+'Arr']=[];
			_this[type+'Arr'].push(data);
			var template = $.templates($modal);
			template.link($wrap, _this[type+'Arr']);
		}else{
			//$($wrap).fadeOut();
			var tmpArr=new Array(data);
			$.observable(_this[type+'Arr']).refresh(tmpArr);
			tmpArr=null;
		}
		//$($wrap).fadeIn();
		if(type=='format'){
			//格式错误，需要取难度，语言，技能
			_this.getQbBaseSkills();
			_this.getQBdifficulty(_this,_this.qBdifficultySelect);
			_this.getProlanguage(_this,_this.prolanguageSelect);
			if(qbCategory=='paper'){
				//导入试卷不可以批量处理
				$("#goBatch").hide();
			}
		}else{
			_this.bindLinkEvent();//绑定link事件
		}
		$('body,html').animate({scrollTop:0},1000);
	},
	linkTmpl : function($wrap,$modal,data){
		var template = $.templates($modal);
		template.link($wrap, data);
	},
	/* 获取错误列表 */
	getErrorQb : function(callBack){
		var url = convertURL(root+"/sets/qbBase/getErrorQb/"+qbId);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result.code ==0 && result.data.errorCode==0){
					verifyObj = result.data;
					if(verifyObj.similarityErrors || verifyObj.timeErrors || verifyObj.formatErrors){
						if(	callBack && typeof 	callBack=="function"){
							callBack();
						}
					}else{
						$('#errortitle').html("没有错误需要处理了，请关闭当前页面，回到题目管理页面继续操作。");
						 var type="skill";
		  		    	 if(qbType=='iq-select' || qbType=='iq-ask' ){
		  		    		type ="iq";
		  		    	 }else if(qbType=="interview"){
		  		    		type ="interview";
		  		    	 } 
						var url = root+"/sets/page/questionlist/"+qbId+'/'+type+'/';
		  		    	 leavePage("没有错误需要处理了，请关闭当前页面。",'题目管理',5,url);
					}
				}
			}
		});
	},
	/* 检查是否错误 */
	hasErrorQuestion : function(qbId){
		var url = convertURL(root+"/sets/qbBase/hasErrorQuestion/"+qbId)
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
			}
		});
	},
	/* 导出错误 */
	exportErrorQuestion : function(qbId){
		var url = convertURL(root+"/sets/page/qbBase/exportErrorQuestion/"+qbId)
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
			}
		});
	},
	/*初始化错误列表*/
	initAlertList : function(alert){
		var _this = this;
		var alert = alert?alert:{'similarityErrors' : _this.similarityErrors.length,'timeErrors' : _this.timeErrors.length,'formatErrors' : _this.formatErrors.length };
		_this.renderTmpl(_this.$errorAlertInfo,_this.$tmpl.errorAlertInfoTmpl,alert);
	},
	/* 初始化tab表 */
	initTab : function(){
		var _this = this;
		var dataArr = [];
		if(_this.similarityErrors.length){
			var length = _this.similarityErrors.length;
			dataArr.push({'tabType':'similarity','list':'#similarityErrors','desc':'相似度错误 <span id="similarityErrNum" class="label label-danger">'+length+'</span>'});
		}
		if(_this.timeErrors.length){
			var length = _this.timeErrors.length;
			dataArr.push({'tabType':'time','list':'#timeErrors','desc':'时间错误 <span id="timeErrNum" class="label label-danger">'+length+'</span>'});
		}
		if(_this.formatErrors.length){
			var length = _this.formatErrors.length;
			dataArr.push({'tabType':'format','list':'#formatErrors','desc':'格式错误 <span id="formatErrNum" class="label label-danger">'+length+'</span>'});
		}
		//设置默认active
		if(dataArr.length){
			dataArr[0]['clazz']='active';
			var tab = dataArr[0]['list'];
			$(tab).addClass('active in');
		}
		_this.renderTmpl(_this.$qbType,_this.$tmpl.qbTypeTmpl,dataArr);
	},
	/* 处理添加 
	 * serialNo ：错误号
	 * data :错误数据
	 * checkTime : 是否检查数据
	 * similar:相似度
	 * */
	dealAdd : function(serialNo,data,checkTime,similar){
		var _this = this;
		var sheetType = data.sheetType;
		question.sheetType = sheetType;
		// 1.提交题
		var url = root+"/sets/qbBase/addQuestion/"+qbId+"/"+similar+"/"+checkTime;
		delete data.sheetType;
		_this.submitQuestion(url,data,function(result){
			//添加成功后处理缓存错误列表，数据库的后台会处理
			_this.cleanErrorArr();
		});
	},
	/* 处理出错 */
	dealError : function(serialNo,callBack){
		var _this = this;
		var url = convertURL(root+"/sets/qbBase/deleteErrorQuestion/"+serialNo);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result.code==0 && result.data.errorCode==0){
					if(callBack && typeof callBack=="function"){
						callBack();
					}
				}else{
						RenderUtils.modalWaiting.show('删除错误列表失败了，请<a class="trigger text-highlight">再试一次</a>，或告诉我们：<br/>'
								+ RenderUtils.connectInfo).hideSpin().oneEvent(function() {
									_this.dealError(serialNo,callBack);
					 });
				}
			}
		});
	},
	/*清理错误数组*/
	cleanErrorArr : function(){
		var _this = this;
		//删除当前绑定数组的处理数据
		var tabType = _this.$qbType.find('li.active').attr('tabtype');
		 var $wrap =$("#"+tabType+"Errors");
		 var handleArrr = _this[tabType+"Errors"];
		//删除当前句柄数组的第一个数据
		if(handleArrr && handleArrr.length){
			handleArrr.shift();
		}
		//处理当前错误数
		if(handleArrr.length){
			$("#"+tabType+'Num').html(handleArrr.length);
			$("#"+tabType+'ErrNum').html(handleArrr.length);
			var tabType = _this.$qbType.find('li.active').attr('tabtype');
			_this.renderError(tabType,0);
		}else{
			/**重新渲染**/
			if(!_this.similarityErrors.length && !_this.timeErrors.length && !_this.formatErrors.length){
				var pagetype=getPageType(qbCategory);
				var url = root+"/sets/page/questionlist/"+qbId+'/'+pagetype+'/';
				leavePage("您的导入错误列表已经全部处理完毕。",'题目管理',1,url);
				return;
			}
			//1.更新提示列表
			_this.initAlertList();
			//2.更新tab
			 _this.initTab();
			//3.清空当前列表
			 $wrap.empty();
		}
	},
	/* 取消导入 */
	cancelImport : function(){
		var _this = this;
	},
	/* 添加题组 */
	submitQuestionGrop : function(url,formData){
		var url =root+"/sets/qbBase/getGroup/{questionId}";
		_this.submitQuestion();
	},
	/* 添加题目 */
	submitQuestion : function(url,formData,callBack){
		var _this = this;
		var success = false;
		var oldserialNo = formData.serialNo;
		if(formData.length==0){
			return false;
		}
		var group = $('input[name="group"]').val();
		if(group){
			question.group=group;
		}
		question.rows[0]=formData;
		// ajax校验
  		$.setsAjax({
  			type: "POST",
  			dataType: "json",
  			contentType : "application/json",
	  		url:convertURL(url),
	  		data:JSON.stringify(question),
  		 	beforeSend: function(){
  		 	 $('button.add').attr('disabled','disabled').html('提交题目中...');
  		    },
			success:function(result)
			{
				if(result.code==0 &&　result.data.errorCode==0 ){
					success =true;
					if(result.data.similarityErrors==0 && result.data.timeErrors==0 && result.data.formatErrors==0){
						// 添加成功
						if(callBack && typeof callBack=="function"){
							callBack();
						}
					}else{
						if(result.data.groups && result.data.groups[0].rows){
							/*返回有错误呀*/
							_this.dealReturnError(oldserialNo,result);
						}
					}
				}
			},
			complete : function(){
				 $('button.add').html('完成');
				if(!success){
					_this.showError=true;
					RenderUtils.modalWaiting.show('添加题目失败了，请<a class="trigger text-highlight">再试一次</a>，或告诉我们：<br/>'
							+ RenderUtils.connectInfo).hideSpin().oneEvent(function() {
								_this.submitQuestion(url,formData,callBack);
					});
				}else{
					if(_this.showError){
						RenderUtils.modalWaiting.hide();
						_this.showError=null;
					}
				}
			}
	  	});
	},
	/*处理返回的错误*/
	dealReturnError : function(oldserialNo,result){
		var _this = this;
		//1.获取错误类型
		var errorType =  result.data.groups[0].rows[0].errorType;
		var errorTypeStr = _this.switchErrorType(errorType);
		var currenttab = _this.$qbType.find('li.active').attr('tabtype');
		var $currentwrap = "#"+currenttab+"ErrorsWrap";
		var $newwrap ="#"+errorTypeStr+"Wrap";
		var tmpl = _this.getTmplByErrorType(errorType);
		var row = result.data.groups[0].rows[0];
		//2：替换当前ACTIVE数组
		 var handleArrr = _this[currenttab+"Errors"];
			//删除当前句柄数组的第一个数据
			if(handleArrr && handleArrr.length){
				handleArrr[0]=row;
			}
		if(errorType){
			//1.2其他格式需要更新错误对象
			_this[errorTypeStr+'Arr']=null;
			_this.linkData($currentwrap,tmpl,errorTypeStr,row);
		}
	},
	/*
	 * 获取配置信息 QB_DIFFICULTY：难度 PROGRAM_LANGUAGE：编程语言
	 */
	getConfig : function(key,callback){
		var _this = this;
		var url = convertURL(root+"/sets/sys/getConfig/"+key);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result && result.code==0){
					var datas={};
					datas.data = result.data;
					callback(_this,datas);
				}
			}
		});
	},
	/*获取难度*/
	getQBdifficulty : function($this,selectValue){
		if($this.levelData){
			//1.如果已经取过了从缓存取
			$this.setQBdifficulty($this,$this.levelData,selectValue);
			return;
		}else{
			//2.如果没有从服务端取
			var url = convertURL(root+"/sets/sys/getConfig/QB_DIFFICULTY");
			$.setsAjax({
				type:'GET',
				url :url,
				success :function(result){
					if(result && result.code==0){
						$this.levelData = result.data;
						$this.setQBdifficulty($this,result.data,selectValue);
					}
				}
			});
		}
	},
	/* 设置难度 */
	setQBdifficulty : function($this,result,selectValue){
		var datas={};
		datas.data = result;
		datas.selectValue = selectValue;
		datas.label="请选择难度";
		$this.renderTmpl($('select[qbdifficul]'),$this.$tmpl.configTmpl,datas);
	},
	/*获取编程语言*/
	getProlanguage : function($this,selectValue){
		if($this.prolanguageData){
			//1.如果已经取过了从缓存取
			$this.setProlanguage($this,$this.prolanguageData,selectValue);
			return;
		}else{
			//2.如果没有从服务端取
			var url = convertURL(root+"/sets/sys/getConfig/PROGRAM_LANGUAGE");
			$.setsAjax({
				type:'GET',
				url :url,
				success :function(result){
					if(result && result.code==0){
						$this.prolanguageData = result.data;
						$this.setProlanguage($this,result.data,selectValue);
					}
				}
			});
		}
	},
	/* 设置编程语言 */
	setProlanguage : function($this,result,selectValue){
		var datas={};
		datas.data = result;
		datas.selectValue = selectValue;
		datas.label="请选择编程语言";
		$this.renderTmpl($('select[proglanguage]'),$this.$tmpl.configTmpl,datas);
	},
	/*根据错误类型获取模板*/
	getTmplByErrorType : function(errorType){
		switch(errorType){
			case 1: //相似度错误
				return '#adjustSimilarTmpl';
				break;
			case 2: //时间错误
				return '#adjustTimeTmpl';
				break;
			case 3: // 格式错误
				return '#adjustFormatTmpl';
				break;
			default:
				return '';
		}
	},
	/* 转换error-type */
	switchErrorType : function(errorType,rows){
		var _this = this;
		switch(errorType){
		case 1: // 相似度错误
			if(rows){
				_this.similarityErrors = rows;
				return "#similarityErrors";
			}else{
				return "similarity";
			}
			break;
		case 2: // 时间错误
			if(rows){
				_this.timeErrors = rows;
				return "#timeErrors";
			}else{
				return "time";
			}
			break;
		case 3: // 格式错误
			if(rows){
				_this.formatErrors = rows;
				return "#formatErrors";
			}else{
				return "format";
			}
			break;
		default:
			return null;
		}
	},
	/*导入*/
	importQuestions : function($multiImport,qbId){
		var _this = this;
		$multiImport
		.uploadify({
			'height' : 34,
			'width' : 127,
			'multi' : false,
			'swf' : root + '/plugin/uploadify/uploadify.swf',
			'cancelImg' : root + '/plugin/uploadify/uploadify-cancel.png',
			'uploader' : root + '/sets/qbBase/importQuestion/'+qbId+'/80/;jsessionid=' + JESEESION_ID,
			'buttonText' : '<i class="fa fa-reply"></i> 错误列表导入',
			'auto' : true,
			'fileDesc' : '请选择Excel文件',
			'fileTypeExts' : '*.xls; *.xlsx',
			'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
	            $('#progress').html(totalBytesUploaded + ' bytes uploaded of ' + totalBytesTotal + ' bytes.');
	        },
			'onUploadError' : function(file, errorCode, errorMsg, errorString) {
				//有错误
				var error={'file':file,'data':data.data,'qbId':qbId,'qbCategory':qbCategory};
				_this.importVerify(error);
			},
			'onUploadSuccess' : function(file, data, response) {
				data = JSON.parse(data);
				if(data.code==0 && data.data.errorCode==0){
					if(data.data.similarityErrors>0 || data.data.timeErrors>0 || data.data.formatErrors>0){
						//有错误
						window.location.reload();
					}
					_this.refresh();
				}else{
					//有错误
					var error={'file':file,'data':data.data,'qbId':qbId,'qbCategory':qbCategory};
					_this.importVerify(error);
				}
			},
			'onUploadComplete' : function() {
				if (!_this.importExcelResult) {
					//批量导入失败
				}
				_this.importExcelResult = false; // 重置为false
			}
		});
	},
	/*搜索技能*/
	searchSkills : function(searchStr){
		var _this = this;
		var skills = [];
		if(_this.skills){
			//搜索
			for(var i =0 ;i<_this.skills.length;i++){
				var myregex = new RegExp(searchStr,"i");   // 创建正则表达式
				var isMatch = _this.skills[i].skillName.search(myregex);
				if(isMatch!=-1){
					skills.push(_this.skills[i]);
				}
			}
			if(skills.length){
				_this.renderTmpl($("#currentskill"),_this.$templates.skillsTmpl,skills);
			}
		}else{
			return null;
		}
		return skills;
	},
	/*获取全部技能*/
	getQbBaseSkills : function(){
		var _this = this;
		if(_this.qbBaseSkills){
			//获取到全部技能
			_this.skills = _this.qbBaseSkills;
			_this.renderTmpl($("#currentskill"),_this.$tmpl.skillsTmpl,_this.skills);
			$("#currentskill").toggleClass("currentskill");
		}else{
			var url = convertURL(root+'/sets/qbBase/getQbBaseSkills/'+qbId);
			$.setsAjax({
				type:'GET',
				url :url,
				success :function(result){
					if(result.data &&　result.data.length>0){
						//获取到全部技能
						_this.qbBaseSkills = result.data;
						_this.skills = result.data;
						_this.renderTmpl($("#currentskill"),_this.$tmpl.skillsTmpl,_this.skills);
						$("#currentskill").toggleClass("currentskill");
					}
				}
			});
		}
	}
}
/*
 * 弹出确认框 msg:消息
 */
function confirmBox(msg,serialNo){
	// 启动模态框
	if(qbCategory=='paper'){
		window.parent.confirmBox(msg,serialNo);  
	}else{
		// 添加信息
		var a ="<p>"+msg+"</p>";
		$("#confirmbtn").data("serialNo",serialNo);
		$("#cancelbtn").data("serialNo",serialNo);
		$("#confirmmsg").html(a);
		$('#confirmModal').modal({
			backdrop:'static',
			keyboard:false,
			show:true
		});
	}
}

function cancelImport(serialNo){
	$("#confirmbtn").data("serialNo",serialNo);
	$("#cancelbtn").data("serialNo",serialNo);
	$("#confirmbtn").triggerHandler('click');
}
function getPageType(){
	var type="skill";
	 if(qbCategory=='skill'){
		 type ="skill";
	 }else if(qbCategory=='iq'){
		 type ="iq";
 	 }else if(qbCategory=="interview"){
 		type ="interview";
 	 }else if(qbCategory=="paper"){
 		type ="paper";
 	 }else{
 		 type=null;
 	 }
 	 return type;
}
/*处理options*/
function dealOptions(data){
	if(data.sheetType==3 || data.sheetType==6){
		//选择题需要有默认选项
		if(!data.options){
			data.options=['','','','',''];
		}
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
/*离开页面*/
function leavePage(msg,pageName,countDown,url){
	 var intervalId = null;
	 var html = msg;
	 if(countDown>0){
		 msg+='<br/><span id="countdown" class="trigger">'+countDown+'</span>'+'秒后会自动返回到'+pageName+'页面，或者点击<a class="trigger text-highlight">返回</a>';
	 }
	 if(qbCategory=="paper"){
		 //导入试卷需要调父页面的方法
		 window.parent.createPaper(qbId);  
	 }else{
		 
		 RenderUtils.modalWaiting.show(html).hideSpin().oneEvent(function() {
			 window.location.href= url; 
		 });
		 intervalId = setInterval(function(){
			 var val = $("#countdown").html();
			 if(!val){
				 clearInterval(intervalId);
				 window.location.href= url; 
			 }else{
				 var index = parseInt(val);
				 index--;
				 $("#countdown").html(index);
			 }
		 },1000);
	 }
}
