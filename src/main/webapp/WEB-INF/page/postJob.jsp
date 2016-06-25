<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="<%=request.getContextPath() %>/core/css/base.css" rel="stylesheet" type="text/css" />
<%@include file="common/meta.jsp"%>
<link href="<%=request.getContextPath() %>/page/css/postJob.css" rel="stylesheet" type="text/css" />
<title>发布招聘</title>
</head>
<body>
<!-- header -->
<%@include file="common/header.jsp"%>
<!-- end header -->

<!-- container -->
	<div id="wrapper">
		<div class="container position">
			<div class="row">
				<div class="col-xs-10">
					<h1 class="title white">发布一个招聘职位</h1>
					<h4>百一测评会为你发布的职位生成测评试卷</h4>
				</div>
			</div>
		</div>
	</div>
	<div class="main">
		<div class="container">
			<div class="row">
				<div class="col-xs-12 postJob">
					<form class="form-horizontal">
					<!-- 招聘要求 -->
					<div class="pannel">
						<div class="form-group">
							<label class="col-xs-2 control-label no-padding-right" >招聘职位</label>
							<div  class="col-xs-10">
								<select id="career" class="col-xs-3" >
								  <option selected="selected">Java</option>
								  <option>C++</option>
								  <option>PHP</option>
								</select>
								<select id="level" class="col-xs-3">
								  <option>初级</option>
								  <option selected="selected">中级</option>
								  <option>高级</option>
								</select>
								<input id="position" type="text"  value="开发工程师"  placeholder="开发工程师" class="col-xs-3">
								<span id="positionerr" class="error"></span>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-xs-2 control-label no-padding-right" >职位要求</label>
							<div class="col-xs-10">
								<textarea id="positiondesc"class="form-control" rows="6"></textarea>
									<span id="descerr" class="error"></span>
							</div>
						</div>
					</div>
					
					<!-- end 招聘要求 -->
					
					<!-- 是否自主命题 -->
					<div class="pannel">
						<div class="form-group">
						<label class="col-xs-1 control-label no-padding-right" ></label>
						<label class="title control-label no-padding-right" >
						<input id="addsubj" type="checkbox" >为全面测试应聘人技能，还可以自主命题</label>
					
						</div>
					</div>
					<!-- end 是否自主命题 -->
					
					<!-- 设置面试题 -->
						<div class="pannel">
						<div class="form-group">
							<label class="col-xs-1 control-label no-padding-right" ></label>
							<label class="control-label no-padding-right title" >
							<input id="addinterview" type="checkbox">为该职位设置面试题</label>
						</div>
						<div id="interviewpan" class="hide">
						<div class="form-group">
							<label class="col-xs-1 control-label no-padding-right" ></label>
							<ul class="postJob col-xs-11" id="interview">
								<li><span>请你介绍您对我们公司的看法</span><button type="button" class="close hide" data-dismiss="alert" aria-hidden="false">×</button></li>
								<li><span>请在五分钟内介绍下自己的优缺点以及朋友眼中的你</span><button type="button" class="close hide" data-dismiss="alert" aria-hidden="true">×</button></li>
								<li><span>您如何评价今年春节比较火的微信抢红包活动</span><button type="button" class="close hide" data-dismiss="alert" aria-hidden="true">×</button></li>
								<li><span>请你介绍您对我们公司的看法</span><button type="button" class="close hide" data-dismiss="alert" aria-hidden="true">×</button></li>
								<li><span>请你介绍您对我们公司的看法</span><button type="button" class="close hide" data-dismiss="alert" aria-hidden="true">×</button></li>
							</ul>
						</div>
						<div class="form-group btl">

								<label class="col-xs-1 control-label no-padding-right" ></label>
								<span>系统为你推荐的题目不能满足你的需求时，还可以<a class="postJob">从系统题库选择</a>或<a id="custominterquest" class="postJob">自定义面试题</a></span>
					
						</div>
						</div>
						<div id="interviewpan2" class="hide">
						<div class="form-group">
							<label class="col-xs-1 control-label no-padding-right" ></label>
							<label class="control-label no-padding-right" >自定义面试题</label>				
						</div>
						<div  class="form-group">
							<label class="col-xs-1 control-label no-padding-right" ></label>
							<input id="addinterviewquest" type="text"  placeholder="输入面试题目" class="col-xs-3">
							<input id="addinterviewtime" type="text"  placeholder="输入答题时间" class="col-xs-3">
							<span id="addinterviewbtn"class="col-xs-3"><a class="postJob btn">添加</a></span>	
							<span id="addinterviewerr" class="error"></span>
						</div>
						</div>
					</div>
					<!-- end 设置面试题 -->
					
					<div class="mb20">
						<label class="col-xs-1 control-label no-padding-right" ></label>
						<a id="submit" class="postJob btn btn-lg w200">提交</a>
					</div>
					
					<!-- 生成试卷提示 -->
					<div id="finish" class="pannel hide">
						<div class="form-group">
							<div class="col-xs-12">
								<span class="title">百一测评已为您发布的职位"JAVA-中级-开发工程师"生成一套测试卷</span>
								<a href="#" class="pull-right orange">查看试卷描述</a>
							</div>
							
								
						</div>
					</div>
					<!--end 生成试卷提示 -->
					
					<div id="invite" class="hide">
						<label class="col-xs-1 control-label no-padding-right" ></label>
						<a id="invitation" class="postJob btn btn-lg w200">去邀请</a>
					</div>
				</form>
				</div>
			</div>
		</div>
	</div>
<!-- end container -->
<!--footer -->
<%@include file="common/footer.jsp"%>
<!--end footer -->
<%@include file="common/meta.jsp"%>
<script>
(function($){
	$(function(){
		$("#addsubj").on("click",function(){
			
		});
		$("#addinterview").on("click",function(){
			$("#interviewpan").toggleClass("hide");
			
		});
		$("#custominterquest").on("click",function(){
			if( $(this).attr("checked", true)){
				$("#interviewpan2").removeClass("hide");
			}
		});
		$("#submit").on("click",function(){
			//检查
			var position=$("#position").val();
			var positiondesc=$("#positiondesc").val();
			if(position && positiondesc){
				$("#finish,#invite").toggleClass("hide");
			}else{
				if(!position){
					$("#positionerr").html("请填写完整的招聘要求！",function(){return false;});
				}
				if(!positiondesc){
					$("#descerr").html("请填写职位要求！",function(){return false;});
				}
			}
		});
		$("#interview li").hover(function(){			
			$(this).children("button").removeClass("hide");
		});
		$("#interview li").on("mouseleave",function(){
			$(this).children("button").addClass("hide");
		});
		$("#addinterviewbtn").on("click",function(){
			var quesion = $("#addinterview").val();
			var time = $("#addinterviewtime").val();
			if(time && quesion){
				//建议时间
				if(isNaN(time)){
					$("#addinterviewerr").html("请填写格式正确的面试时间！",function(){return false;});
				}
				//添加题目
				$("#addinterviewerr").html('');
				var a ="<li><span>"+quesion+"</span><button type=\"button\" class=\"close hide\" data-dismiss=\"alert\" aria-hidden=\"true\">×</button></li>";
				$("#interview").append(a);
				$("#interview li").hover(function(){			
					$(this).children("button").removeClass("hide");
				});
				$("#interview li").on("mouseleave",function(){
					$(this).children("button").addClass("hide");
				});
			}else{
				//提示错误
				$("#addinterviewerr").html("必须填写面试题目和面试时间！",function(){return false;});
			}
		});
			
		
	});
})(jQuery);
</script>
</body>
</html>