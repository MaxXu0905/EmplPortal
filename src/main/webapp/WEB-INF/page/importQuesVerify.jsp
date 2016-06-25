<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>导入题目校验</title>
<%@include file="common/meta.jsp"%>
<link href="<%=request.getContextPath()%>/core/css/importQuesVarify.css"
	rel="stylesheet">
</head>
<body>
	<div class="container">
		<div class="row">
			<div class="main-wrap col-md-12 col-xs-12 col-sm-12 ">
				<div class="panel panel-default">
					<div class="panel-heading">
					<h3 id="title" class="title">导入提示</h3>
					</div>
					
					<div class="panel-body">
						<!-- 错误提示 -->
						<div id="errorAlert" class="errorAlert">
							<h4 id="errortitle" class="red">您要导入的文件有以下问题，请处理完后再导入</h4>
							<ul id="errorAlertInfo" class="errorAlertInfo">
							</ul>
						</div>
						<!--end 错误提示 -->
						
						<!-- 错误列表 -->
						<div id="errorList" class="errorList">
							  <!-- tab标签 -->
                        	<!-- Nav tabs -->
								<ul id="qbType" class="nav nav-tabs">
						
								</ul>
								<div id="tabContent" class="tab-content">
								<!-- 相似度列表-->
                        		<ul id="similarityErrors" class="tab-pane fade quesitionlib">
                        		</ul>
                        		<!-- end相似度列表->
                        		
								<!-- 时间错误列表-->
                        		<ul id="timeErrors" class="tab-pane fade quesitionlib">
                        		</ul>
                        		<!-- end时间错误列表-->
                        		
								<!-- 格式错误列表-->
                        		<ul id="formatErrors" class="tab-pane fade quesitionlib">
                        		</ul>
                        		<!-- end格式错误列表-->
                        		
                        		<!-- 批量处理 -->
                        			<div class="tab-pane fade bs-callout bs-callout-danger" id="batchProcess">
                        			 <a id="goSingleton" href="#formatErrors" class="pull-right" data-toggle="tab" target="batch">单条处理</a>
									    <h4>批量处理步骤：</h4>
									    <p>当导入错误较多的时候，建议使用导出错误Excell批量修改错误的解决办法，步骤如下：</p>
									    <ol class="step" type="1">
									      <li>下载<a id="export" class="exportError" href="#">错误列表</a>并按照提示修改所有错误。</li>
									      <li>点击“错误列表导入”按钮 <input type="file" style="display: none;" id="multi_import" >，选择修改后的错误列表进行导入。</li>
									    </ol>
									 </div>
                        		<!--end 批量处理 -->
                        		
								</div>
						</div>
						<!--end 错误列表  -->
					</div>
						
				</div>
			</div>
		</div>
	</div>
	    	<!-- 确认模态层 -->
		<div id="confirmModal" class="modal fade">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-hidden="true">&times;</button>
						<h4 class="modal-title modal_h">提示</h4>
					</div>
					<div id="confirmmsg" class="modal-body">
					</div>
					<div class="modal-footer">
						<button id="confirmbtn" type="button" class="btn btn-primary" >确认</button>
						<button id="cancelbtn" type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
		<!-- /.modal -->
		<!-- 确认模态层 -->
		
		<div class="modal waiting_modal" id="modal_waiting">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-body">
						<span class="spinner"></span> <span class="title pull-left"></span>
					</div>
				</div>
			</div>
	   </div>
</body>
<script src="<%=request.getContextPath()%>/plugin/jsviews.min.js"></script>
<script src="<%=request.getContextPath()%>/plugin/spin.min.js"></script>
<script
	src="<%=request.getContextPath()%>/plugin/jquery.html5-placeholder-shim.js"></script>
	<script src="<%=request.getContextPath() %>/plugin/uploadify/jquery.uploadify.min.js"></script>
	<script type="text/javascript"
	src="${pageContext.request.contextPath }/core/js/setsValidation.js"></script>
<script src="<%=request.getContextPath()%>/core/js/importQuesVerify.js"></script>

<script>
var qbId = "${qbId}";
var qbCategory = "${qbCategory}";
var urlEncodeQbNameError = "${urlEncodeQbNameError}";
var JESEESION_ID = "${pageContext.session.id}";
</script>
<!-- 错误类型 -->
<script id="errorAlertInfoTmpl" type="text/x-jsrender">
	{{if similarityErrors>0}}
	 <li>有<span  class="number"><span id="similarityNum">{{:similarityErrors}}</span>道题</span>和原有的题目相似度超过80%</li>
		{{/if}}
		{{if timeErrors>0}}
	 <li>有<span  class="number"><span id="timeNum">{{:timeErrors}}</span>道题</span>的答题时间需要调整。（推荐的时间由百一特有的算法计算出来。）</li>
		{{/if}}
		{{if formatErrors>0}}
	 <li>有<span  class="number"><span id="formatNum">{{:formatErrors}}</span>道题</span>格式不正确，请检查。</li>
		{{/if}}
