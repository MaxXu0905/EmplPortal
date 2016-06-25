<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="<%=request.getContextPath() %>/core/css/base.css" rel="stylesheet" type="text/css" />
<%@include file="common/meta.jsp"%>
<script type="text/javascript" src="${pageContext.request.contextPath }/plugin/Highcharts-3.0.9/js/highcharts.js"></script>
<title>试卷模型</title>
<style type="text/css">
	.testModel .title{
	border-bottom: 1px solid #eee;
	padding:20px 40px;
}
.testModel .title > h2,.testModel .title >h3{
	color: #333;
}

.testModel .title .tag{
	border: 2px solid #eee;
	padding : 10px;
	
}
.testModel .title .alert-info{
	color:red;
}
</style>
</head>
<body>
	<div class="testModel">
		<!-- 标题 -->
		<div class="title">
			<h2 align="center">Java-中级-开发工程师测评试卷报告</h2>
		</div>
		<!--end 标题 -->
		
		<!-- 题型结构 -->
		<div class="title">
			<h3>一、题型结构组成</h3>
			<p>本次试卷由主观题和客观题两部分组成，其中:
				主观题20道，客观题3道，附加题
				2道，面试题2道。 &nbsp;|&nbsp; 考试时长：60分钟
			</p>
			
		</div>
		<!--end  题型结构 -->
		
		<!-- 考核重点 -->
		<div class="title">
			<h3>二、试卷考核重点</h3>
			<ul>
				<li>
				<span class="label label-default">JavaBean</span>
				<span class="label label-default"> Java</span>
				<span class="label label-default"> http协议</span>
				<span class="label label-default"> 数据库</span>
				<span class="label label-default"> jsp</span>
				<span class="label label-default"> Servlet</span>
				<span class="label label-default"> shell</span>
				<span class="label label-default"> html</span>
				<span class="label label-default"> oracle</span>
				</li>
			</ul>
			<p> <span class="alert-info">系统无法分析出【ibatis】,百一测评正在成长中，对于无法分析出来的技能，小百会实时关注，会努力解决的！</span></p>
		</div>
		<!--end  考核重点 -->
		
		<!-- 考核比重难度分布 -->
		<div class="title">
			<h3>三、各考核点的比重及难度分布</h3>
			<p id="barChar">
				
			</p>
		</div>
		<!--end  考核比重难度分布  -->
		
		<!-- 附加题 -->
		<div class="title">
			<h3>四、附加题</h3>
				<ul>
					<li>
						1、字符串${inputa}，${inputb} 编程比较他们看是否相等，如果相等请输出"equal",不等输出"not equal"
					</li>
					<li>
						2、有一组字符串${inputa}，请编程输出其中包含的数字，例如：字符串a6d7m84qe，输出结果：6784
					</li>
				</ul>
		</div>
		<!--end  附加题  -->
		
		<!-- 面试题 -->
		<div class="title">
			<h3>五、面试题</h3>
				<ul>
					<li>
						1、如何评价你自己
					</li>
					<li>
						2、描述下你所做过的项目中收获的是什么
					</li>
				</ul>
		</div>
		<!--end 面试题   -->
	 </div>
</body>
<%@include file="common/meta.jsp"%>
<script type="text/javascript">
$(function () { 
    $('#barChar').highcharts({
    	  chart: {
              type: 'column'
          },
          title: {
              text:'考核点在试卷中的占比'
          },
          colors:['rgb(251,255,0)',
        	  	  'rgb(251,151,0)',
        	  	  'rgb(214,0,0)'
        	  
          ],
          xAxis: {
              categories: ['JavaBean','jsp', 'JavaScript', 'JS', 'Html','Http协议','数据库','Servlet','Shell','Oracle']
          },
          yAxis: {
              min: 0,
              title: {
                  text: ''
              },
              stackLabels: {
                  enabled: true,
                  style: {
                      fontWeight: 'bold',
                      color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                  }
              }
          },
          legend: {
              align: 'right',
              x: -70,
              verticalAlign: 'top',
              y: 20,
              floating: true,
              backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
              borderColor: '#CCC',
              borderWidth: 1,
              shadow: false
          },
          tooltip: {
              formatter: function() {
                  return '<b>'+ this.x +'</b><br/>'+
                      this.series.name +': '+ this.y +'<br/>'+
                      'Total: '+ this.point.stackTotal;
              }
          },
          plotOptions: {
              column: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true,
                      color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                  }
              }
          },
          series: [{
              name: '高难度',
              data: [5, 3, 4, 7, 2,3,1,2,1,2]
          }, {
              name: '中难度',
              data: [2, 2, 3, 2, 1,4,2,3,1,2]
          }, {
              name: '低难度',
              data: [3, 4, 4, 2, 5,2,4,5,1,2]
          }]
      });
});
</script>
</html>