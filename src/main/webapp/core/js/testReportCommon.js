(function($){
	
	"use strict";
	$LAB
	.script(basePath + "/plugin/Highcharts-3.0.9/js/highcharts.js").wait(function(){
		
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
		
		var scoreHighchars = {
				/*								init :function(){
												},
				*/								myreload : function(div,relname,score){
													var colors = Highcharts.getOptions().colors,
											        categories = [name],
											        name = '',
											        pie_data = [{
											                y: 21.63,
											                color: colors[4],
											                drilldown: {
											                    name: '',
											                    categories: ['Firefox 4.0'],
											                    data: [(10-score*1)*10],
											                    color: colors[4]
											                }
											            },{
											                y: 0,
											                color: colors[3],
											                drilldown: {
											                    name: '',
											                    categories: ['Firefox 4.0'],
											                    data: [score*1*10],
											                    color: colors[3]
											                }
											            }];
													var browserData = [];
												    var versionsData = [];
													for (var i = 0; i < pie_data.length; i++) {

												        // add browser data
												        browserData.push({
												            name: categories[i],
												            y: pie_data[i].y,
												            color: pie_data[i].color
												        });

												        // add version data
												        for (var j = 0; j < pie_data[i].drilldown.data.length; j++) {
												            var brightness = 0.2 - (j / pie_data[i].drilldown.data.length) / 5 ;
												            versionsData.push({
												                name: pie_data[i].drilldown.categories[j],
												                y: pie_data[i].drilldown.data[j],
												                color: Highcharts.Color(pie_data[i].color).brighten(brightness).get()
												            });
												        }
												    }
													 div.highcharts({
													    	credits : {
																enabled : false
															},
													        chart: {
													            type: 'pie',
													    		height:'100',
													    		width:'100',
													        },
													        title: {
													            text: ''
													        },
													        yAxis: {
													            title: {
													                text: 'Total percent market share'
													            }
													        },
													        plotOptions: {
													            pie: {
													                shadow: false,
													                center: ['50%', '50%']
													            }
													        },
													        tooltip: {
													        	enabled : false
													        },
													        series: [{
													            name: 'Versions',
													            data: versionsData,
													            size: '100%',
													            innerSize: '99%',
													            dataLabels: {
													                formatter: function() {
													                    // display only if larger than 1
													                    return ;
													                }
													            }
													        }]
													    });
													 
													 div.append('<div class="name-anchors">'+relname+'</div>').append('<div class="score-anchors">'+score+'</div>');  
												}
										}
		
		$LAB
		.script(root + "/plugin/flowplayer/flowplayer-3.2.13.min.js")
		.script(root + "/plugin/codemirror-3.21/lib/codemirror.js")
		.script(root + "/plugin/Highcharts-3.0.9/js/highcharts.js")
		.wait()
		.script(root + "/plugin/codemirror-3.21/addon/mode/loadmode.js")
		.wait(
				function() {
	var getView = {
			mirrors : {},
			init : function() {
				var $this = this;
				$this.getReportView($this);
			},
			getReportView : function($this) {
				$
						.setsAjax({
							url : root
									+ "/sets/paper/getPaper/"
									+ TEST_ID,
							type : 'post',
							beforeSend: function(){
								modalWaiting.show('正在加载答题情况...');
							},
							dataType : 'json',
							contentType : 'application/json',
							success : function(result) {
								$('.title_username').text(
										result.data.name
												+ "的答题情况");
								document.title = result.data.name
										+ "的答题情况";
								$('.title_score').text(
										result.data.score);
								var beginTime = $
										.sets_formatTime(result.data.beginTime);
								var endTime = $
										.sets_formatTime(result.data.endTime);
								$('.startTime').text(
										"开始时间:" + beginTime
												+ "———— 交卷时间:"
												+ endTime);
								if (result.data.sysBasicScore
										|| result.data.sysBasicScore == 0) {
									$('.byscore')
											.text(
													result.data.sysBasicScore
															+ "分");
									$('#select').show();
									$('.select_title_content')
											.show();
									$('.score_content').show();
									$('.byscore').show();
									$('.byscore').parent()
											.show();
								} else {
									$('.byscore').hide();
									$('.byscore').parent().hide();
								}
								if (result.data.userBasicScore
										|| result.data.userBasicScore == 0) {
									$('.sysscore')
											.text(
													result.data.userBasicScore
															+ "分");
									$('.select_title_content')
											.show();
									$('.score_content').show();
									$('.sysscore').show();
									$('.sysscore').parent()
											.show();
								} else {
									$('.sysscore').hide();
									$('.sysscore').parent().hide();
								}
								if (result.code == 0) {
									$('#system_list').hide();
									var datas = result.data;
									if(datas.sysBasicScore||datas.userBasicScore||datas.sysBasicScore==0||datas.userBasicScore)
										{
										$(
										'.float_select')
										.show()
										.addClass(
												'skill_background');
										}
									if (datas.parts) {
										for ( var z = 0; z < result.data.parts.length; z++) {
											var partName = result.data.parts[z].partName;
											var floatTitle = $('.floatTitle');
											if (partName == "技术基础") {
												$(
														'.select_exam_content')
														.show();
												$('#select')
														.show();
												$('.score-item')
														.show();
												var skill_content = [];
												for ( var k = 0; k < result.data.parts[z].partItems.length; k++) {
													var skillName = result.data.parts[z].partItems[k].skillName;
													skill_content
															.push(skillName);
												}
												var skill_name = $
														.unique($(skill_content));
												
												$this
														.createSelectView(
																datas,
																z,
																skill_name);
											} else if (partName == "编程能力"
													|| partName == "附加编程") {
												$('#system').show();
												$(
														'.float_system')
														.show();
												if (partName == "编程能力") {
													$this
															.createSystemView(
																	datas,
																	z);
												} else {
													$this
															.additionSystem(
																	datas,
																	z);
												}
												if ($(
														'.float_system')
														.siblings()
														.hasClass(
																"skill_background")) {
												} else {
													$(
															'.float_system')
															.addClass(
																	'skill_background');
												}
											} else if (partName == "技术问答") {
												$('.float_aq')
														.show();
												if ($(
														'.float_aq')
														.siblings()
														.hasClass(
																"skill_background")) {
												} else {
													$(
															'.float_aq')
															.addClass(
																	'skill_background');
												}
												$this
														.questionAnswer(
																datas,
																z);
											} else if (partName == "智力") {
												$('.float_iq')
														.show();
												if ($(
														'.float_iq')
														.siblings()
														.hasClass(
																"skill_background")) {
												} else {
													$(
															'.float_iq')
															.addClass(
																	'skill_background');
												}
												$this
														.iqQuestion(
																datas,
																z);
											}
										}
										;
									} 
									if (datas.videos) {
										if ($('.float_video')
												.siblings()
												.hasClass(
														"skill_background")) {
										} else {
											$('.float_video')
													.addClass(
															'skill_background');
										}
										$('.float_video')
												.show();
										$this.videoPart(datas)
									}
									$this.bindEvent($this);
									$this.score();

								}

							},
							complete : function() {
								$('body').scrollspy({
									target : '.nav-main'
								});
								modalWaiting.hide();
							}
						})
			},
			createSelectView : function(datas, z, skill_name) {
				var selects = datas.parts[z].partItems;
				var $self_paper = $('#self_paper_content');
				var $skill_report = $('.skill_content_title');
				var total = [];
				var totalScore = 0;
				var skill_content = [];
				for ( var i = 0; i < selects.length; i++) {
					var viewContent = [];
					var answer_time = $
							.sets_prettyTime(selects[i].answerTime);
					var avg_time = $
							.sets_prettyTime(selects[i].avgAnswerTime);
					var rightAnswer = selects[i].optRefAnswer;
					if (selects[i].optAnswer) {
						var studentAnswer = selects[i].optAnswer;
					} else {
						var studentAnswer = "未作答";
					}
					var title = selects[i].title.replace(/\n/g,
							"<br>");
					var answer = 0;
					var sanswer = 0;
					var rel_answer = [];
					var stu_answer = [];
					total.push(selects[i].score);
					if (rightAnswer == studentAnswer) {
						rightAnswer == rightAnswer.split("");
						if (studentAnswer) {
							studentAnswer = studentAnswer
									.split("");
						}
						for ( var l = 0; l < rightAnswer.length; l++) {
							switch (rightAnswer[l]) {
							case 'A':
								answer = 0;
								break;
							case 'B':
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
							for ( var p = 0; p < selects[i].options.length; p++) {
								if (answer == p) {
									rel_answer
											.push(selects[i].options[p]);
								}
							}
						}
						viewContent
								.push('<span class="skill_name">技能：'
										+ selects[i].skillName
										+ '</span>');
						viewContent
								.push('<div class="bs-callout bs-callout-success">');
						viewContent
								.push('<label class="technology_content_common"><ul class="content_title">');
						viewContent
								.push('<li class="select_title">'
										+ (i + 1) + '、');
						if (selects[i].questionType == 2) {
							viewContent.push('多选题</li>');
						} else {
							viewContent.push('单选题</li>');
						}
						viewContent
								.push('<li class="exam_time_total">');
						viewContent
								.push('<div style="exam_title_content">&nbsp;&nbsp;考生用时：（'
										+ answer_time
										+ '）平均用时：（'
										+ avg_time
										+ '）</div></li></ul>')
						viewContent
								.push('<div style="margin-left:30px">'
										+ title
										+ '</div> </label>');
						viewContent
								.push('<li style="width:100%;background-color:#fff;list-style:none"><p class="technology_content_common" style="width:95%">');
						viewContent
								.push('<p class="answer_right">考生答案：</p>');
						for ( var o = 0; o < rel_answer.length; o++) {
							viewContent
									.push('<span style="padding-left:50px">'
											+ rel_answer[o]
											+ '</span><br>');
						}
						viewContent.push(' </label></div>');
						$skill_report.append(viewContent
								.join(""));
					} else {
						rightAnswer == rightAnswer.split("");
						if (studentAnswer != "未作答") {
							studentAnswer = studentAnswer
									.split("");
						}
						for ( var l = 0; l < rightAnswer.length; l++) {
							switch (rightAnswer[l]) {
							case 'A':
								answer = 0;
								break;
							case 'B':
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
							for ( var p = 0; p < selects[i].options.length; p++) {
								if (answer == p) {
									rel_answer
											.push(selects[i].options[p]);
								}
							}
						}
						if (studentAnswer != "未作答") {
							for ( var m = 0; m < studentAnswer.length; m++) {
								switch (studentAnswer[m]) {
								case 'A':
									sanswer = 0;
									break;
								case 'B':
									sanswer = 1;
									break;
								case 'C':
									sanswer = 2;
									break;
								case 'D':
									sanswer = 3;
									break;
								case 'E':
									sanswer = 4;
									break;
								case 'F':
									sanswer = 5;
									break;
								}
								for ( var n = 0; n < selects[i].options.length; n++) {
									if (sanswer == n) {
										stu_answer
												.push(selects[i].options[n]);
									}
								}
							}
						} else {
							stu_answer.push(studentAnswer);
						}
						viewContent
								.push('<span class="skill_name">技能：'
										+ selects[i].skillName
										+ '</span>');
						viewContent
								.push('<div class="bs-callout bs-callout-danger">');
						viewContent
								.push('<label class="technology_content_common"><ul class="content_title">');
						viewContent
								.push('<li class="select_title">'
										+ (i + 1) + '、');
						if (selects[i].questionType == 2) {
							viewContent.push('多选题</li>');
						} else {
							viewContent.push('单选题</li>');
						}
						viewContent
								.push('<li class="exam_time_total">');
						viewContent
								.push('<div style="exam_title_content">&nbsp;&nbsp;考生用时：（'
										+ answer_time
										+ '）平均用时：（'
										+ avg_time
										+ '）</div></li></ul>')
						viewContent
								.push('<div style="margin-left:30px">'
										+ title
										+ '</div> </label>');
						viewContent
								.push('<div style="width:100%;background-color:#fff;list-style:none"><div class="technology_content_common" style="width:95%">');
						viewContent
								.push('<p class="answer_wrong">考生答案：');
						viewContent.push('</p> ');
						for ( var o = 0; o < stu_answer.length; o++) {
							viewContent
									.push('<span style="margin-left:50px">'
											+ stu_answer[o]
											+ '</span><br>');
						}
						viewContent
								.push('<p class="answer_re_right">正确答案：</p>');
						for ( var a = 0; a < rel_answer.length; a++) {
							viewContent
									.push('<span style="margin-left:50px">'
											+ rel_answer[a]
											+ '</span><br>');
						}
						viewContent.push('</div>');
						$skill_report.append(viewContent
								.join(""));
					}
				}

			},
			// 创建编程题部分模板
			createSystemView : function(datas, z) {
				var that = this;
				var $thispart = datas.parts[z].partItems;
				var $baiyiSystem = $('.systemcontent');
				var $selfSystem = $('#selfSystem');
				var bysystemIndex = 1;
				for ( var i = 0; i < $thispart.length; i++) {
					var id = Math.guid();
					var title = $thispart[i].title.replace(
							/\n/g, "<br>");
					var ref_answer = "";
					var answer = "";
					var mode = $thispart[i].mode.toLowerCase();
					var answer_time = $
							.sets_prettyTime($thispart[i].answerTime);
					var avg_time = $
							.sets_prettyTime($thispart[i].avgAnswerTime);
					var score = $thispart[i].score;
					if(score||score==0){
						score = $thispart[i].score
					}else{
						score = "未评";
					}
					if (!mode) {
						mode = "无";
					}
					if ($thispart[i].refAnswer) {
						ref_answer = $thispart[i].refAnswer;
					} else {
						ref_answer = "无";
					}
					if ($thispart[i].answer) {
						answer = $thispart[i].answer;
					} else {
						answer = "无";
					}
					if ($thispart[i].prebuilt == true) {
						var content = [];

						content
								.push('<span class="skill_name_sys">语言：'
										+ mode + '</span>');
						content
								.push('<div class="bs-callout bs-callout-info">');
						content
								.push('<li class=""><label class=""><br>');
						content
								.push('<p><span style="font-size: 17pt;color:rgb(66,139,202)">'
										+ (titleIndex++)
										+ '、</span>');
						content.push('' + title
								+ '</p></label></li>');
						content
								.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="stu_answer_content_score"><span class="label label-warning sysScore">'
										+ score
										+ '分</span></li><br><br>');
						content
								.push('<li style="margin-left:20px">');
						content
								.push('<a href="#stAnswera'
										+ id
										+ '" role="tab" data-id="'
										+ id
										+ '" data-toggle="tab" class="tab'
										+ id
										+ '">考生答案</a></li>');
						content
								.push('<li class="active"><a href="#riAnswer'
										+ id
										+ '" role="tab" data-id="'
										+ id
										+ '" data-toggle="tab" >参考答案</a></li>');
						content
								.push('<li class="stu_answer_content">');
						content
								.push('<span style="padding-left:20px;back">&nbsp;&nbsp;考生用时：</span><span>'
										+ answer_time
										+ '</span>，<span>平均用时：</span><span style="padding-right:20px">'
										+ avg_time
										+ '</span></li>');
						content.push('</ul>');
						content
								.push('<div class="tab-content"><div class="tab-pane active" id="stAnswera'
										+ id
										+ '"><div class="mymirror mirror'
										+ id
										+ '"></div><br></div>');
						content
								.push('<div class="tab-pane active" id="riAnswer'
										+ id
										+ '"><div class="mymirror mirrorr'
										+ id
										+ '"></div></div></div></li><br><br>');
						content.push('</div>');
						$baiyiSystem.append(content.join(""));
					} else {
						var content = [];
						content
								.push('<span class="skill_name_sys">语言：'
										+ mode + '</span>');
						content
								.push('<div class="bs-callout bs-callout-info">');
						content
								.push('<li class=""><label class=""><br>');
						content
								.push('<p><span style="font-size: 17pt;color:rgb(66,139,202)">'
										+ (titleIndex++)
										+ '、</span>');
						content.push('' + title
								+ '</p></label></li>');
						content
								.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="stu_answer_content_score"><div><span class="label label-warning sysScore" style="position: absolute;left:0;height:20px;line-height:20px">'
										+ score
										+ '分</span>');
						if($thispart[i].readonly==false){
							content.push('<a class="change_rel_score" ><i class="fa fa-pencil"></i> 修改打分</a>');
						}
						content.push('</div>');
						content
								.push('<div style="display:none"><input class="form-control" type="text" style="width: 160px;display:inline-block;" placeholder="范围:0-10 精度:0.1"/><button data-name="system" class="btn btn-info btn-sm grading-save ml10" disabled="disabled" value='
										+ $thispart[i].questionId
										+ '>保存</button><button class="btn btn-default btn-sm grading-cancel ml10">取消</button></div>');
						content.push('</li><br><br><br>');
						content
								.push('<li style="margin-top:-20px;width:100%"><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li style="margin-left:20px">');
						content
								.push('<a href="#stAnswerb'
										+ id
										+ '" role="tab" data-id="'
										+ id
										+ '" data-toggle="tab" class="tab'
										+ id
										+ '">考生答案</a></li>');
						content
								.push('<li class="active"><a href="#riAnswera'
										+ id
										+ '" role="tab" data-id="'
										+ id
										+ '" data-toggle="tab" >参考答案</a></li>');
						content
								.push('<li class="stu_answer_content">');
						content
								.push('<span style="padding-left:20px;">考生用时：</span><span>'
										+ answer_time
										+ '</span>，<span>平均用时：</span><span style="padding-right:20px">'
										+ avg_time
										+ '</span></li>');
						content.push('</ul>');
						content
								.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerb'
										+ id
										+ '"><div class="mymirror mirror'
										+ id
										+ '"></div><br></div>');
						content
								.push('<div class="tab-pane active" id="riAnswera'
										+ id
										+ '"><div class="mymirror mirrorr'
										+ id
										+ '"></div></div></div></li><br><br>');
						content.push('</div>');
						$baiyiSystem.append(content.join(""));
					}
					this.mirrors['mirror' + id] = CodeMirror($(
							'.mirror' + id).get(0), { // $place.get(0):
						// 页面的一个dom元素，一遍是一个div
						// 或者 textarea
						value : $thispart[i].answer, // 内容
						lineNumbers : true, // 行号
						lineWrapping : false, // 是否换行，还是出现横向滚动条
						styleActiveLine : false,
						tabSize : '4',
						indentUnit : '4',
						readOnly : true
					});
					this.mirrors['mirrorr' + id] = CodeMirror(
							$('.mirrorr' + id).get(0), { // $place.get(0):
								// 页面的一个dom元素，一遍是一个div
								// 或者
								// textarea
								value : ref_answer, // 内容
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
							this.mirrors['mirror' + id]
									.setOption('mode',
											Mode.mode);
							this.mirrors['mirrorr' + id]
									.setOption('mode',
											Mode.mode);
							// 还未加载js
							var jses = [];
							for ( var j = 0; j < Mode.path.length; j++) {
								jses.push(modeURL.replace(
										/%N/g, Mode.path[j]));
							}
							(function(opts) {
								$LAB
										.script(jses)
										.wait(
												function() {
													that.mirrors['mirror'
															+ opts.id]
															.setOption(
																	'mode',
																	opts.mode);
													that.mirrors['mirrorr'
															+ opts.id]
															.setOption(
																	'mode',
																	opts.mode);
												});
								$('#systemcontent').find(
										'.tab' + id + '')
										.click();
								$('#systemcontent')
										.find(
												'a[data-toggle="tab"]')
										.on(
												'shown.bs.tab',
												function(e) {
													var id = $(
															e.target)
															.data(
																	id);
													that.mirrors['mirrorr'
															+ id]
															.refresh();
													that.mirrors['mirror'
															+ id]
															.refresh();
												});
							})({
								id : id,
								mode : Mode.mode
							});
						}
					}
				}
			},
			additionSystem : function(datas, z) {
				var $content = $('.systemcontent');
				var $thispart = datas.parts[z].partItems;
				var bysystemIndex = 1;
				for ( var i = 0; i < $thispart.length; i++) {
					var id = Math.guid();
					var answer_time = $
							.sets_prettyTime($thispart[i].answerTime);
					var avg_time = $
							.sets_prettyTime($thispart[i].avgAnswerTime);
					var title = $thispart[i].title.replace(
							/\n/g, "<br>");
					var ref_answer = "";
					var answer = ""
					if ($thispart[i].refAnswer) {
						ref_answer = $thispart[i].refAnswer;
					} else {
						ref_answer = "无";
					}
					if ($thispart[i].answer) {
						answer = $thispart[i].answer;
					} else {
						answer = "无";
					}
					var score = $thispart[i].score;
					var mode = $thispart[i].mode.toLowerCase();
					if (score||score==0) {
						score = $thispart[i].score;
					}else{
						score = "未评";
					}
					if ($thispart[i].prebuilt == true) {
						var content = [];

						if (mode) {
							content
									.push('<span class="skill_name_sys">语言：'
											+ mode + '</span>');
						}

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
								.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="stu_answer_content_score"><span class="label label-warning sysScore">'
										+ score
										+ '分</span></li><br><br>');
						content
								.push('<li class="active" style="margin-left:20px;width:100%">');
						content
								.push('<a href="#stAnswerc'
										+ id
										+ '" role="tab" data-toggle="tab">考生答案</a></li>');
						content
								.push('<li><a href="#riAnswerc'
										+ id
										+ '" role="tab" data-toggle="tab">参考答案</a></li>');
						content.push('<li class="">');
						content
								.push('<span style="padding-left:20px;">&nbsp;&nbsp;考生用时：</span><span>'
										+ answer_time
										+ '</span>，<span>平均用时：</span><span style="padding-right:20px">'
										+ avg_time
										+ '</span></li>');
						content.push('</ul>');
						content
								.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerc'
										+ id
										+ '"><div class="mirror'
										+ id
										+ '">'
										+ answer
										+ '</div><br></div>');
						content
								.push('<div class="tab-pane " id="riAnswerc'
										+ id
										+ '"><div class="student_answer_content mirrorr'
										+ id
										+ '">'
										+ ref_answer
										+ '</div></div></div></li><br><br>');
						content.push('</div>');
						$content.append(content.join(""));
					} else {
						var content = [];
						if (mode) {
							content
									.push('<span class="skill_name_sys">语言：'
											+ mode + '</span>');
						}
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
								.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="stu_answer_content_score"><div><span class="label label-warning sysScore" style="position: absolute;left:0;height:20px;line-height:20px">'
										+ score
										+ '分</span>');
						if($thispart[i].readonly==false){
							content.push('<a class="change_rel_score" ><i class="fa fa-pencil"></i> 修改打分</a>');
						}
						content.push('</div>');
						content
								.push('<div style="display:none"><input class="form-control" type="text" style="width: 160px;display:inline-block;" placeholder="范围:0-10 精度:0.1"/><button data-name="addsystem" class="btn btn-info btn-sm grading-save ml20" disabled="disabled" value='
										+ $thispart[i].questionId
										+ '>保存</button><button class="btn btn-default btn-sm grading-cancel ml10">取消</button></div>');
						content.push('</li><br><br><br>');
						content
								.push('<li style="margin-top:-20px;width:100%"><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="active" style="margin-left:20px">');
						content
								.push('<a href="#stAnswerd'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">考生答案</a></li>');
						content
								.push('<li><a href="#riAnswerb'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">参考答案</a></li>');
						content
								.push('<li class="stu_answer_content">');
						content
								.push('<span style="padding-left:20px;back">考生用时：</span><span>'
										+ answer_time
										+ '</span>，<span>平均用时：</span><span style="padding-right:20px">'
										+ avg_time
										+ '</span></li>');
						content.push('</ul>');
						content
								.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerd'
										+ bysystemIndex
										+ '"><div class=" mirror'
										+ id
										+ '"></div><br></div>');
						content
								.push('<div class="tab-pane " id="riAnswerb'
										+ bysystemIndex++
										+ '"><div class=" mirrorr'
										+ id
										+ '"></div></div></div></li><br><br>');
						content.push('</div>')
						$content.append(content.join(""));
					}
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
					var _mirror_right = CodeMirror($(
							'.mirrorr' + id).get(0), { // $place.get(0):
						// 页面的一个dom元素，一遍是一个div
						// 或者
						// textarea
						value : ref_answer, // 内容
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
							_mirror_right.setOption('mode',
									Mode.mode);
							// 还未加载js
							var jses = [];
							for ( var j = 0; j < Mode.path.length; j++) {
								jses.push(modeURL.replace(
										/%N/g, Mode.path[j]));
							}
							$LAB
									.script(jses)
									.wait(
											function() {
												_mirror
														.setOption(
																'mode',
																Mode.mode);
												_mirror_right
														.setOption(
																'mode',
																Mode.mode);
											});
						}

					}

					$('.report_content').find(
							'a[data-toggle="tab"]').on(
							'shown.bs.tab', function(e) {
								_mirror.refresh();
								_mirror_right.refresh();
							});

				}

			},
			iqQuestion : function(datas, z) {
				var $content = $('.report_content');
				var iq = datas.parts[z].partItems;
				var bysystemIndex = 1;
				var $baiyiSystem = $('.report_content');
				$baiyiSystem
						.append('<div id="iq" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)"><span style="padding-left:20px">智力题</span> <span style="padding-left:20px;font-size:14pt" class="iqAvgScore">平均分：0</span></div><br>');
				for ( var i = 0; i < iq.length; i++) {
					var title = iq[i].title.replace(/\n/g,
							"<br>");
					var answer_time = $
							.sets_prettyTime(iq[i].answerTime);
					var avg_time = $
							.sets_prettyTime(iq[i].avgAnswerTime);
					var score = iq[i].score;
					var mode = iq[i].mode;
					var answer = "";
					var ref_answer = "";
					var optAnswer = "";
					var option = 0;
					var ref_option = [];
					var optOption = 0;
					var opt_option = [];
					if (iq[i].optAnswer) {
						optAnswer = iq[i].optAnswer.replace(
								/\n/g, "<br>");
					} else {
						optAnswer = "";
					}
					if (iq[i].answer) {
						answer = iq[i].answer.replace(/\n/g,
								"<br>");
					}
					if (iq[i].refAnswer) {
						ref_answer = iq[i].refAnswer.replace(
								/\n/g, "<br>");
					} else {
						ref_answer = "";
					}
					if(score||score==0){
						score = iq[i].score;
					}else{
						score = "未评";
					}
					if (!mode) {
						mode = "无";
					}
					if (iq[i].optRefAnswer) {
						var optRefAnswers = iq[i].optRefAnswer
								.split("");
						for ( var h = 0; h < optRefAnswers.length; h++) {
							switch (optRefAnswers[h]) {
							case "A":
								option = 0;
								break;
							case "B":
								option = 1;
								break;
							case "C":
								option = 2;
								break;
							case "D":
								option = 3;
								break;
							case "E":
								option = 4;
								break;
							case "F":
								option = 5;
								break;
							}
							for ( var y = 0; y < iq[i].options.length; y++) {
								if (y == option) {
									ref_option
											.push(iq[i].options[y]);
								}
							}
						}
					}
					if (iq[i].optAnswer) {
						var optAnswers = iq[i].optAnswer
								.split("");
						for ( var f = 0; f < optAnswers.length; f++) {
							switch (optAnswers[f]) {
							case "A":
								optOption = 0;
								break;
							case "B":
								optOption = 1;
								break;
							case "C":
								optOption = 2;
								break;
							case "D":
								optOption = 3;
								break;
							case "E":
								optOption = 4;
								break;
							case "F":
								optOption = 5;
								break;
							}
							for ( var e = 0; e < iq[i].options.length; e++) {
								if (e == optOption) {
									opt_option
											.push(iq[i].options[e]);
								}
							}
						}
					}

					// 判断智力题的类型 questionType 5 问答类型 7,8选择题
					if (iq[i].questionType == 7
							|| iq[i].questionType == 8
							|| iq[i].questionType == 1
							|| iq[i].questionType == 2) {
						var content = [];

						content
								.push('<div class="bs-callout bs-callout-info"><label class=""><br>');
						content
								.push('<p style="margin-left:20px;width:97%"><span style="font-size: 17pt;color:rgb(66,139,202)">'
										+ (i + 1) + '、</span>');
						content.push('' + title
								+ '</p></label></li>');
						content
								.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="stu_answer_content_score"><div><span class="label label-warning iqScore" style="position: absolute;left:0;height:20px;line-height:20px">'
										+ score
										+ '分</span>');
						if(iq[i].readonly==false){
							content.push('<a class="change_rel_score" ><i class="fa fa-pencil"></i> 修改打分</a>');
						}
						content.push('</div>');
						content
								.push('<div style="display:none"><input class="form-control" type="text" style="width: 160px;display:inline-block;" placeholder="范围:0-10 精度:0.1"/><button data-name="iq" class="btn btn-info btn-sm grading-save ml10" disabled="disabled" value='
										+ iq[i].questionId
										+ '>保存</button><button class="btn btn-default btn-sm grading-cancel ml10">取消</button></div>');
						content.push('</li><br><br><br>');
						content
								.push('<li style="margin-top:-20px"><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="active" style="margin-left:20px">');
						content
								.push('<a href="#stAnswerq'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">考生答案</a></li>');
						content
								.push('<li><a href="#riAnswerq'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">参考答案</a></li>');
						content
								.push('<li class="stu_answer_content">');
						content
								.push('<span style="padding-left:20px;back">考生用时：</span><span>'
										+ answer_time
										+ '</span>，<span>平均用时：</span><span style="padding-right:20px">'
										+ avg_time
										+ '</span></li>');
						content.push('</ul>');
						content
								.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerq'
										+ bysystemIndex
										+ '"><div class="student_answer_content" style="height:auto !important;width:auto !important">');
						for ( var b = 0; b < opt_option.length; b++) {
							content.push(opt_option[b]);
						}
						content.push("<br>");
						if (answer != "") {
							content.push(answer);
						}
						content.push('</div><br></div>');
						content
								.push('<div class="tab-pane " id="riAnswerq'
										+ bysystemIndex++
										+ '"><div class="" style="height:auto !important;width:auto !important;padding-left:30px">');
						for ( var u = 0; u < ref_option.length; u++) {
							content.push(ref_option[u]);
						}
						content.push("<br>");
						if (ref_answer) {
							content.push(ref_answer);
						}
						content
								.push('</div><br></div></div></li><br><br>');
						$content.append(content.join(""));
					} else if (iq[i].questionType == 5) {
						var content = [];
						content
								.push('<div class="bs-callout bs-callout-info"><label class=""><br>');
						content
								.push('<p style="margin-left:20px;width:97%"><span style="font-size: 17pt;color:rgb(66,139,202)">'
										+ (i + 1) + '、</span>');
						content.push('' + title
								+ '</p></label></li>');
						content
								.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="stu_answer_content_score"><div><span class="label label-warning iqScore" style="position: absolute;left:0;height:20px;line-height:20px">'
										+ score
										+ '分</span>');
						if(iq[i].readonly==false){
							content.push('<a class="change_rel_score" ><i class="fa fa-pencil"></i> 修改打分</a>');
						}
						content.push('</div>');
						content
								.push('<div style="display:none"><input class="form-control" type="text" style="width: 160px;display:inline-block;" placeholder="范围:0-10 精度:0.1"/><button data-name="iq" class="btn btn-info btn-sm grading-save ml10" disabled="disabled" value='
										+ iq[i].questionId
										+ '>保存</button><button class="btn btn-default btn-sm grading-cancel ml10">取消</button></div>');
						content.push('</li><br><br><br>');
						content
								.push('<li style="margin-top:-20px"><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="active" style="margin-left:20px">');
						content
								.push('<a href="#stAnswerm'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">考生答案</a></li>');
						content
								.push('<li><a href="#riAnswern'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">参考答案</a></li>');
						content
								.push('<li class="stu_answer_content">');
						content
								.push('<span style="padding-left:20px;back">考生用时：</span><span>'
										+ answer_time
										+ '</span>，<span>平均用时：</span><span style="padding-right:20px">'
										+ avg_time
										+ '</span></li>');
						content.push('</ul>');
						content
								.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerm'
										+ bysystemIndex
										+ '"><div class="student_answer_content" style="height:auto !important;width:auto !important">'
										+ answer
										+ '</div><br></div>');
						content
								.push('<div class="tab-pane " id="riAnswern'
										+ bysystemIndex++
										+ '"><div class="" style="height:auto !important;width:auto !important;padding-left:30px">'
										+ ref_answer
										+ '</div></div></div></li><br><br>');
						$baiyiSystem.append(content.join(""));
					}
				}
			},
			videoPart : function(datas) {
				var that = this;
				var $content = $('.report_content');
				$content
						.append('<div id="video" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)"><span style="padding-left:20px">面试题</span></div><br><div id="video" class="video_list gone"><div class="interview_topics bs-callout bs-callout-info"></div></div><br><br>');
				var showVideos = false;
				if (datas.videos && datas.videos.length > 0) {
					showVideos = true;
				}
				if (showVideos) {
					var videos = datas.videos || [];
					if (videos.length > 0) {
						$('.video_list').show();
						var items = [];
						for ( var i = 0; i < videos.length; i++) {
							var topic = videos[i];
							var hasAnswer = topic.url
									&& (topic.url != '');
							if (hasAnswer) {
								items.push('<button data-url="'
										+ topic.url + '" ');
								items
										.push('title="点击播放候选人答题视频" ');
							} else {
								items.push('<button ');
								items
										.push('title="候选人没有回答该问题" ');
							}
							items
									.push('class="text-left button button-rounded button-flat" style="margin-left:30px">');

							items
									.push('<span class="fa-stack fa-sm">');
							items
									.push('<i class="fa fa-video-camera fa-stack-1x"></i>');
							if (!hasAnswer) {
								items
										.push('<i class="fa fa-ban fa-stack-2x text-danger"></i>');
							}
							items.push('</span>');
							items.push(' ' + topic.title);
							items.push('</button><br>');
						}
						$('.video_list .interview_topics')
								.html(items.join(''));
						$(
								'.video_list .interview_topics button')
								.tooltip({
									placement : 'right'
								});

						var $videoModal = $('#interview_video');
						$('.video_list .interview_topics')
								.on(
										'click',
										'button',
										function() {
											var url = $(this)
													.data('url');
											if (url) {

												// 不encode
												var parts = url
														.split('Signature=');
												if (parts.length == 2) {
													url = parts[0]
															+ 'Signature='
															+ encodeURIComponent(parts[1]);
												}

												$videoModal.find('.modal-title').text($(this).text());
												$("#video_player").attr("href",url);
												flowplayer(
														"video_player",
														root + '/plugin/flowplayer/flowplayer-3.2.18.swf');
												$videoModal
														.modal();
											}

										});

					}
				}
			},
			questionAnswer : function(datas, z) {
				var $content = $('.report_content');
				var iq = datas.parts[z].partItems;
				var bysystemIndex = 1;
				var $baiyiSystem = $('.report_content');
				$baiyiSystem
						.append('<div id="essays" style="height:50px;line-height:50px;border-bottom:2px solid #eeeeee;font-size:18pt;color:rgb(102,186,219)"><span style="padding-left:20px">技术问答</span> <span style="padding-left:20px;font-size:14pt" class="aqAvgScore">平均分：0</span></div><br>');
				for ( var i = 0; i < iq.length; i++) {
					var title = iq[i].title.replace(/\n/g,
							"<br>");
					var answer_time = $
							.sets_prettyTime(iq[i].answerTime);
					var avg_time = $
							.sets_prettyTime(iq[i].avgAnswerTime);
					var score = iq[i].score;
					var mode = iq[i].mode;
					var answer = "";
					var ref_answer = "";
					var optAnswer = "";
					if (iq[i].optAnswer) {
						optAnswer = iq[i].optAnswer.replace(
								/\n/g, "<br>");
					} else {
						optAnswer = "无";
					}
					if (iq[i].answer) {
						answer = iq[i].answer.replace(/\n/g,
								"<br>");
					} else {
						answer = "无";
					}
					if (iq[i].refAnswer) {
						ref_answer = iq[i].refAnswer.replace(
								/\n/g, "<br>");
					} else {
						ref_answer = "无";
					}
					if(score||score==0){
						score = iq[i].score;
					}else{
						score = "未评";
					}
					if (!mode) {
						mode = "无";
					}
					// 判断问答题的类型 questionType 5 问答类型 7,8选择题
					if (iq[i].questionType == 7
							|| iq[i].questionType == 8) {
						var content = [];

						content
								.push('<div class="bs-callout bs-callout-info"><label class=""><br>');
						content
								.push('<p style="margin-left:20px;width:97%"><span style="font-size: 17pt;color:rgb(66,139,202)">'
										+ (i + 1) + '、</span>');
						content.push('' + title
								+ '</p></label></li>');
						content
								.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="stu_answer_content_score"><div><span class="label label-warning aqscore" style="position: absolute;left:0;height:20px;line-height:20px">'
										+ score
										+ '分</span>');
						if(iq[i].readonly==false){
							content.push('<a class="change_rel_score" ><i class="fa fa-pencil"></i> 修改打分</a>');
						}
						content.push('</div>');
						content
								.push('<div style="display:none"><input class="form-control" type="text" style="width: 160px;display:inline-block;" placeholder="范围:0-10 精度:0.1"/><button data-name="qa" class="btn btn-info btn-sm grading-save ml10" disabled="disabled" value='
										+ iq[i].questionId
										+ '>保存</button><button class="btn btn-default btn-sm grading-cancel ml10">取消</button></div>');
						content.push('</li><br><br><br>');
						content
								.push('<li style="margin-top:-20px;width:100%"><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="active" style="margin-left:20px">');
						content
								.push('<a href="#stAnswerq'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">考生答案</a></li>');
						content
								.push('<li><a href="#riAnswerq'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">参考答案</a></li>');
						content
								.push('<li class="stu_answer_content">');
						content
								.push('<span style="padding-left:20px;back">考生用时：</span><span>'
										+ answer_time
										+ '</span>，<span>平均用时：</span><span style="padding-right:20px">'
										+ avg_time
										+ '</span></li>');
						content.push('</ul>');
						content
								.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerq'
										+ bysystemIndex
										+ '"><div class="" style="height:auto;width:auto">'
										+ optAnswer
										+ '</div><br></div>');
						content
								.push('<div class="tab-pane " id="riAnswerq'
										+ bysystemIndex++
										+ '"><div class="" style="height:auto !important;width:auto">'
										+ ref_answer
										+ '</div><br></div></div></li><br><br>');
						$content.append(content.join(""));
					} else if (iq[i].questionType == 5) {
						var content = [];
						content
								.push('<div class="bs-callout bs-callout-info"><label class=""><br>');
						content
								.push('<p style="margin-left:20px;width:97%"><span style="font-size: 17pt;color:rgb(66,139,202)">'
										+ (i + 1) + '、</span>');
						content.push('' + title
								+ '</p></label></li>');
						content
								.push('<li><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="stu_answer_content_score"><div><span class="label label-warning sysScore aqscore" style="position: absolute;left:0;height:20px;line-height:20px">'
										+ score
										+ '分</span>');
						if(iq[i].readonly==false){
							content.push('<a class="change_rel_score" ><i class="fa fa-pencil"></i> 修改打分</a>');
						}
						content.push('</div>');
						content
								.push('<div style="display:none"><input class="form-control" type="text" style="width: 160px;display:inline-block;" placeholder="范围:0-10 精度:0.1"/><button class="btn btn-info btn-sm grading-save ml10" disabled="disabled" value='
										+ iq[i].questionId
										+ '>保存</button><button class="btn btn-default btn-sm grading-cancel ml10">取消</button></div>');
						content.push('</li><br><br><br>');
						content
								.push('<li style="margin-top:-20px"><ul class="nav nav-tabs" role="tablist" style="margin-top:20px"><li class="active" style="margin-left:20px">');
						content
								.push('<a href="#stAnswerb'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">考生答案</a></li>');
						content
								.push('<li><a href="#riAnswera'
										+ bysystemIndex
										+ '" role="tab" data-toggle="tab">参考答案</a></li>');
						content
								.push('<li class="stu_answer_content">');
						content
								.push('<span style="padding-left:20px;back">考生用时：</span><span>'
										+ answer_time
										+ '</span>，<span>平均用时：</span><span style="padding-right:20px">'
										+ avg_time
										+ '</span></li>');
						content.push('</ul>');
						content
								.push('<div class="tab-content"><div class="tab-pane active" id="stAnswerb'
										+ bysystemIndex
										+ '"><div class="" style="height:auto !important;width:auto">'
										+ answer
										+ '</div><br></div>');
						content
								.push('<div class="tab-pane " id="riAnswera'
										+ bysystemIndex++
										+ '"><div  style="height:auto !important;width:auto"">'
										+ ref_answer
										+ '</div></div></div></div><br><br>');
						$baiyiSystem.append(content.join(""));
					}
				}
			},
			bindEvent : function($this) {
				$('.change_rel_score').click(function() {
					$(this).parent().next().show();
					$(this).parent().hide();
				});
				$('.grading-save')
						.click(
								function() {
									var that = $(this);
									var questionId = $(this)
											.val();
									var score = $(this).prev()
											.val();
									var success = true;
									var datas = {
										anchor : -1,
										questionId : questionId,
										score : score,
										testId : TEST_ID
									};
									$
											.setsAjax({
												url : root
														+ "/sets/report/scoreQuestion",
												type : "post",
												data : datas,
												beforeSend : function() {
													that
															.attr(
																	"disabled",
																	"disabled")
															.text(
																	"保存中....");
												},
												success : function(
														result) {
													if (result.code == 0) {
														success = false;
														that
																.parent()
																.prev()
																.find(
																		'span')
																.text(
																		that
																				.prev()
																				.val()
																				+ "分");
													}
												},
												complete : function() {
													if (success == true) {
														setTimeout(
																function() {
																	that
																			.text("保存失败");
																	setTimeout(
																			function() {
																				that
																						.removeAttr(
																								"disabled")
																						.text(
																								"保存");
																			},
																			1000)
																},
																3000);
													} else {
														success = true;
														that
																.parent()
																.hide();
														that
																.parent()
																.prev()
																.show();
														that
																.text("保存");
														$this
																.score();
														var relname = that.data("name");
														var div="" ;
														var score= "";
														switch(relname){
															case "system":
																relname = "编程能力";
																div = $('#1');
																score = $('.sysAvgScore').text().split("：")[1].split("分")[0];
																break;
															case "addsystem":
																relname = "附加编程";
																div = $('#4');
																score = $('.sysAvgScore').text().split("：")[1].split("分")[0];
																break;
															case "iq":
																relname = "智力";
																div = $('#3');
																score = $('.iqAvgScore').text().split("：")[1].split("分")[0];
																break;
														}
														scoreHighchars.myreload(div, relname, score);
													}
												}
											})
								});
				$('.grading-cancel').click(function() {
					$(this).parent().hide();
					$(this).parent().prev().show();
				});
				$('.form-control').keyup(
						function() {
							var $this = $(this);
							if ($this.val() >= 0
									&& $this.val() <= 10) {
								$this.next().removeAttr(
										"disabled");
							} else {
								$this.next().attr("disabled",
										"disabled");
							}
						});
				$('.floatSkill >a').click(
						function() {
							$('.floatSkill').removeClass(
									"skill_background");
							$(this).parent().addClass(
									"skill_background");
						});

			},
			// 计算平均分部分
			score : function() {
				// 智力题部分
				var iq = [];
				var iqscore = 0;
				$('.iqScore').each(
						function() {
							if ($(this).text() != "未评分") {
								iq.push($(this).text().replace(
										"分", ""))
							}
						});
				if (iq != "") {
					for ( var i = 0; i < iq.length; i++) {
						var iqtotal = iq[i];
						iqscore = iqtotal * 1 + iqscore * 1;
					}
					var iqavgscore = iqscore / iq.length;
					iqavgscore = iqavgscore.toFixed(1);
					$('.iqAvgScore').text(
							"平均得分：" + iqavgscore + "分");
				} else {
					$('.iqAvgScore').text("平均得分：0分");
				}
				// 问答题
				var aq = [];
				var aqscore = 0;
				$('.aqscore').each(
						function() {
							if ($(this).text() != "未评分") {
								aq.push($(this).text().replace(
										"分", ""))
							}
						});
				if (aq != "") {
					for ( var i = 0; i < aq.length; i++) {
						var aqtotal = aq[i];
						aqscore = aqtotal * 1 + aqscore * 1;
					}
					var aqavgscore = aqscore / aq.length;
					aqavgscore = aqavgscore.toFixed(1);
					$('.aqAvgScore').text(
							"平均得分：" + aqavgscore + "分");
				} else {
					$('.aqAvgScore').text("平均得分：0分");
				}
				// 编程题部分
				var system = [];
				var sysscore = 0;
				$('.sysScore').each(
						function() {
							if ($(this).text() != "未评分") {
								system.push($(this).text()
										.replace("分", ""))
							}
						});
				if (system != "") {
					for ( var i = 0; i < system.length; i++) {
						var systotal = system[i];
						sysscore = systotal * 1 + sysscore * 1;
					}
					var sysavgscore = sysscore / system.length;
					sysavgscore = sysavgscore.toFixed(1);
					$('.sysAvgScore').text(
							"平均得分：" + sysavgscore + "分");
				} else {
					$('.sysAvgScore').text("平均得分：0分");
				}
			}

		};// END getView
		getView.init();
		})
	})
})(jQuery)