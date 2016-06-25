<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>发送测评邀请--百一</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath}/lib/Font-Awesome/css/font-awesome.min.css" rel="stylesheet" />
<link href="${pageContext.request.contextPath }/plugin/buttons.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/sets.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/post_invite.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/post_invite.js"></script>
</head>
<body>
	<!-- header -->
	<%@include file="common/header.jsp"%>
	<!-- end header -->
	<!-- container -->

	<div id="wrapper" class=" headerheight">
		<div class="container zone">
			<div class="row">
				<div class="col-xs-12">
					<h1 class="title"></h1>
				</div>
			</div>
		</div>
		<div class="main">
			<div class="container">
				<div class="matrix">
					<ul class="slats">
						<li class="zone">
							<div class="row">
								<div class="col-md-6 add-candi" style="padding-top:30px;">
<!-- 忘记密码  -->
</div>
								<div class="col-md-6" style="padding-left:40px;padding-top:30px;">
                                  <div class="rowline"><h4>观看视频了解百一测评</h4></div>
							      <div class="videobg"><div></div></div>
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
</body>
</html>
