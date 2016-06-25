<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<title>百一测评</title>
<jsp:include page="common/meta4link.jsp"></jsp:include>
<link href="<%=request.getContextPath()%>/plugin/buttons.css" rel="stylesheet"
	type="text/css" />
<link href="<%=request.getContextPath()%>/plugin/codemirror-3.21/lib/codemirror.css"
	rel="stylesheet" type="text/css">
<link href="<%=request.getContextPath()%>/core/css/skill_report.css" rel="stylesheet"
	type="text/css" />
<link href="<%=request.getContextPath()%>/core/css/testReport.css"
	rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<%=request.getContextPath()%>/core/js/skill_report.js"></script>
<script type="text/javascript">
	var POSITION_ID = "${requestScope.position_id}";
	var TEST_ID = "${requestScope.test_id}";
	var PASSPORT = "${requestScope.passport}";
	var show_sample = "${requestScope.show_sample}";
	var jump = "${param.jump}"
	var report;
</script>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path;
	request.setAttribute("basePath", basePath);

	String hasReport = (String) request.getAttribute("hasReport");
	if ("1".equals(hasReport)) {
%>
<script type="text/javascript">
	var report = ${requestScope.report};
</script>
<%
	}
%>
</head>
<body>
<div class="report" style="padding-bottom:10px;">
<!--header  -->	
	<div class="header_report">
			<span id="test-name"></span>
			<div id="personPhoto">
				<img src="${basePath}/core/images/portrait_default_big.png" class="m0 img-thumbnail portrait pull-right">
			</div>
	</div>
<!-- 基本信息 -->	
<div  class="nameinfo" id="report_btn">
    <div class="my-col-12 base_info regularinfo"></div>
</div>
<!-- 图表 -->
<div class="row tech-base-analysis gone">
            <div class="sed_title my-col-12 gone">技能选择题分析</div>
      <!--       
				<p class="text-ltitle">
					<span class="examinee-name"></span>技能选择题分析
				</p>
		 -->	<div class="my-col-12">	
				<div class="my-col-6 skill-analysis gone">
					<p class="text-center title-sm">技能分项分析</p>
					<div id="graph_tech_base"></div>
				</div>
				<div class="my-col-6 time-ans-analysis gone">
					<p class="text-center title-sm ">技能占比和答题时间分析</p>
						<a href=""></a>
						<div id="graph_time-ans"></div>
				</div>
				</div>
	</div>
<!-- 面试评分 -->	
			<div class="row hr_remark gone">
			<div class="anchor"></div>	
	
	<div class="sed_title title" id="video-interview">面试得分：
	  <small></small><i id="camera-video"
						class="fa fa-video-camera click_camera" data-placement="bottom"
						data-toggle="tooltip" title="点击查看面试视频"></i>
	</div>
				
				<div class="my-col-12 change-score" style="margin-top:50px;" id="change-score">
				<div class="my-col-3">
					<div class="titlea" id="interview-area" style="display:none">
						<div class="hr_score_operation pull-left edit-score-content">
							<a id="confirm_score" style="color:#e67e22;"><i class="icon-edit"></i>
							</a><a id="hr_score_cancel" style="color:#e67e22;"><i class="icon-undo"></i> 取消</a><span
								class="hr_score_hint"></span>
						</div>
					</div>
					</div>
					<div class="my-col-9 interviewBack">
					<div style="margin:0px;" class="score_editor">
						<div class="slider"></div>
					</div>
					</div>
				</div>
				<div class="my-col-12">
					<div class="my-col-3" class="interview-modify-btn">
						<div class="titlea">
							<div class="hr_score_operation edit-score-content"
								id="hr_score_btn">
								<a style="color:#e67e22;"><i class="icon-edit"></i> 修改打分</a>
							</div>
						</div>
					</div>
					
					
					<div class="my-col-9 interviewBack">
						<div id="graph_hr_score"></div>
					</div>
				</div>
			</div>
			

	
