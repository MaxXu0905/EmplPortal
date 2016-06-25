package com.ailk.sets.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ailk.sets.common.EPResponse;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.cand.service.IAppService;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.common.PFResponseData;
import com.ailk.sets.platform.intf.domain.MsgCandidateInfo;
import com.ailk.sets.platform.intf.empl.service.IReport;

/**
 * 只读控制器，没有session拦截的请求
 * @author panyl
 *
 */
@RestController
@RequestMapping("/readOnly")
public class ReadOnlyController {

	@Autowired
	private IReport reportServ;
	@Autowired
	private IAppService appService;

	private Logger logger = LoggerFactory.getLogger(ReadOnlyController.class);

	 /**
	  * 获取邀请人状态
	  * @param testId
	  * @param passport
	  * @return
	  */
	@RequestMapping(value = "/getEmployerStatus/{testId}/{passport}")
	public @ResponseBody
	EPResponse<PFResponseData<Integer>> getEmployerStatus(@PathVariable long testId,@PathVariable String passport) {
		EPResponse<PFResponseData<Integer>> epResponse = new EPResponse<PFResponseData<Integer>>();
		try {
			epResponse.setData(reportServ.getEmployerStatus(testId, passport));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call getEmployerStatus ", e);
		}
		return epResponse;
	}
	/**
	 * 保存短信的应聘者信息
	 * @param info
	 * @return
	 */
	@RequestMapping(value = "/saveMsgCandidateInfo"  , method = { RequestMethod.POST })
	public @ResponseBody EPResponse<PFResponse>  saveMsgCandidateInfo(@RequestBody MsgCandidateInfo info){
		logger.debug("saveMsgCandidateInfo  info is {} ", info);
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			epResponse.setData(appService.saveMsgCandidateInfo(info));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call saveMsgCandidateInfo ", e);
		}
		return epResponse;
	}
	
	/**
	 * app心跳
	 * @param status
	 * @return
	 */
	@RequestMapping(value = "/udpateAppHeartBeat/{status}")
	public @ResponseBody EPResponse<PFResponse>  udpateAppHeartBeat(@PathVariable int status){
		logger.debug("udpateAppHeartBeat  status is {} ", status);
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			epResponse.setData(appService.udpateAppHeartBeat(status));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call udpateAppHeartBeat ", e);
		}
		return epResponse;
	}
}
