//公用registerBanner
(function($){
	var registerBanner = {
			init : function(){
				var _that = this;
				$.ajax({
					url :　root+"/sets/readOnly/getEmployerStatus/"+TEST_ID+"/"+PASSPORT,
					type : "post",
					dataType : "json",
					contentType : "application/json",
					success : function(result){
						_that.view(result);
						_that.bindEvent();
					}
				})
			},
			view : function(result){
				if(result.code==0&&result.data.code=="SUCCESS"){
					var datas = result.data.data;
					var viewContent =[];
					viewContent.push('<div style="position:fixed;bottom:0;height:60px;text-align:center;width:100%;line-height:65px;background-color:rgb(57,57,57);color:#fff;font-size:15pt;z-index:99999">');
					viewContent.push('</div>');
					viewContent.push('<div style="position:fixed;bottom:0;height:60px;text-align:center;width:100%;line-height:65px;color:#fff;font-size:15pt;z-index:999999">');
					if(datas==0){
						viewContent.push('您还没有注册，注册后可以无限量发送邀请并能享用更尊贵的服务。');
						viewContent.push('<label style="color:#fff;background-color:rgb(160,16,16);text-align:center;height:30px;line-height:30px;width:109px;text-decoration: underline;cursor: pointer;font-size:13pt" data-info = "register">去注册</label>');
						viewContent.push('<label style="color:#fff;margin-left:15px;font-size: 12pt;text-align:center;height:30px;line-height:30px;text-decoration: underline;cursor: pointer;" data-info = "login">有账号？去登录</label>');
						viewContent.push('</div>');
					}else if(datas==1){
						viewContent.push('您还没有登录。');
						viewContent.push('<label style="color:#fff;background-color:rgb(160,16,16);text-align:center;height:30px;line-height:30px;width:109px;text-decoration: underline;cursor: pointer;font-size:13pt" data-info = "login">去登录</label>');
						viewContent.push('<label style="color:#fff;margin-left:15px;font-size: 12pt;text-align:center;height:30px;line-height:30px;text-decoration: underline;cursor: pointer;"data-info = "register">没有账号？去注册</label>');
						viewContent.push('</div>');
					}
					$('#registerBanner').html(viewContent.join(''));
				}
			},
			bindEvent : function(){
				$('#registerBanner').on('click','label',function(){
					var info = $(this).data("info");
					if(info=="login"){
						location.href = root+"/sets/page/regist";
					}else if(info=="register"){
						location.href = root+"/sets/page/regist#regist";
					}
				})
			}
	}
	if(PASSPORT){
		registerBanner.init();
	}
	
})(jQuery)