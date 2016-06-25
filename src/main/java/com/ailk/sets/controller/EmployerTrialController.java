package com.ailk.sets.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.EPResponse;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.EmployerAuthorizationIntf;
import com.ailk.sets.platform.intf.empl.domain.EmployerTrialActiveResponse;
import com.ailk.sets.platform.intf.empl.domain.EmployerTrialApply;
import com.ailk.sets.platform.intf.empl.service.IEmployerTrial;

@Controller
@RequestMapping("trial")
public class EmployerTrialController {

	private static Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	private IEmployerTrial employerTrial;

	/**
	 * 招聘人申请账号
	 * 
	 * @param param
	 * @param session
	 * @return
	 */
	@RequestMapping("/registExmpoler")
	public @ResponseBody
	EPResponse<PFResponse> register(@RequestBody EmployerTrialApply employer, HttpSession session) {
		logger.debug("register begin  ,info is {} ", employer);
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			PFResponse ri = employerTrial.registEmployerTrial(employer);
			epResponse.setCode(SysBaseResponse.SUCCESS);
			epResponse.setData(ri);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			logger.error("error regist employer ", e);
		}
		return epResponse;
	}
	
	/**
	 * 激活
	 * 
	 * @param param
	 * @param session
	 * @return
	 */
	@RequestMapping("/newPassword")
	public @ResponseBody
	EPResponse<EmployerTrialActiveResponse> newPassword(@RequestBody EmployerTrialApply employer, HttpSession session) {
		logger.debug("register begin  ,info is {} ", employer);
		EPResponse<EmployerTrialActiveResponse> epResponse = new EPResponse<EmployerTrialActiveResponse>();
		try {
			EmployerTrialActiveResponse ri = employerTrial.activeEmployerTrail(employer.getActivationKey(),employer.getUserPwd(),employer.getUserName());
			if(ri.getCode().equals(FuncBaseResponse.SUCCESS)){
				session.setAttribute(Constant.EMPLOYERID, ri.getEmployerId());
				session.setAttribute(Constant.EMPLOYERNAME, ri.getEmployerName());
			}
			epResponse.setCode(SysBaseResponse.SUCCESS);
			ri.setEmployerId(null);
			ri.setEmployerName(null);
			epResponse.setData(ri);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			logger.error("error activite employer ", e);
		}
		return epResponse;
	}
	
	/**
	 * 激活
	 * 
	 * @param param
	 * @param session
	 * @return
	 */
	@RequestMapping("/activate/{activationKey}")
	public String activate(HttpServletRequest request, @PathVariable String activationKey) {
		logger.debug("activate begin  ,activationKey is {} ", activationKey);
		EmployerTrialApply apply = employerTrial.getEmployerTrialByKey(activationKey);
		if(apply == null){
			logger.debug("the key is invalidKey {} ", activationKey);
			request.setAttribute("keyErrorType", "invalidKey");//无效的key
			return "newPassword";
		}
		if( apply.getActivated() == 1){
			logger.error("the key {} has already actived ", activationKey);
			request.setAttribute("keyErrorType", "activatedKey");//已经激活
			return "newPassword";
		}
		if(apply.isNeedUserName()){
			request.setAttribute("needUserName", true);
		}
		request.setAttribute("activateKey", activationKey);
		return "newPassword";
	}
	
}
