<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript">
	var ACTION = "${requestScope.action}";	
	var ACTION_URL = "${requestScope.actionUrl}";	
</script>
<link href="${pageContext.request.contextPath }/core/css/relogin.css" rel="stylesheet" type="text/css" />
<div id="re-login-main">
</div>
<script id="tmpl_reloginMain" type="text/x-jsrender">
			<div class="alert-main alert-login"
			data-link="class{merge:loginNameError||loginPswdError||loginError toggle='alert-main-active'}
			">
				{^{>loginNameError||loginPswdError||loginError}}
			</div>
			<div class="warning-info">
				由于您长久未操作，需要您重新登录
			</div>
			<input data-link="{:loginName:}
			class{merge:loginNameError toggle='input-error'}
			class{merge:!loginNameError&&loginName toggle='input-success'}
			" name="loginName" type="text" class="login loginc h45 form-control" placeholder="请输入您的公司邮箱">
			<input data-link="{:loginPswd:}
			class{merge:needcode toggle='up10'}
			class{merge:loginPswdError toggle='input-error'}
			class{merge:loginPswd toggle='input-success'}
			" name="loginPswd" type="password" class="login mt20 loginb h45 form-control" placeholder="请输入密码">
 			<div class="validatecode-main" data-link="visible{:needcode}">
        		<input type="text" name="valiCode" class="login w120 mt10 h45 form-control" placeholder="请输入验证码">
        		<img title="点击更换" data-link="src{:validatecodeimg}">
       		</div>
			<div class="mt10 p0 remember-main" data-link="class{merge:needcode toggle='mt0'}">
				<a href="${pageContext.request.contextPath }/sets/login/forgotPassword" target="_blank" class="pull-right forget-password">忘记密码 ？</a>
			</div>
			<button class="mybtn btn-login" data-link="disabled{:!loginAvailable || logining}
			class{merge:needcode toggle='mt0'}
			">{^{if logining}}登录中...{{else}}登 录{{/if}}</button>
