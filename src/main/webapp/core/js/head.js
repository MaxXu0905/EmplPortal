/*
 *head.jsp对应js
 *zengjie
 *2014/4/22 
 */
(function($) {
	var header;
	$(function() {
		$.fn.serializeToObject = function() {
			var obj = new Object();
			var arr = this.serializeArray();
			for ( var i in arr) {
				obj[arr[i].name] = arr[i].value;
			}
			return obj;
		};
		header = new Header();
		header.init();
		header.bindEvent();
	});

	/* head构造函数 */
	function Header() {
		this.$headModal = $("#headModal"); // 模态层
		this.$headModalBody = $("#headModalBody");// 模态层主体
		this.$headModalLabel = $("#headModalLabel");// 模态层标题
		this.$navMenu = $("#navMenu");// 导航
		this.$logo = $("#logo");// logo
	}
	/* 扩展行为 */
	Header.prototype = {
		/* 初始化 */
		init : function() {
			var _this = this;
			var content = [];
			content.push('<li><a href="' + root + '/sets/page/home.html">首页</a></li>');
			content.push('<li class="divider-vertical">|</li>');
			content.push('<li><a id="handbook" href="#" >产品介绍</a></li>');
			content.push('<li class="divider-vertical">|</li>');
			if (employerId && employerName) {
				content.push(this.geneDropdownMenu('百一测速', this.getCampusHelperTmpl(), true));
				content.push('<li class="divider-vertical">|</li>');
				var welcomeTmpl = [];
				welcomeTmpl.push('<li><a id="modPass" href="#" ><i class="fa fa-cog"></i> 修改密码</a></li>');
				welcomeTmpl.push('<li class="divider"></li>');
				welcomeTmpl.push('<li><a id="quite" href="' + root
						+ '/sets/page/logout"><i class="fa fa-power-off"></i> 退出</a></li>');
				content.push(this.geneDropdownMenu('欢迎您！' + employerName, welcomeTmpl.join('')));
				_this.getQrcode(employerId && employerName);
				_this.getCampusCode();
			} else {
				content.push('<li><a href="' + root + '/sets/page/regist" >登录</a></li>');
				content.push('<li class="divider-vertical">|</li>');
				content.push('<li><a href="' + root + '/sets/page/regist#regist" >注册</a></li>');
				content.push('<li class="divider-vertical">|</li>');
				content.push('<li><a href="#oBusiCopDiv">商业合作</a></li>');
			}
			_this.$navMenu.append(content.join(''));
			_this.$headModal.modal({
				backdrop : 'static',
				keyboard : false,
				show : false
			});
				
		},
		getCampusCode: function(){
			var _this = this;
			
			$.ajax({
				url: root + '/sets/sys/getEmployerAuthCode',
				success: function(data){
					if(data.code == 0){
						_this.$navMenu.find('.cm-code').text(data.data || '');
					}
				}
			});
			
		},
		getCampusHelperTmpl: function(){
			var items = [];
			items.push('<div class="p10" style="width:460px;">');
			items.push('<h5 class="cm-title mt0">百一测速旨在测试考试地点的信号和带宽是否能够正常支持微信考试</h5>');
			items.push('<p class="pl15">预计花费30分钟，预计消耗流量80兆（合20元）</p>');
			items.push('<p class="pl15">测速口令：<span class="cm-code"></span>（下载App后登录需要使用）</p>');
//			items.push('<h5 class="cm-title">电脑下载方式：</h5>');
//			items.push('<a target="_blank" href="http://fir.im/jvso" class="ml15 mr15 btn btn-danger"><i class="fa fa-apple"></i> 苹果版本下载</a>');
//			items.push('<a target="_blank" href="http://fir.im/qo3b" class="btn btn-success"><i class="fa fa-android"></i> 安卓版本下载</a>');
			items.push('<h5 class="cm-title">手机下载方式：</h5>');
			items.push('<p class="pl15">1、请您先用微信“扫一扫”下方二维码，关注“百一测评”。</p>');
			items.push('<img class="ml15 mb10 img-thumbnail w120 app-img">');
			items.push('<p class="pl15">2、点击手机屏幕下方“微测体验>>百一测速”，打开下载页面。</p>');
			items.push('</div>');
			
			return items.join('');
		},
		geneDropdownMenu: function(title, contentTmpl, noIcon){
			var items = [];
			items.push('<li class="dropdown"><a data-toggle="dropdown" href="#">');
			items.push(title);
			if(!noIcon){
				items.push(' <i class="fa fa-caret-down"></i>');
			}
			items.push('</a>');
			items.push('<ul class="dropdown-menu">');
			items.push(contentTmpl);
			items.push('</ul></li>');
			return items.join('');
		},
		getQrcode : function(login) { // 获取二维码图片
			var _this = this;
			var imgUrl = 'http://101testneeds.oss-cn-beijing.aliyuncs.com/pictures/employer/qrcode_for_employer_2.jpg';
			$('.app-img').attr('src', imgUrl);
			if(!login){
				return;
			}
			$
					.ajax({
						url : root + '/sets/sys/getQRCodePicUrl',
						success : function(data) {
							if (data.data) {
								imgUrl = data.data;
							}
							var items = [];
							items.push('<li class="divider-vertical">|</li>');
							items.push('<li class="qrcode-dropdown"><a href="#" data-toggle="dropdown">');
							items.push('<i class="fa fa-qrcode"></i></a>');

							items.push('<ul class="dropdown-menu">');
							items.push('<li>');
							items.push('<img class="qrcode-pic" src="' + imgUrl + '">');
							items.push('<div class="qrcode-slogan">微信扫一扫<br>测评报告早知道</div>');
							items.push('</li></ul>');
							items.push('</li>');
							_this.$navMenu.append(items.join(''));
							_this.bindAnim(_this.$navMenu.find('.qrcode-dropdown'));
							
							$('.app-img').attr('src', imgUrl);
						}
					});
		},
		bindAnim : function($ele) { // 绑定下拉菜单动画效果
			$ele.on('shown.bs.dropdown', function() {
				var $this = $(this);
				setTimeout(function() {
					$this.children('.dropdown-menu').addClass('dropdown-menu-open');
				}, 10);
			})
			$ele.on('hide.bs.dropdown', function() {
				var $this = $(this);
				$this.children('.dropdown-menu').removeClass('dropdown-menu-open');
			});
		},
		/* 绑定监听事件 */
		bindEvent : function() {
			var _this = this;
			// 点击logo
			_this.$logo.on("click", function() {
				if (employerId && employerName) {
					window.location.href = root + "/sets/page/home.html";
				} else {
					window.location.href = root;
				}
			});

			_this.bindAnim(_this.$navMenu.children('.dropdown'));

			// 关闭时清除模态数据
			_this.$headModal.on("hidden.bs.modal", function() {
				$('#headModalBody').empty();
				$(this).removeData("bs.modal");
			});
			_this.$headModal.on('shown.bs.modal', function() {
				$('#headModalBody input:visible:first', this).focus();
			});
			_this.$navMenu.on("click", "a[id]", function() {
				var id = $(this).attr('id');
				switch (id) {
				// 修改密码
				case 'modPass':
					_this.popModalWindow(root + "/sets/page/modPassword", "修改密码");
					return false;
					// 退出
				case 'quite':
					LocalUtils.removePublic('login_remember');
					LocalUtils.removePublic('login_ticket');
					LocalUtils.removePublic('login_loginName');
					LocalUtils.removePublic('login_loginPswd');
					break;
					//产品手册
				case 'handbook':
					window.open(root+"/sets/page/handbook");
					return false;
					// 登陆
				case 'gologin':
					_this.popModalWindow(root + "/sets/page/login", "登录");
					return false;
				}

			});
		},
		/* 弹出modal窗口 */
		popModalWindow : function(url, title) {
			var _this = this;
			_this.$headModalBody.load(url);
			_this.$headModalLabel.text(title);
			_this.$headModal.modal('show');
			return false;
		}
	};
})(jQuery);
function convertURL(url) {
	// 获取时间戳
	var timstamp = (new Date()).valueOf();
	// 将时间戳信息拼接到url上
	// url = "AJAXServer"
	if (url.indexOf("?") >= 0) {
		url = url + "&t=" + timstamp;
	} else {
		url = url + "?t=" + timstamp;
	}
	return url;
}
function callajax(){
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
	    document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
	    }
	  }
	xmlhttp.open("POST",root+"/test/login",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send('{ name: "John", time: "2pm" }' );
}
