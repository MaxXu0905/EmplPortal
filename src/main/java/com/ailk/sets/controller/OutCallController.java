package com.ailk.sets.controller;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

import javax.servlet.ServletInputStream;
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
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.domain.InvitationOutInfo;
import com.ailk.sets.platform.intf.domain.PositionOutInfo;
import com.ailk.sets.platform.intf.empl.domain.Position;
import com.ailk.sets.platform.intf.empl.service.IInfoCollect;
import com.ailk.sets.platform.intf.empl.service.IInvite;
import com.ailk.sets.platform.intf.empl.service.IPosition;
import com.ailk.sets.platform.intf.empl.service.IReport;
import com.ailk.sets.platform.intf.model.invatition.InviteResult;

/**
 * 第三方调用接口
 * @author panyl
 *
 */
@Controller
@RequestMapping("/outpage")
public class OutCallController {
	private Logger logger = LoggerFactory.getLogger(OutCallController.class);

	@Autowired
	private IPosition positionImpl;
	@Autowired
	private IReport reportImpl;
	@Autowired
	private IInvite invite;
	@Autowired
	private IInfoCollect infoCollect;
	@RequestMapping("/{from}/addPosition/{tocken}")
	public String addPosition(HttpServletRequest request,  String tocken, String type) throws Exception {
		InputStream ins = request.getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader((ServletInputStream) ins));
		String line = null;
		StringBuilder sb = new StringBuilder();
		while ((line = br.readLine()) != null) {
			sb.append(line);
		}
		logger.debug("the body position param is {} ", sb.toString());
		request.setAttribute("outPositionModel", sb.toString());
		request.setAttribute("outCallType", "ASMRJOB");
		return "create_post";
	}

	@RequestMapping("/createcampus")
	public @ResponseBody Position  createcampus(HttpServletRequest request) {
		request.setAttribute("realtime", System.currentTimeMillis());
		Position p = new Position();
		p.setPositionId(123);
		p.setPositionName("测评名称");
		return p;
	}

	@RequestMapping("/{from}/positionModel/{positionId}/{tocken}")
	public String positionModel(HttpServletRequest request,@PathVariable String from, @PathVariable int positionId) {
		request.setAttribute(Constant.TESTID, positionId);
		request.setAttribute(Constant.PAPER_TYPE, 2);//1testId 2positionId  3paperId
		return "testReport";
	}
    @RequestMapping("/{from}/getPositionList/{tocken}")	
	public @ResponseBody EPResponse<List<PositionOutInfo>> getPositionList(HttpServletRequest request,HttpSession session) throws Exception{
//    	 System.out.println("=====param is " + request.getParameterMap());
    	/* InputStream ins = request.getInputStream();
    	 BufferedReader br = new BufferedReader(new InputStreamReader((ServletInputStream) ins));
 		String line = null;
 		StringBuilder sb = new StringBuilder();
 		while ((line = br.readLine()) != null) {
 			sb.append(line);
 		}
 		logger.debug("the body position param is {} ", sb.toString());*/
    	 EPResponse<List<PositionOutInfo>> result = new  EPResponse<List<PositionOutInfo>>();
		 try{
			 result.setCode(SysBaseResponse.SUCCESS);
			 int employerId = (Integer)session.getAttribute(Constant.EMPLOYERID);
			 List<PositionOutInfo> infos = positionImpl.getPositionOutInfos(employerId);
			 result.setData(infos);
		 }catch(Exception e){
			 logger.error("error getPositionList ", e);
			 result.setCode(SysBaseResponse.EABORT);
		 }
		 return result;
	}
    @RequestMapping(value = "/{from}/invite/{positionId}/{invalidDays}/{token}", method= { RequestMethod.POST })
	public @ResponseBody
	EPResponse<List<InviteResult>> invite(HttpSession session,@PathVariable String from, @PathVariable int positionId,
			@PathVariable int invalidDays, @RequestBody InvitationOutInfo outInfo) {
    	logger.debug("invite for positionId {} , outInfo {} ", positionId, outInfo);
    	EPResponse< List<InviteResult>>  result = new  EPResponse< List<InviteResult>> ();
    	try{
    		 result.setCode(SysBaseResponse.SUCCESS);
			 int employerId = (Integer)session.getAttribute(Constant.EMPLOYERID);
			 outInfo.setEmployerId(employerId);
			 int type = 0;
			 if(from.equals("aimrjob")){
				 type = 1;
			 }else if(from.equals("chinahr")){
				 type = 11;
			 }
			 result.setData(invite.inviteByOutInvitation(type,positionId, invalidDays, outInfo));
    	}catch(Exception e){
			 logger.error("error invite ", e);
			 result.setCode(SysBaseResponse.EABORT);
		 }
    	 return result;
    }
    @RequestMapping(value = "/{from}/setTestResult/{testId}/{status}/{token}")
	public @ResponseBody
	EPResponse setTestResult(HttpSession session,@PathVariable String from, @PathVariable long testId,
			@PathVariable int status) {
    	int employerId = (Integer)session.getAttribute(Constant.EMPLOYERID);
    	EPResponse  result = new  EPResponse ();
    	try{
    		 result.setCode(SysBaseResponse.SUCCESS);
    		 reportImpl.setTestResultOnly(employerId, testId, status);
    	}catch(Exception e){
			 logger.error("error setTestResult ", e);
			 result.setCode(SysBaseResponse.EABORT);
		 }
    	 return result;
    }
    
    @RequestMapping(value = "/{from}/sys/getQRCodePicUrl/{token}")
   	public @ResponseBody
   	EPResponse<String> getQRCodePicUrl(HttpSession session) {
       	int employerId = (Integer)session.getAttribute(Constant.EMPLOYERID);
       	EPResponse<String>  result = new  EPResponse<String> ();
       	try{
       		 result.setCode(SysBaseResponse.SUCCESS);
       		 String url = infoCollect.getQRCodePicUrl(employerId);
       		 result.setData(url);
       	}catch(Exception e){
   			 logger.error("error getQRCodePicUrl ", e);
   			 result.setCode(SysBaseResponse.EABORT);
   		 }
       	 return result;
       }
    
   /* 
	@RequestMapping("/{from}/skillreport/{positionId}/{testId}/{token}")
	public String skillreport(HttpServletRequest request,
			@PathVariable int positionId, @PathVariable int testId) {
		request.setAttribute(Constant.POSITIONID, positionId);
		request.setAttribute(Constant.TESTID, testId);
		return "skill_report";
	}*/

}
