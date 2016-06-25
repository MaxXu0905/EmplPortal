package com.ailk.sets.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
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
import com.ailk.sets.grade.intf.BaseResponse;
import com.ailk.sets.grade.intf.ExportPositionResponse;
import com.ailk.sets.grade.intf.ILoadService;
import com.ailk.sets.grade.intf.LoadTalksResponse;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.domain.ActivityRecruitAddress;
import com.ailk.sets.platform.intf.domain.PositionQuickInfo;
import com.ailk.sets.platform.intf.domain.PositionSeriesCustom;
import com.ailk.sets.platform.intf.empl.domain.EmployerAuthorizationIntf;
import com.ailk.sets.platform.intf.empl.domain.PaperInfo;
import com.ailk.sets.platform.intf.empl.domain.PaperQuestionTypeInfo;
import com.ailk.sets.platform.intf.empl.domain.Position;
import com.ailk.sets.platform.intf.empl.domain.PositionGroupInfo;
import com.ailk.sets.platform.intf.empl.domain.PositionInitInfo;
import com.ailk.sets.platform.intf.empl.domain.PositionSet;
import com.ailk.sets.platform.intf.empl.service.IEmployerTrial;
import com.ailk.sets.platform.intf.empl.service.IPaper;
import com.ailk.sets.platform.intf.empl.service.IPosition;
import com.ailk.sets.platform.intf.empl.service.ISchoolPositionService;
import com.ailk.sets.platform.intf.exception.PFServiceException;
import com.ailk.sets.platform.intf.model.Page;
import com.ailk.sets.platform.intf.model.Question;
import com.ailk.sets.platform.intf.model.campus.CampusRsp;
import com.ailk.sets.platform.intf.model.param.GetReportParam;
import com.ailk.sets.platform.intf.model.param.RandomQuestionParam;
import com.ailk.sets.platform.intf.model.position.PosResponse;
import com.ailk.sets.platform.intf.model.position.PositionInfo;
import com.ailk.sets.platform.intf.model.position.PositionPaperInfo;
import com.ailk.sets.platform.intf.model.question.Extras;
import com.ailk.sets.utils.FileUtils;
import com.google.gson.Gson;

/**
 * 职位控制器
 * 
 * @author 毕希研
 */
@RestController
@RequestMapping("/position")
public class PositionController {

	private static Logger logger = LoggerFactory
			.getLogger(PositionController.class);

	@Autowired
	private IPosition positionServ;

	@Autowired
	private ILoadService loadService;

	@Autowired
	private IPaper paperService;

	@Autowired
	private ISchoolPositionService schoolPositionServ;

	@Autowired
	private IEmployerTrial employerTrial;

	private static final int POSITION_REPORT_EXPIRES = 60000;

	private static class PositionReportValue {
		private long timestamp;
		private byte[] data;
	}

	private static final Map<String, PositionReportValue> positionReportMap = new ConcurrentHashMap<String, PositionReportValue>();

	/**
	 * 获取职位详细信息
	 * 
	 * @param session
	 * @param positionId
	 * @return
	 */
	@RequestMapping("/getPosition/{positionId}")
	public @ResponseBody
	EPResponse<PositionSet> getPositionSet(HttpSession session,
			@PathVariable int positionId) {
		EPResponse<PositionSet> epResponse = new EPResponse<PositionSet>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			PFResponse pfResponse = positionServ.ownPosition(employerId,
					positionId);
			if (pfResponse.getCode().equals(FuncBaseResponse.SUCCESS))
				epResponse.setData(positionServ.getPositionInfo(positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getPosition error ", e);
		}
		return epResponse;
	}

	/**
	 * 获取初始化创建招聘职位页面信息
	 * 
	 * @return
	 */
	/*
	 * @RequestMapping("/init") public @ResponseBody EPResponse<Map<String,
	 * List<ConfigCodeName>>> getInitInfo() { EPResponse<Map<String,
	 * List<ConfigCodeName>>> epResponse = new EPResponse<Map<String,
	 * List<ConfigCodeName>>>(); try { Map<String, List<ConfigCodeName>> map =
	 * new HashMap<String, List<ConfigCodeName>>();
	 * map.put(ConfigCodeType.POSITION_LEVEL,
	 * configServ.getConfigCode(ConfigCodeType.POSITION_LEVEL));
	 * map.put(ConfigCodeType.POSITION_LANGUAGE,
	 * configServ.getConfigCode(ConfigCodeType.POSITION_LANGUAGE));
	 * map.put(ConfigCodeType.PROGRAM_LANGUAGE,
	 * configServ.getConfigCode(ConfigCodeType.PROGRAM_LANGUAGE));
	 * epResponse.setData(map); epResponse.setCode(SysBaseResponse.SUCCESS); }
	 * catch (Exception e) { epResponse.setCode(SysBaseResponse.ESYSTEM);
	 * logger.error("error call getInitInfo", e); } return epResponse; }
	 */

	/**
	 * 获取初始化职位序列信息
	 * 
	 * @return
	 */
	@RequestMapping("/initInfo")
	public @ResponseBody
	EPResponse<PositionInitInfo> getPositionInitInfo(HttpSession session) {
		EPResponse<PositionInitInfo> epResponse = new EPResponse<PositionInitInfo>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			logger.debug("getPositionInitInfo for employerId {} ", employerId);
			PositionInitInfo info = positionServ
					.getPositionInitInfo(employerId);
			epResponse.setData(info);
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call getPositionInitInfo", e);
		}
		return epResponse;
	}

