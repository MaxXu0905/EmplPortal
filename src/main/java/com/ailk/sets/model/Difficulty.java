package com.ailk.sets.model;

public class Difficulty {
	private String difficult; // 难度等级
	private KPI score; // 得分
	private KPI finishQuantity; // 完成量
	private KPI spendTime; // 完成时间
	
	public Difficulty(String difficult) {
		this.difficult = difficult;
		this.score = new KPI("score", "得分");
		this.finishQuantity = new KPI("finishQuantity", "完成数量");
		this.spendTime = new KPI("spendTime", "完成时间");
	}

	public String getDifficult() {
		return difficult;
	}

	public void setDifficult(String difficult) {
		this.difficult = difficult;
	}

	public KPI getScore() {
		return score;
	}

	public void setScore(KPI score) {
		this.score = score;
	}

	public KPI getFinishQuantity() {
		return finishQuantity;
	}

	public void setFinishQuantity(KPI finishQuantity) {
		this.finishQuantity = finishQuantity;
	}

	public KPI getSpendTime() {
		return spendTime;
	}

	public void setSpendTime(KPI spendTime) {
		this.spendTime = spendTime;
	}

}
