<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>自助配置微信测评方法--百一</title>
<link href="${pageContext.request.contextPath }/core/css/guide.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<div class="wrapper">
		<div class="bs-callout bs-callout-danger" style="margin:20px;">
			<h4 class="action">测评已经创建成功。</h4>
			<p style="font-size:16px;">
				考试口令为：<span class="passport"></span><span style="padding-left:20px;"><a herf="#" class="change-passport"><strong>换一个</strong></a></span>
			</p>
		</div>
		<div class="bs-callout bs-callout-info" style="margin:20px;">
			<h4>招聘者和考生如何利用微信完成测评</h4>
			<img style="width:820px;" alt="" src="${pageContext.request.contextPath }/core/images/campus_guide101.png">
			<img class="img-thumbnail qrcode-img">
			<span class="ps ps1"></span>
			<span class="ps ps2"></span>
			<span class="ps ps3"></span>
		</div>
		<div class="bs-callout bs-callout-info" style="margin:20px;">
			<h4>如何知晓考试地点是否支持微信考试</h4>
			<div>
				<img class="mt10 mr10 w80 inline-block" alt="" src="http://101testneeds.oss-cn-beijing.aliyuncs.com/pictures/101signal.png">
				<div class="inline-block">
					请点击页面右上方的“百一测速”进行了解
				</div>
			</div>
		</div>
		<div class="bs-callout bs-callout-info gone qrcode-download" style="margin:20px;">
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
		function getQrcode() {
			var _this = this;
			$.ajax({
				url : root + '/sets/sys/getQRCodePicUrl',
				success : function(data) {
					var imgUrl = 'http://101testneeds.oss-cn-beijing.aliyuncs.com/pictures/employer/qrcode_for_employer_2.jpg';
					if (data.data) {
						imgUrl = data.data;
					}
					$('.qrcode-img').attr('src', imgUrl);
				}
			});
		}
		
		
		
		var POSITION_ID = "${requestScope.positionId}";
		var action = "${param.action}";
		var $passport = $('.passport');
		var $qrcode = $('.qrcode-download');
		var contentUrl = null;

		if (action && action == 'help') {
			$('.action').hide();
		}

		$('.change-passport').bind('click', function() {
			Server.refreshCampusPassport({
				success : function(data) {
					if (data.code == 0 && data.data) {
						$passport.html(data.data.passport || '');
					}
				}
			}, {
				positionId : POSITION_ID
			});
		});
		
		Server.getCampusPassport({
			success : function(data) {
				if (data.code == 0 && data.data) {
					//	$('.service-url').html(RenderUtils.weixinService.replace('{entry}', (data.data.entry || '')));
					$passport.html(data.data.passport || '');
					$('.ps').text(data.data.passport || '');
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
		
		getQrcode();
		

	})(jQuery);
</script>
</html>
