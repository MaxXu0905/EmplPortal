<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>发送测评邀请--百一</title>

<script type="text/javascript">
	var TEST_ID = "${test_id}";
	var type = "${paper_type}";
	var part = "${param.part}";
	var sampleView = "${requestScope.sampleView}";
</script>
<link href="${pageContext.request.contextPath }/plugin/buttons.css"
	rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/testReport.css"
	rel="stylesheet" type="text/css" />
<link
	href="${pageContext.request.contextPath }/plugin/codemirror-3.21/lib/codemirror.css"
	rel="stylesheet" type="text/css" />
<script type="text/javascript"
	src="${pageContext.request.contextPath }/core/js/testReportCommon.js"></script>


</head>

<body style="position: relative;">
	<!-- <div class="nav-main"
		style="position: fixed;left:0;top:40px;width:80px">
		<ul class="floatTitle nav">
			<li class="floatSkill float_select"><a href="#select">选择题</a>
			</li>
			<li class="floatSkill float_system"><a href="#system">编程题</a>
			</li>
			<li class="floatSkill float_aq"><a href="#essays">技术问答题</a>
			</li>
			<li class="floatSkill float_iq"><a href="#iq">智力题</a>
			</li>
			<li class="floatSkill float_video"><a href="#video">面试题</a>
			</li>
		</ul>
	</div>
 -->	<div class="content container" style="width: 100% !important">
		<!-- 报告头部分 -->
		<div class="title" style="width:103% !important;margin-left:-14px;background-color:rgb(241,241,241)">
			<span class="title_username" style="font-size:16pt !important"></span>
		</div>

		<!-- 试卷内容展示部分 -->

		<div class="report_content">
			<!-- 选择题部分 -->
			<div id="sel_report_content">
				<div id="select"
					style="display:none;height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)">
					<span style="padding-left:20px">选择题</span>
				</div>
				<br>
				<div class="score_content" id="">
					<ul class="list-inline items-score">
						<!-- <li class="score-item">百一选择题
						<div class="score-val-0">0</div></li>
					<li class="score-item">自定制选择题
						<div class="score-val-1">0</div></li> -->
					</ul>
					<ul class="select_title_content">
						<li>百一选择题：<span class="byscore"
							style="clear:both;color:#ff6000"> </span>&nbsp;&nbsp;</li>
						<li>自定制选择题：<span class="sysscore" style="color:#ff6000"></span>
						</li>
					</ul>
				</div>
				<br>
				<!-- 选择题内容 -->
				<div class="select_exam_content">
					<span style="margin-left:32px">以下是自定制的题目部分</span>
					<div>
						<div class="skill_content_title">
				</div>
			</div>
		</div>
	</div>
			<div class="systemcontent" id="systemcontent">
				<div id="system" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219);display:none">
					<span style="padding-left:20px">编程题</span> <span
						style="padding-left:20px;font-size:14pt" class="sysAvgScore">平均分：0</span>
				</div>
				<div id="system_list" class="score_content" style="margin-left:27px">
					<ul class="list-inline items-score">
					</ul>
				</div>
			</div>
			<br> <br>

	<!-- modal：面试题播放 -->
	<div class="modal fade" id="interview_video" tabindex="-1"
		role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title f16 mb5" id="myModalLabel"></h4>
					<a style="display:block;width:520px;height:330px" id="video_player">
					</a>
				</div>
				<div class="modal-body p0">
					<div id="interview_player"></div>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	</div>
	</div>
	<!-- /.modal -->
</body>
</html>
<!--footer -->
<!--end footer -->