<!-- 答题情况 -->	
	
	
	<!-- container -->
	<div class="tab-content">
		<div class="tab-pane fade in active" id="report_btn">
			
			<div id="testReport" style="display:none;">

				<div class="content">
					<!-- 报告头部分 -->
					<div class="title_username sed_title"></div>
					<!-- 试卷内容展示部分 -->

					<div class="report_content">
						<!-- 选择题部分 -->
						<div id="sel_report_content" style="display:none">
							<div id="select" class="parttitle">技能选择题
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
								<span>以下是自定制的题目部分</span>
								<div>
									<div class="skill_content_title"></div>
								</div>
							</div>
						</div>
						<div class="systemcontent" id="systemcontent">
							<div id="system"
								style="height:55px;line-height:55px;display:none">
								<div class="parttitle">编程题<span class="sysAvgScore">平均分：0</span></div>
							</div>
							<div id="system_list" class="score_content"
								style="margin-left:27px">
								<ul class="list-inline items-score">
								</ul>
							</div>
						</div>
						<br> <br>

					</div>
				</div>

			</div>
			<div class="row abnormal">
			   <div class="sed_title">答题过程中监控到的异常图片</div>

			</div>
		</div>
		<!-- endcontainer -->
		<!-- <div class="container main tab-pane fade active" id="modal_btn">
			<div class="row">
				<div class="col-sm-12">
					<p class="title">测评要求</p>
					<p class="paragraph pl20 pos-desc"></p>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6">
					<p class="title">题型结构组成</p>
					<p class="paragraph content pl20 partDesc"></p>
					<p class="paragraph content pl20 totalTime"></p>
				</div>
				<div class="col-md-6">
					<p class="title">试卷考核重点</p>
					<div class="pl20 model_tags">
						
						<span class="model_tag">JavaBean</span> <span class="model_tag">http协议</span> <span class="model_tag">数据库</span> <span
							class="model_tag">jsp</span> <span class="model_tag">Servlet</span> <span class="model_tag">shell</span> <span
							class="model_tag">html</span> <span class="model_tag">oracle</span> <span class="model_tag">JavaScript</span> <span
							class="model_tag">多线程</span>
						
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<p class="title">选择题考核分布（技能基础）</p>
					<div id="model_ratio"></div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<p class="title">编程题考核分布（编程能力）</p>
					<p class="paragraph content pl20 code_ratio"></p>
				</div>
			</div>
		</div> -->
	</div>

</div>	

	<!-- modal：面试题播放 -->
<!-- 	<div class="modal fade" id="interview_video" tabindex="-1" -->
<!-- 		role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> -->
<!-- 		<div class="modal-dialog"> -->
<!-- 			<div class="modal-content"> -->
<!-- 				<div class="modal-header"> -->
<!-- 					<button type="button" class="close" data-dismiss="modal" -->
<!-- 						aria-hidden="true">&times;</button> -->
<!-- 					<h4 class="modal-title f16 mb5 " id="myModalLabel"></h4> -->
<!-- 					<div class="video-play"> -->
<!-- 						<a style="display:block;width:520px;height:330px" -->
<!-- 							id="video_player"> </a> -->
<!-- 					</div> -->
<!-- 				</div> -->
<!-- 				<div class="modal-body p0"> -->
<!-- 					<div id="interview_player"></div> -->
<!-- 				</div> -->
<!-- 			</div> -->
			<!-- /.modal-content -->
<!-- 		</div> -->
		<!-- /.modal-dialog -->
<!-- 	</div> -->
	<!-- /.modal -->

	<!-- modal：面试题播放 -->
		<div id="interview_video" aria-hidden="false" style="display: none;">
			<div class="i-skill-mask"></div>
			<div id="viewbody" class="view-model"
				style="padding:15px;width: 550px; height: auto;left:50%;margin-left:-275px; z-index: 10001; top: 80px; position: fixed;">
				<button type="button" class="close" data-dismiss="modal"
							aria-hidden="true">&times;</button>
						<h4 class="modal-title f16 mb5 "></h4>
				<a style="display:block;width:520px;height:330px"
								id="video_player"> </a>
			</div>
		</div>
	
	<!-- /.modal -->

	<!-- 提示框 -->
	<div class="modal fade waiting_modal" id="modal_waiting">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<span class="spinner"></span> <span class="title pull-left"></span>
				</div>
			</div>
		</div>
	</div>

	<!-- registerBanner -->
	<div id="registerBanner" style="display:none"></div>

	<%@include file="common/footer.jsp"%>
</body>
</html>
<script type="text/javascript"
	src="${basePath}/core/js/registerBanner.js"></script>
