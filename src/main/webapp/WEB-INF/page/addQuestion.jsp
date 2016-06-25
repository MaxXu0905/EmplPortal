<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${title}</title>
<%@include file="common/meta.jsp"%>
<link href="<%=request.getContextPath()%>/core/css/addQuestion.css" rel="stylesheet">
</head>
<body>
	<!-- header -->
	<%@include file="common/header.jsp"%>
	<!-- end header -->

	<!--背景-->
	<div class="container position">
		<div class="row">
			<div class="col-xs-12" id="titleMain">
				<h1 id="title" class="main-title">添加选择题</h1>
			</div>
		</div>
	</div>
	<div class="container main-container">
		<div class="row">
			<div class="main-wrap col-md-12 col-xs-12 col-sm-12 ">
				<!-- 提示 -->
				<div id="alertInfo"
					class="tohide container navbar-fixed-top alert alert-warning ">
					<button id="alertClose" type="button" class="close">
						<span aria-hidden="true">×</span><span class="sr-only">Close</span>
					</button>
					<span id="alertInfo-text" href="#" class="alert-link"></span>
				</div>
				<!--end 提示 -->
				<!-- 选择题 -->
				<form id="question-form" role="form"></form>
				<!--end 选择题 -->

			</div>
		</div>
	</div>
	<!--  waiting_modal-->
	<div class="modal waiting_modal" id="modal_waiting">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<span class="spinner"></span> <span class="title pull-left"></span>
				</div>
			</div>
		</div>
	</div>
	<!--end   waiting_modal-->
</body>
<script type="text/javascript">
	var qbId = "${qbId}";
	var questionId = "${questionId}";
	var qbType = "${qbType}";
	var qbName = decodeURIComponent("${qbName}");
	var qbOperator = "${qbOperator}";
	var imgUploadUrl = "${imgUploadUrl}";
</script>
<script src="<%=request.getContextPath()%>/plugin/spin.min.js"></script>
<script type="text/javascript"
	src="${pageContext.request.contextPath }/core/js/setsValidation.js"></script>
<script src="<%=request.getContextPath()%>/core/js/addQuestion.js"></script>
  <!-- jUploader -->
  <link href="<%=request.getContextPath()%>/plugin/jUpload/css/fileinput.css"" rel="stylesheet">
