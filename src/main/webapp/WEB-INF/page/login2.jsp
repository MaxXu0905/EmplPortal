<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<link href="${pageContext.request.contextPath }/core/css/base.css" rel="stylesheet" type="text/css" />
  <div class="col-md-12 bg-writer pl50">
  <div style="width:450px">
    <div class="container col-md-12">
	<div id="alertInfo" class="alert alert-warning hidden">
	 <!-- <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> -->
 	 <a id="alertInfo-a" href="#" class="alert-link"></a>
	</div>
      <form class="form-signin" role="form" id="loginForm">
        <div class="col-md-12">
        <div class="w200 h45 lh45 ml5" style="float: left;margin-top: -2px"><p><font class="red" id="userError" size="3px"></font></p></div>
        </div>
        <div class="col-md-12">
        <div class="w400" >
        <input type="text" class="form-control h45 w395 logina" id="user" name="user" placeholder="请输入您的公司邮箱"  required data-validation-required-message="请输入正确的公司邮箱">
        </div>
        </div>
        <div class="col-md-12">
        <div class="w200 h45 lh45 ml5" style="float: left;margin-top: -2px"><p><font class="red" id="passwordError" size="3px"></font></p></div>
        </div>
        <div class="col-md-12">
        <div class="w400">
        <input type="password" class="form-control h45 w395 loginb" id="password" name="password" placeholder="请输入密码"  required data-validation-required-message="请输入密码">
        </div>
        </div>
        <div class="col-md-12">
        <div class="w200 h45 lh45 ml5" style="float: left;margin-top: -2px"><p><font class="red" id="securityCodeError" size="3px"></font></p></div>
        </div>
        <div class="col-md-12 hidden" id="securityCodeDiv">
        <div class="w110" >
        <input type="text" class="form-control h45" id="securityCode" placeholder="请输入验证码" required data-validation-required-message="请输入验证码">
        </div>
        <div class="w100 ml20 h45 mt5" style="float: left;margin-left: 130px;margin-top: -40px"><img id="validateCode" title="点击更换" >
        </div>
        </div>
        <div class="col-md-12">
        <div class="mt20">
	        <label class="pull-left">
	          <input  type="checkbox" value="remember-me" id="rememberMe"> <span >记住我</span>
	       </label>
       		<a href="<%=request.getContextPath()%>/sets/login/forgotPassword"  class="pull-right forgot-password-link" target="_blank">
				忘记密码？									
			</a>
        </div>
        </div>
        <div class="col-md-12">
        <div class="w400 mt20" style="padding-bottom:15px;">
        <input type="submit" id="login" class="btn btn-lg btn-info btn-block w395" href="javascript:;" value="登录"/>
        </div>
        </div>
      </form>
    </div>
  </div>
  </div>
 
  <script type="text/javascript">
	(function($){
		//请求次数
		var requestTime = 0;
	  $(function(){
		  $.placeholder.shim();//初始化placeholder
			 //$('input, textarea').placeholder();
			 isNeedValidateCode(); //判断是否需要验证码
			  bindEvent();
			     $LAB
					.script(root+"/core/js/setsValidation.js")
					.wait(function(){
						 $("#loginForm").setsValidation();
					})
					.wait(function(){
						 $("#loginForm").submit(function(e){
							  if(!$(this).setsValidation('submitValidate')){
								return false;
							 } 
							 
							 checkLogin();
							
							   return false;
						 });
					});
	 });
	  function stopDefault(e){
	      if(e && e.preventDefault){
	          e.preventDefault();
	      }else{
	          window.event.returnValue = false;
	      }
	  }
	  function bindEvent(){
		  
		  $("#validateCode").on("click",function(){
			  var imgsrc = root+"/sets/login/validateCode?" + Math.random();
			  $(this).attr("src",imgsrc);
		  });
			
	  }
	
 
  	function checkLogin(){
  		var defaultUrl =root+"/sets/page/home.html";
  	  var loginWindow = $("#headModal").data("loginWindow");
  	  if(loginWindow && loginWindow.action){
  		  if(loginWindow.action==1){
  			  
  			defaultUrl="";
  		  }else if(loginWindow.action==2){
  			  window.location.reload();
  		  }else if(loginWindow.action==3 && loginWindow.actionUrl){
  			  defaultUrl=loginWindow.actionUrl;
  		  }
  	  }else{
  		  if(requestUrl){
  			  defaultUrl = requestUrl;
  		  }
  	  }
    		toSubmit(defaultUrl);
    		
  	}
  	function validate(){
  		var flag=true;
  		var formObj ={};
  		var user = $("#user");
  		formObj.user=user;
  		var password = $("#password");
  		formObj.password=password;
  		var securityCode = $("#securityCode");
  		formObj.securityCode=securityCode;
  		for (var i in formObj){
  			var id = formObj[i].attr("id");
			  var text = formObj[i].attr("placeholder");
			  var value = formObj[i].val();
			  if(!value ){
				  $("#"+id+"Error").html(text);
				  flag=false;
			  }else{
				  $("#"+id+"Error").empty();
			  }
  		}
  		return flag;
  	}
	function toSubmit(url){
		 $('#login').attr('disabled', 'disabled').val("正在登录...");
  		var formData ={};
		var user = $.trim($("#user").val());
		formData.username = user;
		var password = $.md5($("#password").val());
		formData.password = password;
	   	var securityCode = $("#securityCode").val();
	   	if(securityCode){
	   		formData.certifycode = securityCode;
	   	}
  		 if($("#rememberMe").prop("checked")){
			  store.clear();
			  store.set('username', $("#user").val());
			  store.set('userpass',  $.md5($("#password").val()));
		  }
	  	//ajax校验
	  		$.ajax({
	  	  		url:root+"/sets/login/certify",
	  	  		type:"POST",
	  	  	    dataType:"json",
	  	  	    contentType: 'application/json',
	  	  		data:JSON.stringify(formData),
	  			success:function(msg)
	  			{
	  				$('#login').removeAttr('disabled').val("登录");
	  				if(msg.code=="0"){
	  					if(msg.data.needCode==1){
	  						generateValidate();
	  					}
	  					if(msg.data.code=="SUCCESS"){
	  						 /*记录登陆信息*/
	  						 //operType=4:登陆
	  						 if(recordloginInfo){
	  							 try{
		  							 recordloginInfo.postRecode(4,user);
		  						 }catch(e){
		  							 throw e.message;
		  						 }
	  						 }
	  						
	  						if(msg.data.employer.ticket){
	  							 store.set('ticket',msg.data.employer.ticket);
	  						}
	  						if(url){
	  							window.location.href=url;
	  						}else{
	  							$("#headModal").modal("hide");
	  						}
	  						
	  					}else{
		  					if(msg.data.code=="PASSWORDERROR"){
		  						$("#securityCode").val("");
		  						$("#password").setsValidationErr("您输入的密码有误");
		  						$("#validateCode").attr("src",root+"/sets/login/validateCode?" + Math.random());
		  					}else if(msg.data.code=="ACCTNOTEXIST"){
		  						$("#securityCode").val("");
		  						$("#user").setsValidationErr("您输入的邮箱不存在");
		  						$("#validateCode").attr("src",root+"/sets/login/validateCode?" + Math.random());
		  					}else if(msg.data.code=="OUTDATE"){
		  						$("#securityCode").val("");
		  						$("#user").setsValidationErr("您输入的邮箱账户已过期");
		  						$("#validateCode").attr("src",root+"/sets/login/validateCode?" + Math.random());
		  					}else if(msg.data.code=="CERTIFYCODEERR"){
		  						$("#securityCode").val("");
		  						$("#securityCode").setsValidationErr("您输入的验证码错误");
		  						$("#validateCode").attr("src",root+"/sets/login/validateCode?" + Math.random());
		  						};
		  					
		  				};
	  				}else{
	  					$("#alertInfo-a").html("服务异常，请联系管理员!");
						$("#alertInfo").removeClass("hidden");
	  				}
	  			}
	  	  	});
	  	
  };
  //判断是否需要验证码
  function isNeedValidateCode(){
	  $.getJSON(root+"/sets/login/needValidateCode",function(result){
		  if(result && result.code==0 && result.data.needCode==1){
			  generateValidate();
		  }
	  });
  }
  //生成验证码
  function generateValidate(){
	  $("#validateCode").attr("src",root+"/sets/login/validateCode?" + Math.random());
	  $("#securityCodeDiv").removeClass("hidden");
  }
  })(jQuery);

  </script>
</html>
