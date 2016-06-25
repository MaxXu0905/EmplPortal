<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>百一测评</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/sets.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/post_invite.css" rel="stylesheet" type="text/css" />
</head>
<body style="margin:0px;padding:0px;"  class="errorbg">
   <div id="wrapper" class="headerheight">
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
								<div class="col-md-6 add-candi">
								<div class="center-block" style="padding-top: 100px;">
										<div 
												class="tac alert alert-warning"
												style="margin: 0px 40px;">
												<span id="error" class="alert-link"></span>
										</div>
								</div>
								</div>
								<div class="col-md-6">
									<div style="padding-left: 40px; padding-top: 30px;">
										<div class="rowline">
											<h4>观看视频了解百一测评</h4>
										</div>
										<div class="videobg">
											<div></div>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
</body>
<script type="text/javascript">
	var status = "${sessionScope.status}";
	var msg = "${sessionScope.message}";
	var errormsg = document.getElementById('error');
	if (status == "NONEEXIST") {
		errormsg.innerHTML = "修改密码失败，该链接为无效链接。<br/>";
	} else if (status == "TIMEOUT") {
		errormsg.innerHTML = "修改密码失败，您所使用的修改密码链接已失效。";
	} 
</script>
</html>
