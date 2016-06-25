<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>题目管理</title>
	<%@include file="common/meta.jsp"%>
	<link href="<%=request.getContextPath() %>/core/css/createQueslib.css" rel="stylesheet">
</head>
<body>
	<!-- header -->
	<%@include file="common/header.jsp"%>
	<!-- end header -->
	
	<!--背景-->
    <div id="wrapper" >
        <div class="container position">
            <div class="row headerheight">
                    <h1 id="qbName" class="main-title pull-left">${qbName}</h1>
                	<div class="buttons tar mt30 pull-right">
				               		<a  id="filetmpl" class="mr20" href="#">下载题库模板</a>
									<input type="file" style="display: none;" id="multi_import" >
				                   <button  id="importBtn" class="mr20 btn btn-default tohide">
				                       <i class="fa fa-reply"></i> 导入
				                   </button>
				                   <a  id="export" href="#" class="mr20 btn btn-default">
				                       <i class="fa fa-share"></i> 导出
				                   </a>
					</div>
					<!-- 警告框 -->
					<div id="importErr" class="clearleft pull-right w200 tohide alert alert-danger fade" role="alert">
				      <button id="importErrClose" type="button" class="close" ><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
				      <strong>导入提示:</strong><span class="alertMsg"></span>
				    </div>
				<!--end 警告框 -->
            </div>
        </div>
    </div>
    <!--end背景-->
    
    <!--main-->
    <div class="main">
            <div class="container">
                <div class="row">
                    <div class="main-wrap col-md-12 col-xs-12 col-sm-12 ">
                        <div class="alert alert-danger alert-dismissable gone" id="alert_no_flash">
									<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
									您没有安装flash player，请点击<a target="_blank" href="https://get.adobe.com/cn/flashplayer/">安装</a>
						</div>
                        <!-- tab标签 -->
                        	<!-- Nav tabs -->
								<ul id="qbType" class="nav nav-tabs">
								</ul>
													<!-- 筛选条件 -->
							<div class="filter form-inline">
								<div class="padding0 form-group">
									<span>筛选条件：</span>
									<div id="sortgroup" class="btn-group ">
									  <button type="button" class="sort btn btn-info" name="modifyDateAsc" order="desc">最后编辑时间 <i class="fa fa-long-arrow-down"></i></button>
									  <button id="avgbtn" type="button" class="sort btn btn-default" name="avgScoreAsc" order="desc"><span></span> <i class="fa fa-long-arrow-down"></i></button>
									  <!-- <button type="button" class="sort btn btn-default" name="answerNumAsc" order="desc">答题人数 <i class="fa fa-long-arrow-down"></i></button> -->
									  <button type="button" class="sort btn btn-default" name="suggestTimeAsc" order="desc">作答时长 <i class="fa fa-long-arrow-down"></i></button>
									  <!-- <button type="button" class="sort btn btn-default" name="negNumAsc" order="desc">差评 <i class="fa fa-long-arrow-down"></i></button> -->
									</div>
								<div class="ml10 btn-group">
							        <select id="skillSelect"  name="skillId" class="form-control">
							        </select>
							        <select id="programSelect" name="programLang" class="tohide form-control">
							        </select>
							   </div>
							  </div>
							  <div class="padding0 form-group">
							   <div class="ml20 input-group">
							   		<input type="hidden" name="category"/>
				                    <input id="searchtext" name="questionDesc" type="text" class="search form-control" placeholder="输入名称模糊搜索">
				                    <span class="input-group-btn">
				                     <button id="searchbtn" class="btn btn-info" type="button" >搜索</button>
				                    </span>
				                </div><!-- /input-group -->
				             </div>
				                  <button id="addQuestion" type="button" class="pull-right ml20 btn btn-warning add_candi_btn" >
										<span class="glyphicon glyphicon-plus"></span>添加题目
									 </button>
							</div>
								<!--end 筛选 -->
							<!-- Tab panes -->
							<div class="tab-content">
							  <div class="tab-pane fade in active" id="quesitionlistDiv">
								<!-- 题目列表-->
                        		<ul id="quesitionlist" class="quesitionlib">
                            		
                        		</ul>
                        		<!-- end题目列表-->
							  </div>
							</div>
                        <!--end  tab标签 -->
						 <!-- 添加题目区-->
                        <div class="addArea">
                            <h4 id="libinfo" class="title tac">还没有题目，快点添加吧！</h4>
                        </div>
                        <!-- end添加题目区-->
                    </div>
                </div><!-- end row -->
                
                   <!-- 分页 -->
                <div class="page">
				  <div class="pagination">
				  <a id="previous_page" class="previous_page" rel="prev" href="#" style="display:none">← Prev</a> 
				  <a id="next_page" class="next_page" rel="next" href="#">Next →</a>
				  </div>
				</div>
                <!--end 分页 -->
                <!-- 加载更多 -->
                    <!-- <div id="morewrapper" class="morewrapper">
                    	<button id="morewrapperbtn" class="btn btn-default none todo" disabled="disabled" style="display: inline-block;">没有更多的数据了</button>
					</div> -->
                   
                <!--end 加载更多 -->
            </div>

    </div>
    <!--end main-->
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
						<button id="confirmbtn" type="button" class="btn btn-primary">确认</button>
						<button id="cancelbtn" type="button" class="btn btn-default"
							data-dismiss="modal">取消</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
		<!-- /.modal -->
		<!-- 确认模态层 -->
		
		<!-- 提示模态层 -->
		<div id="alertModal" class="modal fade">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-hidden="true">&times;</button>
						<h4 class="modal-title">导入提示</h4>
					</div>
					<div  class="modal-body">
						<p id="alertmmsg">您还有导入错误没有处理，为了避免重复导入请先处理完错误再导入新的文件</p>
					</div>
					<div class="modal-footer">
						<button id="alertBtn" type="button" class="btn btn-primary">去处理</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
		<!-- /.modal -->
		<!--footer -->
	<%@include file="common/footer.jsp"%>
	<!--end footer -->
