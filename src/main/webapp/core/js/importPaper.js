/**
 * 导入试卷
 * zengjie
 * 2014/7/20
 */
$(function(){
	var importPaper = new ImportPaper();
	importPaper.init();
});
/*构造函数*/
function ImportPaper(){
	this.xzTmpl = "http://101testneeds.oss-cn-beijing.aliyuncs.com/template_xls/%E8%AF%95%E5%8D%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88%20-%20%E6%A0%A1%E6%8B%9B.xls";//校招模板
	this.szTmpl = "http://101testneeds.oss-cn-beijing.aliyuncs.com/template_xls/%E8%AF%95%E5%8D%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xls";//社招模板
	this.$multiImport=$('#multi_import'); //导入file
	this.$importErrClose = $('#importErrClose');
	this.$importErr = $('#importErr ');
	this.$goverify = $('#goverify');
	this.$paperVerify = $('#paperVerify');
	this.$paperName= $('#paperName');
	this.$filetmpl = $("#filetmpl");
	this.$alertModal = $("#alertModal");
	this.$confirmbtn = $('#confirmbtn');
}
ImportPaper.prototype={
		/*初始化*/
		init : function(){
			var _this = this;
			_this.$paperName.val(paperName);
			//更新模板
			if(testType==2){
				//校招，默认社招
				_this.$filetmpl.prop('href',_this.xzTmpl);
			}
			//1.初始化导入按钮
			_this.initImportBtn();
			//2.绑定事件
			_this.bindEvent();
			//3.工具辅助类
			RenderUtils.init();
		},
		/*绑定事件*/
		bindEvent : function(){
			var _this = this;
			//监听试卷名称
			_this.$paperName.on('keyup',function(e){
				var code = e.keyCode;
				var val = $(this).val();
				if(!val){
					$('#multi_import-button').addClass('btn').attr('disabled','disabled');
					$('object.swfupload').css('z-index','-1');
				}else{
					$('#multi_import-button').removeClass('btn').removeAttr('disabled');
					$('object.swfupload').css('z-index','1');
				}
			});
			//加载错误校验
			 _this.$goverify.load(function(){
				 var $this = $(this);
				 $this.height(0); //用于每次刷新时控制IFRAME高度初始化 
					setTimeout(function(){
						 var width =$("div.step").outerWidth(); 
						 var height =$this.contents().outerHeight() + 10; 
						 $this.width(width );
						 $this.height( height < 900 ? 900 : height );
					},1000);
				      
			}); 
				_this.$confirmbtn.on('click',function(){
					var serialNo = $(this).data('serialNo');
					goverify.window.cancelImport(serialNo);
					$('#confirmModal').modal('hide');
				})
		},
		/*初始化导入按钮*/
		initImportBtn : function(){
			var _this = this;
			_this.importPaper(_this.$multiImport);//导入
		},
		/*导入校验*/
		importVerify : function(data){
			var _this = this;
			_this.$paperVerify.show();
			_this.$goverify.prop('src',root+"/sets/page/importQuesVerify/"+data.qbId+"/"+data.qbCategory+'/');
		},
		/*导入试卷*/
		importPaper : function($multiImport){
			var _this = this;
			var importExcelResult = false,error=null,qbId=null;
			$multiImport
			.uploadify({
				'height' : 34,
				'width' : 72,
				'multi' : false,
				'swf' : root + '/plugin/uploadify/uploadify.swf',
				'cancelImg' : root + '/plugin/uploadify/uploadify-cancel.png',
				'uploader' : root + '/sets/qbBase/importPaper/'+encodeURIComponent(encodeURIComponent(paperName))+'/'+testType+';jsessionid=' + JESEESION_ID,
				'buttonText' : '<i class="fa fa-reply"></i> 导入',
				'auto' : true,
				'fileDesc' : '请选择Excel文件',
				'fileTypeExts' : '*.xls; *.xlsx',
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
								qbId = data.data.qbId;
								var errorObj={'file':file,'data':data.data,'qbId':qbId,'qbCategory':'paper'};
								_this.importVerify(errorObj);
							}else{
								qbId = data.data.qbId;
								//导入成功后创建试卷
								_this.createPaper(qbId);
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
						}
					}
				}
			});
		},
		/*创建试卷*/
		createPaper : function(qbId){
			createPaper(qbId);
		}
}

function createPaper(qbId){
	var url = "";
	var data = {
		    "paperName": paperName,
		    "seriesId": seriesId,
		    "level": level
		    }
	if(testType==1){
		//社招
		url = root+"/sets/paper/createPaperByQbId/"+qbId;
	}else if(testType==2){
	  //校招
		url = root+"/sets/paper/createCampusPaperByQbId/"+qbId;
	}
	$.setsAjax({
			type: "POST",
			dataType: "json",
			contentType : "application/json",
  		url:url,
  		data:JSON.stringify(data),
		success:function(result)
		{
			if(result.code==0 &&　result.data.code=='SUCCESS' ){
				var paperId = result.data.paperId;
				leavePage(paperId);
			}
		}
	
  	});
}
function leavePage(paperId){
	RenderUtils.modalWaiting.show('<i class="fa fa-smile-o"></i> 创建试卷成功');
	if(window.opener){
		if(window.opener.PAPERCHOSER){
			window.opener.PAPERCHOSER.getPapers(paperId);
		}
		setTimeout(function(){
			if(window.opener){
				window.close();
			}
		}, 2000);
	}
}
/*
 * 弹出确认框 msg:消息
 */
function confirmBox(msg,serialNo){
	// 启动模态框
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