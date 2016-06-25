package com.ailk.sets.model;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.ailk.sets.platform.intf.cand.domain.InfoNeeded;

/**
 * 报告的基本属性
 * @author Mia
 *
 */
public class Report {
	private int reportId;				//报告ID
	private int paper_inst_id;			//试卷ID
	private int invite_id;              //邀请ID
	private Date reportDateTime;        //报告生成时间
	
	private String photo;              //候选人照片
	private int testResult;   //0-待定; 1-通过; 2-淘汰
	private double score;
	private double match;
	
	private List<InfoNeeded> infoNeededList;   //常规信息

	private String positionName;               //职位信息
	private String summary;                    //全面概述
	
	
	private Map<String,TagReport> tags;
	private Map<Integer,List<KPI>> questions;
	
	private List<Integer> interviewAdvices;
	private Map<Integer,String> extrasAnswer;
	private List<InterviewAnswer> interviews;
	
	//附加题答案，key为附加题id，value为附加题答案
	public Map<Integer, String> getExtrasAnswer() {
		return extrasAnswer;
	}

	public void setExtrasAnswer(Map<Integer, String> extrasAnswer) {
		this.extrasAnswer = extrasAnswer;
	}

	public int getReportId() {
		return reportId;
	}

	public void setReportId(int reportId) {
		this.reportId = reportId;
	}

	public int getPaper_inst_id() {
		return paper_inst_id;
	}

	public void setPaper_inst_id(int paper_inst_id) {
		this.paper_inst_id = paper_inst_id;
	}

	public int getInvite_id() {
		return invite_id;
	}

	public void setInvite_id(int invite_id) {
		this.invite_id = invite_id;
	}

	public Date getReportDateTime() {
		return reportDateTime;
	}

	public void setReportDateTime(Date reportDateTime) {
		this.reportDateTime = reportDateTime;
	}

	public String getPhoto() {
		return photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}

	public int getTestResult() {
		return testResult;
	}

	public void setTestResult(int testResult) {
		this.testResult = testResult;
	}

	public double getScore() {
		return score;
	}

	public void setScore(double score) {
		this.score = score;
	}

	public double getMatch() {
		return match;
	}

	public void setMatch(double match) {
		this.match = match;
	}

	public List<InfoNeeded> getInfoNeededList() {
		return infoNeededList;
	}

	public void setInfoNeededList(List<InfoNeeded> infoNeededList) {
		this.infoNeededList = infoNeededList;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public Map<String,TagReport> getTags() {
		return tags;
	}

	public void setTags(Map<String,TagReport> tags) {
		this.tags = tags;
	}

	public List<Integer> getInterviewAdvices() {
		return interviewAdvices;
	}

	public void setInterviewAdvices(List<Integer> interviewAdvices) {
		this.interviewAdvices = interviewAdvices;
	}

	public List<InterviewAnswer> getInterviews() {
		return interviews;
	}

	public void setInterviews(List<InterviewAnswer> interviews) {
		this.interviews = interviews;
	}
	
	public String getPositionName() {
		return positionName;
	}

	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}
}
