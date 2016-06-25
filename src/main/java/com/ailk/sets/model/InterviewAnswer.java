package com.ailk.sets.model;

import java.util.List;

/**
 * 面试题目以及录像
 * 
 * @author Mia
 * 
 */
public class InterviewAnswer {
	private int titleId;
	private String title;
	private String videoURL;
	private List<KPI> kpis;

	public List<KPI> getKpis() {
		return kpis;
	}

	public void setKpis(List<KPI> kpis) {
		this.kpis = kpis;
	}

	public int getTitleId() {
		return titleId;
	}

	public void setTitleId(int titleId) {
		this.titleId = titleId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getVideoURL() {
		return videoURL;
	}

	public void setVideoURL(String videoURL) {
		this.videoURL = videoURL;
	}
}