</script>
<!-- <i class="fa fa-question-circle"></i> -->
<!-- 调整时间错误模板 -->
<script id="adjustTimeTmpl" type="text/x-jsrender">
	<li><span class="title">错误原因：{{:cause}}</span></li>
	<li>
		<dl class="dl-horizontal">
	 		{{if skill}}
			<dt>技能点:</dt>
			<dd>{{:skill}}</dd>
     		{{else mod}}
			<dt>编程语言:</dt>
			<dd>{{:mod}}</dd>
     		{{/if}}
			<dt>题目:</dt>
			<dd >{{:~formatQusetion(title)}}</dd>
			<dt>原答题时间:</dt>
			{{if suggestSeconds}}
			<dd>{{:suggestSeconds}}秒</dd>
			{{else suggestMinutes}}
			<dd>{{:suggestMinutes}}分</dd>
			{{/if}}
			<dt>建议答题时间:</dt>
			{{if suggestTime}}
			<dd>{{:~prettyTime(suggestTime)}}</dd>
			{{/if}}
		</dl>
	</li>
	<li>
	<div class="mt30 listbuttons" style="display: block;">
         <button id="useOriginTime" type="button" class="btn btn-default" > 采用原题时间</button>
			{{if suggestTime}}
         <button id="useSuggestTime" type="button" class="btn btn-default" >采用建议时间 </button>
			{{/if}}
    </div>
	</li>
</script>
<!-- 相似度错误模板 -->
<script id="adjustSimilarTmpl" type="text/x-jsrender">
	 <li><span class="title">错误原因：{{:cause}}</span>
	<button id="keppAll" class="ml30 btn btn-info" serialno="{{:serialNo}}" ><span class="glyphicon glyphicon-plus white"></span> 保留这两道题</button></li>
	 <li>
	 	<div class="similarQuestion">
			<div class="pull-left oldQuestion">
			<p class="tar"><button id="delOldQuestion" class="btn btn-default" serialno="{{:serialNo}}" ><i class="fa fa-trash-o"></i> 替换原题</button></p>
	 		<dl class="dl-horizontal">
	 			<dt>原题目：</dt>
				<dd data-link="origRow.title"></dd>
				{{if origRow.options}}
	 			<dt>选项：</dt>
	 			{{for origRow.options}}
	 			<dd data-link="#data"></dd>
				{{/for}}
				{{/if}}
				{{if origRow.correctOptions}}
	 			<dt>正确选项：</dt>
	 			<dd>{{:origRow.correctOptions}}</dd>
				{{/if}}
				{{if refAnswer}}
	 			<dt>参考答案：</dt>
	 			<dd>{{:~formatQusetion(origRow.refAnswer)}}</dd>
				{{/if}}
				{{if explainReqired}}
	 			<dt>是否需要补充解释：</dt>
	 			<dd>{{:origRow.explainReqired}}</dd>
				{{/if}}
				{{if refExplain}}
	 			<dt>补充解释：</dt>
	 			<dd>{{:origRow.refExplain}}</dd>
				{{/if}}
				{{if mode}}
	 			<dt>编程语言：</dt>
	 			<dd>{{:origRow.mode}}</dd>
				{{/if}}
				<dt>难度：</dt>
	 			<dd>{{:origRow.level}}</dd>
				<dt>作答时长：</dt>
	 			{{if origRow.suggestSeconds}}
	 			<dd>{{:~prettyTime(origRow.suggestSeconds)}}</dd>
			    {{else origRow.suggestMinutes}}
	 			<dd>{{:origRow.suggestMinutes}}分</dd>
				{{/if}}
				{{if origQbName}}
	 			<dt>归属题库：</dt>
	 			<dd>{{:origQbName}}</dd>
				{{/if}}
	 		</dl>
			</div>
       		<div class="pull-right  newQuestion">
				<p class="tar"><button id="delNewQuestion" class="btn btn-default" serialno="{{:serialNo}}" ><i class="fa fa-trash-o"></i> 不导入新题</button></p>
	 		<dl class="dl-horizontal">
	 			<dt>新题目：</dt>
				<dd data-link="title"></dd>
	 			{{if options}}
	 			<dt>选项：</dt>
				{{for options}}
	 			<dd data-link="#data"></dd>
				{{/for}}
				{{/if}}
	 			{{if correctOptions}}
	 			<dt>正确选项：</dt>
	 			<dd>{{:correctOptions}}</dd>
				{{/if}}
	 			{{if refAnswer}}
	 			<dt>参考答案：</dt>
	 			<dd>{{:~formatQusetion(refAnswer)}}</dd>
				{{/if}}
	 			{{if explainReqired}}
	 			<dt>是否需要补充解释：</dt>
	 			<dd>{{:explainReqired}}</dd>
				{{/if}}
	 			{{if refExplain}}
	 			<dt>补充解释：</dt>
	 			<dd>{{:refExplain}}</dd>
				{{/if}}
	 			{{if mode}}
	 			<dt>编程语言：</dt>
	 			<dd>{{:mode}}</dd>
				{{/if}}
	 			<dt>难度：</dt>
	 			<dd>{{:level}}</dd>
				<dt>作答时长：</dt>
	 			{{if suggestSeconds}}
	 			<dd>{{:~prettyTime(suggestSeconds)}}</dd>
			    {{else suggestMinutes}}
	 			<dd>{{:suggestMinutes}}分</dd>
				{{/if}}
	 		</dl>
			</div>
	 	</div>
	 </li>
