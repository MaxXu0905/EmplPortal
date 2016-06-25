<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.Random"%>
<!DOCTYPE html>
<html>
<head>
<title>发送测评邀请--百一</title>
<jsp:include page="common/meta.jsp"></jsp:include>
<link href="${pageContext.request.contextPath }/core/css/merge_invite.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/merge_invite.js"></script>
<script type="text/javascript">
	
</script>
</head>
<body>
	<!-- container -->
	<div class="matrix">
		<div id="main"></div>
	</div>
	<script id="tmpl_main" type="text/x-jsrender">
	<div class="alert alert-warning">
	通过选择多个测评进行一次邀请，应聘者可以选择任意一个进行答题 
		<button 
		data-link="disabled{:!hasItems}"
		class="ml10 btn btn-info btn-invite"><i class="fa fa-paper-plane"></i> 去邀请</button>
	</div>
	<div class="mt10">
	{^{for positions tmpl="#tmpl_position" /}}
	</div>
		<button 
		data-link="disabled{:!hasMore || loadingMore}"
		class="btn btn-info btn-block w200 margin-auto loadMore">
		{^{if loadingMore}}
		加载中...
		{{else !hasMore}}
		没有更多的测评了
		{{else}}
		加载更多
		{{/if}}	
		</button>
	</script>
	<script id="tmpl_position" type="text/x-jsrender">
	<div class="position-item" data-id={{:position.positionId}}>
	{{:position.positionName}}
	<div class="position-select">
		<i class="fa fa-check"></i>
	</div>
	</div>
	</script>
</body>
</html>
