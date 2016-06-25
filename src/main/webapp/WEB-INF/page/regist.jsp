<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>百一测评 - 用互联网的方式颠覆笔试</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/core/css/regist.css" rel="stylesheet" type="text/css" />
<script src="${pageContext.request.contextPath }/core/js/regist.js"></script>
<script type="text/javascript">
	var LOGIN_REQUEST_URL = "${requestScope.request_url}";
	var EMPLOYER_ID = "${sessionScope.employer_id}";
	var EMPLOYER_NAME = "${sessionScope.employer_name}";
</script>
<style type="text/css">
.tcont{
border-radius: 4px;
box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.08);
background: #fff;
height:500px;
}
.statement{padding-top:10px;margin-top:20px;}
</style>
</head>

<body>
<div id="header" >
	<div class="navbar navbar-default navbar-static-top">
		<div class="container">
			<div class="navbar-header">
				<a id="logo" class="navbar-brand logo-wrapper" href="${pageContext.request.contextPath }/sets/page/index.jsp">百一
				<img class="logo-img" src="${pageContext.request.contextPath }/core/images/logo.png">
				<span class="logo-beta">测试版</span>
				</a>
			</div>
			<div class="navbar-collapse collapse">
				<ul id="navMenu" class="nav navbar-nav navbar-right">
				   
				</ul>
			</div>
		</div>
	</div>
	<!-- 
	 -->
</div>
	<div class="container wrapper tcont">
	<!-- 
		<div class="col bg-main mt30">
			<img src="${pageContext.request.contextPath }/core/images/s1.png">
		</div>
	 -->	
		<div class="col cube-main mt30">
			<div class="cube login-main"></div>
			<div class="cube free-main"></div>
			<div class="cube free-notify"></div>
		</div>
	</div>
		<!-- endcontainer -->
		<!--footer -->
		<%@include file="common/footer.jsp"%>
		<!--end footer -->	
</body>
<script type="text/javascript">
	
</script>
<script id="tmpl_loginMain" type="text/x-jsrender">
		{^{if login}}
			<div class="slogan-main p10" >
				<img src="${pageContext.request.contextPath }/core/images/slogan.png" style="margin:60px auto 10px;">
				<a class="mybtn" href="${pageContext.request.contextPath }/sets/page/home.html" style="color:#fff;">欢迎回来</a>
			</div>
		{{else}}
			<div class="alert-main alert-login"
			data-link="class{merge:loginNameError||loginPswdError||loginError toggle='alert-main-active'}
			">
				{^{>loginNameError||loginPswdError||loginError}}
			</div>
			<div class="slogan" style="text-align:left;">
<!-- <img src="${pageContext.request.contextPath }/core/images/loginlog.png" style="padding-bottom:10px;width:60%;">-->
		登录百一		
			</div>
			<div style="padding-bottom:5px;"><input  data-link="{:loginName:}
			class{merge:loginNameError toggle='input-error'}
			class{merge:!loginNameError&&loginName toggle='input-success'}
			" name="loginName" type="text" class="login loginc h45 form-control" placeholder="请输入您的公司邮箱">
			</div>
<div style="padding-bottom:5px;">
<input data-link="{:loginPswd:}
			class{merge:needcode toggle='up10'}
			class{merge:loginPswdError toggle='input-error'}
			class{merge:loginPswd toggle='input-success'}
			" name="loginPswd" type="password" class="login mt20 loginb h45 form-control" placeholder="请输入密码">
</div>
 			<div class="validatecode-main" data-link="visible{:needcode}">
        		<input type="text" name="valiCode" class="login w120 mt10 h45 form-control inline-block" placeholder="请输入验证码">
        		<img title="点击更换" data-link="src{:validatecodeimg}" class="inline-block">
       		</div>
			<div class="mt10 mb20 p0 remember-main" data-link="class{merge:needcode toggle='mt0'}">
				<label class="check-box remember" style="padding:15px 0px;">
					<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  					<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:remember toggle='checked'}"></i></span>
					记住我
  				</label>
				<a href="${pageContext.request.contextPath }/sets/login/forgotPassword" target="_blank" class="pull-right forget-password">忘记密码 ？</a>
			</div>
			<button class="mybtn btn-login" data-link="disabled{:!loginAvailable || logining}
			class{merge:needcode toggle='mt0'}
			">{^{if loginSuccess}}登录成功{{else logining}}登录中...{{else}}登 录{{/if}}</button>
			<div class="free-test">
				没有帐号？赶紧去注册 <i class="fa fa-chevron-right"></i>
			</div>
		{{/if}}
	</script>
<script id="tmpl_freeMain" type="text/x-jsrender">
		<div class="alert-main alert-free"
			data-link="class{merge:freeUserError||freeEmailError||freeError toggle='alert-main-active'}
			class{merge:~isPlenty(freeUserError||freeEmailError||freeError) toggle='alert-main-plenty'}
		">
			{^{>freeUserError||freeEmailError||freeError}}
		</div>
		<div class="slogan" style="text-align:left;padding-bottom:0px;">
		注册百一帐号
		</div>
<div style="margin-top:-25px;">
		<input data-link="{:freeUser:}
			class{merge:freeUserError toggle='input-error'}
			class{merge:freeUser toggle='input-success'}
			" name="freeUser" type="text" class="free logina h45 form-control"  placeholder="请输入您的姓名">
</div>
<input data-link="{:freeEmail:}
			class{merge:freeEmailError toggle='input-error'}
			class{merge:!freeEmailError&&freeEmail toggle='input-success'}
			" name="freeEmail" type="text" class="free mt20 loginc h45 form-control" placeholder="请输入您的公司邮箱">

<div>
	<select data-link="{:freeAcctRole:}" name="freeAcctRole" class="free mt20  h45 form-control">
		<option value="1">我想做社会招聘</option>
		<option value="2">我想做校园招聘</option>
	</select>
</div>		
<div class="statement">点击注册即表明你已阅读过并且同意我们的<a target="_blank" href="${pageContext.request.contextPath }/sets/page/statement">《百一用户协议》</a>。</div>
<button class="mybtn btn-free" data-link="disabled{:!freeAvailable || freeing}
		">{^{if freeing}}处理中...{{else}}注册{{/if}}</button>
		<div class="to-login">
			<i class="fa fa-chevron-left"></i> 已有百一帐号，去登录
		</div>
	</script>
<script id="tmpl_freeNotify" type="text/x-jsrender">
		<div class="slogan" style="text-align:left;">
还差一步即可完成注册
			<!--职位来袭，就用<span>百一</span>-->
		</div>
		<div class="notify-content">
		<div class="notify-title">
			<span class="fb">{^{:freeUser || 'Jack'}}：</span>您好，</div>
		百一已经向您的邮箱<span class="notify-email">{^{:freeEmail || 'hellofreckles@gmail.com'}}</span>发送了一封激活邮件，
		赶快开启您的测评之旅吧！
		</div><br>
		<button class="mybtn btn-active-email">
			去邮箱激活
		</button>
		<div class="no-email">
			<i class="fa fa-chevron-left"></i> 没收到邮件？换个邮箱
		</div>
	</script>
</html>
