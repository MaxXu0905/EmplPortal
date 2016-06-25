<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.Random"%>
<!DOCTYPE html>
<html>
<head>
<title>发送测评邀请--百一</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/plugin/datetimepicker/bootstrap-datetimepicker-sets.css"
	rel="stylesheet" media="screen">
<link href="${pageContext.request.contextPath }/core/css/post_invite.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/post_invite.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/plugin/moment/min/moment.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/plugin/datetimepicker/bootstrap-datetimepicker.js" charset="UTF-8"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/plugin/datetimepicker/locales/bootstrap-datetimepicker.zh-CN.js"
	charset="UTF-8"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/plugin/uploadify/jquery.uploadify.min.js?ver=<%=(new Random().nextInt(99999)) %>"
	type="text/javascript"></script>
<script type="text/javascript">
	var SETS_POSITION_ID = "${position_id}";
	var SETS_POSITION_IDS = "${position_ids}";
	var JESEESION_ID = "${pageContext.session.id}";
	
	var MAX_HANDLE_COUNT = "${param.max}";
	var INTERVAL = "${param.interval}";
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
					<h1 class="title">向应聘人发送测评邀请邮件</h1>
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
							<div class="col-md-7" id="mail"></div>
							<div class="col-md-5 add-candi">
								<div class="alert alert-danger alert-dismissable gone" id="alert_no_flash">
									<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
									您没有安装flash player，请点击<a target="_blank" href="https://get.adobe.com/cn/flashplayer/">安装</a>
								</div>
								<a class="import-template"
									href="http://101testneeds.oss-cn-beijing.aliyuncs.com/template_xls/%E5%80%99%E9%80%89%E4%BA%BA%E9%82%80%E8%AF%B7%E6%A8%A1%E7%89%88.xls">下载模板</a>
								<button type="button" class="btn btn-info submit" disabled="disabled">
									<span class="glyphicon glyphicon-envelope"></span> 发送邀请
								</button>
								<input type="file" id="multi_import">
								<form class="form-inline" role="form">
									<div class="form-group">
										<label class="sr-only" for="candi_name"></label> <input type="text" class="form-control" id="candi_name"
											placeholder="姓名" value="">
									</div>
									<div class="form-group">
										<label class="sr-only" for="candi_email"></label> <input type="text" class="form-control" id="candi_email"
											placeholder="Email" value="">
									</div>
									<button type="button" class="btn btn-warning add_candi_btn">
										<span class="glyphicon glyphicon-plus"></span>
									</button>
								</form>
								<div class="alert alert-success mt10 candi-list-info none">
									<div class="mb10 filter-pane btn-group none" data-toggle="buttons">
										<label class="btn btn-default active" data-filter="all"> <input type="radio" name="options" id="option1" checked>
											全部
										</label> <label class="btn btn-default" data-filter="handling"> <input type="radio" name="options" id="option2"> 邀请中
										</label> <label class="btn btn-default" data-filter="pending"> <input type="radio" name="options" id="option3"> 待邀请
										</label> <label class="btn btn-default" data-filter="fail"> <input type="radio" name="options" id="option4"> 邀请失败
										</label>
									</div>
									发送邀请邮件：<span class="text-primary handle-count">0</span> / <span class="text-primary total-count">0</span>（其中失败
									<span class="fail-count text-danger">0</span> 个）
								</div>
								<div class="alert alert-warning mt10 none"></div>
								<ul class="candi_list">
								</ul>
								<button class="btn btn-info submit" type="button">
									<span class="glyphicon glyphicon-envelope"></span> 发送邀请
								</button>
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

	<!-- modal: alert -->
	<div class="modal fade" id="commit_result">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header"></div>
				<div class="modal-body">
					<p>
						抱歉，邀请失败了。快快告诉<a href="Mailto:linmy@asiainfo-linkage.com">产品经理</a>吧!
					</p>
				</div>
				<div class="modal-footer"></div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>

	<!-- modal: action -->
	<div class="modal fade" id="modal_company">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">发送邀请需要您提供公司名称</h4>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label class="sr-only" for="company_name"></label> <input type="text" class="form-control" id="company_name"
							placeholder="公司名称" value="">
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-success save-company" disabled="disabled">保存名称</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
	</div>
	<!-- /.modal -->
	<!-- modal: preview -->
	<div class="modal fade" id="modal_preview">
		<div class="modal-dialog" style="width: 700px;"></div>
	</div>
	<!-- /.modal -->
	<script id="tmpl_email_preview" type="text/x-jsrender">
	<div class="modal fade">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">发送邀请需要您提供公司名称</h4>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label class="sr-only" for="company_name"></label> <input type="text" class="form-control" id="company_name"
							placeholder="公司名称" value="">
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-success save-company" disabled="disabled">保存名称</button>
				</div>
			</div>
		</div>
	</div>
	</script>
	<script id="tmpl_email" type="text/x-jsrender">
	<div class="alert alert-danger mb0"
	data-link="visible{:!_emailContentLoaded}">
		获取邮件内容信息失败了，请<a onclick="javascript:window.location.reload();">刷新</a>重试
	</div>
	<dl class="dl-horizontal">
		<dt>招聘职位名称</dt>
		<dd><input data-link="testPositionName" class="form-control content_input" type="text" placeholder="应聘人看到的职位名称，例：大数据开发工程师"></dd>
		<dt data-link="visible{:_specifyBeginDate}">测评开始时间</dt>
		<dd data-link="visible{:_specifyBeginDate}"><input data-link="beginDate" readOnly class="form-control w150 inline-block content_input" type="text">
		</dd>
		<dt>测评结束时间</dt>
		<dd>
			<input data-link="validDate" readOnly class="form-control w150 inline-block content_input valid-date" type="text">
			<span data-link="visible{:!_specifyBeginDate}">
			邀请<span class="text-highlight"> {^{:~dayRelative(currentDate, validDate)}} </span>天以后失效
			</span>
			<span class="text-danger"
			data-link="visible{:_relativeTooSmall}">
				测评开放时长不要小于试卷时长哦
			</span>
		</dd>
		<dt data-link="visible{:_specifyBeginDate}">测评开放时长</dt>
		<dd data-link="visible{:_specifyBeginDate}" style="padding:20px 0 0 15px;">
			<span class="text-highlight">{^{:~prettyTime(~minRelative(beginDate, validDate)) || '无有效时长'}}</span>
			{{!--（试卷时长<span class="text-highlight"> {^{:~prettyTime(totalTime)}} </span>
			，平均作答时长约需<span class="text-highlight"> {^{:~formatAvgTime(avgTime)}} </span>）--}}
		</dd>
		<dd>
			<label class="check-box select-begindate mt10">
			<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  			<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:_specifyBeginDate toggle='checked'}"></i></span>
    		<span>指定测评开始时间</span> 
			<a class="ml10 tooltip-test-time" data-toggle="tooltip"><i class="fa fa-question-circle"></i></a> 关于测评时间
  			</label>
		</dd>
		<dt>邮件内容补充</dt>
		<dd>
			<textarea data-link="selfContext" class="form-control content_input" rows="3"></textarea>
		</dd>
		<dd>
			<label class="check-box select-camera mt10">
			<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  			<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:canWithOutCamera toggle='checked'}"></i></span>
    		<span>要求参加测评的人必须开启摄像头，接受实时监考。</span> 
  			</label>
			<div data-link="visible{:!canWithOutCamera}" class="alert alert-warning">
			{^{if hasInterview}}
				这份测评包含<span class="text-danger">面试题</span>，没有摄像头将无法作答面试题。其他试题仍有其他监考方案，但效果会差一些。
			{{else}}
				没有摄像头的在线考试仍有其他监考方式，但效果会差一些。
			{{/if}}
			</div>
		</dd>
		<dd>
			<button class="btn btn-info mail-preview">邮件预览</button>
		</dd>
	</dl>
	</script>
</body>
</html>
