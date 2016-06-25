<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!-- 修改密码 -->
   		<div id="modPassalertInfo" class="alert alert-warning hidden">
<!-- 	 	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> -->
 		 <a id="modPassalertInfo-a" href="#" class="alert-link"></a>
		</div>
        <form class="form-horizontal" role="form" id="modPassForm">
        <div class="h20"></div>
         <div class="form-group">
         <label  class="col-sm-2 control-label"></label>
         	<div class="col-sm-10" ><span class="red" id="passwordOldAsterisk"></span></div>
         </div>
        <div class="form-group">
        	<label for="oldPassword" class="col-sm-2 control-label">旧密码</label>
    		<div class="col-sm-10">
     		 <input type="password"  class="form-control w395" style="display:inline-block" id="passwordOld"  name="passwordOld" placeholder="旧密码" required data-validation-required-message="请输入旧密码">
    		 <span class="red" style="margin:0px;color:red">*</span>
    		</div>
        </div>
         <div class="form-group">
         <label class="col-sm-2 control-label"></label>
         	<div class="col-sm-10" ><span class="red" id="passwordNewAsterisk"></span></div>
         </div>
         <div class="form-group">
        	<label for="newPassword" class="col-sm-2 control-label">新密码</label>
    		<div class="col-sm-10">
     		 <input type="password" class="form-control w395 inlineblock" style="display:inline-block" id="passwordNew" name="passwordNew" placeholder="新密码" required data-validation-required-message="请输入新密码">
    		 <span class="red" style="margin:0px;color:red">*</span>
    		</div>
    	  </div>
    	  <div class="hidden" id="passcomplexify">
    		<label  class="col-sm-2 control-label"></label>
    		<div class="col-sm-10" style="padding-left:5px">
    		<div id="progressbar" style="display:inline-block"><div id="progress" class="progressbarInvalid" ></div></div>&nbsp;<span id="complexityLabel"></span>
    		</div>
         </div>
           <div class="form-group">
         <label class="col-sm-2 control-label"></label>
         	<div class="col-sm-10" ><span class="red" id="passwordNew2Asterisk"></span></div>
         </div>
         <div class="form-group">
        	<label for="passwordNew2" class="col-sm-2 control-label">确认密码</label>
    		<div class="col-sm-10">
     		 <input type="password" class="form-control w395" style="display:inline-block" id="passwordNew2" name="passwordNew2" placeholder="确认密码" required data-validation-required-message="请输入确认密码">
    		 <span class="red" style="margin:0px;color:red">*</span>
    		</div>
        </div>
        
        <div class="w395 mt30" style="padding-left:130px;padding-right:auto">
        <button type="submit" id="login" class="btn btn-lg btn-info btn-block" href="javascript:;">提交</button>
        </div>
      </form>
<!--end 修改密码 -->
<script>
	(function($){
		  $.placeholder.shim();//初始化placeholders
		$(function(){
			$LAB
			.script(root+"/plugin/jquery.complexify.banlist.js",root+"/plugin/jquery.complexify.js")
			.wait(function(){
				$("#passwordNew").complexify({minimumChars:4,miniStrength:8}, function (valid, complexity) {
					$("#complexityLabel").empty();
					var compledata = Math.round(complexity);
					if(compledata==0){
						compledata=1;
					}
					if(!valid && compledata<=34){
						compledata=compledata>34?34:compledata;
					}else{
						compledata=compledata<=34?35:compledata;
					}
					if(compledata<=34){
						 $('#progress').css({'width':compledata + '%'}).removeClass().addClass('progressbarWeek');
						 $("#complexityLabel").html("弱").css("color","red");
					}else if(34<compledata && compledata<66){
						 $('#progress').css({'width':compledata + '%'}).removeClass().addClass('progressbarMid');
						 $("#complexityLabel").html("中").css("color","yellow");
					}else if(compledata>66){
						 $('#progress').css({'width':compledata + '%'}).removeClass().addClass('progressbarStrong');
						 $("#complexityLabel").html("强").css("color","green");
					}
		        });
			})
			.script(root+"/core/js/setsValidation.js")
			.wait(function(){
				 $("#modPassForm").setsValidation();
			})
			.wait(function(){
				 $("#modPassForm").submit(function(e){
					  if(!$(this).setsValidation('submitValidate')){
						return false;
					 } 
					  if(!infoValid()){
							return false;
						}
						$(this).attr("disabled","disabled");
						 $('input[type=submit]', this).attr('disabled', 'disabled');
						 var newPass = $("#passwordNew").val();
						var paramobj ={};
						paramobj.passwordNew=$.md5(newPass);
						paramobj.passwordOld=$.md5($("#passwordOld").val());
						var jsonstr = JSON.stringify(paramobj);
						if(jsonstr){
							toModPassWord(jsonstr);
						}
						$(this).removeAttr("disabled");
						 $('input[type=submit]', this).removeAttr('disabled');
						return false;
				 });
			});
			
			$("#passwordNew").on("keypress",function(e){
				var e = e || window.event; 
				if(e.keyCode != 13){ 
					if($("#passcomplexify").hasClass("hidden")){
						$("#passcomplexify").removeClass("hidden");
					}
				}
			});
			
		
		
		});
		function infoValid(){
			var flag=true;
			var validObjArr = [];
			var oldPass = $("#passwordOld");
			validObjArr.push(oldPass);
			var newPass = $("#passwordNew");
			validObjArr.push(newPass);
			var newPass2 = $("#passwordNew2");
			validObjArr.push(newPass2);
			if (newPass.val()==oldPass.val()){
				$("#passwordNew").setsValidationErr("新密码与旧密码一致！");
				flag = false;
			}
			if(newPass2.val()!=newPass.val()){
				$("#passwordNew2").setsValidationErr("确认密码与新密码不一致！");
				flag = false;
			}
			return flag;
		}
	 	function toModPassWord(formData){
	 		$.ajax({
	 	         type: "POST",
	 	         url:root+"/sets/login/reset",
	 	         data:{"param":formData},// 要提交的表单 
	 	         success: function(result) {
	 	        	 if(result && result.code==0){
	 	        		 if(result.data.code=="SUCCESS"){
	 	        			$("#modPassalertInfo-a").html("修改密码成功!");
	 	        			$("#modPassalertInfo").removeClass("hidden");
	 	        			setTimeout(function(){
	 	        				$("#headModal").modal("hide");
	 	        			},1000);
	 	        		 }else if (result.data.code=="PASSWORDERROR"){
	 	        			$("#passwordOld").setsValidationErr("旧密码输入错误!");
	 	        			//$("#modPassalertInfo").removeClass("hidden");
	 	        			return false;
	 	        		 }
	 	        	 }else{
	 	        		$("#modPassalertInfo-a").html("服务异常，请联系管理员!");
						$("#modPassalertInfo").removeClass("hidden");
						return false;
	 	        	 }
	 	         },
	 	        error : function(){
					$("#modPassalertInfo-a").html("服务异常，请联系管理员!");
					$("#modPassalertInfo").removeClass("hidden");
				}
	 	     });
	 	}
	})(jQuery);
</script>