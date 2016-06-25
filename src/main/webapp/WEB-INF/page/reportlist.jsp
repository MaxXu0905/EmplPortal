<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>百一测评 - 企业门户</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/plugin/datepicker/datepicker.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/reportlist.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/timeLine.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/plugin/datepicker/bootstrap-datepicker.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/plugin/datepicker/locales/bootstrap-datepicker.zh-CN.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/reportlist.js"></script>
<script type="text/javascript">
	var POSITION_ID = "${requestScope.position_id}";
</script>
</head>
<body>
	<!-- header -->
	<%@include file="common/header.jsp"%>
	<!-- end header -->
	<!-- container -->
	<div id="wrapper" class="">
		<div class="container position">
			<div class="row">
				<div class="col-xs-10 position_info">
					<h1 class="main-title title"></h1>
					<ul class="list-inline mb0">
						<li class="create_time">创建于</li>
						<li><a class="paper-model" id="examModel">试卷预览 </a></li>
						<li><a class="activity-line gone">宣讲会 <i class="fa fa-angle-down"></i></a></li>
						<li class="activity-passport hidden"></li>
						<li><a class="activity-help gone">自助配置微信测评帮助</a></li>
					</ul>
				</div>
				<div class="col-xs-2" style="position:relative;">
					<div style="position: absolute;top: 0;left: 0;">
						<div class="position-btn">
							<a id="candi_invite_btn"><i class="fa fa-paper-plane"></i> 邀请候选人</a>
						</div>
						<!-- 
						<div class="position-btn">
							<a id="export_result"><i class="fa fa-paperclip"></i> 导出测评结果
							</a>
						</div>
						 -->
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="main">
		<div class="ghost-area">
			<div class="inner-edge mb20"></div>
			<div class="container pb30">
				<span class="spin"></span> <span class="hint text-center"></span>
				<div class="row">
					<div class="col-sm-12">
						<h4 class="title">测评要求</h4>
						<p class="content" id="position_desc_content"></p>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6">
						<h4 class="title">题型结构组成</h4>
						<p class="content partDesc"></p>
						<p class="content totalTime"></p>
					</div>
					<div class="col-md-6 skills"></div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<h4 class="title">选择题考核分布（主要考核技能基础）</h4>
						<div id="model_ratio"></div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<h4 class="title">编程题考核分布（主要考核编程能力）</h4>
						<p class="content code-ratio"></p>
					</div>
				</div>
			</div>
			<div class="inner-edge bottom"></div>
		</div>

		<!-- 活动线... -->
		<div class="ghost-area-activity">
			<div class="inner-edge mb20"></div>
			<div class="container pb30">
				<span class="spin"></span> <span class="hint text-center"></span>
				<div id="timeline">
					<ul id="dates">
					</ul>
					<ul id="issues">
					</ul>
				</div>
			</div>
			<div class="inner-edge bottom"></div>
		</div>

		<div class="container">
			<div class="divider-horizon"></div>
			<div class="row">
				<div class="col-xs-10 search-main" id="search-main"></div>
			</div>
			<div class="row report-list-container">
				<div class="col-xs-10 p0 tab-content report_list">
					<div class="row tab-pane fade in active" id="report_pane">
						<ul class="slats" id="report_list">
						</ul>
						<div class="morewrapper">
							<button class="btn btn-default none todo">加载更多...</button>
							<button class="btn btn-default none recommended">加载更多...</button>
							<button class="btn btn-default none elimination">加载更多...</button>
						</div>
					</div>
					<div class="row tab-pane fade" id="list_invited">
						<ul class="slats">
							<li class="group pane invited-pane">
								<table class="table table-hover invited_list">
									<thead>
										<tr>
											<th>候选人</th>
											<th>Email</th>
											<th>邀请时间</th>
											<th>状态</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
								<div class="morewrapper">
									<button class="btn btn-default">加载更多...</button>
								</div>
							</li>
						</ul>
					</div>
					<div class="row tab-pane fade" id="list_invalid">
						<ul class="slats">
							<li class="group pane invalid-pane">
								<table class="table table-hover invalid_list">
									<thead>
										<tr>
											<th>候选人</th>
											<th>Email</th>
											<th>邀请时间</th>
											<th>原因</th>
											<th class="text-center">操作</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
								<div class="morewrapper">
									<button class="btn btn-default">加载更多...</button>
								</div>

							</li>
						</ul>
					</div>
				</div>
				<!-- end of report_list -->
				<div class="col-xs-2 category">
					<ul id="side_oper" class="nav nav-pills nav-stacked .nav-justified">
						<li class="active"><a href="#report_pane" data-filter="todo" data-toggle="tab" class="blue reportlist"> <span
								class="badge pull-right">0</span><i class="fa fa-file-text-o"></i> 待处理
						</a></li>
						<li><a href="#report_pane" data-filter="recommended" data-toggle="tab" class="green reportlist"> <span
								class="badge pull-right">0</span><i class="fa fa-smile-o "></i> 已推荐
						</a></li>
						<li><a href="#report_pane" data-filter="elimination" data-toggle="tab" class="red reportlist"> <span
								class="badge pull-right">0</span><i class="fa fa-frown-o "></i> 已淘汰
						</a></li>
						<li class="divider"></li>
						<li><a href="#list_invited" data-toggle="tab" class="black"> <span class="badge pull-right">0</span> <i
								class="fa fa-link"></i> 已邀请
						</a></li>
						<li><a href="#list_invalid" data-toggle="tab" class="black"> <span class="badge pull-right">0</span> <i
								class="fa fa-chain-broken"></i> 失败的邀请
						</a></li>
					</ul>
				</div>
			</div>
			<!-- end of side_oper -->
			<div class="row">
				<div class="col-xs-12">
					<table class="gone" id="cm-detail-wrapper">
					</table>
				</div>
				<div id="comparator-wrapper">
					<div class="cm-alert alert alert-danger"></div>
					<div class="cm-list">
						<dl class="cm-item cm-item-empty">
							<dt>1</dt>
							<dd>还可继续添加</dd>
						</dl>
						<dl class="cm-item cm-item-empty">
							<dt>2</dt>
							<dd>还可继续添加</dd>
						</dl>
						<dl class="cm-item cm-item-empty">
							<dt>3</dt>
							<dd>还可继续添加</dd>
						</dl>
						<dl class="cm-item cm-item-empty">
							<dt>4</dt>
							<dd>还可继续添加</dd>
						</dl>
						<dl class="cm-item cm-item-empty">
							<dt>5</dt>
							<dd>还可继续添加</dd>
						</dl>
						<div class="cm-oper-wrapper">
							<button class="btn btn-info oper cm-trigger-btn">去对比</button>
							<a class="oper cm-cancel-btn">取消对比</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- endcontainer -->
	<script id="tmpl_search" type="text/x-jsrender">
	<div class="a-item a-inline">
		<span class="a-key">交卷时间：</span>
		<input data-link="commitPaperFromDate" type="text" class="a-val a-val-short form-inline form-control" placeholder="开始日期（包含）">		
	</div>
	<div class="a-item a-inline">
		<span class="a-key a-inline">-</span>
		<input data-link="commitPaperToDate" type="text" class="a-val a-val-short form-inline form-control" placeholder="结束日期（包含）">
	</div>
	<div class="a-item a-inline">
		<span class="a-key">分数：</span>
		<input _min data-link="min" type="text" class="a-val form-inline form-control" placeholder="0" style="text-align:center;width:46px;">
		<span class="" style="text-align:left;">以上（范围：0-10，可以是小数）</span>
	</div>
	<br/>
	<div class="a-item a-inline mt10">
		<span class="a-key">关键字：</span>
		<input data-link="inputKey" type="text" class="a-val form-inline form-control" placeholder="姓名，邮箱或电话号码">		
	</div>
	<span class="a-item a-inline mt10" data-link="visible{:positionIntents.length}">
		<span class="a-key">意向职位：</span>
		<select class="a-val form-control" data-link="positionIntentVal" style="width:220px;">
			<option value=''>选择...</option>
			{^{for positionIntents}}
				<option value="{{>id.codeId}}">{{>codeName}}</option>
			{{/for}}
		</select>
	</span>
	<a _search class="btn btn-info" style="margin-bottom:3px"><i class="fa fa-search"></i> 搜索</a>
	<a _searchCancel data-link="visible{:_searchFlag}">撤销搜索</a>
	<a class="btn btn-default" id="export_result"><i class="fa fa-paperclip"></i> 导出测评报告</a>
	</script>
	<!--footer -->
	<%@include file="common/footer.jsp"%>
	<!--end footer -->

	<!-- 模态提示框 -->
	<div class="modal fade waiting_modal" id="modal_waiting">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<span class="spinner"></span> <span class="title pull-left"></span>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="modal_guide">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-body p0"></div>
				<div class="modal-footer" style="text-align: center;">
					<button type="button" class="btn btn-success btn-lg">关闭</button>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
