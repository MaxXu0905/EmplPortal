package com.ailk.sets.model;

public class KPI {
	private String id;
	private String name;
	private double total;
	private double finish;
	private double rate;
	
	public KPI(String id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	public KPI(String id, String name, double total, double finish) {
		this.id = id;
		this.name = name;
		this.total = total;
		this.finish = finish;
		this.rate = (total == 0) ? 0 : (finish / total);
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public double getFinish() {
		return finish;
	}

	public void setFinish(double finish) {
		this.finish = finish;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getRate() {
		return rate;
	}

	public void setRate(double rate) {
		this.rate = rate;
	}
}
