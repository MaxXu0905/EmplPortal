package com.ailk.sets.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.List;

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
import com.ailk.sets.grade.intf.ExportErrorQbResponse;
import com.ailk.sets.grade.intf.ExportQbResponse;
import com.ailk.sets.grade.intf.GetGroupResponse;
import com.ailk.sets.grade.intf.GetQuestionResponse;
import com.ailk.sets.grade.intf.GetSuggestTimeRequest;
import com.ailk.sets.grade.intf.GetSuggestTimeResponse;
import com.ailk.sets.grade.intf.HasErrorQbResponse;
import com.ailk.sets.grade.intf.ILoadService;
import com.ailk.sets.grade.intf.LoadRequest;
import com.ailk.sets.grade.intf.LoadResponse;
import com.ailk.sets.grade.intf.LoadWordResponse;
import com.ailk.sets.platform.intf.cand.service.ICandidateTest;
import com.ailk.sets.platform.intf.common.Constants;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.domain.PFCountInfo;
import com.ailk.sets.platform.intf.empl.service.IQbBase;
import com.ailk.sets.platform.intf.exception.PFServiceException;
import com.ailk.sets.platform.intf.model.Page;
import com.ailk.sets.platform.intf.model.feedback.CandidateTestFeedback;
import com.ailk.sets.platform.intf.model.feedback.FeedbackCountInfo;
import com.ailk.sets.platform.intf.model.param.GetQbBasesParam;
import com.ailk.sets.platform.intf.model.param.GetQbGroupsParam;
import com.ailk.sets.platform.intf.model.param.GetQbQuestionsParam;
import com.ailk.sets.platform.intf.model.qb.QbBase;
import com.ailk.sets.platform.intf.model.qb.QbBaseInfo;
import com.ailk.sets.platform.intf.model.qb.QbProLangInfo;
import com.ailk.sets.platform.intf.model.qb.QbSkill;
import com.ailk.sets.platform.intf.model.qb.QbSkillInfo;
import com.ailk.sets.platform.intf.model.qb.QbSkillResponse;
import com.ailk.sets.platform.intf.model.qb.QbSkillStatistics;
import com.ailk.sets.platform.intf.model.question.QbGroupInfo;
import com.ailk.sets.platform.intf.model.question.QbQuestionInfo;
import com.google.gson.Gson;

/**
 * 题库管理控制器
 * 
 * @author 毕希研
 * 
 */
@RestController
@RequestMapping("/qbBase")
public class QbBaseController {

	private Logger logger = LoggerFactory.getLogger(QbBaseController.class);

	@Autowired
	private IQbBase qbBaseServ;

	@Autowired
	private ILoadService loadService;

	@Autowired
	private ICandidateTest candidateTest;

