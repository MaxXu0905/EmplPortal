<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>题目选择</title>
	<link href="<%=request.getContextPath() %>/core/css/createQueslib.css" rel="stylesheet">
</head>
<body>
    <!--main-->
    <div style="width:1100px;padding: 0 20px;background-color: #E3E3E3;">
            <div class="">
                <div class="row">
                    <div class="main-wrap col-md-12 col-xs-12 col-sm-12 ">
                        <!-- tab标签 -->
                        	<!-- Nav tabs -->
								<ul id="qbType" class="nav nav-tabs">
								</ul>
							<div class="filter">
								<div class="padding0 col-md-8 col-xs-8 col-sm-8">
									<span>筛选条件：</span>
									<div id="sortgroup" class="btn-group ">
									  <button type="button" class="sort btn btn-info" name="modifyDateAsc" order="desc">最后编辑时间 <i class="fa fa-long-arrow-down"></i></button>
									  <button id="avgbtn" type="button" class="sort btn btn-default" name="avgScoreAsc" order="desc"><span></span> <i class="fa fa-long-arrow-down"></i></button>
									  <!-- <button type="button" class="sort btn btn-default" name="answerNumAsc" order="desc">答题人数 <i class="fa fa-long-arrow-down"></i></button> -->
									  <button type="button" class="sort btn btn-default" name="suggestTimeAsc" order="desc">作答时长 <i class="fa fa-long-arrow-down"></i></button>
									</div>
								
								
								<div class="ml10 btn-group">
							        <select id="skillSelect"  name="skillId" class="tohide form-control">
							        </select>
							        <select id="programSelect" name="programLang" class="tohide form-control">
							        </select>
							   </div>
							  </div>
							   <div class="input-group">
							   		<input type="hidden" name="category"/>
				                    <input id="searchtext" name="questionDesc" type="text" class="search form-control" placeholder="输入名称模糊搜索">
				                    <span class="input-group-btn">
				                     <button id="searchbtn" class="btn btn-info" type="button" >搜索</button>
				                    </span>
				             
				                </div><!-- /input-group -->
							</div>
								<!--end 筛选 -->
							<!-- Tab panes -->
							<div class="tab-content">
							  <div class="tab-pane fade in active" id="quesitionlistDiv">
								<!-- 题目列表-->
                        		<ul id="quesitionlist" class="quesitionlib">
                            		
                        		</ul>
                        		<!-- end题目列表-->
                        		<div id="selectedQuestion" ></div>
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
                	<!-- 加载更多 -->
                    <div  class="morewrapper">
                    	<button id="submitSelect" type="button" class="btn btn-info">
									 确定 
						</button>
					</div>
                   
                    <!--end 加载更多 -->
                     
                   <!-- 分页 -->
                <div class="page">
				  <div class="pagination">
				  <a id="previous_page" class="previous_page" rel="prev" href="#" style="display:none">← Prev</a> 
				  <a id="next_page" class="next_page" rel="next" href="#">Next →</a>
				  </div>
				</div>
                <!--end 分页 -->
            </div>

    </div>
    <!--end main-->
</body>
<script type="text/javascript">
	var JESEESION_ID = "${pageContext.session.id}";
</script>
<script src="<%=request.getContextPath() %>/plugin/pager.js"></script>
<script src="<%=request.getContextPath() %>/core/js/questionSelect.js"></script>
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
                <pre  class="title floatleft">{{:questionDesc}}{{if questionType=='group'}}（作答时长：<span class="carrot">{{:~prettyTime(suggestTime)}}</span>）{{/if}}</pre>
			
					{{if questionType!='group'}}<div><i class="title-arrow down-arrow fa fa-sort-desc fa-2"></i></div>{{/if}}
                   <div id="{{:questionId}}" class="listbuttons">
												<button type="button" class="btn btn-default cm-check"
												data-link="class{merge:isSelected toggle='active btn-info'}"  questionId="{{:questionId}}" selectQuestion>
					<i data-link="class{:isSelected?'fa fa-check-square-o':'fa fa-square-o'}" ></i> 选择</button>
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