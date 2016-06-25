<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>查看评论</title>
	<%@include file="common/meta.jsp"%>
	<link href="<%=request.getContextPath() %>/core/css/viewAllComments.css" rel="stylesheet">
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
                    <h1  class="main-title">评论</h1>
                </div>
            </div>
        </div>
    </div>
    <!--end背景-->
    
        <!--main-->
    <div class="main">
            <div class="container">
                <div class="row">
                    <div class="main-wrap col-md-12 col-xs-12 col-sm-12 ">
                    	<div class="commentHead">
                    		<pre id="title" class="ml10 title"></pre>
                    	</div>
                    	<div id="commentContent" class="commentContent">
                    			
                    	</div>
                    	<ul id="comments" class="comments">
    					</ul>
                    </div>
                </div>
           </div>
    </div>
</body>
<script src="<%=request.getContextPath()%>/plugin/jsviews.min.js"></script>
<script>
var questionId = "${questionId}";
var _feedItemsMap ={};
$(function(){
	var newhelpers ={
			/*除法*/
			division: function(a, b){
					return b==0?0: (a/b *100).toFixed(0);
			},
			/*格式化时间*/
			formatTime :function(time){
				if(time){
					return $.sets_formatTime (time);
				}else{
					return "";
				}
				
			},
			/*获取评论类型*/
			getComment : function(fbItems,fbMore){
				var comment = "";
				if(fbItems && !$.isEmptyObject(_feedItemsMap)){
					comment+=_feedItemsMap[fbItems];
				}
				if(fbMore){
					if(comment){
						comment+='，';
					}
					comment+=fbMore;
				}
				if(comment){
					comment+="。";
				}
				return comment;
			}
		};
	$.views.helpers(newhelpers);
	getQuestionDetail(questionId);
	getCandidateTestFeedbacks();
});
function getCandidateTestFeedbacks(){
	$.ajax({
		async : false,
		type :"GET",
		url :root+'/sets/qbBase/getFeedBackCountInfo/'+questionId,
		success : function(result){
			if(result.code==0 && result.data ){
				if(result.data.feedItems){
					var items = result.data.feedItems;
					for(var i =0;i<items.length;i++){
						//把数组转为Map
						_feedItemsMap[items[i].key]=items[i].value;
					}
					_feedItems = result.data.feedItems;
				}
				var htmlOutput = $('#commentHeadTmpl').render(result.data);
				$("#commentContent").html(htmlOutput);
			}
		}
	});
	var data = {
			"pageSize" : 100,
			"requestPage" : 1
			};
	$.ajax({
		type:'POST',
		url :root+'/sets/qbBase/getCandidateTestFeedbacks/'+questionId,
		data : JSON.stringify(data),
		dataType: "json",
		contentType : "application/json",
		success : function(result){
			if(result.code==0 && result.data){
				//渲染
				var htmlOutput = $('#commentTmpl').render(result.data);
				$("#comments").html(htmlOutput);
			}
		}
	});
}
/*获取题目（详细）*/
function getQuestionDetail (questionId,callBack){
	var _this = this;
	$.getJSON(root+'/sets/qbBase/getQuestion/'+questionId,function(result){
		if(result.code==0 && result.data ){
			if(result.data.row && result.data.row.title){
				var title = result.data.row.title;
				$('#title').html(title);
			}else{
				$('#title').html("没有获取到题目");
			}
		}
	});
}
</script>
<script id="commentHeadTmpl" type="text/x-jsrender">
<div id="commentPic" class="commentPic">
	<div class="discuss d_left">
	<i class="fa fa-thumbs-up" style="color:#ff730d;"><br><span>{{:~division(praiseNum,praiseNum+negNum)}}%</span></i>
</div>
	<div class="discuss d_left">
      <i class="fa fa-thumbs-down" style="color:#77b555;"><br><span>{{:~division(negNum,praiseNum+negNum)}}%</span></i>
</div>
<div style="clear:both;"></div>
</div>
<h4 class="comment-title">评论内容<span class="alert">（{{:commentNum}}条）</span></h4>
	
</script>
<script id="commentTmpl" type="text/x-jsrender">
		<li >
		<div class="fbTime">{{:~formatTime(fbTime)}}<span></span></div>
		<div class="fbMore">{{:~getComment(fbItems,fbMore)}}<span></span></div>
		</li>
</script>
</html>