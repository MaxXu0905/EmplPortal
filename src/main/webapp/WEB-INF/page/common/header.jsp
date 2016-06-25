<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!--header -->
<div id="header" >
	<div class="navbar navbar-default navbar-static-top">
		<div class="container">
			<div class="navbar-header">
				<a id="logo" class="navbar-brand logo-wrapper" href="${pageContext.request.contextPath}/sets/page/home.html">百一
				<img class="logo-img" src="${pageContext.request.contextPath }/core/images/logo.png">
				<span class="logo-beta">测试版</span>
				</a>
			</div>
			<div class="navbar-collapse collapse">
				<ul id="navMenu" class="nav navbar-nav navbar-right">
				   
				</ul>
			</div>
		</div>
	</div>
</div>
<!--模态层-->
<div class="modal fade login_modal" id="login_modal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-body" style="overflow:hidden;">
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="headModal" tabindex="-1" role="dialog" aria-labelledby="headModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title f20" id="headModalLabel"></h4>
      </div>
      <div id="headModalBody" class="modal-body clearfix">
      	
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<script src="${pageContext.request.contextPath}/plugin/jquery.md5.js"></script>
<script src="${pageContext.request.contextPath }/plugin/store+json2.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/core/js/head.js"></script>
<script>
var employerId="${sessionScope.employer_id}",employerName="${sessionScope.employer_name}";
</script>
<!--end 修改密码 -->

