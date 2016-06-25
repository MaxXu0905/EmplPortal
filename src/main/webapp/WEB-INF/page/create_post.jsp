<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>创建一个测评--百一</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/plugin/codemirror-3.21/lib/codemirror.css" rel="stylesheet"
	type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/create_post.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/create_post.js"></script>
<script type="text/javascript">
	var POSITION_ID = "${requestScope.position_id}";
	var EMPLOYER_ID = "${sessionScope.employer_id}";
	var OUT_CALL_TYPE = "${requestScope.outCallType}";
</script>
</head>
<body>
	<div class="modal fade waiting_modal" id="modal_waiting">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<span class="spinner"></span> <span class="title pull-left"></span>
				</div>
			</div>
		</div>
	</div>
	<!-- header -->
	<%@include file="common/header.jsp"%>
	<!-- end header -->
	<!-- container -->
	<div class="container position">
		<div class="row">
			<div class="col-xs-12" id="titleMain">
				<h1 class="main-title">创建一个测评</h1>
			</div>
		</div>
	</div>
	<div class="container main-container">
		<div class="row">
			<div class="col-xs-12">
				<ul class="step_list">
					<!-- 第一步 -->
					<li class="step step1" id="step1">
						<dl class="dl-horizontal mb0">
							<dt>职位类别</dt>
							<dd class="series-main"></dd>
							<dt>职位级别</dt>
							<dd>
								<div class="dropdown">
									<input data-toggle="dropdown" type="text" placeholder="请选择一个级别"
										class="w420 form-control test-levelInput un-select" readonly>
									<ul class="dropdown-menu test-level" role="menu" aria-labelledby="dLabel">
									</ul>
								</div>
							</dd>
							<dt>测评名称</dt>
							<dd class="position-name"></dd>
						</dl>
						<div class="paper-main"></div>
						<div class="next-step"></div>
					</li>
					<!-- 第er步 -->
					<li class="step step2" id="step2">
						<div class="config-info-main"></div>
						<div class="divider"></div>
						<div class="authorize-main"></div>
						<div class="next-step"></div>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<!-- endcontainer -->
	<!-- templates -->
	<script id="tmpl_step_nextMain" type="text/x-jsrender">
		{{if !firstStep}}
		<button class="btn btn-default btn-lg w200 pull-left btn-step btn-pre-step">
		<i class="fa fa-arrow-left"></i> 上一步</button>
		{{/if}}
		{{if finalStep}}
		<button 
		data-link="disabled{:nextStepAvailable?false:true}
				   class{merge:!nextStepAvailable toggle='btn-next-step-disable'}"
		class="btn btn-info btn-lg w200 pull-left ml10 btn-step btn-final-step">
		{^{:nextStepContent || '下一步 <i class="fa fa-arrow-right"></i>'}}</button>
		{{else}}
		<button 
		data-link="disabled{:nextStepAvailable?false:true}
				   class{merge:!nextStepAvailable toggle='btn-next-step-disable'}"
		class="btn btn-info btn-lg w200 ml10 pull-left btn-step btn-next-step">
		{^{:nextStepContent || '下一步 <i class="fa fa-arrow-right"></i>'}}</button>
		{{/if}}
		<span class="text-danger pull-left ml10 mt5 info">{^{:alert}}</span>
	</script>
	<script id="tmpl_titleMain" type="text/x-jsrender">
	{^{if mode}}
		<h1 class="main-title">正在编辑：{^{:data.position.positionName}}</h1>
		{{if !editable}}
		<div class="alert alert-warning">
			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
			<i class="fa fa-info"></i> 由于当前测评已经发起过邀请，所以只能修改测评名称、应聘者的信息标签和委托人邮箱啦。
		</div>
		{{/if}}
	{{else}}
		<h1 class="main-title">创建一个测评</h1>
	{{/if}}
	</script>
	<script id="tmpl_step1_seriesMain" type="text/x-jsrender">
		<div class="dropdown">
			<input readonly data-link="{:seriesName:}
			disabled{:~propFrozen()}" data-toggle="dropdown" type="text" name="test-series" class="w420 form-control vali test-seriesInput" placeholder="请选择一个类别">
			<div class="dropdown-menu tab-select-wrapper" role="menu" aria-labelledby="dLabel">
				<ul class="select-tabs"></ul>
				<div class="select-content"></div>
			</div>
		</div>
	</script>
	<script id="tmpl_step1_seriesTab" type="text/x-jsrender">
			<li data-link="data-tab{:seriesId}">{{:seriesName}}</li>
	</script>
	<script id="tmpl_step1_seriesTabContent" type="text/x-jsrender">
		<div data-link="data-tab{:seriesId}">
			{{if children && children.length > 0}}
				{{for children}}
					<span data-link="data-series{:seriesId} class{:sysQuestionNumber?'build-in series':'series'}">
						{{:seriesName}}
					</span>
  				{{/for}}
			{{else seriesId == 900}}
				<span class="empty"><i class="fa fa-meh-o"></i> 没有找到合适的职位类别？在输入框自定义一个吧</span>
			{{else}}
				<span class="empty"><i class="fa fa-meh-o"></i> 即将上线</span>
			{{/if}}
		</div>
	</script>
	<script id="tmpl_step1_levelSelect" type="text/x-jsrender">
		<li class="w420"><a data-link="data-level{:levelId}" class="level">{{:levelName}}</a></li>
	</script>
	<script id="tmpl_step1_positionName" type="text/x-jsrender">
		<input data-link="positionName" type="text" name="test-positionName" class="w420 form-control vali positionNameInput" placeholder="请输入测评名称">
	</script>
	<script id="tmpl_step1_paper" type="text/x-jsrender">
		<div class="mb10">请在下面的列表中选择您要用来测评的试卷
			<button data-link="disabled{:!_loading&&_belongSeriesId&&_belongLevel?false:true}" type="button" class="btn btn-link btn-papers-refresh">
				<i class="fa fa-refresh" data-link="class{merge:_loading toggle='fa-spin'}"></i>
			</button>
			{^{if _belongSeriesId&&_belongLevel&&~count(papers)}}
				<button class="ml5 btn btn-info pull-right btn-paper-import"
				data-link="disabled{:~propFrozen()}">导入试卷</button>
				<button class="btn btn-info pull-right btn-paper-create"
				data-link="disabled{:~propFrozen()}">创建试卷</button>
			{{/if}}
		</div>
		{^{if _belongSeriesId && _belongLevel}}
			{^{if _loading}}
				<div class="alert alert-info pl80">正在刷新试卷列表...</div>
			{{else}}
				{{for papers tmpl="#tmpl_step1_paper_item"}}{{else}}
					<div class="alert alert-info pl80">
						<i class="fa fa-meh-o"></i> 呜呼！尚未添加试卷 
						<button class="btn btn-success btn-paper-create">创建试卷</button>
						或者
						<button class="btn btn-success btn-paper-import">导入试卷</button>
					</div>
				{{/for}}
			{{/if}}
		{{else}}
		<div class="alert alert-warning pl80">请选择职位类别和职位级别</div>
		{{/if}}
		</script>
	<script id="tmpl_step1_paper_item" type="text/x-jsrender">
		<div class="paper-item" data-index={{:#index}}  data-paperid={{:paperId}}
			data-link="class{merge:#parent.parent.data._selectedIndex==#index toggle='paper-item-active'}
			visible{:~paperItemVisible(#index, #parent.parent.data._selectedIndex)}">
				<div class="paper-select"
				data-link="class{merge:#parent.parent.data._selectedIndex==#index toggle='paper-selected'}">
					<i class="fa fa-check"></i>
				</div>
			{^{if #parent.parent.data._newPaperId==paperId}}<span class="icon-new shake"></span>{{/if}}
			<a href="${pageContext.request.contextPath }/sets/page/testReport/{{:paperId}}/3" target="_blank" class="paper-name">{{>paperName}}</a>
			{{if prebuilt}}
				<span class="label label-success label-sm build-in">百一</span>
			{{/if}}
			<ul class="list-inline base-info">
  				<li><i class="fa fa-users"> {{:answerNumber}} 个人答过</i></li>
  				<li><i class="fa fa-clock-o"> 时长 {{:~prettyTime(paperTime, '未知')}}</i></li>
  				<li><i class="fa fa-tasks"> {{:questionNum || 0}} 道题</i></li>
			</ul>
			<div class="create-time">
				创建于 {{:createDateDesc}}
			</div>
			<ul class="list-inline pull-right type-infos">
				<li class="type-info-header"
				data-link="class{merge:#parent.parent.data._focusIndex==#index toggle='type-info-header-active'}"
				>分项 <i class="fa fa-angle-right"></i>
					<div class="q-number">题目数 <i class="fa fa-angle-right"></i></div>
					{{!--
					<div class="avg-point">平均分 <i class="fa fa-angle-right"></i></div>
					--}}
				</li>
			{{for typeInfos}}
				<li class="type-info">{{:typeName}}
					<div class="q-number">{{:questionNumber}}</div>
					{{!--
					<div class="avg-point">{{:avgPoint||0}}分</div>
					--}}
				</li>
			{{/for}}
			</ul>
		</div>
		</script>
	<script id="tmpl_step2_configInfo" type="text/x-jsrender">
		<div class="alert alert-warning">
		<i class="fa fa-smile-o"></i> 想要了解应聘者的什么信息？快快选择吧！
		</div>
		{^{if _loading}}
		<div class="alert alert-info">
			<i class="fa fa-refresh fa-spin"></i> 正在加载信息标签...
		</div>
		{{else !_result}}
		<div class="alert alert-danger">
			<i class="fa fa-meh-o"></i> 呜呼！加载信息标签失败了
			<button class="btn btn-success btn-infos-refresh">重新加载</button>
		</div>
		{{/if}}
		<div class="row">
			<div class="col-xs-6">
			<div class="panel panel-info">
			<div class="panel-heading">已选信息（拖拽标签可以排序）</div>
			<div class="panel-body choosed-infos">
			{^{for mandatories}}
			<span data-infoid="{{:infoId}}" class="btn btn-default info-tag info-tag-fixed" disabled>
				{{>infoName}}
			</span>
			{{/for}}
			{^{for choosedInfos}}
			<span data-infoid="{{:infoId}}" class="btn btn-default info-tag info-tag-choosed">
				{{>infoName}}
			</span>
			{{/for}}
			</div></div></div>
			<div class="col-xs-6">
			<div class="panel panel-default">
			<div class="panel-heading">备选信息</div>
			<div class="panel-body unchoosed-infos">
			{^{for unchoosedInfos}}
			<span data-infoid="{{:infoId}}" class="btn btn-default info-tag info-tag-unchoosed">
				{{>infoName}}
			</span>
			{{/for}}
			</div></div></div>
		</div>
	</script>
	<script id="tmpl_step2_authorize" type="text/x-jsrender">
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
		<div class="form-inline">
			<div class="form-group">
				<label for="trustee_email" class="control-label">委托招聘人邮箱 </label>
				<input data-link="readOnly{:_checking}" type="email" class="ml10 form-control" id="trustee_email" placeholder="请输入委托招聘人的Email">
			</div>
			<button data-link="disabled{:!_emailValid || _checking}" type="button" class="btn btn-warning btn-add-trustee">
				<i class="fa fa-plus" data-link="class{merge:_checking toggle='fa-spin'}"></i>
			</button>
			<span data-link="visible{:alert}" class="alert alert-danger autorize-alert">{^{:alert}}</span>
		</div>
	</div>
	</script>
	<script id="tmpl_trustee" type="text/x-jsrender">
	<li>{{:emailGranted}}<a class="trustee-remove"><i class="fa fa-minus"></i></a></li>
	</script>
	<!-- end templates -->
	<!--footer -->
	<%@include file="common/footer.jsp"%>
	<!--end footer -->
</body>
</html>
