package com.ailk.sets.controller;

import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.EPResponse;
import com.ailk.sets.common.SetsUtils;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.cand.domain.Employer;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.ConfigCodeName;
import com.ailk.sets.platform.intf.empl.domain.ConfigInfoExtEx;
import com.ailk.sets.platform.intf.empl.domain.EmployerOperationLog;
import com.ailk.sets.platform.intf.empl.service.IConfig;
import com.ailk.sets.platform.intf.empl.service.IEmployerTrial;
import com.ailk.sets.platform.intf.empl.service.IInfoCollect;
import com.ailk.sets.platform.intf.empl.service.ILogin;
import com.ailk.sets.platform.intf.exception.PFServiceException;
import com.ailk.sets.platform.intf.model.ContactInfo;

@Controller
@RequestMapping("sys")
public class SystemController {

	private static Logger logger = LoggerFactory
			.getLogger(SystemController.class);

	@Autowired
	private IInfoCollect infoCollect;

	@Autowired
	private ILogin loginServ;

	@Autowired
	private IConfig configServ;

	@Autowired
	private IEmployerTrial trial;

	@RequestMapping("/error")
	public String error() {
		return "error";
	}

	@RequestMapping("/getQRCodePicUrl")
	public @ResponseBody
	EPResponse<String> getQRCodePicUrl(HttpSession session) {
		EPResponse<String> epResponse = new EPResponse<String>();
		try {
			int employerId = Integer.parseInt(session.getAttribute(
					Constant.EMPLOYERID).toString());
			epResponse.setData(infoCollect.getQRCodePicUrl(employerId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call getQRCodePicUrl", e);
		}
		return epResponse;
	}

	@RequestMapping("/getInfo")
	public @ResponseBody
	EPResponse<Collection<ConfigInfoExtEx>> getInfoExt(HttpSession session) {
		EPResponse<Collection<ConfigInfoExtEx>> epResponse = new EPResponse<Collection<ConfigInfoExtEx>>();
		try {
			int employerId = Integer.parseInt(session.getAttribute(
					Constant.EMPLOYERID).toString());
			Collection<ConfigInfoExtEx> infos = infoCollect.getInfoExt(
					employerId, null);
			epResponse.setData(infos);
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			if (logger.isDebugEnabled())
				e.printStackTrace();
		}
		return epResponse;
	}

	@RequestMapping(value = "/cooperate", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<PFResponse> makeCooperation(@RequestBody ContactInfo contactInfo) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			epResponse.setData(loginServ.consultCooperation(contactInfo));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call cooperate error ", e);
		}
		return epResponse;
	}

	@RequestMapping("/getQRCodeUrl")
	public @ResponseBody
	EPResponse<String> getQRCodeUrl(HttpSession session) {
		EPResponse<String> epResponse = new EPResponse<String>();
		try {
			int employerId = Integer.parseInt(session.getAttribute(
					Constant.EMPLOYERID).toString());
			epResponse.setData(infoCollect.getQRCodePicUrl(employerId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call cooperate error ", e);
		}
		return epResponse;
	}

	@RequestMapping("/getConfig/{key}")
	public @ResponseBody
	EPResponse<List<ConfigCodeName>> getConfig(@PathVariable String key) {
		EPResponse<List<ConfigCodeName>> epResponse = new EPResponse<List<ConfigCodeName>>();
		try {
			epResponse.setData(configServ.getConfigCode(key));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getConfig error ", e);
		}
		return epResponse;
	}

	@RequestMapping(value = "/saveOperLog", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<PFResponse> saveOperLog(HttpServletRequest request,
			@RequestBody EmployerOperationLog log) {
		logger.debug("saveOperLog , logInfo is {} ", log);
		log.setClientIp(SetsUtils.getIpAddr(request));
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			PFResponse pf = trial.saveEmployerOperationLog(log);
			epResponse.setData(pf);
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call cooperate error ", e);
		}
		return epResponse;
	}
	
	@RequestMapping(value = "/getEmployerAuthCode")
	public @ResponseBody
	EPResponse<String> getEmployerAuthCode(HttpSession session) {
		Integer employerId = (Integer)session.getAttribute(Constant.EMPLOYERID);
		logger.debug("getEmployerAuthCode , employerId is {} ", employerId);
		EPResponse<String> epResponse = new EPResponse<String>();
		try {
			Employer employer ;
			if(employerId == null){//没有登录
				 employer = trial.getEmployerByEmail("demo@101test.com", null);
			}else{
				 employer = loginServ.getEmployerByEmployerId(employerId);
			}
			epResponse.setData(employer.getAuthCode());
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getEmployerAuthCode error ", e);
		}
		return epResponse;
	}
	
	/**
	 * 获取登陆账号姓名信息
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getEmployerInfo")
	public @ResponseBody
	EPResponse<Employer> getEmployerInfo(HttpSession session) {
		EPResponse<Employer> cpResponse = new EPResponse<Employer>();
		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			Employer employer = loginServ.getEmployerByEmployerId(emloyerId);
			logger.debug("getEmployerInfo  employerId {} , employer {} ",emloyerId, employer);
			employer.setEmployerPwd(null);
			employer.setEmployerId(null);
			employer.setTicket(null);
			employer.setCreateDate(null);
			employer.setInitFlag(null);
			employer.setAuthCode(null);
			cpResponse.setData(employer);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("getEmployerInfo  error ", e);
			cpResponse.setMessage(e.getMessage());
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return cpResponse;
	}
}
