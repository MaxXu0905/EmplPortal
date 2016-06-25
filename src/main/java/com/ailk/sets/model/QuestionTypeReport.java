package com.ailk.sets.model;

/**
 * 报告里头存储按照题型分类的总时间和总分数
 * @author Mia
 *
 */
public class QuestionTypeReport {
	private int questionType;   //1为客观题；2为主观题
	
	private KPI score;         //得分
	private KPI spendTime;     //完成时间
	private KPI finishQuantity; // 完成量
	
	public int getQuestionType() {
		return questionType;
	}
	public void setQuestionType(int questionType) {
		this.questionType = questionType;
	}
}
