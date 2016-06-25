<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.Random" %>
<!DOCTYPE html>
<html>
<head>
<title>创建一个校招微信测评--百一</title>
<jsp:include page="common/meta.jsp"></jsp:include>

<link href="${pageContext.request.contextPath }/plugin/codemirror-3.21/lib/codemirror.css" rel="stylesheet"
	type="text/css" />
<link href="${pageContext.request.contextPath }/plugin/datepicker/datepicker.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/create_campus.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/plugin/datepicker/bootstrap-datepicker.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/plugin/datepicker/locales/bootstrap-datepicker.zh-CN.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/plugin/uploadify/jquery.uploadify.min.js?ver=<%=(new Random().nextInt(99999)) %>" type="text/javascript"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/create_campus.js"></script>
<script type="text/javascript">
	var EMPLOYER_ID = "${sessionScope.employer_id}";
	var POSITION_ID = "${requestScope.position_id}";
	var REAL_TIME = "${requestScope.realtime}";
	var JESEESION_ID = "${pageContext.session.id}";
</script>
</head>
<body>
	<div class="modal fade" id="modal_guide">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-body p0"></div>
				<div class="modal-footer" style="text-align: center;">
					<button type="button" class="btn btn-success btn-lg">
						去查看测评详情
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_splash">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-body p0"></div>
				<div class="modal-footer" style="text-align: center;">
					<button type="button" class="btn btn-success btn-lg" data-dismiss="modal">开始创建</button>
				</div>
			</div>
		</div>
	</div>
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
	<div class="container">
		<div class="row">
			<div class="col-xs-12" id="titleMain">
				<h1 class="main-title">创建一个校招微信测评</h1>
			</div>
		</div>
	</div>
	<div class="container main-container">
		<div class="row">
			<div class="col-xs-12">
				<ul class="step_list">
					<!-- 第一步,添加宣讲会 -->
					<li class="row step step1" id="step1">
						<div class="col-xs-7">
							<dl class="dl-horizontal mb0">
								<dt>测评名称</dt>
								<dd class="position-name"></dd>
							</dl>
							<dl class="dl-horizontal mb0 weixin-main">
							</dl>
							<div class="flash-uninstall-alert"></div>
							<div class="activity-import-alert"></div>
							<div class="panel panel-default mt20 activity-panel">
								<div class="panel-heading">
									宣讲会 <span class="activity-template"> <a class="import-template"
										href="http://101testneeds.oss-cn-beijing.aliyuncs.com/template_xls/%E5%AE%A3%E8%AE%B2%E4%BC%9A%E6%A8%A1%E7%89%88.xls">下载模板</a>
										<input id="importActivityBtn" type="file" class="btn-import-activity" />
									</span>
								</div>
								<div class="panel-body activity-list"></div>
								<div class="panel-footer p0 activity-info"></div>
							</div>
							<div class="clearboth"></div>
						</div>
						<div class="col-xs-5">
							<div style="margin-top: 170px;"></div>
							<div class="add-activity-main"></div>
						</div>
						<div class="next-step"></div>
					</li>
					<!-- 第二步，选择试卷 -->
					<li class="step step2" id="step2">
						<div class="paper-main"></div>
						<div class="next-step"></div>
					</li>
					<!-- 第三步，选择信息 -->
					<li class="step step3" id="step3">
						<div class="config-info-main"></div>
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
		data-bcEvent="{{:bcEvent}}"
		data-link="disabled{:!nextStepAvailable}
				   class{merge:!nextStepAvailable toggle='btn-next-step-disable'}"
		class="btn btn-info btn-lg w200 ml10 pull-left btn-step btn-next-step">
		{^{:nextStepContent || '下一步 <i class="fa fa-arrow-right"></i>'}}</button>
		{{/if}}
		<span class="text-danger pull-left ml10 mt5 info">{^{:alert}}</span>
		</script>
	<script id="tmpl_titleMain" type="text/x-jsrender">
	{^{if mode}}
		<h1 class="main-title">正在编辑：{^{:data.positionName}}</h1>
		{{if !editable}}
		<div class="alert alert-warning">
			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
			<i class="fa fa-info"></i> 由于当前测评已经发起过邀请，所以只能修改基本的信息啦
		</div>
		{{/if}}
	{{else}}
		<h1 class="main-title">创建一个测评</h1>
	{{/if}}		
	</script>
	<script id="tmpl_step1_flash_alert" type="text/x-jsrender">
		<div class="alert alert-danger alert-dismissable" data-link='visible{:flashInstalled}'>
			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
			发现您使用的浏览器没有安装flash player，这会影响您对【导入宣讲会】功能的使用。<br/>请点击<a target="_blank" href="https://get.adobe.com/cn/flashplayer/">安装</a>flash
		</div>
	</script>
	<script id="tmpl_step1_import_alert" type="text/x-jsrender">
		<div class="alert alert-danger alert-dismissable" data-link='visible{:_importAlert}'>
			{^{:_importAlert}}
		</div>
	</script>
	<script id="tmpl_step1_weixinMain" type="text/x-jsrender">
		<dt class="weixin-company">{^{if ~propFrozen()}}公众号{{else}}选择公众号{{/if}}</dt>
		<dd class="weixin-company">
		<div class="btn-group w" data-toggle="buttons">
			<label data-link="class{:weixinCompany==0?'btn btn-info':'btn btn-default'} 
							class{merge:~propFrozen() toggle='br4'}
							visible{:~weixinCompanyRadioVisible(weixinCompany, 0)}
							disabled{:~propFrozen()}"> 
				<input data-link="{:weixinCompany:} disabled{:~propFrozen()}" type="radio" name="weixinCompany" value=0> 用百一的微信公众号考试
			</label> 
			<label data-link="class{:weixinCompany==1?'btn btn-info':'btn btn-default'} 
							class{merge:~propFrozen() toggle='br4'}
							visible{:~weixinCompanyRadioVisible(weixinCompany, 1)}
							disabled{:~propFrozen()}"> 
				<input data-link="{:weixinCompany:} disabled{:~propFrozen()}" type="radio" name="weixinCompany" value=1> 用企业的微信公众号考试
			</label>
		</div>
		</dd>
		<div class="mb0">
			<label class="check-box notify-score">
			<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  			<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:notifyScore toggle='checked'}"></i></span>
    		<span>微信答题后让学生知晓分数</span>
  			</label>
		</div>
	</script>
	<script id="tmpl_activity_add" type="text/x-jsrender">
	<div data-link="class{:_activityMode==1?'add-activity':'add-activity add-activity-edit'}">
		<div class="a-item">
			<span class="a-key require">学校</span>
			<div class="dropdown-menu auto-hint auto-hint-college" role="menu" aria-labelledby="dLabel">
				{^{if _collegeHintLoading}}
					<div class="item college-item"><i class="fa fa-refresh fa-spin"></i></div>
				{{else}}
					{^{for _collegeHintList tmpl="#tmpl_college_item" /}}
				{{/if}}
			</div>
			<input data-toggle="dropdown" data-link="_college" type="text" class="a-val form-control" placeholder="请填写学校">
		</div>
		<div class="a-item">
			<span class="a-key require">城市</span>
			<input data-link="_city" type="text" class="a-val form-control" placeholder="请填写城市">
		</div>
		<div class="a-item">
			<span class="a-key require">具体地点</span>
			<div class="dropdown-menu auto-hint auto-hint-address" role="menu" aria-labelledby="dLabel">
				{^{if _signalLoading}}
				<div class="item"><i class="fa fa-refresh fa-spin"></i></div>
				{{else}}
					{^{for _addressList tmpl="#tmpl_address_item" /}}
				{{/if}}
			</div>
			<input data-toggle="dropdown" data-link="_address" type="text" class="a-val form-control" placeholder="请填写具体地点">
		</div>
		<div class="a-item">
			<span class="a-key">座位数</span>
			<input data-link="_seatNumber" type="text" class="a-val seatNumber form-control" placeholder="请输入座位数">
		</div>
		<div class="a-item">
			<span class="a-key require">日期</span>
			<input data-link="_activityDate" type="text" class="a-val form-control" placeholder="请选择日期">
		</div>
		<div class="a-item a-inline">
			<span class="a-key require">起止时间</span>
			<div class="dropdown-menu sets-timepicker" style="margin-left:64px;" data-timepicker="content" role="menu" aria-labelledby="dLabel">
			</div>
			<input data-link="_beginTime" data-timepicker='trigger' data-toggle="dropdown" type="text" class="a-val a-val-short form-inline form-control timeInput beginTimeInput" placeholder="请选择开始时间">
		</div>
		<div class="a-item a-inline">
			<span class="a-key a-inline">到</span>
			<div class="dropdown-menu sets-timepicker" style="margin-left:-5px;" data-timepicker="content" role="menu" aria-labelledby="dLabel">
			</div>
			<input data-link="_endTime" data-timepicker="trigger" data-toggle="dropdown" type="text" class="a-val a-val-short form-inline form-control timeInput endTimeInput" placeholder="请选择结束时间">
		</div>
		<button class="mt10 btn btn-info btn-add-activity" data-link="disabled{:!_addActivityBtnAvailable}
		class{:_activityMode==1?'mt10 btn btn-info btn-add-activity':'mt10 btn btn-danger btn-add-activity'}" type="button">
			{^{if _activityMode==1}}
				<i class="fa fa-plus"></i> 添加宣讲会
			{{else _activityMode==2}}
				<i class="fa fa-pencil"></i> 完成编辑
			{{/if}}
		</button>
		{^{if _activityCheckInfo}}
		<span class="ml5 text-danger">{^{:_activityCheckInfo}}</span>
		{{/if}}
	</div>
	</script>
	<script id="tmpl_college_item" type="text/x-jsrender">
		<div data-key="{{:regionName}}" class="item college-item">{{:collegeName}}</div>
	</script>
	<script id="tmpl_address_item" type="text/x-jsrender">
		<div data-address="{{:address}}" data-seat="{{:seatNumber}}" class="item address-item">{{:address}}
		<span class="pull-right" data-link="visible{:signalStrength}"><i class="fa fa-signal"></i> {{:signalStrength}} {{signal:signalStrength}}</span>	
		</div>
	</script>
	<script id="tmpl_activity_item" type="text/x-jsrender">
	<div class="activity-item">
		<span class="activity-icon fa-stack"> <i class="fa fa-circle fa-stack-2x"></i> <i class="fa fa-graduation-cap fa-stack-1x fa-inverse"></i></span>
		<ul class="activity-left">
		<li>{{>activityDate}}</li>
		<li>{{>city}}</li>
		</ul><ul class="activity-right">
		<li class="text-primary">{{>college}} 
			{{if testState == 0}}
			<a class="btn-edit-activity"><i class="fa fa-pencil"></i></a>
			<a class="btn-remove-activity"><i class="fa fa-times"></i></a>
			{{else testState == 1}}
			（已开始 不可编辑）
			{{else testState == 2}}
			（已结束 不可编辑）
			{{else}}
			（不可编辑）
			{{/if}}
		</li>
		<li><i class="fa fa-map-marker"></i> {{>address}}</li>
		<li><i class="fa fa-clock-o"></i> {{>beginTime}} 到 {{>endTime}}</li>
		{{if seatNumber}}
		<li><i class="fa fa-users"></i> {{>seatNumber }}个</li>
		{{else}}
		<li><i class="fa fa-users"></i> 未知</li>
		{{/if}}
		</ul>
	</div>
	</script>
	<script id="tmpl_positionName" type="text/x-jsrender">
		<input data-link="positionName" type="text" name="test-positionName" class="w420 form-control vali positionNameInput" placeholder="请输入测评名称">
		</script>
	<!-- 第二步 -->
	<script id="tmpl_paper" type="text/x-jsrender">
	<div class="mb10">请在下面的列表中选择您要用来测评的试卷
			<button data-link="disabled{:_loading}" type="button" class="btn btn-link btn-papers-refresh">
				<i class="fa fa-refresh" data-link="class{merge:_loading toggle='fa-spin'}"></i>
			</button>
			{^{if ~count(papers)}}
				<button class="ml5 btn btn-info pull-right btn-paper-import"
				data-link="disabled{:~propFrozen()}">导入试卷</button>
				<button class="btn btn-info pull-right btn-paper-create"
				data-link="disabled{:~propFrozen()}">创建试卷</button>
			{{/if}}
		</div>
			{^{if _loading}}
				<div class="alert alert-info pl80">正在刷新试卷列表...</div>
			{{else}}
				{{for papers tmpl="#tmpl_paper_item"}}{{else}}
					<div class="alert alert-info pl80">
						<i class="fa fa-meh-o"></i> 呜呼！尚未添加试卷 
						<button class="btn btn-success btn-paper-create">创建试卷</button>
						或者
						<button class="btn btn-success btn-paper-import">导入试卷</button>
					</div>
				{{/for}}
			{{/if}}
		</script>
	<script id="tmpl_paper_item" type="text/x-jsrender">
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
	<!-- 第三步 -->
	<script id="tmpl_configInfo" type="text/x-jsrender">
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
	<!-- end templates -->
	<!--footer -->
	<%@include file="common/footer.jsp"%>
	<!--end footer -->
</body>
</html>
