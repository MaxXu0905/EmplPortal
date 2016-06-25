package com.ailk.sets.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.EPResponse;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.common.Constants;
import com.ailk.sets.platform.intf.domain.DegreeToSkills;
import com.ailk.sets.platform.intf.domain.paper.Paper;
import com.ailk.sets.platform.intf.empl.domain.PaperSet;
import com.ailk.sets.platform.intf.empl.service.IPaper;
import com.ailk.sets.platform.intf.model.PaperInitInfo;
import com.ailk.sets.platform.intf.model.PaperResponse;

/**
 * 试卷controller
 * @author panyl
 *
 */
@RestController
@RequestMapping("/paper")
public class PaperController {
	private static Logger logger = LoggerFactory.getLogger(PaperController.class);

	@Autowired
	private IPaper paperService;

	/**
	 * 获取题库技能信息
	 * @param session
	 * @return
	 *//*
	@RequestMapping("/getQbBasesAndSkills")
	public @ResponseBody
	EPResponse<List<QbBaseModelInfo>> getQbBasesAndSkills(HttpSession session) {
		EPResponse<List<QbBaseModelInfo>> epResponse = new EPResponse<List<QbBaseModelInfo>>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(paperService.getQbBases(employerId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getQbBasesAndSkills error ", e);
		}
		return epResponse;
	}
     */
	
	/**
	 * 获取初始化信息，包括题库技能以及掌握程度
	 * @param session
	 * @return
	 */
	@RequestMapping("/getPaperInitInfo/{seriesId}/{level}")
	public @ResponseBody
	EPResponse<PaperInitInfo> getPaperInitInfo(HttpSession session,@PathVariable int seriesId,@PathVariable int level) {
		EPResponse<PaperInitInfo> epResponse = new EPResponse<PaperInitInfo>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(paperService.getPaperInitInfo(employerId, seriesId,level));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getPaperInitInfo error ", e);
		}
		return epResponse;
	}
	
	

    /**
     * 
     * @param session
     * @return
     */
	@RequestMapping(value = "/analysisSkills" , method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<List<DegreeToSkills>> analysisSkills(HttpSession session, @RequestBody Paper paper) {
		EPResponse<List<DegreeToSkills>> epResponse = new EPResponse<List<DegreeToSkills>>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			paper.setCreateBy(employerId);
			logger.debug("the paperSkillDesc is {} for seriesId {} ", paper.getSkillDesc(), paper.getSeriesId());
			epResponse.setData(paperService.analysisSkills(paper));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call analysisSkills error ", e);
		}
		return epResponse;
	}
    	
	
	/**
	 * 创建试卷
	 * @param session
	 * @param paperSet
	 * @return
	 */
	@RequestMapping(value = "/createPaper" , method={RequestMethod.POST})
	public @ResponseBody
	EPResponse<PaperResponse> createPaper(HttpSession session, @RequestBody PaperSet paperSet) {
		int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
		logger.debug("create paper employerId {} , paperSet {} ", employerId,paperSet);
		EPResponse<PaperResponse> res = new EPResponse<PaperResponse>();
		try {
			Paper paper = paperSet.getPaper();
			paper.setCreateBy(employerId);
			paper.setPrebuilt(Constants.PREBUILT_SELF);
			paper.setTestType(Constants.TEST_TYPE_CLUB);
			res.setData(paperService.createPaper(paperSet));
			res.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			res.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call createPaper error ", e);
		}
		return res;
	}
	
	/**
	 * 创建校招试卷
	 * @param session
	 * @param paperSet
	 * @return
	 */
	@RequestMapping(value = "/createCampusPaper" , method={RequestMethod.POST})
	public @ResponseBody
	EPResponse<PaperResponse> createCampusPaper(HttpSession session, @RequestBody PaperSet paperSet) {
		int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
		logger.debug("create createCampusPaper employerId {} , paperSet {} ", employerId,paperSet);
		EPResponse<PaperResponse> res = new EPResponse<PaperResponse>();
		try {
			Paper paper = paperSet.getPaper();
			paper.setCreateBy(employerId);
			paper.setPrebuilt(Constants.PREBUILT_SELF);
			paper.setTestType(Constants.TEST_TYPE_SCHOOL);
			res.setData(paperService.createCampusPaper(paperSet));
			res.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			res.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call createPaper error ", e);
		}
		return res;
	}

	/**
	 * 创建试卷
	 * 
	 * @param session
	 * @param paperSet
	 * @return
	 */
	@RequestMapping(value = "/createPaperByQbId/{qbId}", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<PaperResponse> createPaperByQbId(HttpSession session, @PathVariable int qbId, @RequestBody Paper paper) {
		int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
		logger.debug("create createPaperByQbId employerId {} , paper {} , qbId "+ qbId, employerId, paper);
		EPResponse<PaperResponse> res = new EPResponse<PaperResponse>();
		try {
			paper.setCreateBy(employerId);
			paper.setPrebuilt(Constants.PREBUILT_SELF);
			paper.setTestType(Constants.TEST_TYPE_CLUB);
			res.setData(paperService.createPaperByQbId(qbId, paper));
			res.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			res.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call createPaperByQbId error ", e);
		}
		return res;
	}

	/**
	 * 创建校招试卷
	 * 
	 * @param session
	 * @param paperSet
	 * @return
	 */
	@RequestMapping(value = "/createCampusPaperByQbId/{qbId}", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<PaperResponse> createCampusPaperByQbId(HttpSession session, @PathVariable int qbId,
			@RequestBody Paper paper) {
		int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
		logger.debug("create createCampusPaperByQbId employerId {} , paperSet {} ,qbId  " + qbId, employerId, paper);
		EPResponse<PaperResponse> res = new EPResponse<PaperResponse>();
		try {
			paper.setCreateBy(employerId);
			paper.setPrebuilt(Constants.PREBUILT_SELF);
			paper.setTestType(Constants.TEST_TYPE_SCHOOL);
			res.setData(paperService.createCampusPaperByQbId(qbId, paper));
			res.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			res.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call createCampusPaperByQbId error ", e);
		}
		return res;
	}
}
