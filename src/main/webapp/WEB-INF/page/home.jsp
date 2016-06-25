<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>百一测评 - 用互联网的方式颠覆笔试</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/plugin/buttons.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/home.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/home.js"></script>
<script type="text/javascript">
	var EMPLOYER_ID = "${sessionScope.employer_id}";
</script>
</head>
<body>
	<!-- header -->
	<jsp:include page="common/header.jsp"></jsp:include>
	<!-- end header -->
	<!-- container -->
	<div class="container">
		<div class="section" id="functions">
			<div class="article function-fake">
				<i class="fa fa-anchor"></i><br /> <span>创建在线测评</span>
				<div class="functs">
					<div>
						<div class="sub-funct" id="function-fast-create">
							<i class="fa fa-plus"></i><br /> <span>快捷创建</span>
						</div>
						<div class="sub-funct" id="function-create-post">
							<i class="fa fa-plus"></i><br /> <span>自定义</span>
						</div>
					</div>
				</div>
			</div>
			<div id="function-create-campus" class="article function">
				<i class="fa fa-graduation-cap"></i><br /> <span>创建微信测评</span>
			</div>
			<div id="function-lib" class="article function">
				<i class="fa fa-tasks"></i><br />题库管理
			</div>
		</div>
		<div class="section" id="position_list"></div>

		<div id="morewrapper">
			<button id="showmore" class="btn btn-default pl20 pr20 mt20">点击加载更多测评...</button>
		</div>

	</div>
	<!-- endcontainer -->
	<!--footer -->

	<!--end footer -->
	<div class="modal fade" id="modal_company">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">应聘者需要知道您的公司名称，不能填错哦</h4>
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
	<div class="modal fade" id="modal_fast_create">
		<div class="modal-dialog" style="margin-bottom:200px;">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title">快捷创建</h4>
				</div>
				<div class="modal-body" style="padding: 10px 0;">
					<div class="fast-create-main"></div>
					<div class="authorize-main"></div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default fast-reset-btn">重置</button>
					<button type="button" class="btn btn-info fast-create-btn">快捷创建</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
	</div>
	<script id="tmpl_fast_create" type="text/x-jsrender">
		{^{for _series tmpl="#tmpl_fast_pos_item" /}}
	</script>
	<script id="tmpl_fast_pos_item" type="text/x-jsrender">
	<div class="fast-post-item">
		<div class="name">
			{{:seriesName}}
		</div>
		<div class="paper-list">
			{^{for levelPapers tmpl="#tmpl_fast_paper_item" /}}
		</div>
	</div>
	</script>
	<script id="tmpl_fast_paper_item" type="text/x-jsrender">
	<label class="fast-paper-item" data-link="
		data-paperId{:paperId}
		class{merge:customed toggle='created'}
		class{merge:selected toggle='selected'}">
		{{:levelName}}
		{^{if !customed}}
		 <input name="fast-paper" type="checkbox"
        	data-link="selected" />
		{{/if}}
  	</label>	
	</script>
	<script id="tmpl_paper_preview" type="text/x-jsrender">
	<div class="preview-title">
		试卷包含{{:~previewTitle(skills, questions)}}
		<span class="pull-right">时长{{:~prettyTime(totalTime)}}，共 {{:totalNum}} 道题</span>
	</div>
	{{if ~hasChoices(skills)}}
	<div class="preview-choice">
	选择题（{{:~totalChoices(difficulties)}} 道题）：
		<div class="preview-choice-graph"></div>
	</div>
	{{/if}}
	{{if ~hasSubjects(questions)}}
	<div class="preview-subject">
	编程题（{{:~totalSubjects(questions)}} 道题）：<br/>
	<span>
		{{:~subjectDesc(questions)}}
	</span>
	</div>
	{{/if}}
	</script>
	<script id="tmpl_authorize" type="text/x-jsrender">
	<label class="check-box set-authorize">
		<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  		<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:_authorize toggle='checked'}"></i></span>
   		<span>委托专人招聘</span>
  	</label><a class="ml15 authorize-tip" data-toggle="tooltip"><i class="fa fa-question-circle"></i>什么是委托招聘</a> 
	<div data-link="visible{:_authorize}">
		{^{if trustees.length}}
			<label class="control-label">已委托： </label>
		{{/if}}
		<ul class="list-trustee">
			{^{for trustees tmpl="#tmpl_trustee" /}}
		</ul>
		<div data-link="visible{:alert}" class="alert alert-danger autorize-alert">{^{:alert}}</div>
		<div class="form-inline">
			<div class="form-group">
				<label for="trustee_email" class="control-label">委托招聘人邮箱 </label>
				<input data-link="readOnly{:_checking}" type="email" class="ml10 form-control" id="trustee_email" placeholder="请输入委托招聘人的Email">
			</div>
			<button data-link="disabled{:!_emailValid || _checking}" type="button" class="btn btn-warning btn-add-trustee">
				<i class="fa fa-plus" data-link="class{merge:_checking toggle='fa-spin'}"></i>
			</button>
		</div>
	</div>
	</script>
	<script id="tmpl_trustee" type="text/x-jsrender">
	<li>{{:emailGranted}}<a class="trustee-remove"><i class="fa fa-minus"></i></a></li>
	</script>
	<%@include file="common/footer.jsp"%>
</body>
</html>
