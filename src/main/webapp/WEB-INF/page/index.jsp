<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html>
<head>
<title>百一测评 - 用互联网的方式颠覆笔试</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/core/css/index.css" rel="stylesheet" type="text/css" />
<script src="${pageContext.request.contextPath }/core/js/index.js"></script>
<script type="text/javascript">
	var LOGIN_REQUEST_URL = "${requestScope.request_url}";
	var EMPLOYER_ID = "${sessionScope.employer_id}";
	var EMPLOYER_NAME = "${sessionScope.employer_name}";
</script>
</head>
<body>
	<%@include file="common/header.jsp"%>
	<!-- 用户登录 -->
<div class="bannerindext">
  <div class="container bannerimg">
    <div class="title_g" style="padding-top:150px;">百一测评 </div>
    <div class="title_h">用互联网的方式颠覆笔试</div>
    <div class="bannerbtn">
        <button onClick="location.href='#001'">在线测评</button>
        <button onClick="location.href='#002'">微信测评</button>
    </div>

  </div>
</div>	
<!-- 社会招聘 -->
<div class="part_a" name="001" id="001">
	<div class="container part3" >
		<div class="conttext_3">
			<div class="part_title">
			<div class="title_h" style="padding-top:60px;">高效在线测评</div>
		<!-- <img src="${pageContext.request.contextPath }/core/images/parttitle2.png">-->
			</div>
			<div class="title_cont">看简历觉着合适？<br/>用百一发送测评邀请，技能题编程题任你考，无需你判题，<br/>提前选出合适的人选。</div>
			<div class="part3_a">
				<img src="${pageContext.request.contextPath }/core/images/part3a.png" style="width:88%; height:88%;">
			</div>
			<div class="part3_b">
				<img src="${pageContext.request.contextPath }/core/images/part3b.png" style="width:70%; height:70%;">
			</div>
		</div>
	</div>	
</div>	
	<!-- 社招体验 -->
	<div class="experience">
	<div class="experiencetitle_a">速速体验百一高效在线测评</div>	
		<div class="container experience-society">
		
			<!-- 
			<div class="col-xs-4"><div class="test"></div></div>
			<div class="col-xs-4"><div class="test"></div></div>
			<div class="col-xs-4"><div class="test"></div></div>
			 -->
		</div>
	</div>
	
	<!-- 校园招聘 -->
<div class="part_b" name="002" id="002">
	<div class="container part2">
		<div class="conttext_2">
			<div class="part_title">
			<div class="title_h">海量微信考试</div>	
			<!-- 
				<img src="${pageContext.request.contextPath }/core/images/parttitle1.png"> -->
			</div>
			<div class="title_cont">一键启动千人微信考试，考生交卷即获得成绩报告<br/>从此不再印卷子，判卷子。</div>
			<div class="part2_b">
				<img src="${pageContext.request.contextPath }/core/images/part2b.png" style="width:85%;height:85%;">
			</div>
			<div class="part2_c">
				<img src="${pageContext.request.contextPath }/core/images/part2c.png" style="width:80%;height:80%;">
			</div>
		</div>
	</div>
