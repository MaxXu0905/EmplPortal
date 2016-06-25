$(function($) {	"use strict";	$LAB			// .script(root + "/plugin/posfixed.js") // 表头固定插件			.script(root + "/plugin/jsviews.min.js")			.script(root + "/plugin/jquery.isotope.min.js")			.script(root + "/plugin/imagesloaded.pkgd.min.js")			.script(root + "/plugin/Highcharts-3.0.9/js/highcharts.js")			.script(root + "/plugin/spin.min.js")			.wait(					function() {						RenderUtils.extend({							extended : function() {								RenderUtils.myConverters();								RenderUtils.myHelpers();							},							myConverters : function() {								$.views.converters('signal', function(val) {									val = Math.abs(val * 1);									if (val < 90) {										return '<span class="text-success">佳</span>';									} else if (val < 100) {										return '<span class="text-info">中</span>';									} else {										return '<span class="text-danger">差</span>';									}								});							},							myHelpers : function() {								var that = this;								$.views.helpers({									previewTitle : function(skills, questions) {										var items = [];										if (skills.length) {											items.push('选择题');										}										if (questions.length) {											if (items.length) {												items.push('和')											}											items.push('编程题');										}										return items.join('');									},									hasChoices : function(skills) {										return skills.length;									},									hasSubjects : function(questions) {										return questions.length;									},									totalChoices : function(difficulties) {										var t = 0;										for ( var i = 0; i < difficulties.length; i++) {											var diff = difficulties[i] || [];											for ( var j = 0; j < diff.length; j++) {												t += diff[j];											}										}										return t;									},									totalSubjects : function(questions) {										var t = 0;										for ( var i = 0; i < questions.length; i++) {											t += questions[i].questionNum;										}										return t;									},									subjectDesc : function(questions) {										var d = [];										for ( var i = 0; i < questions.length; i++) {											var q = questions[i];											d.push(q.programLauguage);											d.push('（');											d.push(q.questionNum);											d.push(' 道题）');											if (i != questions.length - 1) {												d.push('，');											}										}										return d.join('');									}								});							}						});						RenderUtils.init();						var FastModel = Klass.create();						FastModel.include({							_loading : true,							_result : false,							_series : []						});						var PaperInfo = Klass.create();						PaperInfo.include({							totalTime : 0,							totalNum : 0,							skills : [],							difficulties : [],							questions : []						});						var fastData = FastModel.inst();						/** 委托人设置 is a model */						var Authorize = {							_authorize : 0, // 是否开启委托人							_checking : false, // 正在校验委托人邮箱,							_emailValid : false, // 邮箱格式是否正确							alert : null, // 出错提示							trustees : []						// 被委托人列表 						};						var FastController = Controller								.create({									records : {										previewDatas : {},										series : [],										trustees : {}									},									tmpls : {										'#tmpl_authorize' : '$$authorize', // 										'#tmpl_fast_create' : '$$fastCreator'									},									elements : {										'.fast-create-main' : '$fastCreator',										'.authorize-main' : '$authorize',										'.fast-create-btn': '$createBtn'									},									lazyElements : {										'$trusteeInput' : '#trustee_email', // 委托人输入框										'$btnAddTrustee' : '.btn-add-trustee' // 委托人输入框									},									init : function() {										this.link();										this.initData();										$('.authorize-tip').tooltip({											html: true,											placement: 'bottom',											template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div style="width:420px;max-width: 420px;text-align:left;" class="w tooltip-inner"></div></div>',											title: '将测评委托给别人，例如秘书，助理或者其他专做人才服务的机构。<br/>他们可以发送邀请测评，并且对测评报告进行初筛并推荐给你。'										});									},									lazyEvent : true, // 延迟绑定事件，在关联模板后调用linked方法									events : {										'click,.modal-footer>.fast-reset-btn,' : 'reset',										'click,.modal-footer>.fast-create-btn,' : 'create',										'mouseenter,.modal-body .fast-paper-item:not(.created),' : 'previewPaper',										// 委托相关										'click,.check-box.set-authorize,' : 'toggleAuthorize', // toggle委托人										'keydown,#trustee_email,' : 'keyDownTrusteeEmail',										'keyup,#trustee_email,' : 'keyTrusteeEmail',										'click,.btn-add-trustee,' : 'addTrustee',										'click,a.trustee-remove,.list-trustee' : 'removeTrustee',										'click,a.invite-regist,' : 'inviteRegist'									},									link : function() {										var that = this;										this.$$fastCreator.link(this.$fastCreator.selector, fastData);										/** 委托 */										this.$$authorize.link(this.$authorize.selector, Authorize);										this.setupElements([ '$trusteeInput', '$btnAddTrustee' ]);										this.linked();									},									initData : function() {										var that = this;										var success = false;										Server.getFastCreatePositionList({											success : function(data) {												if (data.code == 0 && data.data) {													$.extend(true, that.records.series, data.data);													$.observable(fastData).setProperty('_series', data.data);												}											}										});									},									reset : function() {										var data = [];										$.extend(true, data, this.records.series);										$.observable(fastData._series).refresh(data);									},									create : function() {										var that = this;										var paperIds = [];										this.el.find('.fast-paper-item.selected').each(function() {											paperIds.push($(this).data('paperid'));										});										if(!paperIds.length){ // 没有选中任何											that.$createBtn.text('您还没有选中任何测评呢').addClass('btn-danger');											setTimeout(function(){												that.$createBtn.text('快捷创建').removeClass('btn-danger');											}, 2000);											return;										}										var success = false;										Server.fastCreatePosition({											data : JSON.stringify({												paperIds: paperIds,												employerAuths: Authorize._authorize?Authorize.trustees:null											}),											contentType : 'application/json',											success : function(data) {												if (data.code == 0 && data.data.code == 'SUCCESS') {												}											},											complete: function(){												window.location.reload();											}										});									},									previewPaper : function(e) {										var that = this;										var $ele = $(e.target);										var paperId = $ele.data('paperid');										$ele												.popover(														{															container : 'body',															content : function() {																var previewData = that.records.previewDatas[paperId];																var $$tmpl = $.templates('#tmpl_paper_preview');																if (!previewData && paperId) {																	previewData = PaperInfo.inst();																	Server																			.getReportTemplateByPaperId(																					{																						async : false,																						success : function(data) {																							if (data && data.code == 0) {																								var objects = data.data.objects																										|| {};																								var subjects = data.data.subjects																										|| {};																								previewData.totalTime = data.data.totalTime || 0;																								previewData.totalNum = data.data.totalNum || 0;																								previewData.skills = objects.skills																										|| [];																								previewData.difficulties = objects.difficulties																										|| [];																								previewData.questions = subjects.questions																										|| [];																							}																						}																					}, {																						paperId : paperId																					});																	that.records.previewDatas[paperId] = previewData;																	$ele																			.on(																					'shown.bs.popover',																					function() {																						if (previewData																								&& previewData.skills.length) {																							that																									.loadGraphRatio(																											'.popover-preview .preview-choice-graph',																											previewData.skills,																											previewData.difficulties)																						}																					});																}																var html = $$tmpl.render(previewData);																return html;															},															html : true,															placement : 'bottom',															template : '<div class="popover-preview popover" role="tooltip"><div class="arrow"></div><div id="paper-preview-"'																	+ paperId + ' class="popover-content"></div></div>',															trigger : 'hover'														}).popover('show');									},									loadGraphRatio : function(place, skills, difficulties) {										var that = this;										var low = [], medium = [], high = [];										var names = [];										difficulties = difficulties || [];										for ( var i = 0; i < difficulties.length; i++) {											low.push(difficulties[i][0]);											medium.push(difficulties[i][1]);											high.push(difficulties[i][2]);										}										for ( var i = 0; i < skills.length; i++) {											names.push(skills[i].skillName);										}										$(place)												.highcharts(														{															credits : {																enabled : false															},															chart : {																height : 200,																type : 'column',																backgroundColor : 'rgba(255,255,255,0)'															},															colors : [ '#FF6666', '#FF9966', '#FFCC66' ],															title : null,															xAxis : {																tickWidth : 0,																categories : names,																labels : {																	rotation : (difficulties.length > 6 ? 30 : 0),																	style : {																		color : '#999999'																	}																}															},															yAxis : {																title : null,																gridLineWidth : 0,																lineWidth : 0,																labels : {																	formatter : function() {																		return '';																	}																}															},															tooltip : {																headerFormat : '<span style="font-size:12px">{point.key}:</span><table>',																pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'																		+ '<td style="padding:0"><b>{point.y:0f} </b></td></tr>',																footerFormat : '</table>',																shared : true,																useHTML : true															},															plotOptions : {																column : {																	stacking : 'normal',																	borderWidth : 0,																	pointPadding : 0.2,																	dataLabels : {																		enabled : true,																		color : '#FFF',																		formatter : function() {																			return this.y == 0 ? '' : this.y;																		}																	}																}															},															series : [ {																name : '高难度',																data : high															}, {																name : '中难度',																data : medium															}, {																name : '低难度',																data : low															} ]														});									},									toggleAuthorize: function(){										$.observable(Authorize).setProperty('_authorize', Authorize._authorize ? 0 : 1);									},									keyDownTrusteeEmail: function(e){ // 屏蔽ie8怪异现象										var e = e || event;										var keyNum = e.which || e.keyCode;										if (keyNum == 13) {											return false;										}									},									keyTrusteeEmail: function(e){										if (e.keyCode == 13) {											this.$btnAddTrustee.trigger('click');											return false;										}										var email = $.trim(this.$trusteeInput.val());										var valid = false;										if (email && /^[\w\-][\w\-\.]*@[a-z0-9]+([a-z0-9\-\.]*[a-z0-9\-]+)*\.[a-z0-9]{2,}$/ig													.test(email)) {												valid = true;											}										$.observable(Authorize).setProperty({											_emailValid: valid,											alert: null										});									},									addTrustee: function(e){										var email = $.trim(this.$trusteeInput.val());										// 1.判重										if(this.records.trustees.hasOwnProperty(email)){											$.observable(Authorize).setProperty({												alert: '这个人已经委托了'											});											return;										}																				// 2.校验										var that = this;										var valid = false;										var alert = null;										Server.checkAuthorEmail({											contentType: 'application/json',											data: JSON.stringify({												emailGranted: email											}),											beforeSend: function(){												$.observable(Authorize).setProperty('_checking', true);											},											success: function(data){												if(data.code == 0 && data.data){													switch (data.data.code) {													case 'SUCCESS':														that.add2TrusteeList(email);														break;													case 'SELFGRANTED':														alert = '哎呀，怎么能委托自己呢';														break;													case 'EMAILNOTSUPPORT':														alert = '不支持此类邮箱';														break;													case 'NONEEXIST':														alert = '这个邮箱还还未注册呢，您可以<a class="invite-regist">邀请</a>他来注册，对方注册后就可以看到您委托的测评啦。';														break;													default:														alert ='校验邮箱出错了';														break;													}												}											},											complete: function(){												$.observable(Authorize).setProperty({													alert: alert,													_checking: false												});											}																					});									},									add2TrusteeList: function(email){										this.records.trustees[email] = 1;										this.$trusteeInput.val('').trigger('keyup');										$.observable(Authorize.trustees).insert({											emailGranted: email										});									},									removeTrustee: function(e){										var view = $.view(e.target);										delete this.records.trustees[view.data.emailGranted];										$.observable(Authorize.trustees).remove(view.index);									},									inviteRegist: function(){										var email = $.trim(this.$trusteeInput.val());										if(!email){											return;										}										var alert;										var that = this;										Server.inviteEmployerJoin({											contentType: 'application/json',											data: JSON.stringify({												emailGranted: email											}),											beforeSend: function(){												$.observable(Authorize).setProperty({													alert: '正在发送注册邀请',													_checking: true												});											},											success: function(data){												if(data && data.code == 0){													switch (data.data.code) {													case 'SUCCESS':														alert = '发送邀请邮件成功';														that.add2TrusteeList(email);														break;													case 'ACCTREGISTERED':														alert = '账号已经注册';														break;													case 'EMAILNOTSUPPORT':														alert = '不支持此类邮箱';														break;													case 'SENDMAILERROR':													default:														alert = '发送邀请邮件失败';														break;													}												}											},											complete: function(){												$.observable(Authorize).setProperty({													alert: alert || '发送邀请邮件失败',													_checking: false												});											}										});									}								});						var functionManager = {							$createPostBtn : $('#function-create-post'),							$createCampusBtn : $('#function-create-campus'),							$fastCreateBtn : $('#function-fast-create'),							$manageLibBtn : $('#function-lib'),							$modalFastCreate : $('#modal_fast_create'),							init : function() {								this.initCreatePostBtn();								this.initFastCreateBtn();								this.initCreateCampusBtn();								this.initManageLibBtn();							},							initCreatePostBtn : function() {								this.$createPostBtn.click(function() {									window.location.href = root + '/sets/page/createpost.html';								});							},							initCreateCampusBtn : function() {								this.$createCampusBtn.click(function() {									window.location.href = root + '/sets/page/createcampus/';								});							},							initFastCreateBtn : function() {								var that = this;								that.first = true;								this.$fastCreateBtn.click(function() {									if (that.first) {										that.first = false;										new FastController({											el : $('#modal_fast_create')										});									}									that.$modalFastCreate.modal();								});							},							initManageLibBtn : function() {								this.$manageLibBtn.click(function() {									window.location.href = root + '/sets/page/questionlibMgr/';								});							}						}						functionManager.init();						var mail = {							$wrapper : $('div.mail'),							$companyModal : $('#modal_company'),							companyInfo : {								code : 'SUCCESS',								companyName : ''							},							init : function() {								this.initModal();								this.loadCompanyInfo();								this.check();							},							initModal : function() {								var _this = this;								this.$companyModal.modal({									backdrop : 'static',									keyboard : false,									show : false								});								var $saveBtn = this.$companyModal.find('button.save-company');								var $input = this.$companyModal.find('#company_name');								$input.bind('keyup blur', function() {									var val = $.trim($(this).val());									if (val) {										$saveBtn.removeAttr('disabled');									} else {										$saveBtn.attr('disabled', 'disabled');									}								});								$saveBtn.click(function() {									var val = $.trim($input.val());									if (val) {										_this.saveCompanyName(val, $(this));									}								});							},							check : function() {								var _this = this;								switch (this.companyInfo.code) {								case 'SUCCESS':// 已经有公司信息,可以直接发邀请;									break;								case 'COMPANYFROMDOMAIN':// 通过域名找到了公司信息，需要提示是否更改									_this.$companyModal.find('#company_name').val(_this.companyInfo.companyName || '');								case 'COMPANYNOTFOUND':// 没有找到公司信息，需要手动填写；									_this.$companyModal.modal('show');									_this.$companyModal.find('#company_name').trigger('blur');									break;								}							},							saveCompanyName : function(val, $btn) {								var _this = this;								var success = false;								$.setsAjax({									url : root + '/sets/invitation/saveCompanyInfo',									type : 'post',									contentType : 'application/json',									data : JSON.stringify({										companyName : val									}),									beforeSend : function() {										$btn.text('保存中...').attr('disabled', 'disabled');									},									success : function(data) {										if (data && data.code == 0) {											if (data.data && data.data.code == 'SUCCESS') {												success = true;												_this.$companyModal.modal('hide');												_this.loadMainInfo();											}										}									},									complete : function() {										if (!success) {											$btn.text('保存名称').removeAttr('disabled');										}									}								});							},							loadCompanyInfo : function() {								var _this = this;								$.setsAjax({									url : root + '/sets/invitation/getCompanyInfo',									async : false,									type : 'post',									success : function(data) {										if (data.code == 0 && data.data) {											_this.companyInfo = data.data;										}									}								});							}						};						mail.init();						/** ****** 获取星星评分模板 ************ */						var Star = {							getStarTmpl : function(a) {								if (isNaN(a)) {									a = 0;								}								a = Math.round(a);								if (a < 0) {									a = 0;								}								if (a > 10) {									a = 10;								}								var items = [];								for ( var i = 0; i < 5; i++) {									if (a <= i * 2) {										items.push('<i class="fa fa-star-o"></i>')									} else if (a < (i + 1) * 2) {										items.push('<i class="fa fa-star-half-o"></i>');									} else {										items.push('<i class="fa fa-star"></i>');									}								}								return items.join('');							},							convertRatio : function(a) {								var intA = parseInt(a);								var decimalA = ((a - intA) * 10).toFixed(0);								var addA = 0;								if (decimalA <= 2) {									addA = 0;								} else if (decimalA <= 7) {									addA = 0.5								} else {									addA = 1;								}								return intA + addA;							}						}						var PositionManager = {							$positionList : $('#position_list'), // 列表区域							$loadMoreBtn : $('#showmore'), // 加载更多按钮							$explain : $('.explain'),							_pageInfo : { // 分页参数								pageSize : 20,								requestPage : 1							},							droppers : {}, // 保存消息窗的集合							defaultPortrait : '/core/images/portrait_default.png', // 默认的照片							init : function() {								var _this = this;								this.initLayout(); // 初始化布局								this.onEvent(); // 初始化事件								this.$loadMoreBtn.click(function() {									_this.loadPositionList();								});								this.$loadMoreBtn.trigger('click');							},							initLayout : function() {								this.$positionList.isotope({ // 生成一个瀑布流布局对象：									itemSelector : '.article'								});							},							animSlide2Left : function($ele, step) {								var _this = this;								step = step + 20;								if ($ele.width() >= 288) {									$ele.animate({										textIndent : (-step) + 'px'									}, 50, 'linear', function() {										_this.animSlide2Left($ele, step);									});								}							},							animZoomout : function($ele) {								var _this = this;								if ($ele.width() >= 288) {									$ele.animate({										fontSize : '12px',									}, 50, 'linear', function() {										_this.animSlide2Left($ele, 0)									});								}							},							onEvent : function() {								var _this = this;								// hover相关事件								/** 移动到postion块标识标题可点击 */								this.$positionList.on('mouseover', '.article', function() {									$(this).find('.title').addClass('blue');								});								this.$positionList.on('mouseleave', '.article', function() {									$(this).find('.title').removeClass('blue');								});								this.$positionList.on('mouseenter', '.article .title', function() {									_this.animSlide2Left($(this), 0);								});								this.$positionList.on('mouseleave', '.article .title', function() {									$(this).stop().animate({										fontSize : '18px',										textIndent : 0									}, {										queue : false,										duration : 100									});								});								this.$positionList.on('mouseenter', '.article [title]', function(e) {									$(this).tooltip({										container: 'body'									}).tooltip('show');								});								// 点击相关								/** 点击每个职位块的“更多”按钮显示更多消息记录 */								this.$positionList.on('click', '.handle', function() {									var $todoList = $(this).closest('.article').find('.todo-list');									var toggleClass = $(this).hasClass('handle-only') ? 'todo-list-fixed-only'											: 'todo-list-fixed';									if ($(this).hasClass('handle-more')) { // 如果是收起状态										$(this).removeClass('handle-more');										$(this).find('i').removeClass('fa-angle-double-down').addClass(												'fa-angle-double-up');										$todoList.removeClass(toggleClass);										$(this).closest('.article').removeClass('fix');									} else {										$(this).addClass('handle-more');										$(this).find('i').removeClass('fa-angle-double-up').addClass(												'fa-angle-double-down');										$(this).closest('.article').addClass('fix');										$todoList.addClass(toggleClass);									}									_this.$positionList											.isotope('shiftColumnOfItem', $(this).closest('.article').get(0));									// _this.$positionList.isotope('reLayout');								});								/** 点击标题进入详细页面 */								this.$positionList.on('click', '.article>.header>.title', function() {									var data = $(this).closest('.article').data();									window.open(root + '/sets/page/reportlist/' + data.position.positionId + '.html');								});								/** 点击失败按钮进入招聘页面#失败的邀请 */								this.$positionList.on('click', '.article>.invite-error>a', function() {									var data = $(this).closest('.article').data();									window.open(root + '/sets/page/reportlist/' + data.position.positionId											+ '.html#list_invalid');								});								/** 点击状态图标按钮进入招聘页面#指定状态 */								this.$positionList.on('click', '.article>.baseinfo>li', function(e) {									var data = $(this).closest('.article').data();									window.open(root + '/sets/page/reportlist/' + data.position.positionId + '.html#'											+ $(this).data('hash'));								});								/** 点击招聘图标进入招聘页面 */								this.$positionList.on('click', '.article>.header>.invite', function() {									var data = $(this).closest('.article').data();									window.open(root + '/sets/page/postinvite/' + data.position.positionId + '/',											'_blank');								});								/** 点击应聘人信息进入测评报告页面 */								this.$positionList.on('click', '.article>.todo-list>.item-todo', function(e) {									e.stopPropagation();									var data = $(this).closest('.item-todo').data('item');									var positionId = $(this).closest('.article').data().position.positionId;									var testId = data.testId;									window.open(root + '/sets/page/skillreport/' + positionId + '/' + testId + '.html',											'_blank');								});								/** 点击“未获取到试卷结构比例信息” 重新获取试卷结构比例 */								this.$positionList.on('click', '.article>.paper-model>a.template-query', function(e) {									//var data = $(this).closest('.item-todo').data('item');									//var positionId = $(this).closest('.article').data().position.positionId;									$(this).hide();									_this.loadPaperModel($(this).closest('div.paper-model'),											$(this).data("positionid"), $(this).data("haserrors"));								});								/** 试卷预览..**/								this.$positionList.on('click', '.pagePreView,.pagePreView-error', function(e) {									window.open(root + "/sets/page/testReport/" + $(this).data('positionid') + "/2",											'_blank');								});							},							renderBaseInfo : function($baseInfo, data) {								$baseInfo.find('.invitation').html(										'<i class="glyphicon glyphicon-send"></i> ' + data.invitatedNum || 0 + '</li>');								$baseInfo.find('.todo').html(										'<i class="fa fa-file"></i> ' + data.todoNum || 0 + '</li>');								$baseInfo.find('.recommended').html(										'<i class="fa fa-smile-o"></i> ' + data.chosenNum || 0 + '</li>');							},							toggleActionBar : function($bar, isShow) {								if (isShow) {									$bar.stop().animate({										top : 0									}, {										queue : false,										duration : 200									});								} else {									$bar.stop().animate({										top : '-51px'									}, {										queue : false,										duration : 100									});								}							},							loadPositionList : function() { // 加载列表								var _this = this;								var hasMore = true;								var success = false;								$.setsAjax({									url : root + '/sets/position/positionPage',									type : 'post',									data : _this._pageInfo,									beforeSend : function() {										_this.$loadMoreBtn.attr('disabled', 'disabled').text('加载中...');									},									success : function(data) {										if (data.code == 0) {											success = true;											if (data.data) {												var count = data.data.length;												if (count * 1 < _this._pageInfo.pageSize) {													hasMore = false;												}												if ((count == 0) && (_this._pageInfo.requestPage == 1)) {													_this.$explain.show();													_this.$loadMoreBtn.hide();												}												_this.handlePositionList(data.data);												_this._pageInfo.requestPage++; // 下一页											} else {												hasMore = false;											}										}									},									error : function() {									},									complete : function() {										if (success) {											if (hasMore) {												_this.$loadMoreBtn.removeAttr('disabled').text('加载更多...');											} else {												_this.$loadMoreBtn.text('没有更多的测评了');											}										} else {											_this.$loadMoreBtn.removeAttr('disabled').text('加载失败，请重试');										}									}								});							},							handlePositionList : function(datas) {								var _this = this;								datas = datas || [];								for ( var i = 0; i < datas.length; i++) {									var _position = datas[i];									/** render */									var tmpl = this.getPositionTmpl(_position);									var $position = $(tmpl.tmpl);									// 创建消息通知窗口									this.$positionList.append($position);									if (_position.testType == 1 && tmpl.hasMsgs) {										// triggered after each item is loaded										$position.imagesLoaded().progress(function(instance, image) {											$(image.img).prev('.is-loading').remove();											if (!image.isLoaded) {												image.img.src = root + _this.defaultPortrait;											}										});									}									if (tmpl.showModel) {										_this.loadPaperModel($position.children('div.paper-model'),												_position.position.positionId, tmpl.hasErrors);									}									this.$positionList.isotope('appended', $position).isotope('reLayout');									/** save */									$position.data(_position);								}							},							formatEmployerName2: function(name, company){								name = name || '';								company = company || '';								if(company){									company = '【' + company + '】'								}								return name + company;							},							formatEmployerName: function(name, company){								name = name || '';								company = company || '';								if(name.length > 4){									name = name.substring(0, 3) + '...';								}								if(company.length > 4){									company = company.substring(0, 3) + '...';								}								if(company){									company = '【' + company + '】'								}								return name + company;							},							getPositionTmpl : function(data) {								var tmpl = {};								var items = [];								//　校招，加上小帽子								var positionIcon = '';								if (data.position.testType == 2) {									positionIcon = '<i class="fa fa-graduation-cap"></i> ';								}								items.push('<div class="article fix position">');								items.push('<div class="header">');								items.push('<a class="title title-default">' + positionIcon										+ data.position.positionName + '</a>');								items.push('<div class="invite">');								items.push('<i class="fa fa-user" title="发送测评邀请"></i> <i class="fa fa-plus"></i>');								items.push('</div></div>');								items.push('<ul class="list-inline baseinfo">');								if (data.employerName) {									items.push('<span class="creator" data-toggle="tooltip" title="' + this.formatEmployerName2(data.employerName, data.companyName) + '">' + this.formatEmployerName(data.employerName, data.companyName) +'</span>');									items.push('<span class="time pl5">');								} else {									items.push('<span class="time pl20">');								}								items.push('创建于 ' + data.position.publishDateDesc + '</span>');								items										.push('<li title="已邀请" class="invitation" data-hash="list_invited"><i class="fa fa-link"></i> '												+ data.invitatedNum + '</li>');								items										.push('<li title="待处理" class="todo" data-hash="todo"><i class="fa fa-file-text-o"></i> '												+ data.todoNum + '</li>');								items										.push('<li title="已推荐" class="recommended" data-hash="recommended"><i class="fa fa-smile-o "></i> '												+ data.chosenNum + '</li>');								items.push('</ul>');								var hasErrors = tmpl.hasErrors = data.invitationFailNum > 0;								var msgCount = data.posMessage ? data.posMessage.length : 0;								var hasMsgs = tmpl.hasMsgs = msgCount > 0;								// 如果存在失败信息								if (hasErrors) {									items.push('<div class="invite-error">');									items.push('<span class="fa-stack"><i class="fa fa-envelope fa-stack-2x"></i>');									items.push('<i class="fa fa-exclamation-circle fa-stack-1x red"></i></span>');									items.push('<a class="text-primary pl10">');									items.push(data.invitationFailNum);									items.push(' 份失败的邀请</a>');									items.push('</div>');								}								// 如果有新报告								if (hasMsgs) {									if (hasErrors) {										items.push('<ul class="text-left todo-list todo-list-fixed">');									} else {										items												.push('<ul class="text-left todo-list todo-list-only todo-list-fixed-only">');									}									// add 校招并且没有失败邀请时显示8个、校招有失败邀请/社招显示4个									if (data.position.testType == 2) {										if (msgCount > 8) {											msgCount = 8;										}									} else {										if (msgCount > 4) {											msgCount = 4;										}									}									for ( var i = 0; i < msgCount; i++) {										var _msg = data.posMessage[i];										items.push('<li class="btn-base btn-default img-thumbnail item-todo"');										items.push(' data-item=' + JSON.stringify(_msg));										var title = _msg.candidateName + '&lt;br/&gt;测评分数：' + _msg.score												+ '&lt;br/&gt;';										items.push(' title="' + title												+ '" data-html=true data-placement="bottom" data-container="body"')										items.push('>');										// 未读										if (_msg.reportState != 1) {											items.push('<div class="unread">');											items.push('<i class="fa fa-circle f10"></i>');											items.push('</div>');										}										// 社招显示头像										if (data.position.testType == 1) {											// 头像											items.push('<div class="portrait-wrapper">')											items.push('<div class="is-loading">');											items.push('<i class="fa fa-spinner fa-spin"></i>');											items.push('</div>');											items.push('<img src="' + (_msg.picUrl || (root + this.defaultPortrait))													+ '"');											items.push(' alt="" class="portrait"/>');											items.push('</div>');										}										// 姓名										items.push('<span class="text-primary candi-name">')										items.push(_msg.candidateName);										items.push('</span>');										// 分数										items.push('<div class="score">');										items.push(_msg.score);										items.push('</div>');										items.push('<div class="candi-match-ratio">');										// 匹配度用星星显示										items.push(Star.getStarTmpl(_msg.score));										items.push('</div>');										items.push('</li>');									}									items.push('</ul>');									// 只显示4个									//									if (hasErrors) {									//										if (msgCount > 4) {									//											items.push('<div class="handle handle-more">');									//											items.push('<i class="fa fa-angle-double-down"></i>');									//											items.push('</div>');									//										}									//									} else {									//										if (msgCount > 4) {									//											// 添加handle-only作为切换职位块高度复位后的判定标识									//											items.push('<div class="handle handle-more handle-only">');									//											items.push('<i class="fa fa-angle-double-down"></i>');									//											items.push('</div>');									//										}									//									}								}								if (!hasMsgs) {									tmpl.showModel = true;									items.push('<div class="paper-model"></div>');								} else {									tmpl.showModel = false;								}								items.push('</div>');								tmpl.tmpl = items.join('');								return tmpl;							},							// update 不显示柱状图；而显示文本样式的试卷比例结构							loadPaperModel : function($place, positionId, hasErrors) {								var _this = this;								var success = false;								$.setsAjax({									url : root + '/sets/position/getPositionPaperInfo/' + positionId,									type : 'post',									beforeSend : function() {										$place.spin({											lines : 12,											length : 6,											width : 4,											radius : 12,											corners : 1										}, '#333333');									},									success : function(data) {										if (data.code == 0) {											$place.html('');											if (data.data) {												success = true;												setTimeout(function() {													//													_this.loadGraphRatio($place, data.data);													_this.loadPaperInfo($place, data.data, positionId, hasErrors);												}, 500);											}										}									},									error : function() {									},									complete : function() {										if (!success) {											var items = [];											items.push('<a class="template-query" data-hasErrors=' + hasErrors													+ ' data-positionId=' + positionId + '>');											items.push('未获取到试卷结构比例信息');											items.push('</a>');											$place.html(items.join(''));										}									}								});							},							loadPaperInfo : function($place, data, positionId, hasErrors) {								if (0 == data.length) {									var items = [];									items.push('<a class="template-query" data-hasErrors=' + hasErrors											+ ' data-positionId=' + positionId + '>');									items.push('未获取到试卷结构比例信息');									items.push('</a>');									$place.html(items.join(''));									return;								}								var info = [];								for ( var i = 0; i < data.length; i++) {									info.push('<div class=" text-left paperInfo">');									if (data[i].typeId == 'type_object') {										info.push('<i class="fa fa-check-square"></i> '); // 选择题									} else if (data[i].typeId == 'type_subject') {										info.push('<i class="fa fa-file-code-o" ></i> '); // 编程题									} else if (data[i].typeId == 'type_essay') {										info.push('<i class="fa fa-question-circle"></i> '); // 问答题									} else if (data[i].typeId == 'type_intellige') {										info.push('<i class="fa fa-puzzle-piece"></i> '); // 智力题									} else if (data[i].typeId == 'type_interview') {										info.push('<i class="fa fa-video-camera"></i> '); // 面试题									}									info.push('' + data[i].typeName + ' <span class="">' + data[i].questionNumber											+ '</span> 道');									info.push('</div>');								}								if (!hasErrors) {									info.push('<div class="pagePreView" data-positionid=' + positionId											+ '><a><i class="fa fa-arrow-right"></i>试卷预览</a></div>');								} else {									info.push('<div class="pagePreView-error" data-positionid=' + positionId											+ '><a><i class="fa fa-arrow-right"></i>试卷预览</a></div>');								}								$place.html(info.join(''));							}						};						PositionManager.init();					});});