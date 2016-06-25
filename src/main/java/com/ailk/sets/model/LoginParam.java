package com.ailk.sets.model;

import java.io.Serializable;

public class LoginParam implements Serializable{
	private static final long serialVersionUID = 1L;
	private String certifycode;
	private String username;
	private String password;
	
	public String getCertifycode() {
		return certifycode;
	}
	public void setCertifycode(String certifycode) {
		this.certifycode = certifycode;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}
