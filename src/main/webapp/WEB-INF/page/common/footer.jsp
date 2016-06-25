<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div style="padding:20px;margin-top:50px;text-align:center;">copyright@百一测评 <a href="${pageContext.request.contextPath}/sets/page/statement" style="margin-left:10px;" target="_blank">使用百一前必读</a></div>
<!-- 
<div id="footer" class="navbar-inverse"> 
	<div id="wrapper"> 
 		<div class="container"> 
 			<div class="row"> 
 				<div class="col-xs-8" style="text-align:left;line-height:24px;"> 
	<div class="qrcode_foot">	
		<div class="footerh">扫一扫，发现更多人才！</div>
		<div>为企业提供网络招聘,校园招聘,社会招聘,<br>培训,测评等一站式专业人力资源服务。
		<div style="padding-top:10px;">
		<span style="padding-right:20px;"><a href="#"><img src="${pageContext.request.contextPath }/core/images/sina.png"></a></span>
		<span><a href="#"><img src="${pageContext.request.contextPath }/core/images/weibo.png"></a></span>
		</div>
		</div>				
	</div>	
 				</div> 
 				<div class="col-xs-4" style="text-align:left;line-height:24px;"> 
				<div class="footerh">百一测评</div>
电子信箱：admin@101test.com<br>
北京市海淀区中关村软件园二期西北旺东路10号院东区<br>
邮政编码：100193<br>
联系电话：010-82166778
				</div>
 			</div> 
 		</div> 
 	</div> 
 </div> 
  -->
<!--v5kf -->
<%@include file="v5kf.jsp"%>
<!--end v5kf -->
<div id="backtotop" class="btn btn-default">
	<i class="fa fa-chevron-up"></i>
</div>

<script>
	/**
	 * 返回到顶部的小插件 约定页面底部区域使用id为footer的元素标识 样式对应在sets.css
	 */

	(function() {

		$('body').on('mouseenter', 'div.v5_container div.v5_cell', function(e) {
			$(this).tooltip({
				title : '在线对话',
				container : 'body',
				placement : 'left'
			});
			$(this).tooltip('show');
		});

		var $b2t = $('#backtotop');
		$(window).scroll(function() {
			if ($(this).scrollTop() > 100) {
				$b2t.addClass('showme');
			} else {
				$b2t.removeClass('showme');
			}
		});

		// 飞起来
		$b2t.click(function() {
			$('body,html').animate({
				scrollTop : 0
			}, 400);
			return false;
		});

		if ($(window).scrollTop() == 0) {
			$b2t.removeClass('showme');
		} else {
			$b2t.addClass('showme');
		}
	})();
</script>