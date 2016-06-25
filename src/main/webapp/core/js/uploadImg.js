/**
 * 上传图片
 * zengjie
 * 2014/9/2
 */
var setsUploadImg=(function(my,$){
	  String.prototype.replaceAll  = function(s1,s2){    
	        return this.replace(new RegExp(s1,"g"),s2);    
	    }
		my.init = function(){
			 // 设置上传全局配置
			if(!$.jUploader){
				throw new Error("图片上传依赖jUploader");
			}
		    $.jUploader.setDefaults({
		        cancelable: true,
		        allowedExtensions: ['jpg','jpeg', 'png'],
		        messages: {
		            "upload": '',
		            "cancel": '取消',
		            "emptyFile": "{file} 为空，请选择一个文件.",
		            "invalidExtension": "{file} 后缀名不合法. 只有 {extensions} 是允许的.",
		            "onLeave": "文件正在上传，如果你现在离开，上传将会被取消。"
		        }
		    });
		}();
	/*上传路径*/
	var uploadurl = "",//http://localhost:8080/InterviewPortal/upload/uploadQbPic/
	    imgsrcVal = '<input id="{id}" type="hidden" name="{id}" />',
			MAIN_TEMPLATE = '{hidden}\n' +
		'{preview}\n' +
	    ' <div class="input-group pull-right">\n' +
	    ' {upload}\n' +
	    '</div>',
		/*预览模板*/
		PREVIEW_TEMPLATE = '<div class="file-preview">\n' +
        '   <div class="close fileinput-remove text-right">&times;</div>\n' +
        '   <div class="file-preview-thumbnails"></div>\n' +
        '   <div class="clearfix"></div>' +
        '   <div class="file-preview-status text-center text-success"></div>\n' +
        '</div>',
        /*预览img模板,包裹预览图*/
        IMAGE_TEMPLATE = '<div class="file-preview-frame" id="{previewId}">\n' +
        '   {content}\n' +
        '</div>\n',
        INPUTBTN_TEMPLATE = '<div class="input-group-btn"><div id="{inputBtnId}" class="uploadPic btn-file"><i class="glyphicon glyphicon-folder-open"></i> <span></span> </div></div>',
        TIP = '<span id="{tipId}" style="color:#FF6600"></span>',
        MSGLOADING = 'Loading  file {index} of {files} &hellip;',
        MSGPROGRESS = 'Loading file {index} of {files} - {name} - {percent}% completed.',
        /*错误提示*/
        MSGERRORCLASS =  '<div class="file-error-message" id="{tipId}">\n' +
        '   {content}\n' +
        '</div>\n', 
        isEmpty = function (value, trim) {
            return value === null || value === undefined || value == []
                || value === '' || trim && $.trim(value) === '';
        },
        getElement = function ( value) {
            return (isEmpty(value) ||  $(value));
        },
        /*获取唯一值*/
        uniqId = function () {
            return Math.round(new Date().getTime() + (Math.random() * 100));
        };
        /*定义图像处理构造函数*/
        var ImgInput = function(element,imgUploadUrl,preview){
        	this.$element = $(element);
        	this.mainId = this.$element.attr('id');
        	if(isEmpty(this.mainId)){
        		throw new Error("上传图片必须设置容器ID");
        	}
        	if(imgUploadUrl){
        		uploadurl=imgUploadUrl;
        	}
        	this.init(preview);
        	this.listen();
        };
        /*原型扩展*/
        ImgInput.prototype = {
        		/*初始化*/
        		init : function(preview){
        			var _self = this;
        			_self.hidden = imgsrcVal;
        			_self.preview = PREVIEW_TEMPLATE;
        			_self.broswer = INPUTBTN_TEMPLATE;
        			_self.tip = MSGERRORCLASS;
        			_self.mainTemplate = MAIN_TEMPLATE;
        			_self.previewImageTemplate = IMAGE_TEMPLATE;
        			
        			/*创建主容器*/
        			if (typeof _self.$container == 'undefined') {
                        _self.$container = _self.createContainer(preview);
                    } else {
                        _self.refreshContainer();
                    }
        			/*创建其他容器*/
        			_self.$previewContainer = _self.$container.find('.file-preview');
                    _self.$preview = _self.$container.find('.file-preview-thumbnails');
                    _self.$previewStatus = getElement(_self.$container.find('.file-preview-status'));
                    _self.$hidden= getElement(_self.$container.find('#'+_self.hiddenId));
                    if(preview){
                  	  var  previewId = "preview-" + uniqId();
                  	   var content = _self.previewImageTemplate.replace("{previewId}", previewId).replace("{content}", preview);
                  	   _self.$preview.html(content);
                  	   var $img = getElement(preview);
                  	 _self.$hidden.val($img.attr('src'));
                  	 _self.$element.trigger('heightResize');
                  }
        			/*生成图片上传*/
        			_self.upload();
        		},
        		 listen: function () {
        	            var self = this;
        	            self.$container.on('click', '.fileinput-remove:not([disabled])', $.proxy(function(){
        	            	self.$container.removeClass('file-input-new').addClass('file-input-new');
        	            	self.$element.trigger('defaultheight');
        	            	self.$element.trigger('uploadCancel');
        	            	$("#"+self.broswerId).removeClass("cancelUploadPic").removeClass('replacePic').addClass("uploadPic");
        	            }, self));
        	      },
        		/*初始化预览*/
        		initPreview : function(){
        			var _self = this,html="";
        		},
        		/*创建主容器*/
        		createContainer: function (preview) {
                    var _self = this;
                    //_self.$element.addClass('form-group');
                    var $container = null;
                    if(preview){
                    	$container = $(document.createElement("span")).attr({"class": 'file-input'}).html(_self.renderMain());
                    }else{
                    	$container = $(document.createElement("span")).attr({"class": 'file-input file-input-new'}).html(_self.renderMain());
                    }
                    _self.$element.html($container);
                    return $container;
                },
                /*刷新容器*/
                refreshContainer : function(){
                	  var self = this, $container = self.$container;
                      $container.html(self.renderMain());
                },
        		/*渲染主区*/
        		renderMain: function () {
                    var _self = this;
                    _self.hiddenId = _self.mainId+"Val";
                    var hidden = _self.hidden.replaceAll("{id}",_self.hiddenId);
                    var preview = _self.preview;
                    _self.broswerId = _self.mainId+"-Submit";
                    var broswer = _self.broswer.replace("{inputBtnId}",_self.broswerId);
                    _self.tipId = _self.mainId+"-"+uniqId;
                    var tip = _self.tip.replace("{tipId}",_self.tipId).replace("{content}",'');
                    return _self.mainTemplate.replace('{hidden}',hidden).
                    	replace('{preview}',preview).
                        replace('{upload}', broswer);
                },
                /*加载图片*/
                loadImage : function (url, caption) {
                    var _self = this, $img = $(document.createElement("img"));
                    $img.attr({
                        "src": url,
                        "class": 'file-preview-image',
                        "title": caption,
                        "alt": caption,
                        "onload": function (e) {
                        	 _self.$preview.removeClass('loading');
                        }
                    });
                    // autosize if image width exceeds preview width
                    if ($img.width() >= _self.$preview.width()) {
                        $img.attr({width: "100%", height: "auto"});
                    }
                    var $imgContent = $(document.createElement("div")).append($img);
                    return $imgContent.html();
                },
                /*上传图片*/
                upload : function (){
                	var _self = this;
                	var actionURL = uploadurl;
                	$.jUploader({
                        button: _self.broswerId, // 这里设置按钮id
                        action: actionURL, // 这里设置上传处理接口
                        // 开始上传事件
                        onUpload: function (fileName) {
                         _self.$element.trigger('uploadStart');
                         _self.$previewStatus.html('正在上传 ' + fileName + ' ...');
                         _self.$container.removeClass('file-input-new');
                         _self.$preview.addClass('loading');
                         _self.$element.trigger('heightResize');
                         $("#"+_self.broswerId).removeClass("uploadPic").removeClass("replacePic").addClass("cancelUploadPic");
                         _self.$preview.find('img').hide();
                        },

                        // 上传完成事件
                        onComplete: function (fileName, response) {
                            // response是json对象，格式可以按自己的意愿来定义，例子为： { success: true, fileUrl:'' }
                        	$("#"+_self.broswerId).removeClass("cancelUploadPic").addClass("uploadPic");
                        	if(response.result && !$.isArray(response.result)){
                        		response.result = JSON.parse(response.result);
                        	}
                        	_self.$preview.removeClass('loading');
                        	  if (response.result && response.result.length) {
                            	//装载图片
                               $.each(response.result, function (index, file) {
                            	  var  previewId = "preview-" + uniqId();
                            	  file.src = file.src.replaceAll('&amp;','&');
                            	  var imgHtml = _self.loadImage(file.src, fileName);
                            	   var content = _self.previewImageTemplate.replace("{previewId}", previewId).replace("{content}", imgHtml);
                            	   _self.$preview.html(content);
                            	   _self.$previewStatus.text(fileName + ' 上传成功!'+"图片大小:"+file.size);
                            	   _self.$previewStatus.fadeOut(3000);
                            	   _self.$hidden.val(file.src).trigger('changeImg',[_self.$hidden.attr('id'),imgHtml]);
                            	 	$("#"+_self.broswerId).removeClass("cancelUploadPic").removeClass('uploadPic').addClass("replacePic");
                               });
                                // 这里说明一下，一般还会在图片附近加添一个hidden的input来存放这个上传后的文件路径(response.fileUrl)，方便提交到服务器保存
                            } else {
                            	var error = MSGERRORCLASS;
                            	var errorMsg = "上传失败";
                            	if(response.sizeError){
                            		errorMsg = response.sizeError;
                            	}
                            	if(response.formatError){
                            		errorMsg = response.formatError;
                            	}
                            	error = error.replace("{tipId}",'tip-'+ uniqId()).
                            	replace('{content}',errorMsg);
                            	_self.$previewStatus.show().html(error);
                            	_self.$previewStatus.fadeOut(3000,function(){
                            		if( !_self.$hidden.val()){
                            			_self.$container.addClass('file-input-new');
                            			if( _self.$preview.html()==""){
                            				  _self.$element.trigger('defaultheight');
                            			}
                            		}
                            	});
                            }
                        	  _self.$preview.find('img').show();
                        	  _self.$element.trigger('heightResize');
                        	  _self.$element.trigger('uploadComplete');
                        },

                        // 取消上传事件
                        onCancel: function (fileName) {
                        	 _self.$element.trigger('uploadCancel');
                        	_self.$preview.removeClass('loading');
                        	_self.$previewStatus.html(fileName + '上传取消!');
                        	_self.$previewStatus.fadeOut(3000);
                        	$("#"+_self.broswerId).removeClass("cancelUploadPic").addClass("uploadPic");
                        	if( !_self.$hidden.val()){
                    			_self.$container.addClass('file-input-new');
                    			if( _self.$preview.html()==""){
                    				  _self.$element.trigger('defaultheight');
                    			}
                    		}
                        },

                        // 系统信息显示（例如后缀名不合法）
                        showMessage: function (message) {
                           alert(message, 'error');
                        }
                    });
                }
        }
        $.fn.imgInput = function (imgUploadUrl,preview) {
            return this.each(function () {
                var $this = $(this), data = $this.data('imgInput');
                if (!data) {
                    $this.data('imgInput', (data = new ImgInput(this,imgUploadUrl,preview)));
                    
                }
            })
        };

	return my;
}(setsUploadImg || {},jQuery));