</div>	
	<!-- 校招体验开始 -->
	<div class="experience">
		<div class="container  experience-campus">
		</div>
	</div>
	<!-- 体验结束 -->
	<div class="patr_f">
		<div class="container">
			<div class="row" style="padding-top:60px;padding-bottom:40px;">
				<div class="col-md-1"></div>
				<div class="col-md-5">
					<div class="index_slg">
						<img src="${pageContext.request.contextPath }/core/images/index_slg.png">
					</div>

					百一测评交流群：191587905<br> 联系电话：010-82166778<br> 电子信箱：admin@101test.com<br>
					公司地址：北京市海淀区中关村软件园二期西北旺东路10号院东区<br> 邮政编码：100193
					<div>
						copyright：百一测评 &nbsp;&nbsp;京ICP备 11005544号<br>百一云智 <a
							href="${pageContext.request.contextPath}/sets/page/statement" style="margin-left:10px;color:#2b557a;"
							target="_blank">使用百一前必读</a>
					</div>
				</div>
	
				<div class="col-md-6" id="oBusiCopDiv">
					<div class="footerh">商务合作</div>
					<form id="businessCooperateForm" role="form" novalidate>
						如果您对我们的产品感兴趣或有合作意向，请留下您的信息。
						<ul style="padding-bottom:40px;">
							<li class="copyrightinput">姓名<input style="width:180px;" name="name" /><span
								style="color:white;margin-left:5px;" id="busiNameInfo"></span></li>
							<li class="copyrightinput">企业<input style="width:400px;" name="company" /></li>
							<li class="copyrightinput">邮箱<input style="width:400px;" name="email" /><span
								style="color:white;margin-left:5px" id="busiemailInfo"></span></li>
							<li class="copyrightinput">电话<input style="width:180px;" name="phone" /><span
								style="color:white;margin-left:5px" s id="busiphoneInfo"></span></li>
							<li class="copyrightinput">留言<textarea style="width:450px;" name="remark" rows="3"></textarea></li>
							<li class="copyrightinput"><button id="toSubmitBusi">提交</button></li>
						</ul>
					</form>
				</div>
				<!-- <div class="copyright"><a href="www.asiainfo-linkage.com" class="navbar-link">亚信联创集团股份有限公司</a> <span class="divider-vertical">|</span> <span class="divider-vertical">|京ICP备11005544   京公网安备110108007119号</span></div>              -->
			</div>
		</div>
	</div>

	<script id="tmpl_report" type="text/x-jsrender">

		<a class="btn btn-default report" target="_blank" href="{{:~reportHref(#parent.parent.data.position.positionId, testId, passport)}}">
		<img src="{{:picUrl}}" class="portrait">
		<div class="info">
			<span class="name">{{:candidateName}}</span>
			<span class="score">{{:score}}</span>
		</div>
		<div class="star">{{:~getStarTmpl(score)}}</div>
		</a>

	</script>
	<script id="tmpl_questionType" type="text/x-jsrender">
	<li style="float:left;text-align:center;">
		{{:typeName}} <br/>{{:questionNumber}} 道
	</li>
	</script>
	<script id="tmpl_questionType2" type="text/x-jsrender">
	<li style="float:left;text-align:center;">
		{{:typeName}} {{:questionNumber}} 道
	</li>
	</script>
	<script id="tmpl_campus" type="text/x-jsrender">
<div class="experiencetitle">急速体验百一专有微信测评</div>		
	<div class="col-xs-12" style="padding-left:210px;">
       <div class="test">		
		<ul class="question">
			{{for paperQuestionTypes tmpl="#tmpl_questionType2" /}}
           <li>(<a href="{{:~paperPreviewHref(position.positionId)}}" target="_blank"><i class="fa fa-arrow-right"></i> 试卷预览</a>)</li>
           <li style="padding-left:370px;">累计体验 <span class="em">{{:invitatedNum+1000 || 1000}}</span> 次</li>
          
		</ul>
     <div style="clear:both;">&nbsp;</div>	
<div>
<ul class="school_step">
 <li class="stepli">
<span class="steptitle">体验步骤</span><br>
1、用微信“扫一扫”右侧二维码关注“百一测评”公众号体验微信测评；<br>
2、点击手机屏幕下方的菜单【现在体验】，并进入【应聘者体验入口】体验百一是如何用微信考试的；<br>
3、交卷后30秒（判卷时间只要30秒），进入【招聘者体验入口】，查看测评后的答题报告。		
</li>
 <li><img src="http://101testneeds.oss-cn-beijing.aliyuncs.com/pictures/employer/qrcode_for_employer_0.png"></li>
</ul> 
</div>
	
	</div></div>
	</script>
	<script id="tmpl_society" type="text/x-jsrender">
	<div class="col-xs-4">
<div class="testtype">
	<div class="textimg"><img src="{{:~expIcon(position.seriesId)}}"></div>
     <div class="test divcenter">
        <div class="jobtitle">{{:position.positionName}}</div>
	<div>
    <div>
		 <ul class="cont_pa">
			{{for paperQuestionTypes tmpl="#tmpl_questionType" /}}
		 </ul>
    </div>	
    <div class="linkpaper"><a href="{{:~paperPreviewHref(position.positionId)}}" target="_blank"><i class="fa fa-arrow-right"></i> 试卷预览</a></div>
    <div class="testtime">累计邀请测评 <br/><span class="em">{{:~invitedNum(position.seriesId, invitatedNum || 0)}}</span>次   </div>
    <div><a class="btn btn-warning btn-invite" href="{{:~inviteHref(position.positionId)}}" target="_blank"><span>邀请</span></a></div>
<i class="fa fa-user"></i>
<i class="fa fa-plus"></i>
</div>
{{!--报告 --}}
			{{for posMessage tmpl="#tmpl_report" /}}
	</div>
</div>
</div>
	</script>
	<!--v5kf -->
	<%@include file="common/v5kf.jsp"%>
	<!--end v5kf -->
</body>
</html>
