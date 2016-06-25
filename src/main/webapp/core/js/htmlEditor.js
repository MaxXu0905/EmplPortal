/**
 * html编辑器，基于Editor
 * zengjie
 * 2014/8/26
 */
var htmlEditor = (function(my,$){
	var setting = {
			toolbar :  //工具栏
		        [
		         ['Image','Table']
		        ]
	    };
	//初始化
	my.init = function(editWrapArr,qbId){
		if($.isArray(editWrapArr)){
			for(var i=0,length=editWrapArr.length;i<length;i++){
				if(qbId){
					setting.filebrowserUploadUrl = "http://localhost:8080/InterviewPortal/uploadQuestionlibImg/"+qbId;
					setting.filebrowserImageUploadUrl =  "http://localhost:8080/InterviewPortal/uploadQuestionlibImg/"+qbId;
				}
				//CKEDITOR.inline( editWrapArr[i],setting);
				 CKEDITOR.replace(editWrapArr[i],setting);
			}
		}
		
	}
	//处理CKEDITOR的值
	my.ckUpdate = function(){
		for (var instance in CKEDITOR.instances){
			CKEDITOR.instances[instance].updateElement();
		}
	}
	//清空所有ckeditor
	my.ckClear = function(){
		for (instance in CKEDITOR.instances){
			CKEDITOR.instances[instance].setData("");
		}
	}
	return my;
}(htmlEditor || {}, jQuery ));