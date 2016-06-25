<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>导入试卷</title>
	<%@include file="common/meta.jsp"%>
	<link href="<%=request.getContextPath() %>/core/css/importPaper.css" rel="stylesheet">
</head>
<body>
	<!-- header -->
	<%@include file="common/header.jsp"%>
	<!-- end header -->
	
	<!-- 标题提示 -->
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<h1 class="main-title">导入试卷</h1>
			</div>
		</div>
	</div>
	<!--end 标题提示 -->
	
	<!-- 主体 -->
	<div class="container">
		<div class="row">
			<div class="step">
				<dl class="dl-horizontal p30 inline-block w">
				<dt class="mb0">试卷名称</dt><dd class="mb0">
				<input  id="paperName" type="text" class="mb0 w500 form-control inline" placeholder="请输入试卷名称" >
				<div class="pull-right tar">
		         <a  id="filetmpl" class="mr20" href="http://101testneeds.oss-cn-beijing.aliyuncs.com/template_xls/%E8%AF%95%E5%8D%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xls">下载试卷模板</a>
				<input type="file" style="display: none;" id="multi_import" >
				</div>		                
				<!-- 警告框 -->
				<div id="importErr" class="clearboth pull-right w200 none alert alert-danger fade" role="alert">
			      <button id="importErrClose" type="button" class="close" ><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
			      <strong>导入提示:</strong><span class="alertMsg"></span>
			    </div>
			   <!--end 警告框 -->
				</dd>
			</dl>
			</div>
		</div>
	</div>
	<!--end 主体 -->
	
	<!-- 导入提示 -->
	<div class="container">
		<div class="row">
				<div id="paperVerify" class="main-wrap none"><iframe id="goverify" name="goverify" width="100%" height="90" class="share_self"  frameborder="0" scrolling="no" src=""></iframe></div>
		</div>
	</div>
	<!--end 导入提示 -->
	
	<div class="modal waiting_modal" id="modal_waiting">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-body">
						<span class="spinner"></span> <span class="title pull-left"></span>
					</div>
				</div>
			</div>
	   </div>
	   
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
						<button id="alertBtn" type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
		<!-- /.modal -->
		
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
						<button id="confirmbtn" type="button" class="btn btn-primary" >确认</button>
						<button id="cancelbtn" type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					</div>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
		<!-- /.modal -->
		<!-- 确认模态层 -->
		<!--footer -->
	<%@include file="common/footer.jsp"%>
	<!--end footer -->
</body>
<script>
	var paperName = decodeURIComponent("${requestScope.paperName}");
	var testType = '${testType}';
	var seriesId = '${seriesId}';
	var level = '${level}';
	var JESEESION_ID = "${pageContext.session.id}";
</script>
<script src="<%=request.getContextPath() %>/plugin/uploadify/jquery.uploadify.min.js?t=<%=System.currentTimeMillis() %>/"></script>
<script src="<%=request.getContextPath()%>/plugin/spin.min.js"></script>
<script src="<%=request.getContextPath() %>/core/js/importPaper.js"></script>
</html>