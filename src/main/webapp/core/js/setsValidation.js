/**
 * sets表单校验
 * zengjie
 * 2014/5/6
 */
(function($){
	var defaults = {
		//默认选项
		options : {
			 sniffHtml: true, // sniff for 'required', 'maxlength', etc
			 filter: function () {
	                return $(this).is(":visible"); // only validate elements you can see
	               // return true; // validate everything
	         }
		},
		//方法
		methods : {
			//初始化
			init : function(options){
				this.attr( "novalidate", "novalidate" );
				var settings = $.extend(true,{},defaults);
				settings.options = $.extend(true,settings.options,options);
				//获取form对象
				var $siblingElements = this;
		        var uniqueForms = $siblingElements[0];
		        
		       /* $(uniqueForms).on("submit",function(e){
		        	   e.preventDefault();
		        	var $form = $(this);
		            if(!settings.methods.submitValidate($form)){
		            	return false;
		            };
		        });*/
		        
		        var $inputs = $(uniqueForms).find("input").not("[type=submit],[type=image]").filter(settings.options.filter);
		        //绑定事件
		       $inputs.each(function(i,ele){
		        	$(ele).on("blur",function(){
		        		return settings.methods.toValidate($(this),$(uniqueForms));
		        	});
		        	$(ele).on("keyup",function(e){
		    			var value = $(this).val();
		    			if ( (e.which === 9  && !value) || e.which === 13 ) {
		    				return;
		    			} else{
		    				return settings.methods.toValidate($(this),$(uniqueForms));
		    			}
		        	});
		        });
			},
			//提交检验
			submitValidate : function($form){
				$form = !$form?$(this):$form;
				var flag=true;
				 var $inputs = $form.find("input").not("[type=submit],[type=image]").filter(defaults.options.filter);
		         $inputs.each(function(i,ele){
		         	var event = defaults.methods.toValidate($(ele),$form);
		         	if(!event){
		         		flag = false;
		         	}
		         });
		         return flag;
			},
			//校验
			toValidate : function($ele,$form){
				var _this = this;
				var flag = true;
				var $this = $ele;
				var value = $this.val();
				//必填
				if ($this.attr("required") !== undefined){
					var msg = $this.attr("data-validation-required-message");
					if($this.hasClass('vali_error') && value){
						_this.removeError($this);
					}
					if(!value){
						_this.setError($this,msg,$form);
						flag = false;
					}
				} 
				//邮箱
			    if ($this.attr("type") !== undefined && $this.attr("type").toLowerCase() === "email") {
			    	if(value){
			    		if(!isEmail(value)){
				    		//$this.attr("data-original-title","请输入正确格式的邮箱地址！");
				    		var msg = $this.attr("data-validation-email-message");
				    		if(msg){
				    			_this.setError($this,msg,$form);
				    		}
							flag = false;
						}else{
							_this.removeError($this);
						}
			    	}
			    	
			    }
			    
			    return flag;
			},
			//密码校验
			passWordSame : function($ele,$form){
				
			},
			//设置错误
			setError : function($ele,msg,$form){
				$ele.addClass("vali_error");
				$ele.tooltip('destroy').tooltip({ title:msg,trigger: 'manual'}).tooltip('show');
				$form.find('.tooltip-arrow').addClass('tooltip-arrow-danger-top');
				$form.find('.tooltip-inner').addClass('tooltip-inner-danger');
			},
			//去除错误
			removeError : function($ele){
				$ele.removeClass("vali_error");
				$ele.tooltip('destroy');
			},
			//是否数字
			isNumber : function(value){
				var reg = /^[0-9]*[1-9][0-9]*$/ig;//i：表示忽略大小写，g:全局查
				return reg.test(value);
			}
		}
	};
	//判断是否邮箱
	function isEmail(str){
		var reg = /^[\w\-][\w\-\.]*@[a-z0-9]+([a-z0-9\-\.]*[a-z0-9\-]+)*\.[a-z0-9]{2,}$/ig;//i：表示忽略大小写，g:全局查
	      // var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	    return reg.test(str);
	}
	$.fn.setsValidation = function(){
		var method = arguments[0];
		if(defaults.methods[method]){
			method = defaults.methods[method];
			arguments = Array.prototype.slice.call(arguments,1);
		}else if(typeof method==='object' || !method){
			method = defaults.methods.init;
		}else{
			$.error("method:"+method+"不存在");
			return null;
		}
		
		return method.apply(this,arguments);
	};
	$.fn.removeValidationErr = function(){
		$(this).removeClass("vali_error");
		$(this).tooltip('destroy');
	};
	$.fn.setsValidationErr = function(msg){
		  var $siblingElements = this;
	        var uniqueForms = $.unique(
	          $siblingElements.map( function () {
	            return $(this).parents("form")[0];
	          }).toArray()
	        );
		$(this).addClass("vali_error");
		$(this).tooltip('destroy').tooltip({ title:msg,trigger: 'manual'}).tooltip('show');
		$(uniqueForms).find('.tooltip-arrow').addClass('tooltip-arrow-danger-top');
		$(uniqueForms).find('.tooltip-inner').addClass('tooltip-inner-danger');
	}
	
})(jQuery);