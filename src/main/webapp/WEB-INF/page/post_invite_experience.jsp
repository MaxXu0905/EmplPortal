<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.Random"%>
<!DOCTYPE html>
<html>
<head>
<title>发送测评邀请--百一</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/plugin/buttons.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/post_invite_experience.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/plugin/datepicker/datepicker.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/post_invite_experience.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/plugin/moment/min/moment.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/plugin/datepicker/bootstrap-datepicker.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/plugin/uploadify/jquery.uploadify.min.js?ver=<%=(new Random().nextInt(99999)) %>"
	type="text/javascript"></script>
<script type="text/javascript">
	var SETS_POSITION_ID = "${position_id}";
	var JESEESION_ID = "${pageContext.session.id}";
</script>
</head>
<body>
	<!-- header -->
	<%@include file="common/header.jsp"%>
	<!-- end header -->
	<!-- container -->

	<div id="wrapper" class="headerbg headerheight">
		<div class="container zone">
			<div class="row">
				<div class="col-xs-12">
					<h1 class="title">给自己发送一份测评邀请</h1>
				</div>
			</div>
		</div>
	</div>
	<div class="main">
		<div class="container">
			<div class="matrix">
				<ul class="slats">
					<li class="zone">
						<div class="row">
							<div class="col-md-7 mail">
								<dl class="dl-horizontal" id="emailTitle">
								</dl>
								<dl class="dl-horizontal">
									<dt style="margin-left:-10px">邮件正文</dt>
									<dd>
										<div class="mail_content"></div>
									</dd>
								</dl>
							</div>
							<div class="col-md-5 add-candi mt10">
								<form class="form-horizontal" role="form">
									<div class="form-group">
										<label for="candi_name" class="col-sm-2 control-label">姓名</label>
										<div class="col-sm-10">
											<input type="email" class="form-control" id="candi_name" placeholder="姓名">
										</div>
									</div>
									<div class="form-group">
										<label for="candi_email" class="col-sm-2 control-label">邮箱</label>
										<div class="col-sm-10">
											<input type="email" class="form-control" id="candi_email" placeholder="Email">
										</div>
									</div>
								</form>
								<button class="btn btn-info submit" type="button">
									<span class="glyphicon glyphicon-envelope"></span> 发送邀请
								</button>
								<div class="alert alert-warning mt10 none"></div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<!-- endcontainer -->
	<!-- 注册 -->
	<div class="regist-backdrop gone"></div>
	<div class="regist-main gone">
		<div class="container">
			<div class="row" id="registMain">
				您还可以邀请一次当前测评。想要无限量？赶快来<a class="btn-regist" href="${pageContext.request.contextPath }/sets/page/regist#regist">注册</a>吧！
			</div>
		</div>
	</div>
	<!--footer -->
	<%@include file="common/footer.jsp"%>
	<!--end footer -->

	<!-- modal: alert -->
	<div class="modal fade" id="commit_result">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header"></div>
				<div class="modal-body">
					<p>
						您已经邀请过了，一个测评只能体验一次，赶快 <a class="btn btn-danger" href="${pageContext.request.contextPath }/sets/page/regist#regist">注册</a> 吧！
					</p>
				</div>
				<div class="modal-footer"></div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>

	<!-- modal: action -->
	<div class="modal fade" id="modal_hr">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">百一专注于招聘测评，请填写您的公司邮箱。完成测评后，我们会将测评报告发送给您。</h4>
				</div>
				<div class="modal-body">
					<div class="alert alert-danger gone"></div>
					<div class="form-group">
						<label class="sr-only" for="company_email"></label> <input type="text" class="form-control" id="company_email"
							placeholder="公司邮箱" value="">
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-success save-company-email">确认</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
	</div>
	<!-- /.modal -->
</body>
</html>