</script>
<!-- 格式错误模板 -->
<script id="adjustFormatTmpl" type="text/x-jsrender">
	 <a id="goBatch" href="#batchProcess" class="pull-right" data-toggle="tab" target="batch">批量处理</a>
	 <li><span class="title">错误原因：<span id="errorCause">{{:cause}}</span></span></li>
	 <li>
	 	<form class="selectQuestion">
	 		{{if sheetType==3 tmpl="#selectTmpl"}}
	 		{{else sheetType==4 tmpl="#programTmpl"}}
	 		{{else sheetType==5 tmpl="#askTmpl"}}
	 		{{else sheetType==6 tmpl="#iqTmpl"}}
	 		{{else sheetType==7 tmpl="#askTmpl"}}
	 		{{else sheetType==8 tmpl="#interviewTmpl"}}
			{{/if}}
	 	</form>
	 </li>
</script>
<script id="qbTypeTmpl" type="text/x-jsrender">
	  <li class="{{:clazz}}" tabType="{{:tabType}}"><a href="{{:list}}" data-toggle="tab">{{:desc}}</a></li>
</script>
<script id="quesitionlistTmpl" type="text/x-jsrender">
	<li class="quesitionlib-list clearfix">
		<ul id="{{:errorType}}ErrorsWrap" class="error">
		{{if errorType=='similarity'  tmpl="#adjustSimilarTmpl" }}
		{{else errorType=='time'  tmpl="#adjustTimeTmpl"}}
		{{else errorType=='format' tmpl="#adjustFormatTmpl"}}
		{{/if}}
		</ul>
	</li>
