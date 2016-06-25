<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>新建密码</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<style type="text/css">
body{
background:#f5f5f5;
}
.tcont{
border-radius: 4px;
box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.08);
background: #fff;
padding-top:40px;
margin-top:20px;
}

.slogan {
	color: #545859;
	font-size: 2.4em;
	font-weight: 500;	
padding:10px;
border-bottom:1px dashed #bfbfbf;
}
</style>
</head>
<body>
	<!-- header -->
	<%@include file="common/header-single.jsp"%>
	<!-- end header -->
	<!-- container -->

	<div id="wrapper" class=" headerheight">
		<div class="container zone ">
			<div class="row">
				<div class="col-xs-12">
					<h1 class="title"></h1>
				</div>
			</div>
		</div>
		<div class="main">
			<div class="container tcont">
				<div class="matrix">
					<ul class="slats">
						<li class="zone">
							<div class="row">
							<div class="col-md-2"></div>
								<div class="col-md-8 add-candi">
									<!-- 新密码 -->

									<div class="center-block" style="padding-top:30px;padding-left:30px;">

										<div class="newPassWrap">
											<div id="newPassalertInfo" class="tac alert alert-warning hidden">
												<!--  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> 

-->
												<span id="newPassalertInfo-a" href="#" class="alert-re"></span>
											</div>
											<form id="newPassForm" class="form-horizontal" role="form" novalidate>
												<div class="slogan" id="titleText">请设置新密码</div>
												<div class="h30 tal">
													<label class="col-sm-2"></label><span class="col-sm-10 red" id="userPwdAsterisk"></span>
												</div>
												<div id="needUserName" class="form-group none">
													<label for="userPwd2" class="col-sm-2 control-label">姓名</label>
													<div class="col-sm-10">
														<input type="text" class="form-control w395 inlineBox" id="userName" name="userName"
															placeholder="请输入姓名" required data-validation-required-message="请输入姓名"> <span class="red"
															style="margin:0px;color:red">*</span>
													</div>
												</div>
												<div class="h30 tal">
													<label class="col-sm-2"></label><font class="col-sm-10 red" id="userPwd2Asterisk"></font>
												</div>
												<div class="form-group">
													<label for="userPwd" class="col-sm-2 control-label">新密码</label>
													<div class="col-sm-10">
														<input type="password" class="form-control w395 h45 inlineBox" id="userPwd" name="userPwd"
															placeholder="请输入新密码" required data-validation-required-message="请输入新密码"> <span class="red"
															style="margin:0px;color:red">*</span>
													</div>
												</div>
												<div class="clearfix hidden" id="passcomplexify">
													<label class="col-sm-2 control-label"></label>
													<div class="col-sm-10" style="padding-left:5px">
														<div id="progressbar" style="display:inline-block">
															<div id="progress" class="progressbarInvalid"></div>
														</div>
														&nbsp;<span id="complexityLabel"></span>
													</div>
												</div>
												<div class="h30 tal">
													<label class="col-sm-2"></label><font class="col-sm-10 red" id="userPwd2Asterisk"></font>
												</div>
												<div class="form-group">
													<label for="userPwd2" class="col-sm-2 control-label">确认密码</label>
													<div class="col-sm-10">
														<input type="password" class="form-control w395 h45 inlineBox" id="userPwd2" name="userPwd2"
															placeholder="请输入确认密码" required data-validation-required-message="请输入确认密码"> <span class="red"
															style="margin:0px;color:red">*</span>
													</div>
												</div>
												
												<div class="h50 form-group " style="margin-top:45px">

													<label class="col-sm-2 control-label"></label>
													<div class="col-sm-10">
														<input type="submit" class="btn btn-lg btn-info  w200  white" value="设置"></input>
													</div>
												</div>
											</form>
										</div>
										<div class="mt50"></div>
									</div>
									<!-- end -->
								</div>
								<div class="col-md-2">
								<!-- 
									<div style="padding-left:40px;padding-top:30px;">
										<div class="videobg">
											发布一个测评 <br> 邀请候选人 <br> 查看报告，确定人选
										</div>
									</div>
								 -->	
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!-- endcontainer -->
		<!--footer -->
		<%@include file="common/footer.jsp"%>
		<!--end footer -->
		<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/setsValidation.js"></script>
		<script src="${pageContext.request.contextPath}/plugin/jquery.md5.js"></script>
		<script type="text/javascript">
	(function($){
		$(function(){
			var needUserName = "${needUserName}";
			if(needUserName){
				$("#titleText").html('请设置新密码和姓名');
				$("#needUserName").show();
			}
			$("#footer").addClass('navbar-fixed-bottom');
			$.placeholder.shim();//初始化placeholder
			$("#newPassForm").setsValidation();
			var uuid = "${sessionScope.uuid}";
			var activeKey ="${activateKey}";
			if(!uuid){
				analyActiveKey(activeKey);
			}
			$("#userPwd",this).focus();
			$LAB
			.script(root+"/plugin/jquery.complexify.banlist.js",root+"/plugin/jquery.complexify.js")
			.wait(function(){
				$("#userPwd").complexify({minimumChars:4,miniStrength:8}, function (valid, complexity) {
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
						 $("#complexityLabel").html("中").css("color","#ffa800");
					}else if(compledata>66){
						 $('#progress').css({'width':compledata + '%'}).removeClass().addClass('progressbarStrong');
						 $("#complexityLabel").html("强").css("color","green");
					}
		        });
			});
			
			$("#userPwd").on("keypress",function(e){
				var e = e || window.event; 
				if(e.keyCode != 13){ 
					if($("#passcomplexify").hasClass("hidden")){
						$("#passcomplexify").removeClass("hidden");
					}
				}
			});
		
			$("#newPassForm").on("submit",function(){
				if(!$(this).setsValidation('submitValidate')){
					return false;
				 }
				if(!infoValid()){
					return false;
				}
				 $(this).attr("disabled","disabled");
				 $('input[type=submit]', this).attr('disabled', 'disabled');
				var paramobj ={};
				if(uuid){
					//忘记密码后新建密码
					paramobj.uuid=uuid;
					paramobj.passwordNew=$.md5($("#userPwd").val());
					forgotTosetNewPass(paramobj);
					return false;
				}else{
					//免费试用激活密码
					paramobj.userPwd=$.md5($("#userPwd").val());
					paramobj.activationKey=activeKey;
					if($('#userName').val()){
					paramobj.userName=$('#userName').val();
					}
				    toSubmitPassWord(paramobj);
					
					return false;
				}
				$(this).removeAttr("disabled");
				 $('input[type=submit]', this).removeAttr('disabled');
				return false;
			});
		});
		function analyActiveKey(activeKey){
				var keyErrorType = "${keyErrorType}";
				if(keyErrorType){
					if(keyErrorType=="invalidKey" ){
						$("#newPassalertInfo-a").html("<span>当前激活地址无效,请检查激活链接地址是否正确。</span>");
					}else if(keyErrorType=="activatedKey" ){
						$("#newPassalertInfo-a").html("<a href='"+root+"/sets/page/home.html'>当前邮箱已经激活,请回首页登录。</a>");
					}
					$("#newPassalertInfo").removeClass("hidden");
					$("#newPassForm").hide();
					return false;
				}
				
				/* 	if(!activeKey){
						else{
							
						}
					} */
		}
		function infoValid(){
			var flag=true;
			var userPwd = $("#userPwd");
			var userPwd2 = $("#userPwd2");
			if(userPwd2.val()!=userPwd.val()){
				$("#userPwd2").setsValidationErr("确认密码与新密码不一致！");
				flag = false;
			}
			
			return flag;
		}
		/*忘记密码后新建密码*/
		function forgotTosetNewPass(formData){
			$.setsAjax({
	 	         type: "POST",
	 	         url:root+"/sets/login/setNewPass",
	 	         data:"param="+JSON.stringify(formData),// 要提交的表单 
	 	         success: function(result) {
	 	        	 if(result && result.code==0){
	 	        		 if(result.data.code=="SUCCESS"){
	 	        			 window.location.href="<%=request.getContextPath()%>/sets/page/home";
	 	        		 }
	 	        	 }else{
	 	        		$("#newPassalertInfo-a").html("服务异常，请联系管理员!");
						$("#newPassalertInfo").removeClass("hidden");
						return false;
	 	        	 }
	 	         }
	 	     });
		}
		/*免费试用新建密码*/
		function toSubmitPassWord(formData){
			var activeKey =activeKey || formData.activationKey;
			$.setsAjax({
	 	         type: "POST",
	 	         url:root+"/sets/trial/newPassword",
	 	         dataType:'json',
	  			 contentType:"application/json",
	 	         data:JSON.stringify(formData),// 要提交的表单 
	 	         success: function(result) {
	 	        	 if(result && result.code==0){
	 	        		 if(result.data.code=="SUCCESS"){
	 	        			 /*记录登陆信息*/
	 						 //operType=3:免费试用激活
	 						 try{
	 							 recordloginInfo.postRecord(3,activeKey);
	 						 }catch(e){
	 							 throw e.message;
	 						 }
	 	        			 window.location.href="<%=request.getContextPath()%>/sets/page/home";
						} else if (result.data.code == "ACCTHASACTIVETED") {
							$("#newPassalertInfo-a").html("账号已经被激活过!");
							$("#newPassalertInfo").removeClass("hidden");
							return false;
						}
					} else {
						$("#newPassalertInfo-a").html("服务异常，请联系管理员!");
						$("#newPassalertInfo").removeClass("hidden");
						return false;
					}
						},
						error : function() {
							$("#newPassalertInfo-a").html("服务异常，请联系管理员!");
							$("#newPassalertInfo").removeClass("hidden");
						}
					});
				}
			})(jQuery);
		</script>
</body>
</html>