<script src="<%=request.getContextPath()%>/plugin/jUpload/jquery.jUploader-1.01.min.js" type="text/javascript"></script>
<script src="<%=request.getContextPath()%>/core/js/uploadImg.js"></script>
<script id="selectTmpl" type="text/x-jsrender">
<!--表格类型 -->
							<input type="hidden" name="sheetType" value="{{:sheetType}}" />
							<dl class="dl-horizontal">
								<dt>选择技能  </dt>
								<dd>
									<div  class="dropdown">
										<!--技能-->
										<input type="hidden" name="skill" value="{{:skill}}" required/>
										<button class="btn btn-default dropdown-toggle" type="button"
											id="dropdownMenu" data-toggle="dropdown">
											<span id="skill">{{if skill}}{{:skill}}{{else}}请选择技能{{/if}}</span> <span class="caret"></span>
										</button >
										<div id="skills-dropdown" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
											<!-- 默认没有数据 -->
											<div class="filtrate" id="noskillfilter">
												<div class="group create">
													<div class="side-title"></div>
													<ul class="selections">
														<li id="noskill">请添加技能</li>
													</ul>
												</div>
											</div>
											<!--end 默认没有数据 -->
											<div id="currentskill" ></div>
											<div class="filter">
												<input id="skillsearch" class="form-control"
													placeholder="添加技能" />
											    	<button id="addSkill" class="btn btn-info" >
										   			<span class="glyphicon glyphicon-plus white"></span> 
									      			</button>
											</div>
										</div>
									</div>
								</dd>
								<dt>题干</dt>
								<dd>
									<div class="input-group">
											<textarea name="title"  data-link="title" 
										class="form-control vali topic" rows="4" placeholder="请输入题干" style="min-height: 94px;" required>{{:title)}}</textarea>
											<div id="titleUpload"  class=" input-group-btn valign-middle file-input-right" style="min-height: 94px;"></div>
									</div>
								</dd>
								<dt>答案选项</dt>
								{{for options}}
								  <dd>
									<div class="input-group">
									<span class="input-group-addon option-label">{{:~setOptions(#index)}}</span>
									{{if #index<2}} 
									<textarea name="options"   class="form-control horizontal_choice vali bottom_10"  placeholder="不能为空" required style="min-height: 54px;">{{:#data}}</textarea>
									{{else}}
									<textarea name="options"  class="form-control horizontal_choice vali bottom_10" placeholder="选项(可不填)" style="min-height: 54px;">{{:#data}}</textarea>
									{{/if}}
											<div id="optionUpload_{{:~setOptions(#index)}}"  class=" input-group-btn valign-middle file-input-right" style="min-height: 54px;"></div>
									</div>								
								  </dd>
								{{/for}}
								<dt>正确答案</dt>
								<dd class="correctOptions">
									{{for options}}
									<label id="correctoption_{{:~setOptions(#index)}}" 
										{{!--{{if (#index<2 || #data)}}--}}
										class="check-box">
										{{!--{{else}}
										 class="tohide check-box">
										{{/if}}--}}
										<input type="checkbox" class="" name="correctOptions"  value="{{:~setOptions(#index)}}" {{:~isSelect(#index,~root.correctOptions,'checked')}} required></input>
										<span class="fa-stack check-icon">
										<i class="fa fa-square-o fa-stack-2x"></i>
										<i class="fa fa-check-square fa-stack-1x check {{:~isSelect(#index,~root.correctOptions,'checked')}}"></i>
										</span>
										<span>{{:~setOptions(#index)}}</span>
									</label>
									{{/for}}
								</dd>
								<dt>难度</dt>
								<dd>
									<select name="level" value="{{:level}}" class="form-control" qbdifficul required>
									</select>
								</dd>
								<dt>作答时长</dt>
								<dd>
									<div class="auto input-group pull-left">
										<input type="text" name="suggestSeconds" placeholder="不能为空" value="{{:suggestSeconds}}" class="form-control vali vali-time" number required>
										<span class="input-group-addon">秒</span>
									</div>
									{{!--<span class="label label-warning alertInfo">不填将由百一为你推荐时长 <a class="white" data-toggle="tooltip"  title> <i class="fa fa-question-circle"></i></a></span>--}}
								</dd>
								<dd>
									<button id="toSubmit" class="btn btn-info add" 
										disabled="disabled">
										<span class="glyphicon glyphicon-plus white"></span> 添加
									</button>
									<button id="cancelSubmit" class="btn btn-warning">
										取消添加
									</button>
								</dd>
							</dl>						
</script>
<script id="programTmpl" type="text/x-jsrender">
	<input type="hidden" name="sheetType" value="{{:sheetType}}" />
	<dl class="dl-horizontal tab-pane" data-type="1"
								id="addition-type-1">
								<dt>编程题题干</dt>
								<dd>
									<div class="input-group">
											<textarea name="title"  data-link="title" 
										class="form-control vali topic" rows="4" placeholder="请输入题干" style="min-height: 94px;" required>{{:title)}}</textarea>
											<div id="titleUpload"  class=" input-group-btn valign-middle file-input-right" style="min-height: 94px;"></div>
									</div>
								</dd>
								<!--<dt>题干补充图片</dt>
								<dd>
								<div id="titleUpload"></div>
								</dd> -->
								<dt>参考答案</dt>
								<dd>
									<textarea class="form-control"  name="refAnswer" rows="4" required>{{:refAnswer}}</textarea>
								</dd>
								<dt>语言类型</dt>
								<dd>
									<select class="form-control" name="mode" value="{{:mode}}"  proglanguage required>
									</select>
								</dd>
								<dt>难度</dt>
								<dd>
									<select name="level" value="{{:level}}" class="form-control" qbdifficul required>
									</select>
								</dd>
								<dt>作答时长</dt>
								<dd>
									<div class="auto input-group">
										<input type="text" name="suggestMinutes" class="form-control vali vali-time"
											placeholder="不能为空" value="{{:suggestMinutes}}" required number> 
											<span class="input-group-addon">分钟</span>
									</div>
								</dd>
								<dd>
									<button id="toSubmit" class="btn btn-info add" 
										disabled="disabled">
										<span class="glyphicon glyphicon-plus white"></span> 添加
									</button>
									<button id="cancelSubmit" class="btn btn-warning">
										取消添加
									</button>
								</dd>
							</dl>
</script>
<script id="askTmpl" type="text/x-jsrender">
<input type="hidden" name="sheetType" value="{{:sheetType}}" />
	<dl class="dl-horizontal tab-pane" >
								<dt>问答题题干</dt>
								<dd>
									<div class="input-group">
											<textarea name="title"  data-link="title" 
										class="form-control vali topic" rows="4" placeholder="请输入题干" style="min-height: 94px;" required>{{:title)}}</textarea>
											<div id="titleUpload"  class=" input-group-btn valign-middle file-input-right" style="min-height: 94px;"></div>
									</div>
								</dd>
								<!--<dt>题干补充图片</dt>
								<dd>
								<div id="titleUpload"></div>
								</dd> -->
							    <dt>参考答案</dt>
								<dd>
									<textarea name="refAnswer" class="form-control answer" rows="4" >{{:refAnswer}}</textarea>
								</dd>
								<dt>难度</dt>
								<dd>
									<select name="level" value="{{:level}}" class="form-control" qbdifficul required>
									</select>
								</dd>
								<dt>作答时长</dt>
								<dd>
									<div class="auto input-group">
										<input type="text" name="suggestMinutes" class="form-control vali vali-time"
											placeholder="不能为空" value="{{:suggestMinutes}}" required number> 
                                        <span class="input-group-addon">分钟</span>
									</div>
								</dd>
								<dd>
									<button id="toSubmit" class="btn btn-info add" 
										disabled="disabled">
										<span class="glyphicon glyphicon-plus white"></span> 添加
									</button>
									<button id="cancelSubmit" class="btn btn-warning">
										取消添加
									</button>
								</dd>
							
	</dl>
</script>
<script id="iqTmpl" type="text/x-jsrender">
<input type="hidden" name="sheetType" value="{{:sheetType}}" />
<!--单选<input type="hidden" name="type" value="{{:type}}" /> -->
<input type="hidden" name="explainReqired" value="{{:explainReqired}}" />
	<dl class="dl-horizontal">
								<dt>题干</dt>
								<dd>
											<div class="input-group">
											<textarea name="title"  data-link="title" 
										class="form-control vali topic" rows="4" placeholder="请输入题干" style="min-height: 94px;" required>{{:title)}}</textarea>
											<div id="titleUpload"  class=" input-group-btn valign-middle file-input-right" style="min-height: 94px;"></div>
									</div>
								</dd>
						<!--<dt>题干补充图片</dt>
								<dd>
								<div id="titleUpload"></div>
								</dd> -->
								<dt>答案选项</dt>
								{{for options}}
								<dd>
									<div class="input-group">
									<span class="input-group-addon">{{:~setOptions(#index)}}</span>
									{{if #index<2}} 
									<textarea name="options"   class="form-control horizontal_choice vali bottom_10"  placeholder="不能为空" style="min-height: 54px;" required  >{{:#data}}</textarea>
									{{else}}
									<textarea name="options"  class="form-control horizontal_choice vali bottom_10" placeholder="选项(可不填)" style="min-height: 54px;">{{:#data}}</textarea>
									{{/if}}
										<div id="optionUpload_{{:~setOptions(#index)}}"  class=" input-group-btn valign-middle file-input-right" style="min-height: 54px;"></div>
									</div>								
								</dd>
								{{/for}}
								<dt>正确答案</dt>
								<dd class="correctOptions">
									{{for options}}
									<label id="correctoption_{{:~setOptions(#index)}}" 
										{{!--{{if (#index<2 || #data)}}--}}
										class="check-box">
										{{!--{{else}}
										 class="tohide check-box">
										{{/if}}--}}
										<input type="checkbox" class="tohide" name="correctOptions"  value="{{:~setOptions(#index)}}" {{:~isSelect(#index,~root.correctOptions,'checked')}} required></input>
										<span class="fa-stack check-icon">
										<i class="fa fa-square-o fa-stack-2x"></i>
										<i class="fa fa-check-square fa-stack-1x check {{:~isSelect(#index,~root.correctOptions,'checked')}}"></i>
										</span>
										<span>{{:~setOptions(#index)}}</span>
									</label>
									{{/for}}
								</dd>
								<dt></dt>
								<dd>
													
									<button id="refExplain_checkbox" type="button"
										{{if explainReqired=='是'}}
										class="btn btn-default bottom_10 horizontal_checkbox active">
										<span class="glyphicon glyphicon-check"></span>
										{{else explainReqired=='否'}}
										class="btn btn-default bottom_10 horizontal_checkbox">
										<span class="glyphicon glyphicon-check glyphicon-unchecked"></span>
										{{/if}}
											是否需要应聘者补充解释
									</button>
									<textarea name="refExplain" 
										{{if explainReqired=='是'}}
										class="form-control answer bottom_10"
										{{else  explainReqired=='否'}}
										class="form-control answer bottom_10 tohide"
										{{/if}}
										placeholder="在这里填写补充解释的参考答案（可不填）">{{:refExplain}}</textarea>
								</dd>
								<dt>难度</dt>
								<dd>
									<select name="level" value="{{:level}}" class="form-control" qbdifficul required>
									</select>
								</dd>
								<dt>作答时长</dt>
								<dd>
									<div class="auto input-group">
										
										<input type="text" name="suggestSeconds" value="{{:suggestSeconds}}"
											class="form-control vali vali-time" placeholder="不能为空" required number><span
													class="input-group-addon">秒</span>
									</div>
								</dd>
								<dd>
									<button id="toSubmit" class="btn btn-info add" 
										disabled="disabled">
										<span class="glyphicon glyphicon-plus white"></span> 添加
									</button>
									<button id="cancelSubmit" class="btn btn-warning">
										取消添加
									</button>
								</dd>
							</dl>
</script>
<script id="interviewTmpl" type="text/x-jsrender">
	<dl class="dl-horizontal">
		<dt>面试题题目</dt>
		<dd>
			<blockquote class="interview_editor_wrapper">
				<ul id="interview_editor" class="ui-sortable" data-original-title="" title="">
					{{if group tmpl="#editinterviewOpsTmpl"}}				
					{{else tmpl="#interviewOpsTmpl"}}					
					{{/if}}					
                </ul>
			</blockquote>
		</dd>
		<dt>面试题题干</dt>
			<dd>
				<blockquote class="interview_add_wrapper">
					<div class="row pl10">
						<div class="col-md-8">
							<textarea id="addInterviewtitle" name="title" class="form-control add-topic" rows="3" place></textarea>
						</div>
						<div class="col-md-2">
							<div class="input-group">
								<input type="text" id="suggestMinutes" name="suggestMinutes" class="form-control vali-time add-time" placeholder="必填" number> <span
								class="input-group-addon">分钟</span>
							</div>
						</div>
						<div class="col-md-2">
							<button  class="btn btn-info " id="addInterview" disabled="disabled">
								<span class="glyphicon glyphicon-plus white"></span> 
							</button>
						</div>
					</div>
			</blockquote>
		</dd>
    	<dt>面试题题组名</dt>
								<dd>
									<div class="pl30 col-sm-5 col-md-5 col-xs-5">
                                    <input  name="group" type="text" class="form-control" value="{{:group}}" placeholder="请输入面试题组名（必填）" required>
                                	</div>
								</dd>
								<dd>
									<button id="toSubmit" class="ml30 btn btn-info add" 
										disabled="disabled">
										<span class="glyphicon glyphicon-plus white"></span> 添加
									</button>
									<button id="cancelSubmit" class="btn btn-warning">
										取消添加
									</button>
								</dd>
	</dl>
</script>
<script id="skillsTmpl" type="text/x-jsrender">
	<div class="group create">
		<div class="side-title"></div>
			<ul class="selections" >
				<li skillId={{:skillName}}>{{:skillName}}</li>
			</ul>
	</div>
</script>
<script id="configTmpl" type="text/x-jsrender">
	<option value="">{{:label}}</option>
 	{{for data}}
	<option value="{{:codeName}}" {{:~isSelect(~root.selectValue,codeName,'selected')}}>{{:codeName}}</option>
	{{/for}}
</script>
<script id="interviewOpsTmpl" type="text/x-jsrender">
	<li class="interview_topic">
		<span>{{:title}}</span> 
		<span class="badge">{{:suggestMinutes}}分钟</span>
		<button type="button" class="btn btn-default btn-xs pull-right remove" style="display: none;">
		<i class="fa fa-times"></i> 删除</button>
	</li>
</script>
<script id="editinterviewOpsTmpl" type="text/x-jsrender">
	<div class="row pl10 mb10">
						<div class="col-md-8">
							<textarea  data-link="title" class="form-control add-topic" rows="3" place>{{:title}}</textarea>
							{{if titleImg}}
								<div id="{{:titleImgId}}">
								</div>
							{{/if}}
						</div>
						<div class="col-md-2">
							<div class="input-group">
								<input type="text" data-link="suggestMinutes"  class="form-control vali-time add-time" value="{{:suggestMinutes}}" placeholder="不限" required> 
								<span class="input-group-addon">分钟</span>
							</div>
						</div>
						<div class="col-md-2">
							<button  class="btn btn-info remove" >
								<span class="glyphicon glyphicon-minus white"></span> 
							</button>
						</div>
				
	</div>
</script>
</html>