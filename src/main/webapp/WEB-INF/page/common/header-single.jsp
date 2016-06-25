<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
	.dropdown-menu.dropdown-caret:before {
border-bottom: 7px solid rgba(0,0,0,0.2);
border-left: 7px solid transparent;
border-right: 7px solid transparent;
content: "";
display: inline-block;
left: 9px;
position: absolute;
top: -7px;
}
.dropdown-menu.dropdown-caret:after {
border-bottom: 6px solid #fff;
border-left: 6px solid transparent;
border-right: 6px solid transparent;
content: "";
display: inline-block;
left: 10px;
position: absolute;
top: -6px;
left: auto;
right: 10px;
}
#personalInfo >a,#personalInfo >a:hover,#personalInfo >a:focus{
background-color:transparent
}

</style>

<!--header -->
<div id="header" >
	<div class="navbar navbar-default navbar-static-top">
		<div class="container">
			<div class="navbar-header">
				<a id="logo" class="navbar-brand logo-wrapper" href="/">百一
				<img class="logo-img" src="${pageContext.request.contextPath }/core/images/logo.png">
				<span class="logo-beta">测试版</span>
				</a>
			</div>
		</div>
	</div>
</div>
<!--模态层-->
<div class="modal fade" id="headModal" tabindex="-1" role="dialog" aria-labelledby="headModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title f20" id="headModalLabel"></h4>
      </div>
      <div id="headModalBody" class="modal-body clearfix">
      	
      </div>
      <!-- <div class="modal-footer">
      </div> -->
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<script src="${pageContext.request.contextPath}/plugin/jquery.md5.js"></script>
<script src="${pageContext.request.contextPath }/plugin/store+json2.min.js"></script>
	<script src="${pageContext.request.contextPath }/core/js/recordLoginInfo.js"></script>
	 
<script>
var requestUrl ="${request_url}",employerId="${sessionScope.employer_id}",employerName="${sessionScope.employer_name}";
(function($){
	$(function(){
		//登陆
		$("#gologin").on("click",function(){
			$("#headModalBody").load(root+"/sets/page/login");
			$("#headModalLabel").html("登录");
			$("#headModal").modal();
			return false;
		});
		//关闭时清除模态数据
		$("#headModal").on("hidden.bs.modal",function(){
			$('#headModalBody').empty();
			$(this).removeData("bs.modal");
		});
		$("#headModal").on('shown.bs.modal', function () {
			$('#headModalBody input:visible:first', this).focus();
		});
	});
	
})(jQuery);

</script>
<!--end 修改密码 -->