	/**
	 * 新建题库
	 * 
	 * @param session
	 * @param qbBase
	 * @return
	 */
	@RequestMapping(value = "/createQbBase", method = RequestMethod.POST)
	public @ResponseBody EPResponse<PFResponse> createQbBase(
			HttpSession session, @RequestBody QbBase qbBase) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			qbBase.setCreateBy(emloyerId);
			if (qbBase.getCategory() == null)// 默认题库为技能
				qbBase.setCategory(Constants.CATEGORY_SKILL);
			epResponse.setData(qbBaseServ.createQbBase(qbBase));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call createQbBase error", e);
		}

		return epResponse;
	}

	/**
	 * 获取题库列表
	 * 
	 * @param session
	 * @param page
	 * @return
	 */
	@RequestMapping(value = "/getQbBases", method = RequestMethod.POST)
	public @ResponseBody EPResponse<List<QbBaseInfo>> getQbBases(
			HttpSession session, @RequestBody GetQbBasesParam param) {
		EPResponse<List<QbBaseInfo>> epResponse = new EPResponse<List<QbBaseInfo>>();

		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			param.setEmployerId(employerId);
			epResponse.setData(qbBaseServ.getQbBases(param));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getQbBases error", e);
		}

		return epResponse;
	}

	/**
	 * 获取题库列表总数
	 * 
	 * @param session
	 * @param page
	 * @return
	 */
	@RequestMapping(value = "/getQbBasesCount", method = RequestMethod.POST)
	public @ResponseBody EPResponse<PFCountInfo> getQbBasesCount(
			HttpSession session, @RequestBody GetQbBasesParam param) {
		EPResponse<PFCountInfo> epResponse = new EPResponse<PFCountInfo>();

		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			param.setEmployerId(employerId);
			epResponse.setData(qbBaseServ.getQbBasesCount(param));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getQbBasesCount error", e);
		}

		return epResponse;
	}

	/**
	 * 获取面试题组列表
	 * 
	 * @param session
	 * @param page
	 * @return
	 */
	@RequestMapping(value = "/getQbGroups", method = RequestMethod.POST)
	public @ResponseBody EPResponse<List<QbGroupInfo>> getQbGroups(
			HttpSession session, @RequestBody GetQbGroupsParam param) {
		EPResponse<List<QbGroupInfo>> epResponse = new EPResponse<List<QbGroupInfo>>();

		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(qbBaseServ.getQbGroups(employerId, param));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getQbGroups error", e);
		}

		return epResponse;
	}

	/**
	 * 获取题库题目信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getQbQuestionsCount", method = RequestMethod.POST)
	public @ResponseBody EPResponse<PFCountInfo> getQbQuestionsCount(
			HttpSession session, @RequestBody GetQbQuestionsParam param) {
		EPResponse<PFCountInfo> epResponse = new EPResponse<PFCountInfo>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse
					.setData(qbBaseServ.getQbQuestionsCount(emloyerId, param));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getQbQuestions error", e);
		}

		return epResponse;
	}

	/**
	 * 获取题库题目总数信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getQbQuestions", method = RequestMethod.POST)
	public @ResponseBody EPResponse<List<QbQuestionInfo>> getQbQuestions(
			HttpSession session, @RequestBody GetQbQuestionsParam param) {
		EPResponse<List<QbQuestionInfo>> epResponse = new EPResponse<List<QbQuestionInfo>>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(qbBaseServ.getQbQuestions(emloyerId, param));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getQbQuestions error", e);
		}

		return epResponse;
	}

	/**
	 * 获取建议时间
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getSuggestTime", method = RequestMethod.POST)
	public @ResponseBody EPResponse<GetSuggestTimeResponse> getSuggestTime(
			@RequestBody GetSuggestTimeRequest request) {
		EPResponse<GetSuggestTimeResponse> epResponse = new EPResponse<GetSuggestTimeResponse>();

		try {
			epResponse.setData(loadService.getSuggestTime(request));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call getSuggestTime", e);
		}

		return epResponse;
	}

	/**
	 * 导入题目
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/importQuestion/{qbId}/{similarityLimit}", method = RequestMethod.POST)
	public void importQuestion(HttpServletRequest request,
			HttpServletResponse response, @PathVariable int qbId,
			@PathVariable int similarityLimit) throws IOException {
		HttpSession session = request.getSession();
		int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
		EPResponse<LoadResponse> epResponse = new EPResponse<LoadResponse>();
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);

		if (isMultipart) {
			try {
				FileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				List<FileItem> items = upload.parseRequest(request);
				for (FileItem item : items) {
					if (item.isFormField()) // 文本
						continue;

					String filename = item.getName();
					logger.debug("{} upload begin ...", filename);
					ByteArrayOutputStream baos = new ByteArrayOutputStream();
					byte[] buff = new byte[1024 * 10];
					InputStream is = item.getInputStream();
					int len = 0;
					while ((len = is.read(buff)) != -1)
						baos.write(buff, 0, len);
					byte[] param = baos.toByteArray();
					epResponse.setData(loadService.loadFile(emloyerId, qbId,
							similarityLimit / 100.0, true, param));
				}
			} catch (Exception e) {
				epResponse.setCode(SysBaseResponse.ESYSTEM);
				logger.error("error call importQuestion", e);
			}
		}

		response.getWriter().write(new Gson().toJson(epResponse));
	}

	/**
	 * 导入试卷
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/importPaper/{qbName}/{testType}", method = RequestMethod.POST)
	public void importPaper(HttpServletRequest request,
			HttpServletResponse response, @PathVariable String qbName,
			@PathVariable int testType) throws IOException {
		qbName = URLDecoder.decode(qbName, "UTF-8");
		HttpSession session = request.getSession();
		int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
		EPResponse<LoadResponse> epResponse = new EPResponse<LoadResponse>();
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);

		if (isMultipart) {
			try {
				FileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				List<FileItem> items = upload.parseRequest(request);
				for (FileItem item : items) {
					if (item.isFormField()) // 文本
						continue;

					String filename = item.getName();
					logger.debug("{} upload begin ...", filename);
					ByteArrayOutputStream baos = new ByteArrayOutputStream();
					byte[] buff = new byte[1024 * 10];
					InputStream is = item.getInputStream();
					int len = 0;
					while ((len = is.read(buff)) != -1)
						baos.write(buff, 0, len);
					byte[] param = baos.toByteArray();
					epResponse.setData(loadService.loadPaper(emloyerId, qbName,
							true, testType, param));
				}
			} catch (Exception e) {
				epResponse.setCode(SysBaseResponse.ESYSTEM);
				logger.error("error call importPaper", e);
			}
		}

		response.getWriter().write(new Gson().toJson(epResponse));
	}

	/**
	 * 导入Word试卷
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/importPaperWord/{testType}", method = RequestMethod.POST)
	public void importPaperWord(HttpServletRequest request,
			HttpServletResponse response, @PathVariable int testType)
			throws IOException {
		HttpSession session = request.getSession();
		int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
		EPResponse<LoadWordResponse> epResponse = new EPResponse<LoadWordResponse>();
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);

		if (isMultipart) {
			try {
				FileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				List<FileItem> items = upload.parseRequest(request);
				for (FileItem item : items) {
					if (item.isFormField()) // 文本
						continue;

					String filename = item.getName();
					logger.debug("{} upload begin ...", filename);
					ByteArrayOutputStream baos = new ByteArrayOutputStream();
					byte[] buff = new byte[1024 * 10];
					InputStream is = item.getInputStream();
					int len = 0;
					while ((len = is.read(buff)) != -1)
						baos.write(buff, 0, len);
					byte[] param = baos.toByteArray();
					epResponse.setData(loadService.loadPaperWord(emloyerId,
							testType, param));
				}
			} catch (Exception e) {
				epResponse.setCode(SysBaseResponse.ESYSTEM);
				logger.error("error call importPaperWord", e);
			}
		}

		response.getWriter().write(new Gson().toJson(epResponse));
	}
	
	/**
	 * 下载错误试卷
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/downloadPaperWord/${paperName}", method = RequestMethod.POST)
	public void downloadPaperWord(HttpServletRequest request,
			HttpServletResponse response, @RequestParam String filename)
			throws IOException {
		try {
			byte[] bytes = loadService.downloadPaperWord(filename);
			if (bytes == null) {
				logger.error("错误试卷不存在：" + filename);
				return;
			}

			OutputStream os = response.getOutputStream();
			response.reset();
			response.setHeader("Content-Disposition", "attachment");
			response.setContentType("application/octet-stream; charset=utf-8");
			response.setContentLength(bytes.length);
			os.write(bytes);
			os.flush();
		} catch (Exception e) {
			logger.error("error call downloadPaperWord", e);
		}
	}

	/**
	 * 确定导入题目
	 * 
	 * @param session
	 * @param qbId
	 * @param rows
	 * @return
	 */
	@RequestMapping(value = "/loadQuestions/{qbId}/{similarityLimit}/{checkTime}", method = RequestMethod.POST)
	public @ResponseBody EPResponse<LoadResponse> loadQuestions(
			HttpSession session, @PathVariable int qbId,
			@PathVariable int similarityLimit, @PathVariable boolean checkTime,
			@RequestBody LoadRequest request) {
		EPResponse<LoadResponse> epResponse = new EPResponse<LoadResponse>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(loadService.loadQuestions(emloyerId, qbId, null,
					similarityLimit / 100.0, checkTime, request));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call loadQuestions", e);
		}

		return epResponse;
	}

	/**
	 * 导出题目
	 * 
	 * @param qbId
	 * @param response
	 */
	@RequestMapping(value = "/exportQuestion/{qbId}/{qbName}")
	public void exportQuestion(HttpSession session, @PathVariable int qbId,
			HttpServletResponse response) {
		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			ExportQbResponse exportQbResponse = loadService.exportQb(emloyerId,
					qbId);
			if (exportQbResponse.getErrorCode() != BaseResponse.SUCCESS) {
				logger.error("题库导出异常：" + exportQbResponse.getErrorDesc());
				return;
			}

			OutputStream os = response.getOutputStream();
			response.reset();
			response.setHeader("Content-Disposition", "attachment");
			response.setContentType("application/octet-stream; charset=utf-8");
			response.setContentLength(exportQbResponse.getData().length);
			os.write(exportQbResponse.getData());
			os.flush();
		} catch (Exception e) {
			logger.error("error call exportQuestion", e);
		}
	}

	/**
	 * 题库是否有错误题目
	 * 
	 * @param qbName
	 * @param response
	 */
	@RequestMapping(value = "/hasErrorQuestion/{qbId}")
	public @ResponseBody EPResponse<HasErrorQbResponse> hasErrorQuestion(
			HttpSession session, @PathVariable int qbId) {
		EPResponse<HasErrorQbResponse> epResponse = new EPResponse<HasErrorQbResponse>();

		try {
			epResponse.setData(loadService.hasErrorQb(qbId));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call hasErrorQuestion error", e);
		}

		return epResponse;
	}

	/**
	 * 删除错误题目
	 * 
	 * @param qbName
	 * @param response
	 */
	@RequestMapping(value = "/deleteErrorQuestion/{serialNo}")
	public @ResponseBody EPResponse<BaseResponse> deleteErrorQuestion(
			HttpSession session, @PathVariable int serialNo) {
		EPResponse<BaseResponse> epResponse = new EPResponse<BaseResponse>();

		try {
			epResponse.setData(loadService.deleteErrorQuestion(serialNo));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call deleteErrorQuestion error", e);
		}

		return epResponse;
	}

	/**
	 * 导出错误题目
	 * 
	 * @param qbName
	 * @param response
	 */
	@RequestMapping(value = "/getErrorQb/{qbId}")
	public @ResponseBody EPResponse<LoadResponse> getErrorQb(
			HttpSession session, @PathVariable int qbId) {
		EPResponse<LoadResponse> epResponse = new EPResponse<LoadResponse>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(loadService.getErrorQb(emloyerId, qbId));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getErrorQb error", e);
		}

		return epResponse;
	}

	/**
	 * 导出错误题目（Excel）
	 * 
	 * @param qbId
	 * @param response
	 */
	@RequestMapping(value = "/exportErrorQb/{qbId}/{qbName}")
	public void exportErrorQuestion(HttpSession session,
			@PathVariable int qbId, HttpServletResponse response) {
		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			ExportErrorQbResponse exportErrorQbResponse = loadService
					.exportErrorQb(emloyerId, qbId);
			if (exportErrorQbResponse.getErrorCode() != BaseResponse.SUCCESS) {
				logger.error("题库导出异常：" + exportErrorQbResponse.getErrorDesc());
				return;
			}

			OutputStream os = response.getOutputStream();
			response.reset();
			response.setHeader("Content-Disposition", "attachment");
			response.setContentType("application/octet-stream; charset=utf-8");
			response.setContentLength(exportErrorQbResponse.getData().length);
			os.write(exportErrorQbResponse.getData());
			os.flush();
		} catch (Exception e) {
			logger.error("error call exportErrorQb", e);
		}
	}

	/**
	 * 编辑题目
	 * 
	 * @return
	 */
	@RequestMapping(value = "/editQuestion/{qbId}/{questionId}/{similarityLimit}/{checkTime}")
	public @ResponseBody EPResponse<LoadResponse> editQuestion(
			@PathVariable int qbId, @PathVariable long questionId,
			@PathVariable int similarityLimit, @PathVariable boolean checkTime,
			HttpSession session, @RequestBody LoadRequest request) {
		EPResponse<LoadResponse> epResponse = new EPResponse<LoadResponse>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(qbBaseServ.editQuestion(emloyerId, qbId,
					questionId, similarityLimit / 100.0, checkTime, request));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call editQuestion error", e);
		}

		return epResponse;
	}

	/**
	 * 删除题目
	 * 
	 * @return
	 */
	@RequestMapping(value = "/deleteQuestion/{qbId}/{questionId}")
	public @ResponseBody EPResponse<PFResponse> deleteQuestion(
			@PathVariable int qbId, @PathVariable long questionId,
			HttpSession session) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(qbBaseServ.deleteQuestion(emloyerId, qbId,
					questionId));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call deleteQuestion error", e);
		}

		return epResponse;
	}

	/**
	 * 增加题目
	 * 
	 * @return
	 */
	@RequestMapping(value = "/addQuestion/{qbId}/{similarityLimit}/{checkTime}")
	public @ResponseBody EPResponse<LoadResponse> addQuestion(
			@PathVariable int qbId, @PathVariable int similarityLimit,
			@PathVariable boolean checkTime, @RequestBody LoadRequest request,
			HttpSession session) {
		EPResponse<LoadResponse> epResponse = new EPResponse<LoadResponse>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(loadService.loadQuestions(emloyerId, qbId, null,
					similarityLimit / 100.0, checkTime, request));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call addQuestion error", e);
		}

		return epResponse;
	}

	/**
	 * 修改技能名称
	 * 
	 * @return
	 */
	@RequestMapping(value = "/updateQbSkill", method = RequestMethod.POST)
	public @ResponseBody EPResponse<PFResponse> updateQbSkill(
			HttpSession session, @RequestBody QbSkillInfo qbSkillInfo) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			qbSkillInfo.setCreateBy(emloyerId);
			epResponse.setData(qbBaseServ.updateQbSkill(qbSkillInfo));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call updateQbSkill error", e);
		}

		return epResponse;
	}

	/**
	 * 添加技能
	 * 
	 * @return
	 */
	@RequestMapping(value = "/createQbSkill", method = RequestMethod.POST)
	public @ResponseBody EPResponse<QbSkillResponse> createQbSkill(
			HttpSession session, @RequestBody QbSkillInfo qbSkillInfo) {
		EPResponse<QbSkillResponse> epResponse = new EPResponse<QbSkillResponse>();

		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			qbSkillInfo.setCreateBy(emloyerId);
			epResponse.setData(qbBaseServ.createQbSkill(qbSkillInfo));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call createQbSkill error", e);
		}

		return epResponse;
	}

	/**
	 * 删除技能
	 * 
	 * @param skillId
	 * @return
	 */
	@RequestMapping("/deleteQbSkill/{skillId}")
	public @ResponseBody EPResponse<PFResponse> deleteQbSkill(
			@PathVariable String skillId) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();

		try {
			epResponse.setData(qbBaseServ.deleteQbSkill(skillId));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call deleteQbSkill error", e);
		}

		return epResponse;
	}

	/**
	 * 获取题库的全部技能
	 * 
	 * @param qbId
	 * @return
	 */
	@RequestMapping("/getQbBaseSkills/{qbId}")
	public @ResponseBody EPResponse<List<QbSkill>> getQbBaseSkills(
			@PathVariable int qbId) {
		EPResponse<List<QbSkill>> epResponse = new EPResponse<List<QbSkill>>();

		try {
			epResponse.setData(qbBaseServ.getQbBaseSkills(qbId));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getQbBaseSkills error", e);
		}

		return epResponse;
	}

	/**
	 * 获取选择题技能难度题目数分布
	 * 
	 * @param qbId
	 * @return
	 */
	@RequestMapping("/getSkillLevelNums/{qbId}")
	public @ResponseBody EPResponse<QbSkillStatistics> getSkillLevelNums(
			@PathVariable int qbId) {
		EPResponse<QbSkillStatistics> epResponse = new EPResponse<QbSkillStatistics>();

		try {
			epResponse.setData(qbBaseServ.getSkillLevelNums(qbId));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getSkillLevelNums error", e);
		}

		return epResponse;
	}

	/**
	 * 获取编程题按编程语言难易程序题目数
	 * 
	 * @param qbId
	 * @return
	 */
	@RequestMapping("/getProgramLevelNums/{qbId}")
	public @ResponseBody EPResponse<QbProLangInfo> getProgramLevelNums(
			@PathVariable int qbId) {
		EPResponse<QbProLangInfo> epResponse = new EPResponse<QbProLangInfo>();

		try {
			epResponse.setData(qbBaseServ.getProgramLevelNums(qbId));
		} catch (PFServiceException e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getProgramLevelNums error", e);
		}

		return epResponse;
	}

	/**
	 * 获取一道题
	 * 
	 * @param questionId
	 * @return
	 */
	@RequestMapping("/getQuestion/{questionId}")
	public @ResponseBody EPResponse<GetQuestionResponse> getQuestion(
			@PathVariable long questionId) {
		EPResponse<GetQuestionResponse> epResponse = new EPResponse<GetQuestionResponse>();

		try {
			epResponse.setData(loadService.getQuestion(questionId));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getQuestion error", e);
		}

		return epResponse;
	}

	/**
	 * 获取题组
	 * 
	 * @param questionId
	 * @return
	 */
	@RequestMapping("/getGroup/{questionId}")
	public @ResponseBody EPResponse<GetGroupResponse> getGroup(
			@PathVariable long questionId) {
		EPResponse<GetGroupResponse> epResponse = new EPResponse<GetGroupResponse>();

		try {
			epResponse.setData(loadService.getGroup(questionId));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getGroup error", e);
		}

		return epResponse;
	}

	/**
	 * 获取评论吐槽汇总信息
	 * 
	 * @param questionId
	 * @return
	 */
	@RequestMapping("/getFeedBackCountInfo/{questionId}")
	public @ResponseBody EPResponse<FeedbackCountInfo> getFeedBackCountInfo(
			@PathVariable long questionId) {
		logger.debug("getFeedBackCountInfo questionId {} ", questionId);
		EPResponse<FeedbackCountInfo> epResponse = new EPResponse<FeedbackCountInfo>();

		try {
			epResponse.setData(candidateTest.getFeedbackCountInfo(questionId));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getFeedBackCountInfo error", e);
		}

		return epResponse;
	}

	@RequestMapping("/getCandidateTestFeedbacks/{questionId}")
	public @ResponseBody EPResponse<List<CandidateTestFeedback>> getCandidateTestFeedbacks(
			@PathVariable long questionId, @RequestBody Page page) {
		logger.debug("getCandidateTestFeedbacks questionId {}, page {}  ",
				questionId, page);
		EPResponse<List<CandidateTestFeedback>> epResponse = new EPResponse<List<CandidateTestFeedback>>();

		try {
			epResponse.setData(candidateTest.getCandidateTestFeedbacks(
					questionId, page));
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getCandidateTestFeedbacks error", e);
		}

		return epResponse;
	}

}
