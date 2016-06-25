package com.ailk.sets.model;

import com.ailk.sets.platform.intf.model.employer.LoginInfo;

public class LoginInfoNeedCode extends LoginInfo {
     private Integer needCode;//0不需要  1需要
	
     public Integer getNeedCode() {
		return needCode;
	 }

	public void setNeedCode(Integer needCode) {
		this.needCode = needCode;
	}
}
