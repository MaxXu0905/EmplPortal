<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>忘记密码</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<style type="text/css">
body{
background:#f5f5f5;
}
.fgpasswordli{padding:0px 0px 40px 80px;}
.fgpasswordli li{list-style-type:disc;line-height:30px;}
.tcont{
border-radius: 4px;
box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.08);
background: #fff;
padding-top:40px;
margin-top:20px;
}
</style>
</head>
<body>
	<!-- header -->
	<%@include file="common/header-single.jsp"%>
	<!-- end header -->
	<!-- container -->

	<div id="wrapper" class="headerheight">
		<div class="container zone">
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
							<div class="row" >
							
							<div class="col-md-2"></div>
								<div class="col-md-8 add-candi" style="height:400px;">
									<!-- 忘记密码 -->
									<div class="center-block" style="padding-top: 30px;">
										<div class="forgotPassWrap">
											<div id="forgotPassalertInfo"
												class=" alert alert-warning hidden"
												style="margin: 0px 40px;padding-left:20px;margin-bottom:30px;margin-left:60px;">
												<!--  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> -->
												<span id="forgotPassalertInfo-a" class="alert-link"></span>
											</div>
											<form id="forgotPasswordForm" class="form-horizontal" style="padding-left:5px;">
												<div>
													<label class="col-sm-1 control-label"></label>
													<h4>忘记密码？就使用邮箱找回密码吧！</h4>
												</div>
												<div class="h30 tal">
													<label class="col-sm-1"></label><span
														class="col-sm-11 red" id="emailAsterisk"></span>
												</div>
												<div class="form-group">
													<label for="oldPassword" class="col-sm-1 control-label"></label>
													<div class="col-sm-11">
														<input type="email"
															class="form-control loginc h45 w450 inlineBox" id="email"
															name="email" placeholder="请输入邮箱"
															data-validation-email-message="请输入正确的email地址" required
															data-validation-required-message="请输入邮箱"> <span
															class="red" style="margin: 0px; color: red">*</span>
													</div>
												</div>
												<div class="form-group" style="margin-top: 30px">
													<label class="col-sm-1 control-label"></label>
													<div class="col-sm-11">
														<input type="submit" id="forgotPasswordBtn"
															class="btn btn-lg btn-info  h50  w200  white"
															value="找回密码" />
													</div>
												</div>
											</form>
											<div id="activeEmail" class="hidden">
												<div class="form-group" style="margin-top: 20px;">
												<ul class="fgpasswordli">
												  <li>为了您的账号安全， 验证邮件有效期为24小时，请及时查收。</li>
												  <li>如未收到请查看您的垃圾邮件箱，可能由于网络问题，验证邮件会有1-10分钟的延迟，请稍后片刻。</li>
												  <li>如超过10分钟仍未收到，可点此 <a href="#" class="forgot-password-link"
															id="reCheck">再次发送</a>，或拨打010-82166778。</li>
												</ul>												
														
														
													

													<!--         <p style="text-align:center;">
        <a href="#"  class="forgot-password-link" id="reCheck" >没有收到邮件？重新检查邮箱	</a>
        </p> -->
													<label class="col-sm-1 control-label"></label>
													<div class="col-sm-11" style="padding-left: 0px;">
														<a id="activeEmail-a"
															class="btn btn-lg btn-info h50  w200  white" href="#">去邮箱查看</a>
													</div>
												</div>
											</div>
										</div>
										<div class="mt50"></div>
									</div>
									<!-- end  -->
								</div>
							<div class="col-md-2"></div>	
									<!-- 	
								<div class="col-md-6" style="border:1px solid #ff0000;">
						
									<div style="padding-left: 40px;">
										
										<div class="videobg">
										发布一个测评<br>邀请候选人<br>查看报告，确定人选
										
										</div>
									</div>
								
									
								</div>
									 -->
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

		<script type="text/javascript"
			src="${pageContext.request.contextPath }/core/js/setsValidation.js"></script>
		<script type="text/javascript">
			(function($) {
				var email = null;
				$(function() {
					$("#footer").addClass('navbar-fixed-bottom');
					//初始化
					init();

					//检查邮箱
					$("#reCheck").on("click", function() {
						reCheckEmail();
						return false;
					});
					//提交请求
					$("#forgotPasswordForm").on(
							"submit",
							function() {
								email = $("#email").val();
								if (!$(this).setsValidation('submitValidate')) {
									return false;
								}
								$(this).attr("disabled", "disabled");
								$('input[type=submit]', this).attr('disabled',
										'disabled');
								findPassword(email);
								$(this).removeAttr("disabled");
								$('input[type=submit]', this).removeAttr(
										'disabled');
								return false;
							});
				});
				//复查邮箱
				function reCheckEmail() {
					$("#activeEmail").addClass("hidden");
					//恢复数据
					$("#email").val(email);
					$("#forgotPasswordForm").removeClass("hidden").show();
					$("#forgotPassalertInfo").addClass("hidden");
				}
				//初始化
				function init() {
					$("#email")[0].focus();
					$.placeholder.shim();//初始化placeholder
					$("#forgotPasswordForm").setsValidation();
				}

				//找回密码服务
				function findPassword(formData) {
					//ajax校验
					if (formData) {
						$
								.ajax({
									url : root + "/sets/login/forgetPass",
									data : {
										"email" : formData
									},
									success : function(msg) {
										if (msg.code == "0") {
											if (msg.data.code == "SUCCESS") {
												$("#forgotPassalertInfo-a")
														.html(
																"已经将找回密码邮件发送到您的邮箱("
																		+ formData
																		+ ")中。");
												$("#forgotPassalertInfo")
														.removeClass("hidden");
												$("#forgotPasswordForm").hide();
												$("#activeEmail").removeClass(
														"hidden");
												var mailsuffix = $("#email")
														.val().split("@")[1];
												$("#activeEmail-a").attr(
														"href",
														"http://mail."
																+ mailsuffix);
											} else if (msg.data.code = "ACCTNOTEXIST") {
												$("#forgotPassalertInfo-a")
														.html(
																"您输入的邮箱表明您还不是百一测评的用户哦! <a href='"+root+"#freeTest'> 现在去注册吧！</a>");
												$("#forgotPassalertInfo")
														.removeClass("hidden"); 
												return false;
											}
										} else {
											$("#forgotPassalertInfo-a").html(
													"服务异常，请联系管理员!");
											$("#forgotPassalertInfo")
													.removeClass("hidden");
										}
									},
									error : function() {
										$("#forgotPassalertInfo-a").html(
												"服务异常，请联系管理员!");
										$("#forgotPassalertInfo").removeClass(
												"hidden");
									}
								});
					} else {
						alert("提交失败！");
					}
				}
			})(jQuery);
		</script>
</body>
</html>