</script>
<script id="selectTmpl" type="text/x-jsrender">
<!--表格类型 -->
<input type="hidden" name="sheetType" value="{{:sheetType}}" />
<input type="hidden" name="serialNo" value="{{:serialNo}}" />
<dl class="dl-horizontal">
	<dt>选择技能</dt>
	<dd>
		<div class="dropdown">
			<!--技能-->
			<input type="hidden" name="skill" value="{{:skill}}" required />
			<button class="btn btn-default dropdown-toggle" type="button"
				id="dropdownMenu" data-toggle="dropdown">
				<span id="skill">{{if skill}}{{:skill}}{{else}}请选择技能{{/if}}</span> <span
					class="caret"></span>
			</button>
			<div id="skills-dropdown" class="dropdown-menu" role="menu"
				aria-labelledby="dropdownMenu">
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
				<div id="currentskill"></div>
				<div class="filter">
					<input id="skillsearch" class="form-control"
						placeholder="快速筛选/添加技能" />
					<button id="addSkill" class="btn btn-info">
						<span class="glyphicon glyphicon-plus white"></span>
					</button>
				</div>
			</div>
		</div>
			{{:~getQbBaseSkills()}}
	</dd>
	<dt>题干</dt>
	<dd>
		<textarea name="title" data-link="title" class="form-control vali topic" rows="4" placeholder="请输入题干" required></textarea>
	</dd>
	<dt>答案选项</dt>
	{{for options}}
	<dd>
		<div class="input-group">
			<span class="input-group-addon option-label">{{:~setOptions(#index)}}</span>
			{{if #index<2}}
			<textarea name="options"
				class="form-control horizontal_choice vali bottom_10"
				placeholder="不能为空" required data-link="#data"></textarea>
			{{else}}
			<textarea name="options"
				class="form-control horizontal_choice vali bottom_10"
				placeholder="选项(可不填)" data-link="#data"></textarea>
			{{/if}}
		</div>
	</dd>
	{{/for}}
	<dt>正确答案</dt>
	<dd class="correctOptions">
		{{for options}} 
			{{!--<label id="correctoption_{{:~setOptions(#index)}}" data-link="class{:#data?'check-box':'tohide check-box'}"> --}} 
			<label id="correctoption_{{:~setOptions(#index)}}" class= "check-box">
			<input type="checkbox" class="tohide" name="correctOptions" value="{{:~setOptions(#index)}}"
			{{:~isSelect(#index,#parent.parent.data.correctOptions,'checked')}} required /> <span
			class="fa-stack check-icon"> <i
				class="fa fa-square-o fa-stack-2x"></i> <i
				class="fa fa-check-square fa-stack-1x check  {{:~isSelect(#index,#parent.parent.data.correctOptions,'checked')}}"></i>
			</span> <span>{{:~setOptions(#index)}}</span>
			</label> 
		{{/for}}
	</dd>
	<dt>难度</dt>
	<dd>
		<select name="level" value="{{:level}}" class="form-control"
			qbdifficul required> {{:~getLevel(level)}}
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
		<button id="toSubmit" class="btn btn-info add" disabled="disabled">保存</button>
		<button class="btn btn-default cancel" serialNo="{{:serialNo}}">取消导入</button>
	</dd>
</dl>				
</script>
<script id="programTmpl" type="text/x-jsrender">
	<input type="hidden" name="sheetType" value="{{:sheetType}}" />
	<input type="hidden" name="serialNo" value="{{:serialNo}}" />
	<dl class="dl-horizontal tab-pane" data-type="1"
								id="addition-type-1">
								<dt>编程题题干</dt>
								<dd>
									<textarea name="title" data-link="title"  class="form-control vali topic" rows="4" required></textarea>
								</dd>
								<dt>参考答案</dt>
								<dd>
									<textarea class="form-control"  name="refAnswer" rows="4" required>{{:refAnswer}}</textarea>
								</dd>
								<dt>语言类型</dt>
								<dd>
									<select class="form-control" name="mode" value="{{:mode}}"  proglanguage required>
										{{:~getProlanguage(mode)}}
									</select>
								</dd>
								<dt>难度</dt>
								<dd>
									<select  name="level" value="{{:level}}"  class="form-control" qbdifficul required>
										 {{:~getLevel(level)}}
									</select>
								</dd>
								<dt>作答时长</dt>
								<dd>
									<div class="auto input-group">
										<input type="text" name="suggestMinutes" class="form-control vali vali-time"
											placeholder="不能为空" value="{{:suggestMinutes}}" required> <span
											class="input-group-addon">分钟</span>
									</div>
								</dd>
								<dd>
									<button  class="btn btn-info add" serialNo="{{:serialNo}}"
										disabled="disabled">
										保存
									</button>
									<button  class="btn btn-default cancel" serialNo="{{:serialNo}}">
										取消导入
									</button>
								</dd>
							</dl>
</script>
<script id="askTmpl" type="text/x-jsrender">
<input type="hidden" name="sheetType" value="{{:sheetType}}" />
<input type="hidden" name="serialNo" value="{{:serialNo}}" />
	<dl class="dl-horizontal tab-pane" >
								<dt>问答题题干</dt>
								<dd>
									<textarea name="title" data-link="title"  class="form-control vali topic" rows="4" required></textarea>
								</dd>
							    <dt>参考答案</dt>
								<dd>
									<textarea name="refAnswer" class="form-control answer" rows="4">{{:refAnswer}}</textarea>
								</dd>
								<dt>难度</dt>
								<dd>
									<select  name="level" value="{{:level}}"  class="form-control" qbdifficul required>
										 {{:~getLevel(level)}}
									</select>
								</dd>
								<dt>作答时长</dt>
								<dd>
									<div class="auto input-group">
										<input type="text" name="suggestMinutes" class="form-control vali vali-time"
											placeholder="不能为空" value="{{:suggestMinutes}}" required> 
                                        <span class="input-group-addon">分钟</span>
									</div>
								</dd>
								<dd>
									<button  class="btn btn-info add" serialNo="{{:serialNo}}"
										disabled="disabled">
										完成
									</button>
									<button  class="btn btn-default cancel" serialNo="{{:serialNo}}">
										取消导入
									</button>
								</dd>
							
	</dl>
</script>
<script id="iqTmpl" type="text/x-jsrender">
<input type="hidden" name="sheetType" value="{{:sheetType}}" />
<input type="hidden" name="serialNo" value="{{:serialNo}}" />
<input type="hidden" name="explainReqired" value="{{:explainReqired}}" />
	<dl class="dl-horizontal">
		<dt>题干</dt>
			<dd>
				<textarea name="title" data-link="title"  class="form-control vali topic" rows="4" required></textarea>
			</dd>
	<dt>答案选项</dt>
	{{for options}}
	<dd>
		<div class="input-group">
			<span class="input-group-addon option-label">{{:~setOptions(#index)}}</span>
			{{if #index<2}}
			<textarea name="options"
				class="form-control horizontal_choice vali bottom_10"
				placeholder="不能为空" required data-link="#data"></textarea>
			{{else}}
			<textarea name="options"
				class="form-control horizontal_choice vali bottom_10"
				placeholder="选项(可不填)" data-link="#data"></textarea>
			{{/if}}
		</div>
	</dd>
	{{/for}}
	<dt>正确答案</dt>
	<dd class="correctOptions">
		{{for options}} 
			<label id="correctoption_{{:~setOptions(#index)}}" data-link="class{:#data?'check-box':'tohide check-box'}"> 
			<input type="checkbox" class="tohide" name="correctOptions" value="{{:~setOptions(#index)}}"
			{{:~isSelect(#index,#parent.parent.data.correctOptions,'checked')}} required /> <span
			class="fa-stack check-icon"> <i
				class="fa fa-square-o fa-stack-2x"></i> <i
				class="fa fa-check-square fa-stack-1x check  {{:~isSelect(#index,#parent.parent.data.correctOptions,'checked')}}"></i>
			</span> <span>{{:~setOptions(#index)}}</span>
			</label> 
		{{/for}}
	</dd>
								<dt></dt>
									<dd>
									<button id="refExplain_checkbox" type="button" class="btn btn-default bottom_10 horizontal_checkbox" data-link="class{merge:explainReqired=='是'?toggle='active'}">
										{{if explainReqired=='是'}}
										<span class="glyphicon glyphicon-check"></span>
										{{else }}
										<span class="glyphicon glyphicon-check glyphicon-unchecked"></span>
										{{/if}}
											是否需要应聘者补充解释
									</button>
									<textarea name="refExplain" class="form-control answer bottom_10" data-link="class{merge:explainReqired!='是'?toggle='tohide'}"
										placeholder="在这里填写补充解释的参考答案（可不填）">{{:refExplain}}</textarea>
								</dd>
								<dt>难度</dt>
								<dd>
									<select name="level" value="{{:level}}"  class="form-control" qbdifficul required>
										 {{:~getLevel(level)}}
									</select>
								</dd>
								<dt>作答时长</dt>
								<dd>
									<div class="auto input-group">
										<input type="text" name="suggestSeconds" value="{{:suggestSeconds}}"
											class="form-control vali vali-time" placeholder="不能为空" required><span
													class="input-group-addon">秒</span>
									</div>
								</dd>
								<dd>
									<button  class="btn btn-info add" serialNo="{{:serialNo}}"
										disabled="disabled">
										完成
									</button>
									<button  class="btn btn-default cancel" serialNo="{{:serialNo}}">
										取消导入
									</button>
								</dd>
							</dl>
</script>
<script id="interviewTmpl" type="text/x-jsrender">
	<dl class="dl-horizontal">
		<dt>题目</dt>
		<dd>
			<blockquote class="interview_editor_wrapper">
				<ul id="interview_editor" class="ui-sortable" data-original-title="" title="">
					{{if sheetType tmpl="#editinterviewOpsTmpl"}}				
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
								<input type="text" id="suggestMinutes" name="suggestMinutes" class="form-control vali-time add-time" placeholder="必填"> <span
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
										 保存
									</button>
									<button  class="btn btn-default cancel" serialNo="{{:serialNo}}">
										取消导入
									</button>
								</dd>
	</dl>
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
<script id="skillsTmpl" type="text/x-jsrender">
	<div class="group create">
		<div class="side-title"></div>
			<ul class="selections" >
				<li skillId={{:skillName}}>{{:skillName}}</li>
			</ul>
	</div>
</script>
</html>