package com.ailk.sets.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.EPResponse;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.cand.domain.Invitation;
import com.ailk.sets.platform.intf.cand.domain.InvitationForMulti;
import com.ailk.sets.platform.intf.common.Constants;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.EmployerCompanyInfo;
import com.ailk.sets.platform.intf.empl.domain.InvitationMail;
import com.ailk.sets.platform.intf.empl.domain.InvitationMailForMultiPos;
import com.ailk.sets.platform.intf.empl.service.IEmployerTrial;
import com.ailk.sets.platform.intf.empl.service.IInvite;
import com.ailk.sets.platform.intf.empl.service.IPosition;
import com.ailk.sets.platform.intf.exception.PFServiceException;
import com.ailk.sets.platform.intf.model.Page;
import com.ailk.sets.platform.intf.model.invatition.InvitationInfo;
import com.ailk.sets.platform.intf.model.invatition.InvitationValidInfo;
import com.ailk.sets.platform.intf.model.invatition.InviteResult;
import com.ailk.sets.platform.intf.model.param.GetInvitationInfoParam;
import com.ailk.sets.platform.intf.model.position.PositionStatistics;
import com.ailk.sets.utils.EmailUtils;

/**
 * 邀请控制器
 * 
 * @author 毕希研
 * 
 */
@RestController
@RequestMapping("/invitation")
public class InvitationController {
	private static Logger logger = LoggerFactory.getLogger(InvitationController.class);

	@Autowired
	private IInvite iInviteService;
	
	@Autowired
	private IPosition positionServ;
	
	@Autowired
	private IEmployerTrial employerTrial;

	/**
	 * 发送邀请邮件
	 * 
	 * @param param
	 */
	@RequestMapping(value = "/commit", method = RequestMethod.POST)
	public @ResponseBody
	EPResponse<PFResponse> invite(HttpSession session, @RequestBody Invitation invitation) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
            int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
            invitation.setEmployerId(employerId);
            // 提交邀请信息
            epResponse.setData(iInviteService.invite(invitation));
            epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call invite error", e);
		}
		return epResponse;
	}

	/**
	 * 发送邀请邮件 多个测评
	 * 
	 * @param param
	 */
	@RequestMapping(value = "/commitForMulti", method = RequestMethod.POST)
	public @ResponseBody
	EPResponse<InviteResult> inviteForMulti(HttpSession session, @RequestBody InvitationForMulti invitation) {
		EPResponse<InviteResult> epResponse = new EPResponse<InviteResult>();
		try {
			logger.debug("commitForMulti , invitation is {} ", invitation);
            int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
            invitation.setEmployerId(employerId);
            // 做字符串切割 1373+1369=1367+1366=1365+1364
            String[] idsArray = invitation.getMultiPositionIds().split("=");
            
            // 必选
            List<Integer> idList1 = new ArrayList<Integer>();
            if (StringUtils.isNotEmpty(idsArray[0]))
            {
                String[] ids = idsArray[0].split("\\+");
                for (int i = 0; i < ids.length; i++)
                {
                    int id = Integer.parseInt(ids[i]);
                    idList1.add(id);
                }
            }
            
            // 可选
            List<Integer> idList2 = new ArrayList<Integer>();
            if (StringUtils.isNotEmpty(idsArray[1]))
            {
                String[] ids = idsArray[1].split("\\+");
                for (int i = 0; i < ids.length; i++)
                {
                    int id = Integer.parseInt(ids[i]);
                    idList2.add(id);
                }
            }
            
            // 附加
            List<Integer> idList3 = new ArrayList<Integer>();
            if (StringUtils.isNotEmpty(idsArray[2]))
            {
                String[] ids = idsArray[2].split("\\+");
                for (int i = 0; i < ids.length; i++)
                {
                    int id = Integer.parseInt(ids[i]);
                    idList3.add(id);
                }
            }
            invitation.setMustAnswerPositionIds(idList1);
            invitation.setOptionalAnswerPositionIds(idList2);
            invitation.setAddOnPositionIds(idList3);
            // 提交邀请信息
            epResponse.setData(iInviteService.inviteForMulti(invitation));
            epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call commitForMulti error", e);
		}
		return epResponse;
	}
	/**
	 * 获取邮件正文和标题
	 * 
	 * @param session
	 * @param positionId
	 * @return
	 */
	@RequestMapping("/mailInfo/{positionId}")
	public EPResponse<InvitationMail> getMailInfo(HttpSession session, @PathVariable int positionId) {
		EPResponse<InvitationMail> epResponse = new EPResponse<InvitationMail>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(iInviteService.getMailContent(employerId, positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getMailInfo error", e);
		}
		return epResponse;
	}
	
	/**
	 * 获取邮件正文和标题
	 * 
	 * @param session
	 * @param positionId
	 * @return
	 */
	@RequestMapping("/mailInfoForMulti")
	public EPResponse<InvitationMailForMultiPos> getMailInfosForMulti(HttpSession session,@RequestBody String positionIds) {
		EPResponse<InvitationMailForMultiPos> epResponse = new EPResponse<InvitationMailForMultiPos>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			 // 做字符串切割 1373+1369=1367+1366=1365+1364
            String[] idsArray = positionIds.split("=");
			 // 必选
            List<Integer> idList1 = new ArrayList<Integer>();
            if (StringUtils.isNotEmpty(idsArray[0]))
            {
                String[] ids = idsArray[0].split("\\+");
                for (int i = 0; i < ids.length; i++)
                {
                    int id = Integer.parseInt(ids[i]);
                    idList1.add(id);
                }
            }
            
            // 可选
            List<Integer> idList2 = new ArrayList<Integer>();
            if (StringUtils.isNotEmpty(idsArray[1]))
            {
                String[] ids = idsArray[1].split("\\+");
                for (int i = 0; i < ids.length; i++)
                {
                    int id = Integer.parseInt(ids[i]);
                    idList2.add(id);
                }
            }
            
            // 附加
            List<Integer> idList3 = new ArrayList<Integer>();
            if (StringUtils.isNotEmpty(idsArray[2]))
            {
                String[] ids = idsArray[2].split("\\+");
                for (int i = 0; i < ids.length; i++)
                {
                    int id = Integer.parseInt(ids[i]);
                    idList3.add(id);
                }
            }
            List<Integer> idList = new ArrayList<Integer>();
            if (CollectionUtils.isNotEmpty(idList1))
            {
                idList = idList1;
            }else if (CollectionUtils.isNotEmpty(idList2))
            {
                idList = idList2;
            }else if (CollectionUtils.isNotEmpty(idList3))
            {
                idList = idList3;
            }
			epResponse.setData(iInviteService.getMailContents(employerId, idList));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getMailInfosForMulti error", e);
		}
		return epResponse;
	}

	/**
	 * 获取邀请失效列表
	 * 
	 * @return
	 */
	@RequestMapping("/list/{positionId}")
	public @ResponseBody
	EPResponse<List<InvitationInfo>> getList(HttpSession session, @PathVariable int positionId, @ModelAttribute("page") Page page, BindingResult result) {
		EPResponse<List<InvitationInfo>> epResponse = new EPResponse<List<InvitationInfo>>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			GetInvitationInfoParam param = new GetInvitationInfoParam();
			param.setInvitationState(0);
			param.setPositionId(positionId);
			param.setEmployerId(employerId);
			param.setPage(page);
			epResponse.setData(iInviteService.getInvitationInfo(param));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error(" call getList error", e);
		}
		return epResponse;
	}
