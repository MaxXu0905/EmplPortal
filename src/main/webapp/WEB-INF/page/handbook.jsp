<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>

<title>百一--产品介绍</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/core/css/index.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/sets.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/plugin/buttons.css" rel="stylesheet" type="text/css" />
<style type="text/css">
body>.container {
	padding-top:20px;
}
body{background:#eeeeee;
}
.introduction{padding:0px 0px 30px 0px;color:#536b7d;font-size:16px;}
.step_title{font-size: 1.8em; color:#536b7d;padding:40px 0px 10px 0px;
font-weight:400;
}
.stepul li{font-size:16px;}

.part2{font-size:18px;color:#5d5d5e;}
.part2_a{
position:absolute;
right:110px;
top:-170px;
}
.part2_b{
position:absolute;
right:90px;
top:160px;
}
.part2_c{
position:absolute;
right:320px;
top:240px;
}
.part3{font-size:18px;color:#5d5d5e;
}
.conttext_2{position:relative;height:580px;padding-left:80px;background:#fff;
}
.conttext_3{position:relative;height:660px;padding-left:80px;background:#fff;}
.part3_a{
position:absolute;
right:100px;
top:180px;
}
.part3_b{
position:absolute;
right:340px;
top:280px;
}
.slogan{text-align:center;margin-bottom:35px;}

.part_title span{color:#5bc0de;}
.pull-left{color:#fff;font-weight: normal;padding-left:0px;padding-top:5px;}
.mytab> ul{margin-top:30px;}
.mytab> li{float:left;width:546px;font-size:32px;height:110px;
	background:#d1d7db;
	margin:0px 10px;
	
}
.mytab .active{
	background:#7fb760;
	color:#fff;
}
.tcont{
border-radius: 4px;
box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.08);
background:#fff;
}
.mytab> li{
-webkit-transition: all 0.2s ease-in-out;
	transition: all 0.2s ease-in-out;
}
.mytab> li a{
display:block;
height:110px;
width:546px;
padding-top:10px;
padding-left:50px;
}
</style>
</head>
<body>
	<!-- header -->
	<%@include file="common/header-single.jsp"%>
	<!-- end header -->
<!-- 产品介绍 -->	
<div class="introduction">
	<div class="container" style="padding-left:20px;">
	 <h1 style="margin-bottom:-10px;" class="main-title">产品介绍</h1><br>
	    <div style="text-indent:30px;">每一个技术猿像一个黑盒子，得到他们基本靠车轮战似的推荐和悲催耗时的面试。那些年HR拿着技术猿简历并不确信他到底有没有料，面试官也花很多时间了解每一个来面试的“黑盒子”。中关村上空回荡着HR和面试官的阵阵哀鸣：“时间都去哪了？！”。后来有一个面试官揭竿而起，开发了一个可以透视这群“黑盒子”的神器，百一……</div>
 </div>
</div>
<!-- 标签页 -->	
<div class="container tcont">
<!-- Nav tabs -->
<ul class="mytab" role="tablist">
  <li class="active"><a href="#home" role="tab" data-toggle="tab">
<img  src="${pageContext.request.contextPath }/core/images/tablist_a.png" width="64%;">
  </a>
  </li>
  <li><a href="#profile" role="tab" data-toggle="tab"><img  src="${pageContext.request.contextPath }/core/images/tablist_b.png"  width="64%;"></a></li>
</ul>
<div style="clear:both;"></div>
<!-- Tab panes -->
<div class="tab-content">
  <div class="tab-pane active" id="home">
<!-- 社招 -->
		<div class="step">
			<div class="container">
			     <div class="step_01">	
				        <div class="step_title">自助创建测评，一键生成试卷</div>
				        <ul class="stepul">
				           <li>自助创建任意难度，不同技术方向的测评试题。</li>
				        </ul>
				        <div style="text-align:center;"><img src="${pageContext.request.contextPath }/core/images/tabimg_a1.png " width="60%"></div>
				  </div>
			     <div class="step_02">	
				        <div class="step_title">一键发送多份邀请</div>
				        <ul class="stepul">
				           <li>给应聘人发送答题邀请，邀请线上答题及面试。</li>
				        </ul>
				        <div style="text-align:center;"><img  src="${pageContext.request.contextPath }/core/images/tabimg_a2.png"></div>
				  </div> 
			     <div class="step_03">	
				        <div class="step_title">考生线上答题，省时省力</div>
				        <ul class="stepul">
				           <li>线上答题，在线面试，全程监控，公平公正。</li>
				        </ul>
				        <div style="text-align:center;"><img  src="${pageContext.request.contextPath }/core/images/tabimg_a3.png"  width="60%"></div>
				         <div style="text-align:center;padding-top:20px;"><img  src="${pageContext.request.contextPath }/core/images/tabimg_a4.png"  width="60%"></div>
				  </div> 
			     <div class="step_04">	
				        <div class="step_title">测评报告辅助决策，锁定优秀人才</div>
				        <ul class="stepul">
				           <li>被试者交卷，面试官微信即可收到测评报告。</li>
				           <li>对标海量样本，测评结果客观准确。</li>
				        </ul>
				        <div style="text-align:center;"><img  src="${pageContext.request.contextPath }/core/images/tabimg_a5.png" width="60%"></div>
				  </div> 		  
			     <div class="step_05">	
				        <div class="step_title">实时撰写面试报告</div>
				        <ul class="stepul">
				           <li>带着手机去面试，缩短等待，高效协作。</li>
				        </ul>
				    <div style="text-align:center;"><img  src="${pageContext.request.contextPath }/core/images/tabimg_a6.png" width="60%"></div>     
				  </div> 		    		   
			 </div>     	    
		</div>  
  </div>
  <div class="tab-pane" id="profile">
<!-- 校招 --> 
		<div class="step">
			<div class="container">
			     <div class="step_01">	
				        <div class="step_title">校园招聘极速易用</div>
				        <ul class="stepul">
				           <li>校招档期，宣讲会流程通过百一发布，精准送达学生手机。</li>
				        </ul>
				        <div style="text-align:center;"><img  src="${pageContext.request.contextPath }/core/images/tabimg_b1.png" width="80%"></div> 
				  </div>
				  <div class="step_02">	
				        <div class="step_title">微信考试，千人在线不阻塞</div>
				        <ul class="stepul">
				           <li>宣讲会现场发布考卷编号，现场输入编号即可开始考试，实现多种考卷极速分发。</li>
				        </ul>
				      <div style="text-align:center;"><img  src="${pageContext.request.contextPath }/core/images/tabimg_b2.png" width="40%"></div>   
				  </div>	  
				  <div class="step_03">	
				        <div class="step_title">微信看报告做决策</div>
				        <ul class="stepul">
				           <li>现场自动阅卷出成绩，自动统计分析成绩。</li>
				        </ul>
				    <div style="text-align:center;"><img  src="${pageContext.request.contextPath }/core/images/tabimg_b3.png" width="30%"></div>     
				  </div>		  
				  <div class="step_04">	
				        <div class="step_title">实时撰写面试评价</div>
				        <ul class="stepul">
				           <li>带着手机面试人选，实时撰写面试评价，缩短等待，高效协作。</li>
				        </ul>
				     <div style="text-align:center;"><img  src="${pageContext.request.contextPath }/core/images/tabimg_b4.png" width="70%"></div>    
				  </div>		  
			 </div>     	    
		</div> 
  </div>
</div>
</div>

		<!--footer -->
		<%@include file="common/footer.jsp"%>
		<!--end footer -->
		<!-- /.modal -->
		<!-- end 免费使用模态层 -->
		<!--footer -->
		<!--end footer -->
</body>
<script type="text/javascript">
	var requestUrl = "${request_url}";
</script>
</html>
