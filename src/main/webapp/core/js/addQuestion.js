var uploadArr = [];
(function($){
		$.fn.serializeToObj = function() {
			var obj = new Object();
			var arr = this.serializeArray();
			for ( var i=0 ;i <arr.length;i++) {
				if(arr[i].name=='group'){
					continue;
				}
				if(arr[i].name.indexOf('titleUpload_')!=-1){
					continue;
				}
				if(arr[i].name=='options' || arr[i].name.indexOf('optionUpload_')!=-1){
					if(arr[i].name.indexOf('optionUpload_')!=-1){
						if(obj['optionsPic']){
							obj['optionsPic'].push(arr[i].value);
						}else{
								obj['optionsPic']=new Array(arr[i].value);
						}
					}else{
						if(obj[arr[i].name]){
							obj[arr[i].name].push(arr[i].value);
						}else{
							obj[arr[i].name]=new Array(arr[i].value);
						}
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
			/*对题干和选项进行html encode*/
			if(obj.title){
				obj.title = html_encode(obj.title);
			}
			if(obj.options && $.isArray(obj.options) && obj.options.length>0){
				for(var i=0,len=obj.options.length;i<len;i++){
					obj.options[i]=html_encode(obj.options[i]);
				}
			}
			/*对题干和选项进行图片合并*/
			if(obj.title || $('#titleUploadVal').val()){
				if(obj.titleUploadVal){
					var img = '<img src="'+obj.titleUploadVal+'" class="file-preview-image"/>';
					if(obj.title){
						obj.title = obj.title +"<br/>"+img;
					}else{
						obj.title = img;
					}
					delete obj.titleUploadVal;
					obj.html = true; //补充html标记
				}
			}
			if(obj.optionsPic && $.isArray(obj.optionsPic) && obj.optionsPic.length>0){
				obj.options = obj.options || [];
				for(var i=0,len=obj.optionsPic.length;i<len;i++){
					var img = '<img src="'+obj.optionsPic[i]+'" class="file-preview-image"/>';
					if(obj.optionsPic[i]){
						obj.html = true; //补充html标记
						if(obj.options[i]){
							obj.options[i]=obj.options[i]+"<br/>"+img;
						}else{
							obj.options[i]=img;
						}
					}
				}
					delete obj.optionsPic;
					
			}
			return obj;
		};
})(jQuery);
/*扩展jsview.helper模板*/
(function(jsview){
	var newhelpers ={
		/*除法*/
		division: function(a, b){
				return b==0?0: (a/b *100).toFixed(0);
		},
		/*设置选项*/
		setOptions : function(index){
			var charArr=['A','B','C','D','E'];
			return charArr[index];
		},
		/*格式化题干*/
		formatQusetion : function(title){
			//var questionHead = title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,"<br>");
			return title;
		},
		/*设置是否选中*/
		isSelect : function(current,value,type){
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
			
		}
	};
	jsview.helpers(newhelpers);
})($.views);
var question ={
		"sheetType":"3", // 表格类型(选择（技能）--3，编程--4，智力--5，业务--6，面试--7)
		"rows": []
}
var questionObj = {
        "type":"", // 题型
        "skill":"", // 技能
        "level":"", // 难度
        "suggestSeconds":"", // 答题时间（秒）
        "suggestMinutes":"", // 答题时间（分钟）
        "title":"", // 题目描述
        "options":['','','','',''], // 选项
        "correctOptions":"", // 正确选项
        "refAnswer":"", // 参考答案
        "explainReqired":"", // 需要补充解释:是，否
        "refExplain":"", // 补充解释的参考答案
        "mode":"", // 编程语言
        "group":"" // 面试题组
    }
/**
 * 添加题目
 * zengjie
 * 2014/6/27
 */
$(function(){
	var addQuestion = new AddQuestion();
	addQuestion.init();
});
/*构造函数*/
function AddQuestion(){
	this.returnUrl = root+"/sets/page/questionlist/"+qbId+'/'+getPageType()+'/';
	this.formArr = [];
	this.$alertInfo=$("#alertInfo");
	this.$alertInfotext=$("#alertInfo-text");
	this.$alertClose = $('#alertClose');
	this.$title=$("#title");
	this.$questionForm=$("#question-form");
	this.$dropdownMenu = $("#dropdownMenu");
	this.$skills = $('[name="skill"]');
	this.$skill = $('#skill');
	this.$noskill = $("#noskill");
	this.$skillsearch = $("#skillsearch");
	this.$skilldropdown = $("#skills-dropdown");
	this.$currentskill = $("#currentskill");
	this.$templates ={
		selectTmpl : $("#selectTmpl"), //选择题模板
		programTmpl : $("#programTmpl"), //选择题模板
		iqTmpl : $("#iqTmpl"), //选择题模板
		askTmpl : $("#askTmpl"), //选择题模板
		interviewTmpl : $("#interviewTmpl"), //面试题模板
		interviewOpsTmpl : $("#interviewOpsTmpl"), //面试题选项模板
		configTmpl : $("#configTmpl"), //配置模板
		skillsTmpl : $('#skillsTmpl')//技能模板
	};
}
AddQuestion.prototype = {
	init : function(){
		var _this = this;
		//1.初始化视图
		_this.initView();
		//2.绑定事件
		_this.bindEvent();
		// 3.工具辅助类
		RenderUtils.init();
	},
	/*初始化视图*/
	initView : function(){
		imgUploadUrl+=qbId;
		var _this = this;
		var operator ="添加";
		var qtype = "选择题";
		var $tmpl=_this.$templates.selectTmpl;
		var callBack =null;
		var initObj = _this.reverSheetType(qbType);
		qtype = initObj.qtype;
		$tmpl = initObj.$tmpl;
		callBack = initObj.callBack;
		if(qbOperator=='edit'){
			//获取数据
			operator ="编辑";
			if(qbType!='interview'){
				_this.getQuestionDetail(questionId,callBack);
			}else{
				_this.getQuestionGrop(questionId,callBack);
			}
		}else{
			//渲染页面
			_this.renderTmpl(_this.$questionForm,$tmpl,questionObj);
			if(callBack && typeof callBack=='function'){
				callBack(_this);
			}
				
		}
		 var type=getPageType();
		 var url = root+"/sets/page/questionlist/"+qbId+'/'+type+'/';
		 var titlehtml = operator+'<a href="'+url+'">'+qbName+'</a>'+qtype;
		_this.$title.html(titlehtml); //设置标题
		//htmlEditor.init(new Array('qbTitle'),qbId); //调用html编辑器
		//setsUploadImg.uploadImg('upload-horpic','#horPic','#tip1',qbId);
		if(qbOperator=='add'){
			//如果是添加
			$('#titleUpload').imgInput(imgUploadUrl);//初始化图片上传控件
			_this.bindResizeHeight($('#titleUpload'));
			if(qbType=='select' || qbType =="iq-select"){
				//选择题需要初始化选项的图片上传
				var charArr=['A','B','C','D','E'];
				var defaultHeight  = $('textarea[name="options"]').first().outerHeight();
				for(var i =0,len = charArr.length;i<len;i++){
					$('#optionUpload_'+charArr[i]).imgInput(imgUploadUrl);//初始化图片上传控件
					_this.bindResizeHeight($('#optionUpload_'+charArr[i]));
				}
			}
		}
	},
	/*绑定高度变化*/
	bindResizeHeight : function(obj){
		var isUploading = false;
		obj.on('uploadStart',function(){
			isUploading = true;
			$('#toSubmit').attr('disabled','disabled');
			$('#cancelSubmit').attr('disabled','disabled');
		});
		obj.on('uploadComplete uploadCancel',function(){
			$('[required]:first').trigger('change');
			$('#cancelSubmit').removeAttr('disabled');
		});
		var defaultHeight = obj.prev('textarea').outerHeight();
		obj.on('heightResize',function(){
			$(this).prev('textarea').height($(this).height());
			//去掉placeholder
			var placeholder = $(this).prev('textarea').attr('placeholder');
			var required = $(this).prev('textarea').attr('required');
			if($(this).data('placeholder')===undefined){
				$(this).data('placeholder',placeholder);
			}
			if(required!==undefined){
				$(this).data('required',required);
			}
			$(this).prev('textarea').attr('placeholder','').removeAttr('required');
			$(this).prev('label.placeholder').hide();
		});
		obj.on('defaultheight',function(){
			$(this).prev('textarea').height(defaultHeight);
			//加上placeholder
			$(this).prev('textarea').attr('placeholder',$(this).data('placeholder'));
			if($(this).data('required')!==undefined){
				$(this).prev('textarea').attr('required',$(this).data('required'));
			}
			$(this).prev('label.placeholder').show();
			//去掉hidden的值
			var id=$(this).attr('id');
			if($("#"+id+"Val").length>0){
				$("#"+id+"Val").val('');
			}
		});
	},
	/*初始化选择题数据*/
	initSelector: function($this){
		//1.加载难度
		$this.initLevel($this);
		//2.获取技能
		$this.getQbBaseSkills(qbId);
		$('[data-toggle="tooltip"]').tooltip({
			html: true,
			placement: 'top',
			template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div style="width:420px;max-width: 420px;text-align:left;white-space:normal" class="w tooltip-inner"></div></div>',
			title: '通常技能选择题内容以基础知识为主，考核效果立竿见影，考生并不用过多演算，故答题时长标准是来自众多考生的平均答题时长，并根据题干字数有所浮动。'
		});
	},
	/*初始化编程题数据*/
	initProgramer: function($this){
		//1.加载难度
		$this.initLevel($this);
		//2.加载语言
		$this.getConfig('PROGRAM_LANGUAGE', $this.getProlanguage);
	},
	/*初始化面试题*/
	initInterview : function($this){
		//1.初始化面试
		$this.rendInterviewGrop();
	},
	/*加载难度*/
	initLevel : function ($this){
		$this.getConfig('QB_DIFFICULTY', $this.getQBdifficulty);
	},
	/*校验*/
	validate: function(){
		
	},
	bindEvent : function(){
		var _this = this;
		_this.$questionForm.on('click','#toSubmit',function(){
			_this.$questionForm.submit();
			return false;
		});
		_this.$questionForm.on('click','#cancelSubmit',function(){
			window.location.href=_this.returnUrl;
			return false;
		});
		/*提交选择题*/
		_this.$questionForm.on('submit',function(e){
			e.preventDefault();
			var similar = 80;
			if($('.dropdown').hasClass('open')){
				_this.addSkill();
				return false;
			}
				var url =null;
				//true,表示检查时间
				if(!_this.groups){
					//非题组
					var formData = $(this).serializeToObj(); //序列化表单
					if(formData.html===true){
						similar=100;
					}
					_this.formArr[0]=formData;
				}else{
					_this.dealGroupData();
					_this.formArr = _this.groups;
				}
				if(qbOperator=='edit'){
					url = root+"/sets/qbBase/editQuestion/"+qbId+"/"+questionId+"/"+similar+"/true";
				}else{
					url = root+"/sets/qbBase/addQuestion/"+qbId+"/"+similar+"/true";
					
				}
				_this.submitQuestion(url,_this.formArr);
			    return false;
		});
		/*检查选项*/
/*		_this.$questionForm.on('blur change','textarea[name="options"]:not([required])',function(){
			var val = $(this).val();
			var option = $(this).parent().children('span').html();
			if(val){
				$('#correctoption_'+option).show();
			}else{
				$('#correctoption_'+option).hide();
			}
		});*/
		_this.$questionForm.on('blur keyup','[number]',function(){
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
		_this.$questionForm.on('blur keyup change','[required]',function(){
			var flag = true;
			if(!$(this).val()){
				flag =  false;
			}else{
				flag = _this.requireVarify();
			}
			//遍历看是不是都有值
			if(qbType=="interview"){
				if(flag){
					 var $kids = $('#interview_editor').children();
					 if(!$kids.length){
						 flag = false;
					 }
				}
			}
			if(flag){
				$('#toSubmit').removeAttr('disabled');
			}else{
				$('#toSubmit').attr('disabled','disabled');
			}
		});
	
		//下拉菜单
		_this.$questionForm.on('click','#dropdownMenu',function(){
			$('#skillsearch').val('');
			if(_this.skills){
				$("#currentskill").show();
				$("#noskillfilter").hide();
			}
		});
		
		_this.$questionForm.on('click','ul.selections>li',function(){
			var skill = $(this).attr('skillid');
			if(skill){
				$('#skill').text(skill);
				$('[name="skill"]').val(skill).change();
				$(this).closest('.dropdown').toggleClass('open');
			}
		});
		/*技能搜索添加*/
		_this.$questionForm.on('click','#addSkill',function(e){
			_this.addSkill();
			return false;
		});
		_this.$questionForm.on('click','#skillsearch',function(e){
			 e.preventDefault();
			 e.stopPropagation();
			$(this).closest('.dropdown').addClass('open');
		});
		_this.$questionForm.on('keyup','#skillsearch',function(e){
			e.preventDefault();
			e.stopPropagation();
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
				_this.addSkill();
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
		
		//checkbox
		
		_this.$questionForm.on('click','.correctOptions input[type="checkbox"]',function(e){
			$(this).parent().find('i.check').toggleClass("checked");
			//校验
			var flag = _this.requireVarify();
			//遍历看是不是都有值
			if(flag){
				$('#toSubmit').removeAttr('disabled');
			}else{
				$('#toSubmit').attr('disabled','disabled');
			}
		});
		//补充解释
		_this.$questionForm.on('click','#refExplain_checkbox',function(){
			$(this).toggleClass('active');
			$(this).children().toggleClass('glyphicon-unchecked','glyphicon-check');
			$(this).next('[name="refExplain"]').toggle();
			if($(this).hasClass('active')){
				_this.$questionForm.find('[name="explainReqired"]').val('是');
			}else{
				_this.$questionForm.find('[name="explainReqired"]').val('否');
			}
		});
		//面试题组hover
		_this.$questionForm.on('mouseenter','li.interview_topic',function(){
			$(this).find('button.remove').show();
		});
		_this.$questionForm.on('mouseleave','li.interview_topic',function(){
			$(this).find('button.remove').hide();
		});
		
		_this.$questionForm.on('blur','#addInterviewtitle,#suggestMinutes',function(){
			if(!_this.formValid){
				return;
			}
			if($('#suggestMinutes').val() && $('#addInterviewtitle').val()){
				$('#addInterview').removeAttr('disabled');
			}else{
				$('#addInterview').attr('disabled','disabled');
			}
		});
		//导入错误关闭按钮
		_this.$alertClose.on('click',function(){
			_this.$alertInfo.hide();
			return false;
		});
	},
	/*添加技能*/
	addSkill : function(){
		var value = $('#skillsearch').val();
		if(!value){
			return;
		}
		$('#skill').text(value);
		$('[name="skill"]').val(value).change();
		$('#addSkill').closest('.dropdown').toggleClass('open');
	},
	/*校验必填*/
	requireVarify : function(){
		var flag = true;
		var checked =false;
		var require = $('[required]');
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
	getQbBaseSkills : function(qbId){
		var _this = this;
		var url = convertURL(root+'/sets/qbBase/getQbBaseSkills/'+qbId);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result && result.code==0){
					if(result.data &&　result.data.length>0){
						//获取到全部技能
						_this.skills = result.data;
						/*var $tmpl = $.templates("#skillsTmpl");
						$tmpl.link("#currentskill",_this.skills);*/
						_this.renderTmpl($("#currentskill"),_this.$templates.skillsTmpl,_this.skills);
						$("#currentskill").toggleClass("currentskill");
					}
				}
			}
		});
	},
	/*获取配置信息
	 * QB_DIFFICULTY：难度
	 * PROGRAM_LANGUAGE：编程语言
	 * */
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
	getQBdifficulty : function($this,data){
		data.selectValue = questionObj.level;
		data.label="请选择难度";
		$this.renderTmpl($('select[qbdifficul]'),$this.$templates.configTmpl,data);
		$('[required]:first').trigger('change');
	},
	/*获取编程语言*/
	getProlanguage : function($this,data){
		data.selectValue = questionObj.mode;
		data.label="请选择编程语言";
		$this.renderTmpl($('select[proglanguage]'),$this.$templates.configTmpl,data);
		$('[required]:first').trigger('change');
	},
	/*渲染模板*/
	renderTmpl : function($wrap,$model,data){
		var htmlOutput = $model.render(data);  
		$wrap.html(htmlOutput); 
	},
	/*添加题组*/
	submitQuestionGrop : function(url,formData){
		_this.submitQuestion(url,formData);
	},
	/*处理题组*/
	dealGroupData : function(){
		var _this = this;
		if(_this.groups && _this.groups.length){
			for(var i=0,len=_this.groups.length;i<len;i++){
				if(_this.groups[i].html===true && _this.groups[i].titleImg){
					_this.groups[i].title=_this.groups[i].title+"<br/>"+_this.groups[i].titleImg;
					delete _this.groups[i].titleImg;
					delete _this.groups[i].titleImgId;
				}
			}
		}
	},
	/*添加题目*/
	submitQuestion : function(url,formArr){
		var _this = this;
		var success = false;
		var resultData =null;
		if(formArr.length==0){
			return false;
		}
		//题组处理
		if(_this.groups){
			question.group = $('[name="group"]').val();
			question.rows = formArr;
			//清理掉errorType,sheetType
			_this.groupDataclean(question.rows);
		}else{
			question.rows=formArr;
		}
		var msg="";
		//ajax校验
  		$.setsAjax({
  			type: "POST",
  			dataType: "json",
  			contentType : "application/json",
	  		url:url,
	  		data:JSON.stringify(question),
  		 	beforeSend: function(){
  		 	 $('[type=submit]').attr('disabled','disabled').html('提交题目中...');
  		    },
			success:function(result)
			{
				if(result.code==0 &&　result.data.errorCode==0 ){
					resultData = result.data;
					if(result.data.similarityErrors==0 && result.data.timeErrors==0 && result.data.formatErrors==0){
						//添加成功
						success =true;
					}else{
						//有业务异常
					}
				}else if(result.code==12){
					msg = "服务出现了异常";
				}
			},
			error : function(jqXHR,textStatus,errorThrown){
				msg = "服务出现了异常";
			},
			complete: function(jqXHR,textStatus){
	  		     $('[type=submit]').removeAttr('disabled').html('<span class="glyphicon glyphicon-plus white"></span> 添加');
	  		     if(success){
	  		    	//处理成功，跳转到题目管理页面
	  		    	 var type=getPageType();
	  		    	 var url = root+"/sets/page/questionlist/"+qbId+'/'+type+'/';
	  		    	//window.location.href= url; 
	  		    	 leavePage("保存成功！",'题目管理',0,url);
	  		    	
	  		     }else{
	  		    	if(resultData && resultData.groups){
	  		    		msg= "温馨提示："+resultData.groups[0].rows[0].cause;
					}else if(resultData && resultData.data.errorDesc){
						msg="温馨提示："+resultData.results[0].cause;
					}
	  		    	if(textStatus=='error' && jqXHR!==undefined){
	  		    		msg="错误提示："+jqXHR.statusText+";错误编码："+jqXHR.status+";"
	  		    	}
	  		    	if(msg){
	  		    		_this.$alertInfotext.html(msg);
	  		    		_this.$alertInfo.slideDown("slow");
	  		    	}
	  		     }
	  		 
			},
	  	});
	},
	/*获取题组*/
	getQuestionGrop : function(questionId,callBack){
		var _this = this;
		var url = convertURL(root+'/sets/qbBase/getGroup/'+questionId);
		$.setsAjax({
			type:'POST',
			url :url,
			success :function(result){
				if(result.code==0 && result.data && result.data.errorCode==0){
					//渲染面试题组
					questionObj =result.data.group;
					/*循环处理带图片的数据*/
//					if(questionObj.rows.length){
//						for(var i =0,len=questionObj.rows.length;i<len;i++ ){
//							questionObj.rows[i].title=html_decode(questionObj.rows[i].title);
//							if(questionObj.rows[i].html===true){
//								var titleImg = getImgHtml(questionObj.rows[i].title);
//								if(titleImg){
//									var index = i+1;
//									questionObj.rows[i].titleImg = titleImg;
//									questionObj.rows[i].titleImgId = "titleUpload_"+index;
//									questionObj.rows[i].title= questionObj.rows[i].title.replace(titleImg,'').replace('<br/>','');
//								}
//							}
//						}
//					}
					/*end循环处理带图片的数据*/
					
					_this.groups = questionObj.rows;
					//渲染
					_this.renderTmpl(_this.$questionForm,$("#interviewTmpl"),questionObj);
					//设置按钮
					$('#toSubmit').removeAttr('disabled').html('保存');
					$('#cancelSubmit').html('取消保存');
					if(callBack && typeof callBack=='function'){
						callBack(_this);
					}
					/*初始化图片控件*/
//					$('#titleUpload').imgInput(imgUploadUrl);
//					for(var i=0,len= _this.groups.length;i<len;i++){
//						if(_this.groups[i].titleImgId && _this.groups[i].titleImg){
//							$('#'+_this.groups[i].titleImgId).imgInput(imgUploadUrl,_this.groups[i].titleImg);
//						}
//						//绑定图片变更的事件
//						_this.$questionForm.on('changeImg','#'+_this.groups[i].titleImgId+'Val',function(event,id,data){
//							var index = id.replace('titleUpload_','').replace('Val','');
//							index-=1;
//							_this.groups[index].titleImg=data;
//						});
//					}
					/*end初始化图片控件*/
					if(_this.groups.length>=5){
						$("#addInterviewtitle,#suggestMinutes,#addInterview").attr('disabled','disabled');
						$("#addInterviewtitle").val("面试题至多只能添加5个");
						return false;
					}
				}else{
					$("#alertInfo-a").html("获取面试题组异常:"+result.data.errorDesc);
					$("#alertInfo").show();
				}
			}
		});
	},
	/*获取题目（详细）*/
	getQuestionDetail : function(questionId,callBack){
		var _this = this;
		var url = convertURL(root+'/sets/qbBase/getQuestion/'+questionId);
		$.setsAjax({
			type:'GET',
			url :url,
			success :function(result){
				if(result.code==0 && result.data && result.data.errorCode==0){
					questionObj =result.data.row;
					if(result.data.sheetType){
						var $tmpl = _this.switchSheetType(parseInt(result.data.sheetType));
						if($tmpl){
							//渲染
							//1.htmldecode题干和选项
							result.data.row.title = html_decode(result.data.row.title);
							_this.uploadImgObj = _this.uploadImgObj || {};
							if(result.data.row.html===true){
								var titleImg = getImgHtml(result.data.row.title);
								if(titleImg){
									_this.uploadImgObj.titleImg= titleImg;
									result.data.row.title = result.data.row.title.replace(titleImg,'').replace('<br/>','');
								}
							}
							if(result.data.row.options){
								_this.uploadImgObj.optionsImg= [];
								for(var i =0,len=result.data.row.options.length;i<len;i++){
									result.data.row.options[i] = html_decode(result.data.row.options[i]);
									if(result.data.row.html===true){
										var optionImg = getImgHtml(result.data.row.options[i]);
											_this.uploadImgObj.optionsImg.push(optionImg);
											result.data.row.options[i] = result.data.row.options[i].replace(optionImg,'').replace('<br/>','');
									}
								}
							}
							_this.renderTmpl(_this.$questionForm,$tmpl,result.data.row);
							//设置按钮
							$('#toSubmit').removeAttr('disabled').html('保存');
							$('#cancelSubmit').html('取消保存');
							if(callBack && typeof callBack=='function'){
								callBack(_this);
							}
							//初始化上传图片
							initUploadImg(_this,_this.uploadImgObj);
						}
						
					}
					
				}else{
					$("#alertInfo-a").html("获取题目异常:"+result.data.errorDesc);
					$("#alertInfo").show();
				}
			}
		});
	},
	/*渲染面试题组*/
	rendInterviewGrop : function(){
		var _this=this;
		var tmpl ="#interviewOpsTmpl";
		if( _this.groups){
			tmpl = "#editinterviewOpsTmpl";
		}else{
			_this.groups =[];
		}
		var $tmpl = $.templates(tmpl);
		$tmpl.link("#interview_editor",_this.groups);
		$("#addInterview").on('click',function(){
			var formData = _this.$questionForm.serializeToObj(); //序列化表单
			/*带图片的编辑需要特殊处理*/
				if(qbOperator=='edit'){
					if(formData.html===true){
						var titleImg = getImgHtml(formData.title);
						if(titleImg){
							var index = _this.groups.length+1;
							formData.titleImg = titleImg;
							formData.titleImgId = "titleUpload_"+index;
							formData.title= formData.title.replace(titleImg,'').replace('<br/>','');
						}
					}
				}
			/*end 带图片的编辑需要特殊处理*/
			$.observable(_this.groups).insert(formData);
			
			/*带图片的编辑需要特殊处理,生成图片控件*/
			if(qbOperator=='edit' && formData.titleImgId && formData.titleImg){
				$('#'+ formData.titleImgId).imgInput(imgUploadUrl,formData.titleImg);
				//绑定图片变更的时间
				_this.$questionForm.on('changeImg','#'+formData.titleImgId+'Val',function(event,id,data){
					var index = id.replace('titleUpload_','').replace('Val','');
					index-=1;
					_this.groups[index].titleImg=data;
				});
			}
		/*end 带图片的编辑需要特殊处理*/
			if(_this.groups.length>=5){
				$("textarea,[name='suggestMinutes'],#addInterview").attr('disabled','disabled');
				$("[name='title']").val("面试题至多只能添加5个");
				return false;
			}else{
				$('#addInterviewtitle').val('');
				$('#suggestMinutes').val('');
			}
			if(_this.groups.length && $("[name='group']").val()){
				$('#toSubmit').removeAttr('disabled');
			}else{
				$(this).attr('disabled','disabled');
			}
			return false;
		});
		
		$("#interview_editor").on('click','.remove',function(){
				if(_this.groups.length==5){
					$("textarea,[name='suggestMinutes'],#addInterview").removeAttr('disabled');
					$("[name='title']").val("");
				}
			
			var index = $.view(this).index;
		    $.observable(_this.groups).remove(index);
		    if(_this.groups.length){
		    	$('#toSubmit').removeAttr('disabled');
		    }else{
				$('#toSubmit').attr('disabled','disabled');
			}
			return false;
		});
	},
	/*转换sheet-type*/
	switchSheetType : function(sheetType){
		var _this = this;
		switch(sheetType){
		case 3: //选择题
			return _this.$templates.selectTmpl;
			break;
		case 4: //编程题
			return _this.$templates.programTmpl;
			break;
		case 5: //技能类（问答题
			return _this.$templates.askTmpl;
			break;
		case 6: //智力类（选择题
			return _this.$templates.iqTmpl;
			break;
		case 7: //智力类（问答题）
			return _this.$templates.askTmpl;
			break;
		case 8: //面试题
			return _this.$templates.interviewTmpl;
			break;
		default:
			return null;
		}
	},
	/*反转sheetType*/
	reverSheetType : function(type){
		var _this = this;
		var obj ={};
		switch(type){
			case 'select':
				question.sheetType=3;
				questionObj.type ="单选题";
				obj.qtype='选择题';
				obj.$tmpl=_this.$templates.selectTmpl;
				obj.callBack = _this.initSelector;
				return obj;
				break;
			case 'program':
				question.sheetType=4;
				obj.qtype='编程题';
				obj.$tmpl=_this.$templates.programTmpl;
				obj.callBack = _this.initProgramer;
				return obj;
				break;
			case 'ask':
				question.sheetType=5;
				obj.qtype='问答题';
				obj.$tmpl=_this.$templates.askTmpl;
				obj.callBack = _this.initLevel;
				return obj;
				break;
			case 'iq-select':
				questionObj.explainReqired="是";
				questionObj.type ="单选题";
				question.sheetType=6;
				obj.qtype='选择题';
				obj.$tmpl=_this.$templates.iqTmpl;
				obj.callBack = _this.initLevel;
				return obj;
				break;
			case 'iq-ask':
				question.sheetType=7;
				obj.qtype='问答题';
				obj.$tmpl=_this.$templates.askTmpl;
				obj.callBack = _this.initLevel;
				return obj;
				break;
			case 'interview':
				question.sheetType=8;
				obj.qtype='面试题组';
				obj.$tmpl=_this.$templates.interviewTmpl;
				obj.callBack = _this.initInterview;
				return obj;
				break;
		}
	},
	/*面试题组数据处理*/
	groupDataclean : function(rows){
		for (var i=0;i<rows.length;i++){
				delete rows[i].sheetType;
				delete rows[i].errorType;
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
function getPageType(){
	var type="skill";
 	 if(qbType=='iq-select' || qbType=='iq-ask' ){
 		type ="iq";
 	 }else if(qbType=="interview"){
 		type ="interview";
 	 }
 	 return type;
}
function leavePage(msg,pageName,countDown,url){
	 var intervalId = null;
	 var html = msg;
	 if(countDown>0){
		 msg+='<br/><span id="countdown" class="trigger">'+countDown+'</span>'+'秒后会自动返回到'+pageName+'页面，或者点击<a class="trigger text-highlight">返回</a>';
	 }
   	 RenderUtils.modalWaiting.show(html).hideSpin().oneEvent(function() {
   		window.location.href= url; 
	 });;
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
/**
 * 转义html
 * @param html
 * @returns
 */
function html_encode(html){
	return html? $.views.converters.html(html) :"";
}
function html_decode(str)   
{   
//	var converter = document.createElement("DIV");
//	converter.innerHTML = str;
//	var output = converter.innerText;
//	converter = null;
//	return output;
  var s = "";   
  if (!str){
	  return "";   
  }
  s = str.replace(/&gt;/g, "&");   
  s = s.replace(/&lt;/g, "<");   
  s = s.replace(/&gt;/g, ">");   
  s = s.replace(/&nbsp;/g, " ");   
  s = s.replace(/&#39;/g, "\'");   
  s = s.replace(/&quot;/g, "\"");   
  s = s.replace(/<br>/g, "\n");   
  return s;   
}
function getImgHtml(str){
	if(str){
		var index = str.lastIndexOf('<img');
		if(index==-1){
			return "";
		}
		return str.slice(index);
	}else{
		return;
	}
}
function initUploadImg(_this,options){
	_this.bindResizeHeight($('#titleUpload'));
	if(options && options.titleImg){
		$('#titleUpload').imgInput(imgUploadUrl,options.titleImg);//初始化图片上传控件
	}else{
		$('#titleUpload').imgInput(imgUploadUrl);
	}
	if(qbType=='select' || qbType =="iq-select"){
		//选择题需要初始化选项的图片上传
			var charArr=['A','B','C','D','E'];
			for(var i =0,len = charArr.length;i<len;i++){
				_this.bindResizeHeight($('#optionUpload_'+charArr[i]));
				if(options && options.optionsImg && options.optionsImg.length>0){
					if(options.optionsImg[i] && options.optionsImg[i].lastIndexOf('<img')!=-1){
						$('#optionUpload_'+charArr[i]).imgInput(imgUploadUrl,options.optionsImg[i]);//初始化图片上传控件
					}else{
						$('#optionUpload_'+charArr[i]).imgInput(imgUploadUrl);//初始化图片上传控件
					}
				}else{
					$('#optionUpload_'+charArr[i]).imgInput(imgUploadUrl);//初始化图片上传控件
				}
			}
	}
}