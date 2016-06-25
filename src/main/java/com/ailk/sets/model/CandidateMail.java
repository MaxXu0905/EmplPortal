package com.ailk.sets.model;

//实体类
public class CandidateMail {
	
	private String name;
	private String email;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	public boolean equals(Object obj) 
	{ 
		if(obj == null)
			return false;
		if(!(obj instanceof CandidateMail))
			return false;
		
		if(this.name == null || this.email == null)
			return false;
		
		if(this.name.equals(((CandidateMail)obj).getName()) && this.email.equals(((CandidateMail)obj).getEmail()))
			return true;
		else
			return false;
	} 
	
}