</body>
<script type="text/javascript">
	var qbId = "${qbId}";
	var qbCategory = "${qbCategory}";
	var JESEESION_ID = "${pageContext.session.id}";
	var qbName = "${qbName}";
	var urlEncodeQbName = "${urlEncodeQbName}";
</script>
<script src="<%=request.getContextPath() %>/plugin/jsviews.min.js"></script>
<script src="<%=request.getContextPath() %>/plugin/jquery.html5-placeholder-shim.js"></script>
<script src="<%=request.getContextPath() %>/plugin/uploadify/jquery.uploadify.min.js?t=<%=System.currentTimeMillis() %>/"></script>
<script src="<%=request.getContextPath() %>/plugin/pager.js"></script>
<script src="<%=request.getContextPath() %>/core/js/questionlist.js"></script>
<script id="qbTypeTmpl" type="text/x-jsrender">
	  <li {{if #index==0}}class="active"{{/if}}><a href="#quesitionlistDiv" data-toggle="tab"  target="{{:label}}">{{:desc}}</a></li>
</script>
<script id="groupQuestionsTmpl" type="text/x-jsrender">
<ul class="group" questionId="{{:questionId}}" group>
 	{{for  groupQuestion.group.questionList}}
	  <li ><span>{{:questionDesc}}</span>
			<ul class="property mt10 mb10">
												  <li class="">作答时长：<span class="carrot">{{:~prettyTime(suggestTime)}}</span>{{if avgTime}}（平均时间：{{:~prettyTime(avgTime,0)}}）{{/if}}</li>
												 {{if questionType!='group'}}
												  <li class="">答题人数：<span class="carrot">{{:answerNumber}}人</span></li>
												  {{/if}}
			</ul>
	  </li>
	{{/for}}
</ul>
	
</script>
<script id="skillSelecTmpl" type="text/x-jsrender">
	<option value={{:skillId}}>{{:skillName}}</option>
</script>
<script id="programSelecTmpl" type="text/x-jsrender">
	<option value={{:id.codeId}}>{{:codeName}}</option>
</script>
<script id="quesitionlistTmpl" type="text/x-jsrender">
	<li class="quesitionlib-list clearfix">
         <ul class="quesitionInfo">
             <li>
                 <div  class="title floatleft">{{:questionDesc}}{{if questionType=='group'}}（作答时长：<span class="carrot">{{:~prettyTime(suggestTime)}}</span>）{{/if}}</div>
			
					{{if questionType!='group'}}<div><i class="title-arrow down-arrow fa fa-sort-desc fa-2"></i></div>{{/if}}
                    <div id="{{:questionId}}" class="tohide listbuttons">
                            					<button type="button" class="btn btn-default" questionId="{{:questionId}}" editQuestion><i class="fa fa-pencil" ></i> 编辑 </button>
                            					<button type="button" class="btn btn-default" questionId="{{:questionId}}" delQuestion><i class="fa fa-times" ></i> 删除 </button>
                            				</div>
                            				<div  class="select-options  bs-callout bs-callout-info" data-link="class{merge:questionType!='group'?toggle='tohide'}">
                            					{{if questionType=='s_choice' || questionType=='m_choice' || questionType=='s_choice_plus' || questionType=='m_choice_plus'}}
                            					<h5>选项</h5>
                            					<ul>
														{{for answers}}
														<li class="options">{{:~setOptions(#index,#data)}}</li>
														{{/for}}
													   
                            					</ul>
											  {{else  questionType=='group'}}
													{{if groupQuestion.group.questionList tmpl="#groupQuestionsTmpl"}}
												
													{{/if}}
											  {{else }}
													<h5>参考答案</h5>
                            					<pre data-link="refAnswer"></pre>
											  {{/if}}
											
                            				</div>
                            				</li>
												{{if category==1 && (questionType=='s_choice' || questionType=='m_choice')}}
                            				<li>所属技能：{{for skills}}<span class="label-arrowed">{{:skillName}}</span>{{/for}}</li>
												{{else  questionType=='extra_program'}}
											<li>编程语言：<span class="label-arrowed">{{:mode}}</span></li>
												{{/if}}
											<li>
												{{if  questionType!='group'}}
                            					<ul class="property">
												  <li class="">作答时长：<span class="carrot">{{:~prettyTime(suggestTime)}}</span>{{if avgTime}}（平均时间：{{:~prettyTime(avgTime,0)}}）{{/if}}</li>
												{{if questionType=='s_choice' || questionType=='m_choice' || questionType=='s_choice_plus' || questionType=='m_choice_plus'}}
												  <li class="">正确率：<span class="carrot">{{:~division(rightAnswerNumber,answerNumber)}}%</span>（{{:answerNumber}}人答过，其中{{:rightAnswerNumber}}人答对了）</li>
												{{else}}
												  <li class="">平均分：<span class="carrot">{{if avgScore}} {{:avgScore}}（满分10分）{{else}}无{{/if}}</span></li>
												  <li class="">答题人数：<span class="carrot">{{:answerNumber}}人</span></li>
												{{/if}}
												</ul>
												{{/if}}
                            				</li>
                            			</ul>
  </li>
</script>
</html>