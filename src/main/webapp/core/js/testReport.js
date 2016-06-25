(function($) {

	"use strict";
	var titleIndex = 1;
	var modemapping = {
		java : {
			mode : 'text/x-java',
			path : [ 'clike' ],
			opt : {
				intent : true
			},
			help : {
				type : 'interface'
			}
		},
		javascript : {
			mode : 'text/javascript',
			path : [ 'javascript' ],
			opt : {
				intent : true
			}
		},
		sql : {
			mode : 'text/x-sql',
			path : [ 'sql' ],
			opt : {
				intent : true
			}
		},
		shell : {
			mode : 'shell',
			path : [ 'shell' ],
			opt : {
				intent : true
			}
		},
		html : {
			mode : 'htmlmixed',
			path : [ 'htmlmixed' ],
			opt : {
				intent : true
			}
		},
		'c++' : {
			mode : 'text/x-c++src',
			path : [ 'clike' ],
			opt : {
				intent : true
			},
			help : {
				type : 'file'
			}
		},
		c : {
			mode : 'text/x-csrc',
			path : [ 'clike' ],
			opt : {
				intent : true
			}
		},
		php : {
			mode : 'text/x-php',
			path : [ 'php', 'clike' ],
			opt : {
				intent : false
			},
			help : {
				type : 'interface'
			}
		},
		python : {
			mode : 'text/x-python',
			path : [ 'python' ],
			opt : {
				intent : false
			}
		}
	};
	var modeURL = root + "/plugin/codemirror-3.21/mode/%N/%N.js";
	
	var modalWaiting = {
			$modalHint : $('#modal_waiting'),
			$spinner : $('#modal_waiting .spinner'),
			init : function() {
				var _this = this;

				this.$modalHint.modal({
					backdrop : 'static',
					keyboard : false,
					show : false
				});

				this.$modalHint.on('shown.bs.modal', function(e) {
					_this.$spinner.spin({
						corners : 1,
						direction : 1,
						hwaccel : false,
						length : 15,
						lines : 12,
						radius : 20,
						rotate : 0,
						shadow : false,
						speed : 1,
						trail : 61,
						width : 8,
						left : 150,
						top : -40
					});
				});

				this.$modalHint.on('hide.bs.modal', function(e) {
					_this.$spinner.spin(false);
				});

			},
			show : function(title) {
				this.$modalHint.find('.title').text(title);
				this.$modalHint.modal('show');
			},
			hide : function() {
				this.$modalHint.modal('hide');
			},
			title : function(title) {
				this.$modalHint.find('.title').text(title);
			}
		};
		modalWaiting.init();
	
	$LAB
			.script(root + "/plugin/flowplayer/flowplayer-3.2.13.min.js")
			.script(root + "/plugin/codemirror-3.21/lib/codemirror.js")
			.script(root + "/plugin/Highcharts-3.0.9/js/highcharts.js")
			.wait()
			.script(root + "/plugin/codemirror-3.21/addon/mode/loadmode.js")
			.wait(
					function() {
						

						// POSITION模板

						var position = {
							init : function() {
								// 获取数据
								var that = this;
								$('#graph_overview').css({
									'margin-left' : '20%'
								});
								var jump_url = "/sets/report/getReportTemplateByPositionId/";
								if(sampleView&&sampleView!=""){
									jump_url = "/sets/experience/getReportTemplateByPositionId/";
								}
								var datas = {};
								$
										.setsAjax({
											url : root
													+ jump_url
													+ TEST_ID,
											type : "post",
											dataType : "json",
											beforeSend : function(){
												modalWaiting.show('正在加载试卷预览...');
											},
											contentType : "application/json",
											success : function(result) {
												var datas = result.data;
												datas = result.data;
												if (!datas) {
													$('.select_exam_content')
															.find('span')
															.text("暂无自定制试卷部分");
												} else {

													$('.title_username').text(
															datas.name);
													document.title = datas.name
															+ "试卷预览";
													$('.title_username').next()
															.hide();
													$('.title_username').next()
															.next().hide();
													var date = $
															.sets_formatTime(datas.modifyDate);
													var time = $
															.sets_prettyTime(datas.totalTime);
													$('.startTime')
															.html(
																	"<span class='positionTitle'>时长:"
																			+ time
																			+ "&nbsp;&nbsp;&nbsp;共"
																			+ datas.totalNum
																			+ "道题&nbsp;&nbsp;&nbsp;</span>");
													$('.select_exam_content')
															.children()
															.eq(0)
															.css(
																	{
																		'margin-left' : '32px'
																	});

													var floatTitle = $('.floatTitle');
													$('.report_content')
															.append(
																	'<div id="graph_overview" style="display:none"><ul class="list-inline items-score"></ul><br>以下是自定制试卷部分</div>');
													if (datas.objects) {
														$('#select').show();
														$('.float_select')
																.show();
														if (datas.objects.selfQuestions) {
															$('.select_exam_content').show()
															$('#graph_overview')
																	.show();
															that.create(datas);
														}
														that
																.loadGraphRatio(datas);
													}
													if (datas.subjects) {
														var system = datas.subjects;
														$('.float_system')
																.show();
														$('#system').show();
														$('.sysAvgScore').hide();
														$('#system_list').show();
														for ( var q = 0; q < system.questions.length; q++) {
															$('#system_list >ul')
																	.append(
																			'<li class="score-item">'
																					+ system.questions[q].programLauguage
																					+ '<div class="score-val-'
																					+ q
																					+ '">'
																					+ system.questions[q].questionNum
																					+ '<span style="color:#4c4b4b !important;font-weight:normal">道</span></div></li>');
														}
														if (datas.subjects.selfQuestions) {
															$('#graph_overview')
																	.show();
															that
																	.systemView(datas);
														}
													}
													if (datas.essays) {
														if (datas.essays.selfQuestions) {
															$('.select_exam_content').show()
															$('#graph_overview')
																	.show();
															$('.float_aq')
																	.show();
															that
																	.essaysView(datas);
														}
													}
													if (datas.intellige) {
														if (datas.intellige.selfQuestions) {
															$('.select_exam_content').show()
															$('#graph_overview')
																	.show();
															$('.float_iq')
																	.show();
															that
																	.iqQuestionPart(datas);
														}
													}
													if (datas.videos) {
														if (datas.videos.selfQuestions) {
															$('#graph_overview')
																	.show();
															$('.float_video')
																	.show();
															that
																	.videoView(datas);
														}
													}

													$('.floatTitle')
															.children()
															.eq(0)
															.addClass(
																	'skill_background');
													$('.floatSkill >a')
															.click(
																	function() {
																		$(
																				'.floatSkill')
																				.removeClass(
																						"skill_background");
																		$(this)
																				.parent()
																				.addClass(
																						"skill_background");
																	});

												}
											},
											complete : function(){
												$('body').scrollspy({
													target : '.nav-main'
												});
												modalWaiting.hide();
											}
										})
							},
							loadGraphRatio : function(datas) {
								var _this = this;
								var low = [], medium = [], high = [];
								var skill = [];
								for ( var j = 0; j < datas.objects.skills.length; j++) {
									if (datas.objects.skills[j].prebuilt == 1) {
										skill
												.push(datas.objects.skills[j].skillName
														+ "（百一）");
									} else {
										skill
												.push(datas.objects.skills[j].skillName);
									}
								}
								datas.objects.difficulties = datas.objects.difficulties
										|| [];
								for ( var i = 0; i < datas.objects.difficulties.length; i++) {
									low.push(datas.objects.difficulties[i][0]);
									medium
											.push(datas.objects.difficulties[i][1]);
									high.push(datas.objects.difficulties[i][2]);
								}
								$('#graph_overview').show().empty();
								$('#graph_overview')
										.highcharts(
												{
													credits : {
														enabled : false
													},
													chart : {
														height : 250,
														type : 'column',
														backgroundColor : 'rgba(255,255,255,0)',
														width : 550,
													},
													colors : [ '#FF6666',
															'#FF9966',
															'#FFCC66' ],
													title : null,
													xAxis : {
														tickWidth : 0,
														categories : skill,
														labels : {
															style : {
																color : '#666'
															}
														}
													},
													yAxis : {
														title : null,
														gridLineWidth : 0,
														lineWidth : 0,
														labels : {
															formatter : function() {
																return '';
															}
														}
													},
													legend : {
														/*
														 * align:'right',
														 * verticalAlign: 'top',
														 * y: -10,
														 */
														itemStyle : {
															color : '#666'
														},
														itemHoverStyle : {
															color : '#FFF'
														},
														itemHiddenStyle : {
															color : '#333'
														}
													},
													tooltip : {
														formatter : function() {
															return this.x
																	+ '<br/>'
																	+ this.series.name
																	+ ': '
																	+ this.y
																	+ '/'
																	+ this.point.stackTotal;
														}
													},
													plotOptions : {
														column : {
															stacking : 'normal',
															dataLabels : {
																enabled : true,
																color : '#FFF',
																formatter : function() {
																	return this.y == 0 ? ''
																			: this.y;
																}
															}
														}
													},
													series : [ {
														name : '高难度',
														data : high
													}, {
														name : '中难度',
														data : medium
													}, {
														name : '低难度',
														data : low
													} ]
												});
							},
							create : function(datas) {
								$('.select_exam_content').show();

								var selects = datas.objects.selfQuestions;
								var $self_paper = $('#self_paper_content');
								var $skill_report = $('.skill_content_title');
								var viewContent = [];
								var en = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G',
										'H' ];
								for ( var i = 0; i < selects.length; i++) {
									var time = $
											.sets_prettyTime(selects[i].suggestTime);
									var title = selects[i].title.replace(/\n/g,
											"<br>");
									viewContent
											.push('<div class="bs-callout bs-callout-info">');
									viewContent
											.push('<label class="technology_content_common" ><ul class="content_title" style="margin-bottom:0px !important;height:20px">');
									if (selects[i].editType == 1) {
										viewContent
												.push('<li class="select_title">'
														+ (i + 1) + '、单选题</li>');
									} else {
										viewContent
												.push('<li class="select_title">'
														+ (i + 1) + '、多选题</li>');
									}
									viewContent
											.push('<li class="exam_time_total">');
									viewContent
											.push('<div style="exam_title_content">&nbsp;&nbsp;技能：'
													+ selects[i].qbName
													+ '&nbsp;&nbsp;答题时间：（'
													+ time
													+ '）</div></li></ul><br>')
									viewContent
											.push('<div style="margin-left:30px">'
													+ title + '</div> </label>');
									viewContent
											.push('<li style="width:100%;background-color:#fff"><label class="technology_content_common" style="width:95%;padding-left:20px;line-height:2">');
									for ( var p = 0; p < selects[i].options.length; p++) {
										var answer = selects[i].options[p];
										viewContent.push('<span>' + en[p] + '、'
												+ answer + '</span><br> ');
									}
									var right_answer = selects[i].optAnswers
											.split("");
									var answer = 0;
									var rel_answer = [];
									for ( var w = 0; w < right_answer.length; w++) {
										switch (right_answer[w]) {
										case "A":
											answer = 0;
											break;
										case "B":
											answer = 1;
											break;
										case 'C':
											answer = 2;
											break;
										case 'D':
											answer = 3;
											break;
										case 'E':
											answer = 4;
											break;
										case 'F':
											answer = 5;
											break;
										}
										for ( var v = 0; v < selects[i].options.length; v++) {
											if (answer == v) {
												rel_answer
														.push(selects[i].options[v]);
											}
										}
									}
									viewContent
											.push('<p class="answer_re_right2">正确答案：<br>');
									for ( var t = 0; t < rel_answer.length; t++) {
										viewContent
												.push('<span>' + rel_answer[t]
														+ '</span><br>');
									}
									viewContent.push('</p>');
									viewContent.push('</label></div>');
									$skill_report.html(viewContent.join(""));
								}

							},// END cereate
							// start SystemView
							systemView : function(datas) {
								var $content = $('.systemcontent');
								var system = datas.subjects;
								var newIndex = 1;
								if (system) {
									$('#system_list').show();
									$('#systemcontent').append('<p style="padding-left:25px">以下是自定制编程题部分</p>');
									for ( var i = 0; i < system.selfQuestions.length; i++) {
										var id = Math.guid();
										var $thispart = system.selfQuestions;
										var title = $thispart[i].title.replace(
												/\n/g, "<br>");
										var answer = ""
										if ($thispart[i].matrix.items[0].template) {
											answer = $thispart[i].matrix.items[0].template;
										} else {
											answer = "无";
										}
										var score = $thispart[i].score;
										var mode = $thispart[i].mode
												.toLowerCase();
										var time = $thispart[i].suggestTime;
										var language = $thispart[i].programLanguage;
										time = $.sets_prettyTime(time);
										if (!score) {
											score = 0;
										}
										var content = [];
										content
												.push('<span class="skill_name_sys">语言：'
														+ language + '</span>');

										content
												.push('<div class="bs-callout bs-callout-info">');
										content
												.push('<li class=""><label style="margin-left:20px;display:block"><br>');
										content
												.push('<span style="font-size: 17pt;color:rgb(66,139,202)">'
														+ (titleIndex++)
														+ '、</span>');
										content.push('' + title
												+ '</label></li>');
										content
												.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px">');
										content
												.push('<li class="active" style="margin-left:20px">');
										content
												.push('<a href="#stAnswerc'
														+ newIndex
														+ '" role="tab" data-toggle="tab">参考答案</a></li>');
										content
												.push('<li class="stu_answer_content">');
										content
												.push('<span style="padding-left:10px;">答题时间：</span><span>'
														+ time
														+ '</span>&nbsp;&nbsp;</li>&nbsp;&nbsp;');
										content.push('</ul>');
										content
												.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerc'
														+ newIndex
														+ '"><div class="mirror'
														+ id
														+ '"> </div><br></div>');
										content.push('</div>');
										$content.append(content.join(""));
										var _mirror = CodeMirror($('.mirror' + id)
												.get(0), { // $place.get(0):
											// 页面的一个dom元素，一遍是一个div
											// 或者 textarea
											value : answer, // 内容
											lineNumbers : true, // 行号
											lineWrapping : false, // 是否换行，还是出现横向滚动条
											styleActiveLine : false,
											tabSize : '4',
											indentUnit : '4',
											readOnly : true
										});
										if (mode) {
											var Mode = modemapping[mode];
											if (Mode) {
												// 默认已加载JS
												_mirror
												.setOption('mode',
														Mode.mode);
												// 还未加载js
												var jses = [];
												for ( var j = 0; j < Mode.path.length; j++) {
													jses.push(modeURL.replace(
															/%N/g, Mode.path[j]));
												}
												$LAB.script(jses).wait(
														function() {
															_mirror.setOption(
																	'mode',
																	Mode.mode);
														});
											}
											
										}
									}
								}
							},// end systemView
							essaysView : function(datas) {
								var $thispart = datas.essays.selfQuestions;
								var $content = $('.report_content');
								var newIndex = 1;
								$content
										.append('<div id="essays" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)"><span style="padding-left:20px" class="parttitle">技能问答题</span> </div><br>');

								for ( var i = 0; i < $thispart.length; i++) {
									var title = $thispart[i].title.replace(
											/\n/g, "<br>");
									var answer = ""
										if ($thispart[i].matrix) {
											if ($thispart[i].matrix.items[0]) {
												if($thispart[i].matrix.items[0].template){
													if ($thispart[i].matrix.items[0].template != "") {
														answer = $thispart[i].matrix.items[0].template;
													} else {
														answer = "无";
													}
												}else{
													answer = "无";
												}
											}else{
												answer = "无";
											}
										}else{
											answser = "无";
										}
									var score = $thispart[i].score;
									var mode = $thispart[i].mode;
									var time = $thispart[i].suggestTime;
									time = $.sets_prettyTime(time);
									if (!score) {
										score = 0;
									}
									if (!mode) {
										mode = "无";
									}

									var content = [];
									content
											.push('<div class="bs-callout bs-callout-info">');
									content
											.push('<li class=""><label style="margin-left:25px;display:block"><br>');
									content
											.push('<p style="margin-left:20px;width:97%"><span style="font-size: 17pt;color:rgb(66,139,202)">'
													+ (newIndex++) + '、</span>');
									content.push('' + title
											+ '</p></label></li>');
									content
											.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px">');
									content
											.push('<li class="active" style="margin-left:20px">');
									content
											.push('<a href="#stAnswerc'
													+ newIndex
													+ '" role="tab" data-toggle="tab">参考答案</a></li>');
									content
											.push('<li class="stu_answer_content">');
									content
											.push('<span style="padding-left:10px;">答题时间：</span><span>'
													+ time
													+ '</span>&nbsp;&nbsp;</li>&nbsp;&nbsp;');
									content.push('</ul>');
									content
											.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerc'
													+ newIndex
													+ '"><div class="iqanswer">'
													+ answer
													+ '</div><br></div>');
									content.push('</div>');
									$content.append(content.join(""));
								}
								$content.append('<br><br>');
							},
							// start iqQuestion
							iqQuestionPart : function(datas) {
								var $thispart = datas.intellige.selfQuestions;
								var $content = $('.report_content');
								var newIndex = 1;
								$content
										.append('<div id="iq" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)"><span style="padding-left:20px" class="parttitle">智力题</span> </div>');
								for ( var i = 0; i < $thispart.length; i++) {
									var title = $thispart[i].title.replace(
											/\n/g, "<br>");
									var answer = ""
									if ($thispart[i].matrix) {
										if ($thispart[i].matrix.items) {
											if ($thispart[i].matrix.items[0].template
													&& $thispart[i].matrix.items[0].template != "") {
												answer = $thispart[i].matrix.items[0].template;
											} else {
												answer = "无";
											}
										}else{
											answer = "无";
										}
									}else{
										answer = "无";
									}
									if ($thispart[i].optDesc) {
										answer = $thispart[i].optDesc;
									}
									var score = $thispart[i].score;
									var type=$thispart[i].type;
									var mode = $thispart[i].mode;
									var time = $thispart[i].suggestTime;
									var qbName = $thispart[i].qbName;
									var lang = [ 'A', 'B', 'C', 'D', 'E', 'F' ];
									var ref_option = [];
									 $thispart[i].optAnswers =  $thispart[i].optAnswers || "";
									var ref_answer = $thispart[i].optAnswers
											.split("");
									var ref_answer_num = 0;
									var ref_options = [];
									if ($thispart[i].options) {
										var options = $thispart[i].options;
									}
									if ($thispart[i].optAnswers) {
										var optAnswers = $thispart[i].optAnswers;
									}
									time = $.sets_prettyTime(time);
									if (!score) {
										score = 0;
									}
									if (!mode) {
										mode = "无";
									}

									var content = [];

									content
											.push('<div class="bs-callout bs-callout-info">');
									content
											.push('<li class=""><label style="margin-left:25px;display:block"><br>');
									content
											.push('<span style="font-size: 17pt;color:rgb(66,139,202)">'
													+ (newIndex++) + '、<span style="font-size:13pt;display:inline-block">['+qbName+']</span></span>');
									content.push('' + title + '<br>');
									if(type==7||type==8||type==1||type==2){
										if (options) {
											for ( var t = 0; t < options.length; t++) {
												content
												.push('<span style="width:97%">'
														+ lang[t]
														+ '：'
														+ options[t]
														+ '</span><br>')
														ref_option.push(options[t]);
											}
										}
									}
									content.push('</label></li>');
									for ( var p = 0; p < ref_answer.length; p++) {
										switch (ref_answer[p]) {
										case "A":
											ref_answer_num = 0;
											break;
										case "B":
											ref_answer_num = 1;
											break;
										case "C":
											ref_answer_num = 2;
											break;
										case "D":
											ref_answer_num = 3;
											break;
										case "E":
											ref_answer_num = 4;
											break;
										case "F":
											ref_answer_num = 5;
											break;
										}
										for ( var q = 0; q < ref_option.length; q++) {
											if (ref_answer_num == q) {
												ref_options.push(ref_option[q]);
											}
										}
									}
									content
											.push('<li><ul class="nav nav-tabs" role="tablist">');
									content
											.push('<li class="active" style="margin-left:20px">');
									content
											.push('<a href="#stAnswerc'
													+ newIndex
													+ '" role="tab" data-toggle="tab">参考答案</a></li>');
									content
											.push('<li class="stu_answer_content">');
									content
											.push('<span style="padding-left:10px;">答题时间：</span><span>'
													+ time
													+ '</span>&nbsp;&nbsp;</li>&nbsp;&nbsp;');
									content.push('</ul>');
									content
											.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerc'
													+ newIndex
													+ '"><div class="iqanswer" style="padding-left:20px">');
									if (optAnswers) {
										for ( var w = 0; w < ref_options.length; w++) {
											content.push(ref_options[w]);
										}
									}
									content.push("<br>" + answer);
									content.push('</div><br></div>');
									content.push('</div>');
									$content.append(content.join(""));
								}
							},// end iqQuestion
							// start videoView
							videoView : function(datas) {
								var $thispart = datas.videos.selfQuestions;
								var $content = $('.report_content');
								var newIndex = 1;
								$content
										.append('<div id="video" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)"><span style="padding-left:20px" class="parttitle">面试题</span> </div><br>');
								$content
										.append('<div class="video bs-callout bs-callout-info">');
								for ( var i = 0; i < $thispart.length; i++) {
									var time = $thispart[i].suggestTime;
									time = $.sets_prettyTime(time);
									var content = [];

									content
											.push('<ul class="videoquestion"><li>'
													+ (i + 1)
													+ '、'
													+ $thispart[i].title
													+ '&nbsp;&nbsp;(作答时长：'
													+ time + ')</li>');
									content.push('</ul>');
									$('.video').append(content.join(""));
								}
								$content.append('</div><br><br>');
							}// end videoView getReportTemplateByPaperId
						};// End Position

						var paper = {
								init : function() {
									// 获取数据
									var that = this;
									$('#graph_overview').css({
										'margin-left' : '20%'
									});
									var datas = {};
									$
											.setsAjax({
												url : root
														+ "/sets/report/getReportTemplateByPaperId/"
														+ TEST_ID,
												type : "post",
												dataType : "json",
												beforeSend : function(){
													modalWaiting.show('正在加载试卷预览...');
												},
												contentType : "application/json",
												success : function(result) {
													var datas = result.data;
													datas = result.data;
													if (!datas) {
														$('.select_exam_content')
																.find('span')
																.text("暂无自定制试卷部分");
													} else {

														$('.title_username').text(
																datas.name);
														document.title = datas.name
																+ "试卷预览";
														$('.title_username').next()
																.hide();
														$('.title_username').next()
																.next().hide();
														var date = $
																.sets_formatTime(datas.modifyDate);
														var time = $
																.sets_prettyTime(datas.totalTime);
														$('.startTime')
																.html(
																		"<span class='positionTitle'>时长:"
																				+ time
																				+ "&nbsp;&nbsp;&nbsp;共"
																				+ datas.totalNum
																				+ "道题&nbsp;&nbsp;&nbsp;</span>");
														$('.select_exam_content')
																.children()
																.eq(0)
																.css(
																		{
																			'margin-left' : '32px'
																		});

														var floatTitle = $('.floatTitle');
														$('.report_content')
																.append(
																		'<div id="graph_overview" style="display:none"><ul class="list-inline items-score"></ul><br>以下是自定制试卷部分</div>');
														if (datas.objects) {
															$('#select').show();
															$('.float_select')
																	.show();
															if (datas.objects.selfQuestions) {
																$('#graph_overview')
																		.show();
																$('.select_exam_content').show();
																that.create(datas);
															}
															that
																	.loadGraphRatio(datas);
														}
														if (datas.subjects) {
															var system = datas.subjects;
															$('.float_system')
																	.show();
															$('#system').show();
															$('.sysAvgScore').hide();
															$('#system_list').show();
															for ( var q = 0; q < system.questions.length; q++) {
																$('#system_list >ul')
																		.append(
																				'<li class="score-item">'
																						+ system.questions[q].programLauguage
																						+ '<div class="score-val-'
																						+ q
																						+ '">'
																						+ system.questions[q].questionNum
																						+ '<span style="color:#4c4b4b !important;font-weight:normal">道</span></div></li>');
															}
															if (datas.subjects.selfQuestions) {
																$('#graph_overview')
																		.show();
																$('.select_exam_content').show()
																that
																		.systemView(datas);
															}
														}
														if (datas.essays) {
															if (datas.essays.selfQuestions) {
																$('#graph_overview')
																		.show();
																$('.select_exam_content').show()
																$('.float_aq')
																		.show();
																that
																		.essaysView(datas);
															}
														}
														if (datas.intellige) {
															if (datas.intellige.selfQuestions) {
																$('#graph_overview')
																		.show();
																$('.select_exam_content').show()
																$('.float_iq')
																		.show();
																that
																		.iqQuestionPart(datas);
															}
														}
														if (datas.videos) {
															if (datas.videos.selfQuestions) {
																$('#graph_overview')
																		.show();
																$('.select_exam_content').show()
																$('.float_video')
																		.show();
																that
																		.videoView(datas);
															}
														}

														$('.floatTitle')
																.children()
																.eq(0)
																.addClass(
																		'skill_background');
														$('.floatSkill >a')
																.click(
																		function() {
																			$(
																					'.floatSkill')
																					.removeClass(
																							"skill_background");
																			$(this)
																					.parent()
																					.addClass(
																							"skill_background");
																		});

													}
												},
												complete : function(){
													$('body').scrollspy({
														target : '.nav-main'
													});
													modalWaiting.hide();
												}
											})
								},
								loadGraphRatio : function(datas) {
									var _this = this;
									var low = [], medium = [], high = [];
									var skill = [];
									for ( var j = 0; j < datas.objects.skills.length; j++) {
										if (datas.objects.skills[j].prebuilt == 1) {
											skill
													.push(datas.objects.skills[j].skillName
															+ "（百一）");
										} else {
											skill
													.push(datas.objects.skills[j].skillName);
										}
									}
									datas.objects.difficulties = datas.objects.difficulties
											|| [];
									for ( var i = 0; i < datas.objects.difficulties.length; i++) {
										low.push(datas.objects.difficulties[i][0]);
										medium
												.push(datas.objects.difficulties[i][1]);
										high.push(datas.objects.difficulties[i][2]);
									}
									$('#graph_overview').show().empty();
									$('#graph_overview')
											.highcharts(
													{
														credits : {
															enabled : false
														},
														chart : {
															height : 250,
															type : 'column',
															backgroundColor : 'rgba(255,255,255,0)',
															width : 550,
														},
														colors : [ '#FF6666',
																'#FF9966',
																'#FFCC66' ],
														title : null,
														xAxis : {
															tickWidth : 0,
															categories : skill,
															labels : {
																style : {
																	color : '#666'
																}
															}
														},
														yAxis : {
															title : null,
															gridLineWidth : 0,
															lineWidth : 0,
															labels : {
																formatter : function() {
																	return '';
																}
														                           	}
														},
														legend : {
															/*
															 * align:'right',
															 * verticalAlign: 'top',
															 * y: -10,
															 */
															itemStyle : {
																color : '#666'
															},
															itemHoverStyle : {
																color : '#FFF'
															},
															itemHiddenStyle : {
																color : '#333'
															}
														},
														tooltip : {
															formatter : function() {
																return this.x
																		+ '<br/>'
																		+ this.series.name
																		+ ': '
																		+ this.y
																		+ '/'
																		+ this.point.stackTotal;
															}
														},
														plotOptions : {
															column : {
																stacking : 'normal',
																dataLabels : {
																	enabled : true,
																	color : '#FFF',
																	formatter : function() {
																		return this.y == 0 ? ''
																				: this.y;
																	}
																}
															}
														},
														series : [ {
															name : '高难度',
															data : high
														}, {
															name : '中难度',
															data : medium
														}, {
															name : '低难度',
															data : low
														} ]
													});
								},
								create : function(datas) {
									$('.select_exam_content').show();

									var selects = datas.objects.selfQuestions;
									var $self_paper = $('#self_paper_content');
									var $skill_report = $('.skill_content_title');
									var viewContent = [];
									var en = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G',
											'H' ];
									for ( var i = 0; i < selects.length; i++) {
										var time = $
												.sets_prettyTime(selects[i].suggestTime);
										var title = selects[i].title.replace(/\n/g,
												"<br>");
										viewContent
												.push('<div class="bs-callout bs-callout-info">');
										viewContent
												.push('<label class="technology_content_common" ><ul class="content_title" style="margin-bottom:0px !important;height:20px">');
										if (selects[i].editType == 1) {
											viewContent
													.push('<li class="select_title">'
															+ (i + 1) + '、单选题</li>');
										} else {
											viewContent
													.push('<li class="select_title">'
															+ (i + 1) + '、多选题</li>');
										}
										viewContent
												.push('<li class="exam_time_total">');
										viewContent
												.push('<div style="exam_title_content">&nbsp;&nbsp;技能：'
														+ selects[i].qbName
														+ '&nbsp;&nbsp;答题时间：（'
														+ time
														+ '）</div></li></ul><br>')
										viewContent
												.push('<div style="margin-left:30px">'
														+ title + '</div> </label>');
										viewContent
												.push('<li style="width:100%;background-color:#fff"><label class="technology_content_common" style="width:95%;padding-left:20px;line-height:2">');
										for ( var p = 0; p < selects[i].options.length; p++) {
											var answer = selects[i].options[p];
											viewContent.push('<span>' + en[p] + '、'
													+ answer + '</span><br> ');
										}
										var right_answer = selects[i].optAnswers
												.split("");
										var answer = 0;
										var rel_answer = [];
										for ( var w = 0; w < right_answer.length; w++) {
											switch (right_answer[w]) {
											case "A":
												answer = 0;
												break;
											case "B":
												answer = 1;
												break;
											case 'C':
												answer = 2;
												break;
											case 'D':
												answer = 3;
												break;
											case 'E':
												answer = 4;
												break;
											case 'F':
												answer = 5;
												break;
											}
											for ( var v = 0; v < selects[i].options.length; v++) {
												if (answer == v) {
													rel_answer
															.push(selects[i].options[v]);
												}
											}
										}
										viewContent
												.push('<p class="answer_re_right2">正确答案：<br>');
										for ( var t = 0; t < rel_answer.length; t++) {
											viewContent
													.push('<span>' + rel_answer[t]
															+ '</span><br>');
										}
										viewContent.push('</p>');
										viewContent.push('</label></div>');
										$skill_report.html(viewContent.join(""));
									}

								},// END cereate
								// start SystemView
								systemView : function(datas) {
									var $content = $('.systemcontent');
									var system = datas.subjects;
									var newIndex = 1;
									if (system) {
										$('#system_list').show();
										$('#systemcontent').append('<p style="padding-left:25px">以下是自定制编程题部分</p>');
										for ( var i = 0; i < system.selfQuestions.length; i++) {
											var id = Math.guid();
											var $thispart = system.selfQuestions;
											var title = $thispart[i].title.replace(
													/\n/g, "<br>");
											var answer = ""
											if ($thispart[i].matrix.items[0].template) {
												answer = $thispart[i].matrix.items[0].template;
											} else {
												answer = "无";
											}
											var score = $thispart[i].score;
											var mode = $thispart[i].mode
													.toLowerCase();
											var time = $thispart[i].suggestTime;
											var language = $thispart[i].programLanguage;
											time = $.sets_prettyTime(time);
											if (!score) {
												score = 0;
											}
											var content = [];
											content
													.push('<span class="skill_name_sys">语言：'
															+ language + '</span>');

											content
													.push('<div class="bs-callout bs-callout-info">');
											content
													.push('<li class=""><label class=""><br>');
											content
													.push('<p style="margin-left:20px;width:97%"><span style="font-size: 17pt;color:rgb(66,139,202)">'
															+ (titleIndex++)
															+ '、</span>');
											content.push('' + title
													+ '</p></label></li>');
											content
													.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px">');
											content
													.push('<li class="active" style="margin-left:20px">');
											content
													.push('<a href="#stAnswerc'
															+ newIndex
															+ '" role="tab" data-toggle="tab">参考答案</a></li>');
											content
													.push('<li class="stu_answer_content">');
											content
													.push('<span style="padding-left:10px;">答题时间：</span><span>'
															+ time
															+ '</span>&nbsp;&nbsp;</li>&nbsp;&nbsp;');
											content.push('</ul>');
											content
													.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerc'
															+ newIndex
															+ '"><div class="mirror'
															+ id
															+ '"> </div><br></div>');
											content.push('</div>');
											$content.append(content.join(""));
											var _mirror = CodeMirror($('.mirror' + id)
													.get(0), { // $place.get(0):
												// 页面的一个dom元素，一遍是一个div
												// 或者 textarea
												value : answer, // 内容
												lineNumbers : true, // 行号
												lineWrapping : false, // 是否换行，还是出现横向滚动条
												styleActiveLine : false,
												tabSize : '4',
												indentUnit : '4',
												readOnly : true
											});
											if (mode) {
												var Mode = modemapping[mode];
												if (Mode) {
													// 默认已加载JS
													_mirror
													.setOption('mode',
															Mode.mode);
													// 还未加载js
													var jses = [];
													for ( var j = 0; j < Mode.path.length; j++) {
														jses.push(modeURL.replace(
																/%N/g, Mode.path[j]));
													}
													$LAB.script(jses).wait(
															function() {
																_mirror.setOption(
																		'mode',
																		Mode.mode);
															});
												}
												
											}
										}
									}
								},// end systemView
								essaysView : function(datas) {
									var $thispart = datas.essays.selfQuestions;
									var $content = $('.report_content');
									var newIndex = 1;
									$content
											.append('<div id="essays" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)"><span style="padding-left:20px">技能问答题</span> </div><br>');

									for ( var i = 0; i < $thispart.length; i++) {
										var title = $thispart[i].title.replace(
												/\n/g, "<br>");
										var answer = ""
											if ($thispart[i].matrix) {
												if ($thispart[i].matrix.items[0]) {
													if($thispart[i].matrix.items[0].template){
														if ($thispart[i].matrix.items[0].template != "") {
															answer = $thispart[i].matrix.items[0].template;
														} else {
															answer = "无";
														}
													}else{
														answer = "无";
													}
												}else{
													answer = "无";
												}
											}else{
												answser = "无";
											}
										var score = $thispart[i].score;
										var mode = $thispart[i].mode;
										var time = $thispart[i].suggestTime;
										time = $.sets_prettyTime(time);
										if (!score) {
											score = 0;
										}
										if (!mode) {
											mode = "无";
										}

										var content = [];
										content
												.push('<div class="bs-callout bs-callout-info">');
										content
												.push('<li class=""><label class=""><br>');
										content
												.push('<p style="margin-left:20px;width:97%"><span style="font-size: 17pt;color:rgb(66,139,202)">'
														+ (newIndex++) + '、</span>');
										content.push('' + title
												+ '</p></label></li>');
										content
												.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px">');
										content
												.push('<li class="active" style="margin-left:20px">');
										content
												.push('<a href="#stAnswerc'
														+ newIndex
														+ '" role="tab" data-toggle="tab">参考答案</a></li>');
										content
												.push('<li class="stu_answer_content">');
										content
												.push('<span style="padding-left:10px;">答题时间：</span><span>'
														+ time
														+ '</span>&nbsp;&nbsp;</li>&nbsp;&nbsp;');
										content.push('</ul>');
										content
												.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerc'
														+ newIndex
														+ '"><div class="iqanswer">'
														+ answer
														+ '</div><br></div>');
										content.push('</div>');
										$content.append(content.join(""));
									}
									$content.append('<br><br>');
								},
								// start iqQuestion
								iqQuestionPart : function(datas) {
									var $thispart = datas.intellige.selfQuestions;
									var $content = $('.report_content');
									var newIndex = 1;
									$content
											.append('<div id="iq" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)"><span style="padding-left:20px">智力题</span> </div>');
									for ( var i = 0; i < $thispart.length; i++) {
										var title = $thispart[i].title.replace(
												/\n/g, "<br>");
										var answer = ""
										if ($thispart[i].matrix) {
											if ($thispart[i].matrix.items) {
												if ($thispart[i].matrix.items[0].template
														&& $thispart[i].matrix.items[0].template != "") {
													answer = $thispart[i].matrix.items[0].template;
												} else {
													answer = "无";
												}
											}else{
												answer = "无";
											}
										}else{
											answer = "无";
										}
										if ($thispart[i].optDesc) {
											answer = $thispart[i].optDesc;
										}
										var score = $thispart[i].score;
										var mode = $thispart[i].mode;
										var time = $thispart[i].suggestTime;
										var qbName = $thispart[i].qbName;
										var lang = [ 'A', 'B', 'C', 'D', 'E', 'F' ];
										var ref_option = [];
										 $thispart[i].optAnswers =  $thispart[i].optAnswers || "";
										var ref_answer = $thispart[i].optAnswers
												.split("");
										var ref_answer_num = 0;
										var ref_options = [];
										if ($thispart[i].options) {
											var options = $thispart[i].options;
										}
										if ($thispart[i].optAnswers) {
											var optAnswers = $thispart[i].optAnswers;
										}
										time = $.sets_prettyTime(time);
										if (!score) {
											score = 0;
										}
										if (!mode) {
											mode = "无";
										}

										var content = [];

										content
												.push('<div class="bs-callout bs-callout-info">');
										content
												.push('<li class=""><label class=""><br>');
										content
												.push('<span style="font-size: 17pt;color:rgb(66,139,202)">'
														+ (newIndex++) + '、<span style="font-size:13pt">['+qbName+']</span></span>');
										content.push('' + title + '<br>');
										if(type==7||type==8||type==1||type==2){
										if (options) {
											content
													.push('<p style="margin-left:20px;width:97%">');
											for ( var t = 0; t < options.length; t++) {
												content
														.push('<span style="width:97%">'
																+ lang[t]
																+ '：'
																+ options[t]
																+ '</span><br>')
												ref_option.push(options[t]);
											}
										}
										}
										content.push('</p></label></li>');
										for ( var p = 0; p < ref_answer.length; p++) {
											switch (ref_answer[p]) {
											case "A":
												ref_answer_num = 0;
												break;
											case "B":
												ref_answer_num = 1;
												break;
											case "C":
												ref_answer_num = 2;
												break;
											case "D":
												ref_answer_num = 3;
												break;
											case "E":
												ref_answer_num = 4;
												break;
											case "F":
												ref_answer_num = 5;
												break;
											}
											for ( var q = 0; q < ref_option.length; q++) {
												if (ref_answer_num == q) {
													ref_options.push(ref_option[q]);
												}
											}
										}
										content
												.push('<li><ul class="nav nav-tabs" role="tablist">');
										content
												.push('<li class="active" style="margin-left:20px">');
										content
												.push('<a href="#stAnswerc'
														+ newIndex
														+ '" role="tab" data-toggle="tab">参考答案</a></li>');
										content
												.push('<li class="stu_answer_content">');
										content
												.push('<span style="padding-left:10px;">答题时间：</span><span>'
														+ time
														+ '</span>&nbsp;&nbsp;</li>&nbsp;&nbsp;');
										content.push('</ul>');
										content
												.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerc'
														+ newIndex
														+ '"><div class="iqanswer" style="padding-left:20px">');
										if (optAnswers) {
											for ( var w = 0; w < ref_options.length; w++) {
												content.push(ref_options[w]);
											}
										}
										content.push("<br>" + answer);
										content.push('</div><br></div>');
										content.push('</div>');
										$content.append(content.join(""));
									}
								},// end iqQuestion
								// start videoView
								videoView : function(datas) {
									var $thispart = datas.videos.selfQuestions;
									var $content = $('.report_content');
									var newIndex = 1;
									$content
											.append('<div id="video" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)"><span style="padding-left:20px">面试题</span> </div><br>');
									$content
											.append('<div class="video bs-callout bs-callout-info">');
									for ( var i = 0; i < $thispart.length; i++) {
										var time = $thispart[i].suggestTime;
										time = $.sets_prettyTime(time);
										var content = [];

										content
												.push('<ul class="videoquestion"><li>'
														+ (i + 1)
														+ '、'
														+ $thispart[i].title
														+ '&nbsp;&nbsp;(作答时长：'
														+ time + ')</li>');
										content.push('</ul>');
										$('.video').append(content.join(""));
									}
									$content.append('</div><br><br>');
								}// end videoView getReportTemplateByPaperId
							};// END OF PAPER

						if (type == 1) {
							getView.init();
						} else if (type == 2) {
							position.init();
						} else if (type == 3) {
							paper.init();
						}

					});// wait
})(jQuery)