<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript" src="${pageContext.request.contextPath }/plugin/j-ui/jquery-ui-custom.min.js"></script>
  <style type="text/css">
  #sortable { list-style-type: none; margin: 0;  width: 600px; }
  #sortable li,#alternative li,#selected li {  float: left; text-align: center; width:120px; height: 34px; } 
 /*  #sortable { list-style-type: none; margin: 0; padding: 0; }
  #sortable li { margin: 3px 3px 3px 0; padding: 1px; float: left; width: 100px; height: 90px; font-size: 4em; text-align: center; } */
  .sort-placeholder{
    margin-top:10px;
    margin-right:5px;
  	background-color: #ebebeb;
	border-color: #adadad;
  }
</style>
<!-- 常规设置 -->
	<div id="regularWrap">
	<div class="col-md-12 mt15" ><p>已选项（点击删除，拖拽排序）：</p></div>
		<ul class="col-md-12" id="selected">
			<li class="btn btn-default mt10 mr5" style="background-color: #C0C0C0" >姓名</li>
			<li class="btn btn-default mt10 mr5"  style="background-color: #C0C0C0">邮箱</li>
		</ul>
		<ul class="col-md-12" id="sortable">
		</ul>
		<div class="col-md-12 mt15"><p>备选项（点击增加）：</p></div>
		<ul class="col-md-12 mb20" style="min-height:30px" id="alternative"></ul>
		<div class="col-md-12 text-center mb20"><button id="saveSet" type="button" data-dismiss="modal" class="btn btn-success">保存设置</button></div>
	</div>
<!-- end 常规设置 -->
  <script type="text/javascript">
  
  (function($){
	  $(function(){
		  initData();
		  $( "#sortable" ).sortable({
		      placeholder: "sort-placeholder"
		    });
		  $("#sortable").disableSelection();
		  $(document).off("click","[role='button']");
		  $(document).on("click","[role='button']",function(){
			     var dataType = $(this).attr("data-type");
				if("selected"==dataType){
					$(this).attr("data-type","backselect");
					  var tempHtml = $(this)[0].outerHTML;
					  $(this).remove();
					$("#alternative").append(tempHtml);
					
				}else{
					$(this).attr("data-type","selected");
					  var tempHtml = $(this)[0].outerHTML;
					  $(this).remove();
					$("#sortable").append(tempHtml);
				};
				return false;
			  });
		  $("#saveSet").on("click",function(){
			  toSave();
		  });
	  });
	  //初始化数据
	  function initData(){
		  var getUrl=convertURL("<%=request.getContextPath()%>/sets/sys/getInfo");
		  $.getJSON(getUrl,function(data){
			  if(data.code=="0"){
				  var result = data.data;
				  for(var i in result){
					  var temp ='<li class="btn btn-default mt10 mr5" data-type="selected" role="button" data-infoid="'+result[i].infoId+'" data-seq="'+result[i].seq+'" >'+result[i].infoName+'</li>';
					  if(result[i].choosed){
						 //1.放入已选择 
						 if(result[i].infoId!="FULL_NAME" && result[i].infoId!="EMAIL"){
							 $("#sortable").append(temp);
						 }
					  }else{
						 //2.放入备选 
						 if(result[i].infoId!="FULL_NAME" && result[i].infoId!="EMAIL"){
							 var temp ='<li class="btn btn-default mt10 mr5" data-type="backselect" role="button" data-infoid="'+result[i].infoId+'" data-seq="'+result[i].seq+'" >'+result[i].infoName+'</li>';
							 $("#alternative").append(temp);
						 }
					  }
				  }
			  }else{
				  $("#alertInfo-a").html("获取不到常规信息数据！");
				  $("#alertInfo").removeClass("hidden");
			  }
		  });
	  }
	  //保存设置
	  function toSave(){
		  $("#alertInfo").addClass("hidden");
		  var jsonArr=[];
		  $("#sortable").children().each(function (index,value){
			  if(typeof($(this).attr("data-infoid"))!="undefined"){
				  var json={};
				  json.infoId=$(this).attr("data-infoid");
				  json.seq=index+3;
				  jsonArr.push(json);
			  }
		  });
			  var paramStr=JSON.stringify(jsonArr);
			  if (paramStr){
				  $.ajax({
				  		url:root+"/sets/sys/resetInfo",
				  		data:"param="+paramStr,
						success:function(msg)
						{
							if(msg.code=="0"){
								
							}else{
								$("#alertInfo-a").html("保存设置失败!");
								$("#alertInfo").removeClass("hidden");
							}
							
						},
						error:function(){
							$("#alertInfo-a").html("服务请求失败！");
							$("#alertInfo").removeClass("hidden");
						}
				  	});
			  }
	  }
  })(jQuery);
  </script>