/*
	*//**
	 * 获取今天的邀请
	 * 
	 * @param param
	 * @return
	 *//*
	@RequestMapping(value = "/getTodayInvitationInfo", method = RequestMethod.POST)
	public @ResponseBody
	EPResponse<List<InvitationInfo>> getTodayInvitationInfo(HttpSession session, @RequestBody GetInvitationInfoParam param) {
		EPResponse<List<InvitationInfo>> epResponse = new EPResponse<List<InvitationInfo>>();
		try {
			DateFormat df = new SimpleDateFormat("yyyyMMdd");
			param.setLowerDate(df.parse(df.format(new Timestamp(System.currentTimeMillis()))));
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			param.setEmployerId(employerId);
			epResponse.setData(iInviteService.getInvitationInfo(param));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error(" call getList error", e);
		}
		return epResponse;
	}*/

	/**
	 * 重新邀请
	 * 
	 * @param positionId
	 * @return
	 */
	@RequestMapping(value = "/reInvite/{testId}")
	public @ResponseBody
	EPResponse<PFResponse> reInvite(HttpSession session, @RequestBody Invitation invitation , @PathVariable long testId) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
            int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
            invitation.setEmployerId(employerId);
            invitation.setTestId(testId);
            epResponse.setData(iInviteService.reInvite(invitation, false));
            epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
				logger.error(" error call reInvite ", e);
		}
		return epResponse;
	}

	/**
	 * 重新邀请带统计信息
	 * 
	 * @param positionId
	 * @return
	 */
	@RequestMapping(value = "/reInviteWithStatistics/{positionId}/{testId}")
	public @ResponseBody
	EPResponse<PositionStatistics> reInviteWithStatistics(HttpSession session ,@PathVariable int positionId , @PathVariable long testId) {
		EPResponse<PositionStatistics> epResponse = new EPResponse<PositionStatistics>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			Invitation invitation = new Invitation();
            invitation.setEmployerId(employerId); //
            invitation.setPositionId(positionId);
            invitation.setTestId(testId);
			epResponse.setData(iInviteService.reInvite(invitation, true));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
				logger.error(" error call reInviteWithStatistics ", e);
		}
		return epResponse;
	}

	/**
	 * 设置失效的邀请数
	 * 
	 * @param positionId
	 * @return
	 */
	@RequestMapping("/delInvitationLog/{positionId}")
	public @ResponseBody
	EPResponse<PFResponse> readInvitationFailed(HttpSession session, @PathVariable int positionId) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(positionServ.delInvitationFailedLog(employerId, positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			if (logger.isDebugEnabled())
				logger.debug(" error call readInvitationFailed ", e);
		}
		return epResponse;
	}

	/**
	 * 失败邀请删除
	 * 
	 * @param positionId
	 * @param invitationIds
	 * @return
	 */
	@RequestMapping(value = "/delFailedInvitation/{positionId}", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<PositionStatistics> delFailedInvitation(HttpSession session, @PathVariable int positionId, @RequestBody List<Integer> invitationIds) {
		EPResponse<PositionStatistics> epResponse = new EPResponse<PositionStatistics>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(iInviteService.delFailedInvitation(employerId, positionId, invitationIds));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			if (logger.isDebugEnabled())
				logger.debug(" error call delFailedInvitation ", e);
		}
		return epResponse;
	}

	/**
	 * 获取已邀请列表
	 * 
	 * @return
	 */
	@RequestMapping("/listInvitation/{positionId}")
	public @ResponseBody
	EPResponse<List<InvitationValidInfo>> getInvitationList(HttpSession session, @PathVariable int positionId, @ModelAttribute("page") Page page, BindingResult result) {
		EPResponse<List<InvitationValidInfo>> epResponse = new EPResponse<List<InvitationValidInfo>>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(iInviteService.getInvitationValidInfo(employerId, positionId, page));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
		}
		return epResponse;
	}

	/**
	 * 获取某个职位的的已邀请数
	 * @param positionId
	 * @return
	 */
	@RequestMapping("/getInvitationNum/{positionId}")
	public @ResponseBody
	EPResponse<Long> getInvitationNum(HttpSession session, @PathVariable int positionId) {
		EPResponse<Long> epResponse = new EPResponse<Long>();
		try {
			int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(iInviteService.getInvitationNum(employerId, positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getInvitationNum error ", e);
		}
		return epResponse;
	}
	
	
	/**
	 * 设置失效的邀请数
	 * @param positionId
	 * @return
	 */
	@RequestMapping("/getCompanyInfo")
	public @ResponseBody
	EPResponse<EmployerCompanyInfo> getCompanyInfo(HttpSession session) {
		EPResponse<EmployerCompanyInfo> epResponse = new EPResponse<EmployerCompanyInfo>();
		try {
			Integer employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(employerTrial.getEmployerCompanyInfo(employerId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error(" error call getCompanyInfo ", e);
		}
		return epResponse;
	}
	
	/**
	 * 设置失效的邀请数
	 * @param positionId
	 * @return
	 */
	@RequestMapping(value="/saveCompanyInfo" , method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<PFResponse> saveCompanyInfo(HttpSession session,@RequestBody EmployerCompanyInfo info) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			Integer employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(employerTrial.saveEmployerCompanyInfo(employerId, info));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error(" error call getCompanyInfo ", e);
		}
		return epResponse;
	}
	
	
	/**
	 * 校验邮箱是否合法
	 * @param session
	 * @param invitation
	 * @return
	 */
	@RequestMapping(value="/checkEmailDomain")
	public @ResponseBody EPResponse<PFResponse> checkEmailDomain(HttpSession session , @RequestParam String email) {
	    EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
	    try {
	        if(EmailUtils.lookupDomain(email))
	        {
	            epResponse.setData(new PFResponse(FuncBaseResponse.SUCCESS,Constants.POSITIVE+""));
	        }else
	        {
	            epResponse.setData(new PFResponse(FuncBaseResponse.SUCCESS,Constants.NEGATIVE+""));
	        }
	        epResponse.setCode(SysBaseResponse.SUCCESS);
	    } catch (Exception e) {
	        epResponse.setCode(SysBaseResponse.ESYSTEM);
	        logger.error(" error call checkEmailDomain ", e);
	    }
	    return epResponse;
	}
	
	/**
	 * 防止页面session失效
	 * @return
	 */
	@RequestMapping(value="/preventSessionValid")
	public @ResponseBody EPResponse<PFResponse> preventSessionInvalid() {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return epResponse;
	}
	
	
}
