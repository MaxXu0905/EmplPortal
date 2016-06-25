package com.ailk.sets.model;

import java.util.ArrayList;

public class CandidateResult {
	private ArrayList<CandidateMail> candidates;
	private ArrayList<String> errors;
	private int total;
	
	public CandidateResult(ArrayList<CandidateMail> candidates,ArrayList<String> errors,int total)
	{
		this.candidates = candidates;
		this.errors = errors;
		this.total = total;
	}
}
