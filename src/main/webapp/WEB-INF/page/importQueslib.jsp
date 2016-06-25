<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>题库管理</title>
	<%@include file="common/meta.jsp"%>
	<link href="<%=request.getContextPath() %>/core/css/importQueslib.css" rel="stylesheet">
</head>
<body>
	<!-- header -->
	<%@include file="common/header.jsp"%>
	<!-- end header -->
	
	  <!--背景-->
    <div id="wrapper" >
        <div class="container position">
            <div class="row headerheight">
                <div class="col-md-6 col-xs-6 col-sm-6">
                    <h1 class="main-title">题库管理</h1>
                </div>
                <div class="input-group">
                    <input id="searchtext" type="text" class="search form-control" placeholder="输入题库名称模糊搜索">
                    <span class="input-group-btn">
                     <button id="searchbtn" class="btn btn-info" type="button" >搜索</button>
                    </span>
                </div><!-- /input-group -->
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
                        <!-- 添加题目区-->
                        <div class="addArea">
                            <h4 id="libinfo" class="title"></h4>
                            <div >
                            	<p class="clearfix">
                            		<span id="addVarify" class="alert-main mt10  col-sm-5 col-md-5 col-xs-5 none"></span>
                            	</p>
                                <div class="paddingl0 col-sm-5 col-md-5 col-xs-5">
                                    <input id="createQbtext" type="text"  class="form-control" placeholder="添加新题库，例如java题库">
                                </div>
                                <button id="createQbbtn" type="button" class="btn btn-info" disabled="disabled">
                                    <span class="glyphicon glyphicon-plus white"></span> 添加题库
                                </button>
                                
                            </div>
                        </div>
                        <!-- end添加题目区-->

                        <!-- 题库列表-->
                        <ul id="quesitionlib" class="quesitionlib">
                            
                        </ul>
                        <!-- end题库列表-->
                    </div>
                </div><!-- end row -->
                
                <!-- 分页 -->
                <div class="page">
				  <div class="pagination">
				  <a id="previous_page" class="previous_page" rel="prev" href="#" style="display:none">← Prev</a> 
				  <a id="next_page" class="next_page" rel="next" href="#">Next →</a></div>
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
    
    <!--footer -->
	<%@include file="common/footer.jsp"%>
	<!--end footer -->
</body>
<script type="text/javascript">
	var JESEESION_ID = "${pageContext.session.id}";
</script>
<script src="<%=request.getContextPath() %>/plugin/Highcharts-3.0.9/js/highcharts.js"></script>
<script src="<%=request.getContextPath() %>/plugin/jsviews.min.js"></script>
<script src="<%=request.getContextPath() %>/plugin/uploadify/jquery.uploadify.min.js"></script>
<script src="<%=request.getContextPath() %>/plugin/pager.js"></script>
<script src="<%=request.getContextPath() %>/core/js/importQueslib.js"></script>
<script id="quesitionlibModel" type="text/x-jsrender">
	<li class="quesitionlib-list clearfix">
                                <div class="info w">
                                    <div >
                                        <a id="{{:qbId}}" class="title" qbId="{{:qbId}}" qbCategory="{{:category}}" questionList>{{:qbName}}</a>
                           					<span class="pull-right">最后编辑于{{:modifyDateDesc}}</span>
                                    </div>

                                    <ul class="content">
                                        <li><i class="fa fa-align-justify"></i> 
										     {{if category==4}}
										           总题组<span>{{:totalNum}}</span>组
										     {{else }}
										           总题目<span>{{:totalNum}}</span>道
										     {{/if}}
										</li>
											{{if category==1}}
                                        <li qbId="{{:qbId}}" ratio="skillRatio" class="highChart"><i class="fa fa-check-square"></i> 选择题<a>{{:choiceNum}}</a>道</li>
                                        <li qbId="{{:qbId}}" ratio="programRatio" class="highChart"><i class="fa fa-file-code-o" ></i> 编程题<a>{{:subjectNum}}</a>道</li>
                                        <li><i class="fa fa-question-circle"></i> 问答题<span>{{:essayNum}}</span>道</li>
                                    	{{/if}}
									</ul>
									<div class="popover fade bottom in">
										<div class="arrow"></div>
									<div class="paper-model popover-content"></div>
									</div>
                                </div>
    </li>
</script>
</html>