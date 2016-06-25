package com.ailk.sets.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.EPResponse;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.cand.domain.Invitation;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.InvitationMail;
import com.ailk.sets.platform.intf.empl.domain.PaperModel;
import com.ailk.sets.platform.intf.empl.domain.Position;
import com.ailk.sets.platform.intf.empl.service.IEmployerTrial;
import com.ailk.sets.platform.intf.empl.service.IInfoCollect;
import com.ailk.sets.platform.intf.empl.service.IInvite;
import com.ailk.sets.platform.intf.empl.service.IPosition;
import com.ailk.sets.platform.intf.empl.service.IReport;
import com.ailk.sets.platform.intf.model.position.PositionInfo;
import com.ailk.sets.platform.intf.common.Constants;
import com.ailk.sets.utils.EmailUtils;
/**
 * 免登陆体验百一相关接口
 * @author panyl
 *
 */
@Controller
@RequestMapping("/experience")
public class ExperienceController {
	private Logger logger = LoggerFactory.getLogger(ExperienceController.class);

	@Autowired
	private IPosition positionImpl;
	@Autowired
	private IReport reportImpl;
	@Autowired
	private IInvite invite;
	@Autowired
	private IInfoCollect infoCollect;
	@Autowired
	private IEmployerTrial employerTrial;
    @RequestMapping("/getSamplePositionInfo")	
	public @ResponseBody EPResponse<List<PositionInfo>> getSamplePositionInfo(HttpServletRequest request,HttpSession session) throws Exception{
    	 EPResponse<List<PositionInfo>> result = new  EPResponse<List<PositionInfo>>();
		 try{
			 result.setCode(SysBaseResponse.SUCCESS);
			 List<PositionInfo> infos = positionImpl.getPositionInfoOfSample();
			 result.setData(infos);
		 }catch(Exception e){
			 logger.error("error getSamplePositionInfo ", e);
			 result.setCode(SysBaseResponse.ESYSTEM);
		 }
		 return result;
	}
    
    /**
     * 调转到邮件发送页面
     * @param request
     * @param positionId
     * @return
     */
    @RequestMapping("/invite/{positionId}")
	public String jump(HttpServletRequest request, @PathVariable int positionId) {
		request.setAttribute(Constant.POSITIONID, positionId);
		return "post_invite_experience";
	}
    
    /**
	 * 获取邮件正文和标题
	 * @param session
	 * @param positionId
	 * @return
	 */
	@RequestMapping("/getMailInfo/{positionId}")
	public  @ResponseBody EPResponse<InvitationMail> getMailInfo(HttpSession session, @PathVariable int positionId) {
		EPResponse<InvitationMail> epResponse = new EPResponse<InvitationMail>();
		try {
	        if(isSamplePosition(positionId))
			epResponse.setData(invite.getMailContent(-1, positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getMailInfo error", e);
		}
		return epResponse;
	}
	
	/**
	 * 发送邀请邮件
	 * 
	 * @param param
	 */
	@RequestMapping(value = "/invite", method = RequestMethod.POST)
	public @ResponseBody
	EPResponse<PFResponse> invite(HttpSession session, @RequestBody Invitation invitation) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
            // 提交邀请信息
            epResponse.setData(invite.inviteBySampleInvitation(invitation));
            epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call invite error", e);
		}
		return epResponse;
	}
	
	/**
	 * 验证邮箱是否已经正式注册或者是否合法
	 * 
	 * @param param
	 */
	@RequestMapping(value = "/checkMail", method = RequestMethod.POST)
	public @ResponseBody
	EPResponse<PFResponse> checkMail(HttpSession session, @RequestBody Invitation invitation) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
            // 提交邀请信息
            epResponse.setData(employerTrial.supportEmail(invitation.getEmployerEmail()));
            epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call checkMail error", e);
		}
		return epResponse;
	}
	
	@RequestMapping("positionModel/{positionId}")
	public String positionModel(HttpServletRequest request, @PathVariable int positionId) {
		request.setAttribute(Constant.TESTID, positionId);
		request.setAttribute(Constant.PAPER_TYPE, 2);//1testId 2positionId  3paperId
		request.setAttribute("sampleView", 1);
		return "testReport";
	}
	
	/**
	 * 获取试卷报告模板
	 * 
	 * @param pos
	 * @return
	 */
	@RequestMapping(value = "/getReportTemplateByPositionId/{positionId}")
	public @ResponseBody
	EPResponse<PaperModel> getReportTemplateByPositionId(@PathVariable int positionId,
			HttpSession session) {
		logger.debug("getReportTemplateByPositionId by positionId {} ", positionId);
		EPResponse<PaperModel> epResponse = new EPResponse<PaperModel>();
		try {
			if(isSamplePosition(positionId))
			epResponse.setData(reportImpl.getPaperModel(positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("error getReportTemplateByPositionId ", e);
			epResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return epResponse;
	}
	
	
	/**
	 * 是否是体验测评
	 * @param positionId
	 * @return
	 */
	public  boolean isSamplePosition(int positionId){ 
	   Position position =	positionImpl.getPositionByPositionId(positionId);
	   if(position.getSample() == Constants.POSITION_TEST_SAMPLE)
		   return true;
	   logger.warn("the position {} is not sample position ,please check ", positionId);
	   return false;
	}
}
