package com.ailk.sets.model;

import java.util.HashMap;
import java.util.Map;

/**
 * 每个标签中的要素
 * 
 * @author Mia
 * 
 */
public class TagReport {

	private int tagId;
	private String tagName;

	private double requireValue; // 需要掌握的程度,权值;
	private String requireName; // 需要掌握的程度，中文;

	// private int tagNum; //标签数
	// private double occupyDegree; //tag/totalNum,标签所占的比例

	private KPI tag;

	// private int finishNum; //所有完成的标签加起来的题目数；
	// private double finishDegree; //finishNum/totalNum，完成的标签所占的比例；
	private KPI finishQuantity; // 完成量

	// private double totalScore; //每个标签上的总分数
	// private double getScore; //每个正确题目的总分数；
	// private double correctDegree; //正确率;

	private KPI score; // 得分

	// private int spendTime; //每个标签所花的时间
	// private int totalTime; //每个标签所分配的时间
	// private int timeDegree; //每个标签所花的时间占比

	private KPI spendTime; // 完成时间

	private Map<String, Difficulty> difficulties = new HashMap<String, Difficulty>(); // 每个标签上的难度；

	public int getTagId() {
		return tagId;
	}

	public void setTagId(int tagId) {
		this.tagId = tagId;
	}

	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}

	public double getRequireValue() {
		return requireValue;
	}

	public void setRequireValue(double requireValue) {
		this.requireValue = requireValue;
	}

	public String getRequireName() {
		return requireName;
	}

	public void setRequireName(String requireName) {
		this.requireName = requireName;
	}

	public Map<String, Difficulty> getDifficulties() {
		return difficulties;
	}

	public void setDifficulties(Map<String, Difficulty> difficulties) {
		this.difficulties = difficulties;
	}

}
