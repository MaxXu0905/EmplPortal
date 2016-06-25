<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>创建一份试卷--百一</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/plugin/codemirror-3.21/lib/codemirror.css" rel="stylesheet"
	type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/create_paper.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/create_paper.js"></script>
<script type="text/javascript">
	var EMPLOYER_ID = "${sessionScope.employer_id}";
	var SERIES_ID = "${requestScope.seriesId}";
	var LEVEL = "${requestScope.level}";
	var POSITION_NAME = decodeURIComponent("${requestScope.positionName}");
</script>
</head>
<body>
	<div class="modal waiting_modal" id="modal_waiting">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<span class="spinner"></span> <span class="title pull-left"></span>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="modal_questionSelect">
		<div class="modal-dialog" style="width:1100px;">
		</div>
	</div>
	<!-- header -->
	<%@include file="common/header.jsp"%>
	<!-- end header -->
	<!-- container -->
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<h1 class="main-title">创建一份试卷</h1>
			</div>
		</div>
	</div>
	<div class="container main-container">
		<div class="row">
			<div class="col-xs-12">
				<ul class="step_list">
					<!-- 基本信息 -->
					<li class="step" id="baseInfo"></li>
					<!-- 考技能 -->
					<li class="step" id="skillMain"></li>
					<!-- 考智力 -->
					<li class="step" id="eqMain"></li>
					<!-- 考面试 -->
					<li class="step mb100" id="interviewMain"></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="create-main-backdrop"></div>
	<!-- 创建 -->
	<div class="create-main">
		<div class="container">
			<div class="row" id="createMain"></div>
		</div>
	</div>
	<!-- endcontainer -->
	<!-- templates -->
	<script id="tmpl_baseInfo" type="text/x-jsrender">
	<dl class="dl-horizontal m30 inline-block">
		<dt class="mb0">试卷名称</dt><dd class="mb0">
		<input data-link="paper.paperName" type="text" class="mb0 w500 form-control" placeholder="请输入试卷名称">
		</dd>
	</dl>
	</script>
	<script id="tmpl_skillMain" type="text/x-jsrender">
	<div class="step-header" data-link="class{merge:_skill toggle='step-header-checked'}">
	<label class="check-box test_skill">
		<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  		<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:_skill toggle='checked'}"></i></span>
   		<span>考技能</span>
  	</label><div class="divider"></div>
	</div>{{!-- end of header --}}
	<div class="step-body skill_setting" data-link="visible{:_skill}">
	<label class="check-box block test_choice">
		<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  		<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:_choice toggle='checked'}"></i></span>
   		<span>添加选择题</span>
  	</label>
	<div class="setting choice_setting" data-link="visible{:_choice}">
		<div class="alert alert-info mt15 mb20">
		请选择您要考核的技能（带有 <span class="icon-101"></span> 标志是百一内置题库，选择由百一题库提供的技能，百一会为您出题。 
		<a data-toggle="tooltip"><i class="fa fa-question-circle"></i></a> 如何出题）
		</div>
		{{!--搜索框 藏起来
		<div class="input-group w320 mb10" data-link="class{merge:_skillQueryInputFocus||_skillQuery toggle='w650'}">
  			<span class="input-group-addon"><i class="fa fa-search"></i></span>
			<input data-link="_skillQuery" type="text" class="last form-control skillQueryInput" placeholder="技能搜索 例：java">
		</div>
		--}}
		<div class="wapper-main">
			<div class="wapper-main-modal" data-link="visible{:_skillLoading}">
			</div>
			<div class="wrapper lib-wrapper">
				<div class="lib-list">
				{^{for _libs}}
				<div class="item" data-link="class{merge:#parent.parent.data._libSelectedIndex==#index toggle='item-selected'}">
					{^{if prebuilt}}<span class="icon-101"></span> {{/if}}
					{^{>qbName}}
					<i class="fa fa-angle-right"></i>
				</div>
				{{/for}}
				</div>
				<div class="lib-bottom">
				<a href="${pageContext.request.contextPath }/sets/page/questionlibMgr/" target="create_lib">去创建题库</a>
				{{!--
				<a class="pull-right mr20"><i class="fa fa-refresh"></i></a>
				--}}
				</div>
			</div>
			<div class="wrapper skill-wrapper">
			{^{for _skills}}
			<div class="item skill-item"
			data-link="class{merge:~hasSelected(skillId) toggle='skill-item-selected'}"
			>
				{^{>skillName}}
				<i class="fa fa-plus"></i>
			</div> 
			{{else}}
			<div class="skill-alert">
				{^{if #parent.data._libSelectedIndex>=0}}
				<i class="fa fa-frown-o"></i><br/>该题库下面还没有技能呢
				{{else}}
				<i class="fa fa-hand-o-left"></i><br/>通过左侧的题库选择技能
				{{/if}}
			</div>
			{{/for}}
			</div>
			<div class="wrapper chosen-wrapper">
				<div class="br0 ghost-main" 
				data-link="class{merge:_chosenSkills.length toggle='ghost-main-hide'}">
					<div class="alert-danger ghost-alert">
						<i class="fa fa-meh-o"></i> 百一不才，没有给您分析出任何技能~
					</div> 
					存在现成的测评要求？拷贝到这里，让百一帮你分析出技能
					<textarea type="text" class="form-control ghostInput" placeholder="例：精通Java，熟悉JavaScript"
					data-link="{:_ghostInput:}
					class{merge:_ghostInputFocus || _ghostInput toggle='ghostInput-focus'}"	></textarea>
					<button class="btn btn-info btn-ghost-commit" data-link="visible{:_ghostInput}">交给百一</button>			
				</div>
				<div class="chosen-list">
					{^{for _chosenSkills}}
					<div class="chosen-item">
						<span class="oper-pre skill-remove"><i class="fa fa-minus-circle"></i></span>
						<span class="oper-pre skill-index">{^{:#index+1}}、</span>
						<div class="skill-suf">
						<span class="skill-content">
							{^{if libType==1}}
							<span class="icon-101"></span> 
							{{/if}}
							{^{:skillName}}
						</span>
						<span class="oper-suf">
							{^{if libType}}
								<div class="btn btn-link tiny-select select-subjectnum pull-right ml10">
									{^{for ~getSubjectNums(degreeToQuestionNum[selectedDegreeIndex].questionLeast, degreeToQuestionNum[selectedDegreeIndex].questionMost)}}
									<span data-link="class{:num==#parent.parent.data.selectedSubNum?'selected':''}">{^{:num}}</span> 
									{{/for}}
									道题 <i class="fa fa-cog"></i>
								</div>
								<div class="btn btn-link tiny-select select-degree pull-right">
									{^{for degreeToQuestionNum}}
									<span data-link="class{:#index==#parent.parent.data.selectedDegreeIndex?'selected':''}">{^{:degreeName}}</span> 
									{{/for}}<i class="fa fa-cog"></i>
								</div>
							{{else}}
								<div class="btn btn-link tiny-info pull-right ml10">
									{^{:selectedSubNum}} 道题
								</div>
								<div class="btn btn-link tiny-info pull-right">
									{^{:~prettyTime(time)}}
								</div>
							{{/if}}
						</span>
						</div>
					</div>
					{{/for}}
				</div>
				<div class="chosen-bottom">
					您已经选择了 <span class="text-info">{^{:_chosenSkills.length}}</span> 个技能，<span class="text-info">{^{:_skillTotalCount}}</span> 道题，预计作答时长 <span class="text-info">{^{:~prettyTime(_skillTotalTime)}}</span>
				</div>
			</div>
		</div>
	</div>
	{{!--------------------- choice end ------------------------}}
	<label class="check-box block test_tech">
		<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  		<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:_tech toggle='checked'}"></i></span>
   		<span>添加编程题</span>
  	</label>
	<div class="setting tech_setting" data-link="visible{:_tech}">
		{^{if _baseInfo.leastSubjectNum}}
		<div class="part part-101"
		data-link="class{merge:!_techUse101 toggle='part-ban'}">
			<div class="part-content">
				<span class="pull-left"><span class="icon-101"></span> 百一题库已为您推荐</span>
				<a class="pull-left tiny-select select-technum inline-block">
					{^{for ~getSubjectNums(_baseInfo.leastSubjectNum, _baseInfo.mostSubjectNum)}}
						<span data-link="class{:num==#parent.parent.data._techSelectedNum?'selected':''}">{^{:num}}</span> 
					{{/for}}道 <i class="fa fa-cog"></i>
				</a><span class="pull-left">编程题，预计作答时长<span class="text-info">
				{^{:~prettyTime(_baseInfo.subjectAvgTime * _techSelectedNum)}}</span>。</span>
			</div>
			<div class="part-toggle">
				{^{if _techUse101}}
					<i class="fa fa-ban"></i> 不使用百一推荐的编程题
				{{else}}
					百一帮我推荐
				{{/if}}
			</div>
		</div>
		{{/if}}	
		<div class="part part-self"
		data-link="class{merge:!_techUseSelf toggle='part-ban'}">
			<div class="part-content">
			{^{if ~count(_customTechs) }}
				<a class="popup popup-tech">重新选择</a>
			{{else}}
				<a class="popup popup-tech">从自己的题库添加编程题</a>
			{{/if}}
			{^{for _customTechs tmpl="#tmpl_question"}}{{/for}}
			</div>
			<div class="part-toggle"
			data-link="class{merge:!~count(_customTechs) toggle='part-toggle-hide'}">
				{^{if _techUseSelf}}
					<i class="fa fa-ban"></i> 不使用自定义的编程题
				{{else}}
					自定义
				{{/if}}
			</div>
		</div>
	</div>
	{{!--------------------- tech end ------------------------}}
	<label class="check-box block test_qa">
		<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  		<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:_qa toggle='checked'}"></i></span>
   		<span>添加问答题</span>
  	</label>
	<div class="setting qa_setting" data-link="visible{:_qa}">
		<div class="part part-self"
		data-link="class{merge:!_qaUseSelf toggle='part-ban'}">
			<div class="part-content">
			{^{if ~count(_customQas) }}
				<a class="popup popup-qa">重新选择</a>
			{{else}}
				<a class="popup popup-qa">从自己的题库添加问答题</a>
			{{/if}}
			{^{for _customQas tmpl="#tmpl_question"}}{{/for}}
			</div>
			<div class="part-toggle"
			data-link="class{merge:!~count(_customQas) toggle='part-toggle-hide'}">
				{^{if _qaUseSelf}}
					<i class="fa fa-ban"></i> 不使用自定义的问答题
				{{else}}
					自定义
				{{/if}}
			</div>
		</div>
	</div>
	{{!--------------------- qa end ------------------------}}
	</div>{{!-- end of body(skill-setting) --}}
	</script>
	<script id="tmpl_question" type="text/x-jsrender">
	<div class="question">
		<pre class="question-title"><span class="question-index">{^{:#index+1}}</span>{^{: questionDesc}} <span class="text-info">{^{:~prettyTime(suggestTime)}}</span> </pre>
	</div>
	</script>
	<script id="tmpl_eqMain" type="text/x-jsrender">
	<div class="step-header" data-link="class{merge:_eq toggle='step-header-checked'}">
	<label class="check-box test_eq">
		<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  		<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:_eq toggle='checked'}"></i></span>
   		<span>考智力</span>
  	</label><div class="divider"></div>
	</div>{{!-- end of header --}}
	<div class="step-body setting eq_setting" data-link="visible{:_eq}">
		<div class="part part-101 mt20"
		data-link="class{merge:!_eqUse101 toggle='part-ban'}">
			<div class="part-content">
				{^{if _eqLoading}}
					<i class="fa fa-refresh fa-spin"></i> 百一正在帮您推荐一道智力题
				{{else _eqRecommend}}
					<span class="icon-101"></span> 已为您推荐了一道智力题，预计作答时长<span class="text-info">
					{^{:~prettyTime(_eqRecommend.time)}}</span>。
					<div class="question">
						<pre class="question-title question-title-quote">{^{:_eqRecommend.qDesc}}</pre>
					</div>
					<a class="change">换一道</a> 
				{{else}}
					<i class="fa fa-frown-o"></i> 百一题库还没有该类别的题目
				{{/if}}
			</div>
			<div class="part-toggle">
				{^{if _eqUse101}}
					<i class="fa fa-ban"></i> 不使用百一推荐的智力题
				{{else}}
					百一帮我推荐
				{{/if}}
			</div>
		</div>
		<div class="part part-self mb0"
		data-link="class{merge:!_eqUseSelf toggle='part-ban'}">
			<div class="part-content">
			{^{if ~count(_customEqs) }}
			<a class="popup popup-tech">重新选择</a>
			{{else}}
			<a class="popup popup-tech">从自己的题库添加智力题</a>
			{{/if}}
			{^{for _customEqs tmpl="#tmpl_question"}}{{/for}}
			</div>
			<div class="part-toggle"
			data-link="class{merge:!~count(_customEqs) toggle='part-toggle-hide'}">
				{^{if _eqUseSelf}}
					<i class="fa fa-ban"></i> 不使用自定义的智力题
				{{else}}
					自定义
				{{/if}}
			</div>
		</div>
	</div>{{!-- end of body(eq-setting) --}}
	</script>
	<script id="tmpl_interviewMain" type="text/x-jsrender">
	<div class="step-header" data-link="class{merge:_interview toggle='step-header-checked'}">
	<label class="check-box test_interview">
		<span class="fa-stack check-icon"><i class="fa fa-square-o fa-stack-2x"></i>
  		<i class="fa fa-check-square fa-stack-1x check" data-link="class{merge:_interview toggle='checked'}"></i></span>
   		<span>在线面试</span>
  	</label><div class="divider"></div>
	</div>{{!-- end of header --}}
	<div class="step-body setting interview_setting" data-link="visible{:_interview}">
		<div class="btn-group mt20 w" data-toggle="buttons">
			<label data-link="class{:_interviewUseType==1?'btn btn-info':'btn btn-default'}"> 
				<input type="radio" name="interviewUseType" value="1" data-link="_interviewUseType"> 百一帮我推荐
			</label> 
			<label data-link="class{:_interviewUseType==2?'btn btn-info':'btn btn-default'}"> 
				<input type="radio" name="interviewUseType" value="2" data-link="_interviewUseType"> 自定义
			</label>
		</div>
		<div class="part part-101 mt20" data-link="visible{:_interviewUseType==1}">
			<div class="part-content" style="line-height:25px">
				{^{if _interviewLoading}}
					<i class="fa fa-refresh fa-spin"></i> 百一正在帮您推荐一组面试题
				{{else _interviewRecommend}}
					<span class="icon-101"></span> 已为您推荐了一组面试题，预计作答时长<span class="text-info">
					{^{:~prettyTime(~iTotalTime(_interviewRecommend))}}</span>。
					{^{for _interviewRecommend.qbQuestion tmpl="#tmpl_question"}}{{/for}}
					<a class="change" style="right:0;">换一组</a>
				{{else}}
					<i class="fa fa-frown-o"></i> 百一题库还没有该类别的题目
				{{/if}}
			</div>
		</div>
		<div class="part part-self mb0 mt20" data-link="visible{:_interviewUseType==2}">
			<div class="part-content">
			{^{if _customInterview }}
				<a class="popup popup-tech">重新选择一组 </a>
				{^{if _customInterview}}
					您选择了面试题组<span class="text-info"> {^{:_customInterview.group}}</span>，预计作答时长<span class="text-info">
					{^{:~prettyTime(~ciTotalTime(_customInterview))}}</span>。
					{^{for _customInterview.rows}}
					<div class="question">
						<pre class="question-title"><span class="question-index">{^{:#index+1}}</span>{^{: title}} <span class="text-info">{^{:suggestMinutes}}分钟</span> </pre>
					</div>
					{{/for}}
				{{else}}
					获取面试题组题目列表出错了
				{{/if}}
			{{else}}
				<a class="popup popup-tech">从自己的题库添加一组面试题</a>
			{{/if}}
			</div>
		</div>
	</div>{{!-- end of body(eq-setting) --}}
	</script>
	<script id="tmpl_createMain" type="text/x-jsrender">
	<div class="col-xs-12" style="padding:0 45px;">
		试卷共包含 <span class="add-up">{^{:_paperTotalCount}}</span> 道题，预计作答时长 <span class="add-up">{^{:~prettyTime(_paperTotalTime)}}</span> 。
		<div class="btn-create-paper" data-link="disabled{:!(_paperTotalCount && paper.paperName)}">创建试卷</div>
		<div class="btn-overview" data-link="disabled{:!(_paperTotalCount && paper.paperName)}">试卷预览</div>
	</div>
	</script>
	<!-- end templates -->
	<!--footer -->
	<%@include file="common/footer.jsp"%>
	<!--end footer -->
</body>
</html>