	/**
	 * 获取试卷信息
	 * 
	 * @return
	 */
	@RequestMapping("/getPapers/{seriesId}/{level}/{testType}")
	public @ResponseBody
	EPResponse<List<PaperInfo>> getPapers(HttpSession session,
			@PathVariable int seriesId, @PathVariable int level,
			@PathVariable int testType) {
		EPResponse<List<PaperInfo>> epResponse = new EPResponse<List<PaperInfo>>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			logger.debug("getPapers for seriesId {} ,level {} ", seriesId,
					level);
			List<PaperInfo> infos = paperService.getPaperInfo(seriesId, level,
					employerId, testType);
			epResponse.setData(infos);
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call getPositionInitInfo", e);
		}
		return epResponse;
	}

	/**
	 * 保存职位
	 * 
	 * @param session
	 * @param position
	 * @return
	 */
	@RequestMapping(value = "/createPosition", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<PosResponse> createPosition(HttpSession session,
			@RequestBody Position position) {
		EPResponse<PosResponse> epResponse = new EPResponse<PosResponse>();
		try {
			logger.debug("create position {} ", position);
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			position.setEmployerId(employerId);
			epResponse.setData(positionServ.createPosition(position));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			logger.error("error createPosition ", e);
		}
		return epResponse;
	}

	/*
	 * @RequestMapping("/getPosDescription/{positionLang}/{level}") public
	 * 
	 * @ResponseBody EPResponse<String> getPosDescription(@PathVariable String
	 * positionLang,
	 * 
	 * @PathVariable int level) { EPResponse<String> epResponse = new
	 * EPResponse<String>(); try {
	 * epResponse.setData(positionServ.getPosRequireDesc(positionLang, level));
	 * epResponse.setCode(SysBaseResponse.SUCCESS); } catch (PFServiceException
	 * e) { epResponse.setCode(SysBaseResponse.ESYSTEM);
	 * logger.error("error call getPosDescription", e); } return epResponse; }
	 */

	/**
	 * 获取问题
	 * 
	 * @param session
	 * @param pos
	 */
	@RequestMapping(value = "/recommendQuestion/{type}", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<Question> recommendQuestion(@RequestBody Position pos,
			@PathVariable String type, HttpSession session) {
		EPResponse<Question> epResponse = new EPResponse<Question>();
		try {
			RandomQuestionParam param = new RandomQuestionParam();
			param.setCategory(type);
			param.setPosition(pos);
			Extras extras = (Extras) session
					.getAttribute(Constant.PAPERQUESTIONTOSKILLS);
			param.setSkillIds((extras == null) ? null : extras.getSkillIds());
			epResponse.setData(positionServ.getRandomQuestion(param));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			if (logger.isDebugEnabled())
				logger.error("call recommendQuestion error ", e);
		}
		return epResponse;
	}

	/**
	 * 获取问题历史
	 */
	/*
	 * @RequestMapping(value = "/questionHistory/{type}", method = {
	 * RequestMethod.POST }) public @ResponseBody EPResponse<List<Question>>
	 * getHistory(HttpSession session,
	 * 
	 * @ModelAttribute("pos") Position pos,
	 * 
	 * @ModelAttribute("page") Page page, @PathVariable String type,
	 * BindingResult result) { EPResponse<List<Question>> epResponse = new
	 * EPResponse<List<Question>>(); try { int employerId = (Integer) session
	 * .getAttribute(Constant.EMPLOYERID);
	 * epResponse.setData(positionServ.getHistory(employerId, pos, type, page));
	 * epResponse.setCode(SysBaseResponse.SUCCESS); } catch (Exception e) {
	 * epResponse.setCode(SysBaseResponse.ESYSTEM);
	 * epResponse.setMessage(e.getMessage()); if (logger.isDebugEnabled())
	 * e.printStackTrace(); } return epResponse; }
	 */

	/**
	 * 删除问题历史
	 * 
	 * @param session
	 * @param qId
	 */
	/*
	 * @RequestMapping("/delHistory/{type}/{qId}") public @ResponseBody
	 * EPResponse<PFResponse> delHistory(HttpSession session,
	 * 
	 * @PathVariable String type, @PathVariable Long qId) {
	 * EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>(); try {
	 * int employerId = (Integer) session .getAttribute(Constant.EMPLOYERID);
	 * epResponse.setData(positionServ.delQuesHistory(employerId, qId, type +
	 * "")); epResponse.setCode(SysBaseResponse.SUCCESS); } catch (Exception e)
	 * { epResponse.setCode(SysBaseResponse.ESYSTEM);
	 * epResponse.setMessage(e.getMessage()); if (logger.isDebugEnabled())
	 * e.printStackTrace(); } return epResponse; }
	 */

	/**
	 * 提交职位要求信息
	 */
	/*
	 * @RequestMapping(value = "/commit", method = { RequestMethod.POST })
	 * public @ResponseBody EPResponse<PosResponse> commitPosRequire(HttpSession
	 * session, @RequestBody PositionSet positionSet) { EPResponse<PosResponse>
	 * epResponse = new EPResponse<PosResponse>(); try { int employerId =
	 * (Integer) session.getAttribute(Constant.EMPLOYERID);
	 * positionSet.getPosition().setEmployerId(employerId);
	 * epResponse.setData(positionServ.commitPosition(positionSet));
	 * epResponse.setCode(SysBaseResponse.SUCCESS); } catch (Exception e) {
	 * epResponse.setCode(SysBaseResponse.ESYSTEM);
	 * epResponse.setMessage(e.getMessage()); if (logger.isDebugEnabled())
	 * logger.debug("error commitPosition ", e); } return epResponse; }
	 */
	/**
	 * 获取已经创建过的职位信息
	 * 
	 * @param employerId
	 */
	@RequestMapping("/getPositionInfoWithPaperCount")
	public @ResponseBody
	EPResponse<List<PositionPaperInfo>> getPositionInfoWithPaperCount(HttpSession session,
			@RequestBody Page page) {
		EPResponse<List<PositionPaperInfo>> epResponse = new EPResponse<List<PositionPaperInfo>>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(positionServ.getPositionInfoWithPaperCount(employerId, page));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("call getPositionInfoWithPaperCount error", e);
			epResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return epResponse;
	}

	/**
	 * 获取已经创建过的职位信息
	 * 
	 * @param employerId
	 */
	@RequestMapping("/positionPage")
	public @ResponseBody
	EPResponse<List<PositionInfo>> positionPage(HttpSession session,
			@ModelAttribute("page") Page page, BindingResult result) {
		EPResponse<List<PositionInfo>> epResponse = new EPResponse<List<PositionInfo>>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(positionServ.getPositionInfo(employerId, page));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("call getPositions error", e);
			epResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return epResponse;
	}
	@RequestMapping("/getPositionPaperInfo/{positionId}")
	public @ResponseBody
	EPResponse<List<PaperQuestionTypeInfo>> getPositionPaperInfo(
			HttpSession session, @PathVariable int positionId) {
		EPResponse<List<PaperQuestionTypeInfo>> epResponse = new EPResponse<List<PaperQuestionTypeInfo>>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			logger.debug(
					"getPositionPaperInfo for positionId {}, employer {} ",
					positionId, employerId);
			epResponse.setData(paperService
					.getPaperQuestionTypeInfo(positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("call getPositions error", e);
			epResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return epResponse;
	}

	/**
	 * 根据职位id获取职位信息
	 * 
	 * @param session
	 * @param positionId
	 * @return
	 */
	@RequestMapping("/get/{positionId}")
	public @ResponseBody
	EPResponse<PositionInfo> getPosition(HttpSession session,
			@PathVariable int positionId, @RequestParam String activityPassport) {
		EPResponse<PositionInfo> epResponse = new EPResponse<PositionInfo>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(positionServ.getPositionInfo(positionId,
					employerId, 0, activityPassport));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
		}
		return epResponse;
	}

	/**
	 * 关闭职位
	 * 
	 * @return
	 */
	/*
	 * @RequestMapping("/close/{positionId}") public @ResponseBody
	 * EPResponse<PFResponse> closePosition(@PathVariable int positionId,
	 * HttpSession session) { EPResponse<PFResponse> epResponse = new
	 * EPResponse<PFResponse>(); try { int employerId = (Integer) session
	 * .getAttribute(Constant.EMPLOYERID); PFResponse pfResponse =
	 * positionServ.ownPosition(employerId, positionId); if
	 * (pfResponse.equals(FuncBaseResponse.SUCCESS))
	 * epResponse.setData(positionServ.closePosition(positionId)); else
	 * epResponse.setData(pfResponse);
	 * epResponse.setCode(SysBaseResponse.SUCCESS); } catch (PFServiceException
	 * e) { epResponse.setCode(SysBaseResponse.ESYSTEM);
	 * logger.error("call close position ", e); } return epResponse; }
	 */
	/**
	 * 获取学校考试地点信号强度列表
	 * 
	 * @param session
	 * @param activity
	 * @return
	 */
	@RequestMapping(value = "/getCampusSignalList", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<List<ActivityRecruitAddress>> getCampusSignalList(
			HttpSession session, @RequestBody ActivityRecruitAddress address) {
		EPResponse<List<ActivityRecruitAddress>> epResponse = new EPResponse<List<ActivityRecruitAddress>>();
		try {
			logger.debug("get CampusSignalList city:{} , college:{}",
					address.getCity(), address.getCollege());
			epResponse.setData(schoolPositionServ
					.getActivityAddressList(address));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			if (logger.isDebugEnabled())
				logger.debug("error getCampusSignalList ", e);
		}
		return epResponse;
	}

	/**
	 * 保存校招职位
	 * 
	 * @param session
	 * @param position
	 * @return
	 */
	@RequestMapping(value = "/createCampus", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<CampusRsp> createCampus(HttpSession session,
			@RequestBody Position position) {
		EPResponse<CampusRsp> epResponse = new EPResponse<CampusRsp>();
		try {
			logger.debug("create campus {} ", position);
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			position.setEmployerId(employerId);
			epResponse.setData(schoolPositionServ
					.createCampusPosition(position));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			if (logger.isDebugEnabled())
				logger.debug("error createCampus ", e);
		}
		return epResponse;
	}

	
	/**
	 * 保存校招职位
	 * 
	 * @param session
	 * @param position
	 * @return
	 */
	@RequestMapping(value = "/createGroupPosition", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<CampusRsp> createGroupPosition(HttpSession session,
			@RequestBody PositionGroupInfo position) {
		EPResponse<CampusRsp> epResponse = new EPResponse<CampusRsp>();
		try {
			logger.debug("create createGroupPosition {} ", position);
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			position.setEmployerId(employerId);
			epResponse.setData(schoolPositionServ
					.createGroupPosition(position));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			logger.error("error createGroupPosition ", e);
		}
		return epResponse;
	}
	/**
	 * 查询校招职位
	 * 
	 * @param session
	 * @param position
	 * @return
	 */
	@RequestMapping(value = "/queryCampus/{positionId}", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<Position> queryCampus(HttpSession session,
			@PathVariable Integer positionId) {
		EPResponse<Position> epResponse = new EPResponse<Position>();
		try {
			logger.debug("query campus where positionId={} ", positionId);
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(schoolPositionServ.queryCampus(employerId,
					positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			if (logger.isDebugEnabled())
				logger.debug("error createCampus ", e);
		}
		return epResponse;
	}

	/**
	 * 导入宣讲会Excel
	 * 
	 * @param request
	 * @param res
	 * @throws IOException
	 */
	@RequestMapping(value = "/loadTalks", method = { RequestMethod.POST })
	public void loadTalks(HttpServletRequest request, HttpServletResponse res)
			throws IOException {
		EPResponse<LoadTalksResponse> response = new EPResponse<LoadTalksResponse>();
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		if (isMultipart) {
			try {
				FileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				List<FileItem> items = upload.parseRequest(request);
				for (FileItem item : items) {
					if (item.isFormField()) { // 文本
					} else { // 文件
						String filename = item.getName();
						logger.debug("loadActivities {}...", filename);
						response.setData(loadService.loadTalks(FileUtils
								.getBytes(item.getInputStream())));
					}
				}
				response.setCode(SysBaseResponse.SUCCESS);
			} catch (Exception e) {
				response.setCode(SysBaseResponse.ESYSTEM);
				response.setMessage(e.getMessage());
				if (logger.isDebugEnabled())
					logger.debug("load loadActivities error", e);
			}
		}
		res.setContentType("text/html;charset=UTF-8");
		res.getWriter().write(new Gson().toJson(response));
	}

	/**
	 * 查询校招职位
	 * 
	 * @param session
	 * @param position
	 * @return
	 */
	@RequestMapping(value = "/getCampusPassport/{positionId}", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<CampusRsp> getCampusPassport(HttpSession session,
			@PathVariable Integer positionId) {
		EPResponse<CampusRsp> epResponse = new EPResponse<CampusRsp>();
		try {
			logger.debug("get Campus Position Passport where positionId={} ",
					positionId);
			epResponse
					.setData(schoolPositionServ.getCampusPassport(positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			if (logger.isDebugEnabled())
				logger.debug("get Campus Position Passport error ", e);
		}
		return epResponse;
	}

	/**
	 * 查询校招职位
	 * 
	 * @param session
	 * @param position
	 * @return
	 */
	@RequestMapping(value = "/refreshCampusPassport/{positionId}", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<CampusRsp> refreshCampusPassport(HttpSession session,
			@PathVariable Integer positionId) {
		EPResponse<CampusRsp> epResponse = new EPResponse<CampusRsp>();
		try {
			logger.debug(
					"refresh Campus Position Passport where positionId={} ",
					positionId);
			epResponse.setData(schoolPositionServ
					.refreshCampusPassport(positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			if (logger.isDebugEnabled())
				logger.debug("refresh Campus Position Passport", e);
		}
		return epResponse;
	}

	/**
	 * 获取定制测评信息
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getPositionSeriesCustom")
	public @ResponseBody
	EPResponse<List<PositionSeriesCustom>> getPositionSeriesCustom(
			HttpSession session) {
		EPResponse<List<PositionSeriesCustom>> epResponse = new EPResponse<List<PositionSeriesCustom>>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			logger.debug("getPositionSeriesCustom employerId= {} ", employerId);
			epResponse
					.setData(positionServ.getPositionSeriesCustom(employerId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			logger.error("error getPositionSeriesCustom ", e);
		}
		return epResponse;
	}

	/**
	 * 创建快速定制测评
	 * 
	 * @param session
	 * @param paperIds
	 * @return
	 */
	@RequestMapping(value = "/createPositionByCustom", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<PFResponse> createPositionByCustom(HttpSession session,
			@RequestBody PositionQuickInfo quickInfo) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			logger.debug(
					"createPositionByCustom employerId= {}, paperIds {}  ",
					employerId, quickInfo);
			epResponse.setData(positionServ.createPositionByCustom(employerId,
					quickInfo));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			logger.error("error createPositionByCustom ", e);
		}
		return epResponse;
	}

	/**
	 * 导出职位的报告信息
	 * 
	 * @param session
	 * @param testId
	 * @return
	 */
	@RequestMapping("/exportPosition")
	@ResponseBody
	public EPResponse<String> exportPosition(HttpSession session,
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestBody final GetReportParam param
	        ) {
		EPResponse<String> epResponse = new EPResponse<String>();
		final long timestamp = System.currentTimeMillis();

		Thread thread = new Thread() {
			@Override
			public void run() {
				String id = this.getId() + "-" + timestamp;

				try {
					ExportPositionResponse exportPositionResponse = loadService
							.exportPosition(param);
					if (exportPositionResponse.getErrorCode() != BaseResponse.SUCCESS) {
						positionReportMap.remove(id);
						logger.error("报告导出异常："
								+ exportPositionResponse.getErrorDesc());
						return;
					}

					PositionReportValue value = positionReportMap.get(id);
					value.timestamp = System.currentTimeMillis();
					value.data = exportPositionResponse.getData();
				} catch (Throwable e) {
					positionReportMap.remove(id);
					logger.error("error call exportPosition", e);
				}
			}
		};

		String id = thread.getId() + "-" + timestamp;
		PositionReportValue value = new PositionReportValue();
		positionReportMap.put(id, value);

		thread.start();

		epResponse.setData(id);
		return epResponse;
	}

	/**
	 * 检查职位报告是否生成完毕
	 * 
	 * @param session
	 * @param id
	 * @return
	 */
	@RequestMapping("/checkPosition/{id}")
	@ResponseBody
	public EPResponse<Boolean> checkPosition(HttpSession session,
			@PathVariable String id, HttpServletRequest request,
			HttpServletResponse response) {
		EPResponse<Boolean> epResponse = new EPResponse<Boolean>();
		PositionReportValue positionReportValue = positionReportMap.get(id);
		if (positionReportValue == null) {
			epResponse.setCode(SysBaseResponse.ENOENT);
			epResponse.setMessage("没有对应的报告，id=" + id);
			return epResponse;
		}

		if (positionReportValue.timestamp == 0) {
			epResponse.setData(false);
			return epResponse;
		}

		epResponse.setData(true);
		return epResponse;
	}

	/**
	 * 下载职位的报告信息
	 * 
	 * @param session
	 * @param testId
	 * @return
	 */
	@RequestMapping("/downloadPosition/{id}/{positionName}.xls")
	public void downloadPosition(HttpSession session, @PathVariable String id,
			HttpServletRequest request, HttpServletResponse response) {
		try {
			PositionReportValue positionReportValue = positionReportMap.get(id);
			if (positionReportValue == null) {
				logger.error("报告不存在或已超时，id=" + id);
				return;
			}

			OutputStream os = response.getOutputStream();
			response.reset();
			response.setHeader("Content-Disposition", "attachment");
			response.setContentType("application/octet-stream; charset=utf-8");
			response.setContentLength(positionReportValue.data.length);
			os.write(positionReportValue.data);
			os.flush();
		} catch (Exception e) {
			logger.error("error call downloadPosition", e);
		}
	}

	/**
	 *委托 验证邮箱是否已经正式注册或者是否合法
	 * 
	 * @param param
	 */
	@RequestMapping(value = "/checkAuthorEmail", method = RequestMethod.POST)
	public @ResponseBody
	EPResponse<PFResponse> checkAuthorEmail(HttpSession session,
			@RequestBody EmployerAuthorizationIntf auth) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			// 提交邀请信息
			epResponse.setData(positionServ.checkAuthorEmail(employerId,
					auth.getEmailGranted()));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call checkAuthorEmail error", e);
		}
		return epResponse;
	}

	/**
	 *委托 邀请加入
	 * 
	 * @param param
	 */
	@RequestMapping(value = "/inviteEmployerJoin", method = RequestMethod.POST)
	public @ResponseBody
	EPResponse<PFResponse> inviteEmployerJoin(
			@RequestBody EmployerAuthorizationIntf employerAuth,
			HttpSession session) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			employerAuth.setEmployerId(employerId);
			epResponse.setData(employerTrial.inviteEmployerJoin(employerAuth));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
			logger.error("error activite employer ", e);
		}
		return epResponse;
	}

	@Scheduled(initialDelay = POSITION_REPORT_EXPIRES, fixedRate = POSITION_REPORT_EXPIRES)
	public void checkPositionReport() {
		try {
			Iterator<Entry<String, PositionReportValue>> iter = positionReportMap
					.entrySet().iterator();
			while (iter.hasNext()) {
				Entry<String, PositionReportValue> entry = iter.next();
				long timestamp = entry.getValue().timestamp;
				if (timestamp > 0
						&& timestamp + POSITION_REPORT_EXPIRES < System
								.currentTimeMillis()) {
					iter.remove();
				}
			}
		} catch (Throwable e) {
			logger.error("", e);
		}
	}

}