</script>
<script type="text/javascript">
(function($) {
var belongModal = '#login_modal';
var LoginModel = Klass.create();
LoginModel.include({
	loginName : null,
	loginPswd : null,
	ticket : null,
	loginNameError : null,
	loginPswdError : null,
	loginError : null,
	loginAvailable : false,
	logining : false,
	needcode : false, // 是否需要校验码
	validatecodeimg : null,
	loginValiCode : null,
	init : function() {
	}
});
var loginData = LoginModel.inst();
var LoginController = Controller.create({
	lazyElements : {
		'$loginBtn' : '.btn-login'
	},
	tmpls : {
		'#tmpl_reloginMain' : '$$loginMain',
	},
	events : {
		'keyup,input[name="loginName"],' : 'keyName',
		'keyup,input[name="loginPswd"],' : 'keyPswd',
		'keyup,input[name="valiCode"],' : 'keyCode',
		'keydown,input.login,' : 'keyLogin',
		'click,.validatecode-main>img,' : 'changeValidateCode',
		'click,.btn-login,' : 'login'
	},
	init : function() {
		this.link();
		this.addObservers();
		this.needValidateCode();
		this.ajaxOpts = reAjaxOpts;
	},
	lazyEvent : true,
	link : function() {
		this.$loginMain = this.el;
		this.$$loginMain.link(this.$loginMain.selector, loginData);
		this.refreshLazyElements();
		this.linked(); // 绑定事件
	},
	addObservers : function() {
		var that = this;
		$
				.observe(loginData, 'loginName', 'loginPswd', 'loginNameError',
						'loginValiCode', function changeHandler(ev, eventArgs) {
							var available = false;
							if (loginData.loginName && loginData.loginPswd
									&& !loginData.loginNameError) {
								if (loginData.needcode) {
									if (loginData.loginValiCode) {
										available = true;
									}
								} else {
									available = true;
								}
							}
							$.observable(loginData).setProperty({
								loginAvailable : available
							});
						});
	},
	keyName : function(e) {
		var val = $.trim($(e.target).val());
		if (val) {
			if (/^[\w\-][\w\-\.]*@[a-z0-9]+([a-z0-9\-\.]*[a-z0-9\-]+)*\.[a-z0-9]{2,}$/ig
					.test(val)) {
				$.observable(loginData).setProperty({
					loginName : val,
					loginNameError : null,
					loginError: null
				});
			} else {
				$.observable(loginData).setProperty({
					loginName : val,
					loginNameError : 'Email格式不对哦'
				});
			}
		} else {
			$.observable(loginData).setProperty({
				loginName : val,
				loginNameError : '请输入您的公司邮箱'
			});
		}
	},
	keyPswd : function(e) {
		var val = $.trim($(e.target).val());
		if (val) {
			$.observable(loginData).setProperty({
				loginPswd : val,
				loginPswdError : null,
				loginError: null
			});
		} else {
			$.observable(loginData).setProperty({
				loginPswd : val,
				loginPswdError : '请输入密码'
			});
		}
	},
	keyCode : function(e) {
		var val = $.trim($(e.target).val());
		if (val) {
			$.observable(loginData).setProperty({
				loginValiCode : val,
				loginError : null
			});
		} else {
			$.observable(loginData).setProperty({
				loginValiCode : val,
				loginError : '请输入验证码'
			});
		}

	},
	keyLogin : function(e) {
		if (e.keyCode == 13) {
			this.$loginBtn.trigger('click');
			return false;
		}
	},
	needValidateCode : function() {
		Server.needValidateCode({
			success : function(data) {
				if (data.code == 0 && data.data.needCode == 1) {
					$.observable(loginData).setProperty({
						needcode : true,
						validatecodeimg : root + '/sets/login/validateCode?' + Math.random()
					});
				}
			}
		});
	},
	changeValidateCode : function() {
		$.observable(loginData).setProperty({
			validatecodeimg : root + '/sets/login/validateCode?' + Math.random()
		});
	},
	login : function() {
		var req = {};
		req.username = $.trim(loginData.loginName);
		req.password = $.md5(loginData.loginPswd);
		if (loginData.needcode) {
			req.certifycode = loginData.loginValiCode;
		}
		Server.loginCertify({
			contentType : 'application/json',
			data : JSON.stringify(req),
			beforeSend : function() {
				$.observable(loginData).setProperty({
					logining : true,
					loginError : null
				});
			},
			success : function(data) {
				if (data.code == 0) {
					if (data.data.needCode == 1 && !data.data.code) {
						$.observable(loginData).setProperty(
								{
									needcode : true,
									validatecodeimg : root + '/sets/login/validateCode?'
											+ Math.random(),
									loginError : '请输入验证码'
								});
						return;
					}
					if (data.data.code == 'SUCCESS') {
						switch (ACTION * 1) {
						case 1: // 消失
							$(belongModal).modal('hide');
							if(reAjaxOpts){
								reAjax4reLogin(reAjaxOpts);
							}
							break;
						case 2: // 刷新
							window.location.reload();
							break;
						case 3: // 定向跳转
							window.location.href = ACTIONURL || (root + '/sets/page/home.html');
							break;
						default:
							window.location.href = root + '/sets/page/home.html';
						}
						
					} else {
						var info = '';
						switch (data.data.code) {
						case 'PASSWORDERROR':
							info = '您输入的密码有误';
							break;
						case 'ACCTNOTEXIST':
							info = '您输入的邮箱不存在';
							break;
						case 'OUTDATE':
							info = '您输入的邮箱账户已过期';
							break;
						case 'CERTIFYCODEERR':
							info = '您输入的验证码错误';
							break;
						default:
							info = '网络似乎有点繁忙，请稍后再试';
							break;
						}
						$.observable(loginData).setProperty({
							loginError : info
						});
					}
				}
			},
			error : function() {
				$.observable(loginData).setProperty({
					loginError : '抱歉，服务貌似异常了'
				});
			},
			complete : function(data) {
				$.observable(loginData).setProperty({
					logining : false
				});
			}
		});
	}
	
});
	new LoginController({
		el : $('#re-login-main')
	});
})(jQuery);
</script>

