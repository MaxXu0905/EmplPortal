<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
  <div class="col-md-12 bg-writer" >
  <div class="tac">
	<div id="alertInfo" class="alert alert-warning hidden">
	<!--  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> -->
 	 <span id="alertInfo-a" href="#" class="alert-link"></span>
	</div>
      <form id="freeTestForm" class="form-horizontal" role="form" novalidate>
        <div class="form-group">
        <label for="userName" class="col-sm-2 control-label">姓名</label>
        	<div class="controls">
	        <input class="form-control h45 w395 logina" style="display:inline-block" id="userName" name="userName"  type="text"  placeholder="请输入您的姓名" required  data-validation-required-message="请输入您的姓名">
	        <span class="red" style="margin:0px;color:red">*</span>
	         <p class="help-block h25" style="padding-left:25%;margin:0px;height:27px"></p>
      		</div>
       </div>
        <div class="form-group">
           <label for="userEmail" class="col-sm-2 control-label">公司邮箱</label>
        	<div class="controls">
		        <input class="form-control h45 w395 loginc input-xlarge focused" style="display:inline-block" id="userEmail" name="userEmail"  type="email"  placeholder="请输入您的公司邮箱"   data-validation-email-message="请输入正确的email地址，例如：test@101test.com" required data-validation-required-message="请输入您的公司邮箱">
		        <span class="red" style="margin:0px;color:red">*</span>
		        <p class="help-block h25" style="padding-left:25%;margin:0px;height:27px"></p>
        	</div>
        </div>
      <!--    <div class="form-group">
         <label for="company" class="col-sm-2 control-label">公司</label>
         	<div class="controls">
	        <input class="form-control h45 w395 logine input-xlarge focused" style="display:inline-block" id="company" name="company"  type="text"  placeholder="请输入您的公司名称" required data-validation-required-message="请输入您的公司名称">
	        <span class="red" style="margin:0px;color:red">*</span>
	        <p class="help-block h25" style="padding-left:25%;margin:0px;height:27px"></p>
	        </div>
	     </div> -->
        <div class="h50 form-group" style="margin-top:45px" >
         <input type="submit" class="btn btn-lg btn-info  w400  white" style="margin-right:9px" value="去免费试用"></input>
        </div>
      </form>
      <div id="activeEmail" class="hidden" tyle="margin-top:45px">
      		<p class="tar">
        <a href="#"  class="forgot-password-link" id="reCheck">
				没有收到邮件？重新检查邮箱								
		</a></p>
      	  <a id="activeEmail-a" class="btn btn-lg btn-info h50  w400  white" style="margin-right:9px" href="#" target="_blank">去邮箱激活</a>
      </div>
  </div>
    <div class="mt50"></div>
  </div>
    

<script type="text/javascript">
  (function($){
	  var formDataArr=null;
   $(document).ready(function() {
	    $.placeholder.shim();//初始化placeholder
	    bindEvent();
	     $LAB
		.script(root+"/core/js/setsValidation.js")
		.wait(function(){
			 $("#freeTestForm").setsValidation();
		})
		.wait(function(){
			 $("#freeTestForm").submit(function(e){
				  if(!$(this).setsValidation('submitValidate')){
					return false;
				 } 
				
				 formDataArr = $("#freeTestForm").serializeArray();
				 var formData = $("#freeTestForm").serializeToObject(); //序列化表单
				 toSubmit(formData);
				 /*记录登陆信息*/
				 //operType=2:免费试用
				 var userAccunt = formData.userEmail;
				  recordloginInfo.postRecode(2,userAccunt);
				 return false;
			 });
		}); 
   });
    function bindEvent(){
       $("#activeEmail-a").on("click",function(){
    	   $("#freeModal").modal("hide");
       });
     //检查邮箱
		$("#reCheck").on("click",function(){
			reCheckEmail();
			return false;
		});
		 
   		}
    
  //复查邮箱
	function reCheckEmail(){
		$("#activeEmail").addClass("hidden");
		//恢复数据
		if(formDataArr){
			for(var i in formDataArr){
				$("#"+formDataArr[i].name).val(formDataArr[i].value);
			}
		}
		$("#freeTestForm").removeClass("hidden").show();
		$("#alertInfo").addClass("hidden");
	}


	function toSubmit(formData){
	  	//ajax校验
	  		if(formData){
	  		$.setsAjax({
	  			type:"POST",
	  			dataType:'json',
	  			contentType:"application/json",
		  		url:root+"/sets/trial/registExmpoler",
		  		data:JSON.stringify(formData),
	  		 	beforeSend: function(){
	  		 	 $('input[type=submit]').attr('disabled', 'disabled');
	  		    },
	  		    complete: function(){
	  		     $('input[type=submit]').removeAttr('disabled');
	  		    },
				success:function(msg)
				{
					if(msg.code=="0"){
						if(msg.data.code=="SUCCESS"){
							$("#alertInfo-a").html("已发送一封激活邮件到您的邮箱");
							$("#alertInfo").removeClass("hidden");
							$("#freeTestForm").hide();
							$("#activeEmail").removeClass("hidden");
							var mailsuffix=$("#userEmail").val().split("@")[1];
							$("#activeEmail-a").attr("href","http://mail."+mailsuffix);
						}else{
							 if(msg.data.code=="EMAILNOTSUPPORT"){
								$("#userEmail").setsValidationErr("请输入公司内部邮箱，QQ、网易、新浪等公共邮箱目前不能开通招聘服务");
								return false;
							 }
							 if(msg.data.code=="ACCTREGISTERED"){
									$("#userEmail").setsValidationErr("当前邮箱已注册");
									return false;
							 }
							 if(msg.data.code=="SENDMAILERROR"){
									$("#userEmail").setsValidationErr(msg.data.message);
									return false;
							 }
						}
					}else{
						$("#alertInfo-a").html("服务异常，请联系管理员!");
						$("#alertInfo").removeClass("hidden");
					}
				},
				error : function(){
					$("#alertInfo-a").html("服务异常，请联系管理员!");
					$("#alertInfo").removeClass("hidden");
				}
		  	});
	  	}else{
	  		$("#alertInfo-a").html("服务异常，请联系管理员!");
			$("#alertInfo").removeClass("hidden");
	  	}
	}
  })(jQuery);
  </script>
