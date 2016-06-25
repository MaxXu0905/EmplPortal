<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>自助配置微信测评--百一</title>
<link href="${pageContext.request.contextPath }/core/css/guide.css" rel="stylesheet" type="text/css" />
<script type="text/javascript">
</script>
</head>
<body>
	<div class="wrapper">
		<div class="bs-callout bs-callout-danger">
			<h4 class="action">测评已经创建成功。</h4>
			<p style="font-size:16px;">
				考试链接为：<span class="service-url"></span><br /> <span><a href="http://mp.weixin.qq.com" target="_blank">现在去配置</a></span>
			</p>
		</div>
		<div class="bs-callout bs-callout-info">
			<h4>自助配置微信测评</h4>
			<br />
			<!--   <p>登录微信公众平台，在左侧的功能列表中选择自动回复，在右侧选择关键词自动回复<br>点击添加规则按钮，分别配置考试口令和回复内容</p> -->
			<img src="${pageContext.request.contextPath }/core/images/guide_e.png" /><br> <img
				src="${pageContext.request.contextPath }/core/images/guide_f.png" style="margin:15px 0px;" />
			<p>测评君提示您：微信中设置回复内容时的考试链接需要用以下代码：
			<pre>&lt;a href="<i><span class="service-url"></span></i>"&gt;猛戳这里参加考试&lt;/a&gt;</pre>
			<i class="fa fa-info"></i> 请注意是双引号哦！<br /> <br /> 因为微信在不同手机平台上的展现不同，请你配置好后分别用苹果和安卓手机测试一下。<br />（对于微信的这个缺陷，测评君也表示无能为力。）
			</p>
		</div>
		<div class="bs-callout bs-callout-info gone qrcode-download">
			<h4>仅供没有微信应用应聘者扫描，请根据实际情况选择下载二维码</h4>
			<table class="mt20 table table-hover table-condensed text-center">
				<thead>
					<tr>
						<th class="text-center">二维码边长（厘米）</th>
						<th class="text-center">建议扫描距离（米）</th>
						<th class="text-center">下载链接</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>8</td>
						<td>0.5</td>
						<td><a data-pix="224"><i class="fa fa-download"></i></a></td>
					</tr>
					<tr>
						<td>12</td>
						<td>0.8</td>
						<td><a data-pix="336"><i class="fa fa-download"></i></a></td>
					</tr>
					<tr>
						<td>15</td>
						<td>1</td>
						<td><a data-pix="420"><i class="fa fa-download"></i></a></td>
					</tr>
					<tr>
						<td>30</td>
						<td>1.5</td>
						<td><a data-pix="840"><i class="fa fa-download"></i></a></td>
					</tr>
					<tr>
						<td>50</td>
						<td>2.5</td>
						<td><a data-pix="1400"><i class="fa fa-download"></i></a></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</body>
<script type="text/javascript">
(function($) {
	var POSITION_ID = "${requestScope.positionId}";
	var action = "${param.action}";
	var $qrcode = $('.qrcode-download');
	if(action && action=='help'){
		$('.action').hide();
	}
	
	Server.getCampusPassport({
		success : function(data) {
			if (data.code == 0 && data.data) {
				var entry = data.data.entry || '';
				$('.service-url').html(RenderUtils.weixinService.replace('{entry}', entry));
				// 下载链接
				$qrcode.show().find('a').each(function(){
					var size = $(this).data('pix');
					$(this).attr('href', root + '/sets/qrcode/genEntryQRCode/' + size + '/' + (data.data.entry || ''));
				});
			}
		}
	}, {
		positionId : POSITION_ID
	});

})(jQuery);
</script>
</html>
