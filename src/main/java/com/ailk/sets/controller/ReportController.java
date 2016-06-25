package com.ailk.sets.controller;

import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
import com.ailk.sets.grade.intf.ExportReportResponse;
import com.ailk.sets.grade.intf.IGradeService;
import com.ailk.sets.grade.intf.ILoadService;
import com.ailk.sets.grade.intf.report.GetComparedReportsResponse;
import com.ailk.sets.grade.intf.report.GetReportResponse;
import com.ailk.sets.grade.intf.report.Interview.InterviewItem;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.PaperModel;
import com.ailk.sets.platform.intf.empl.service.IPosition;
import com.ailk.sets.platform.intf.empl.service.IReport;
import com.ailk.sets.platform.intf.model.candidateReport.CandReportAndInfo;
import com.ailk.sets.platform.intf.model.param.GetReportParam;
import com.ailk.sets.platform.intf.model.position.PositionStatistics;

/**
 * 试答题控制器
 * 
 * @author 毕希研
 * 
 */
@RestController
@RequestMapping("/report")
public class ReportController {

	@Autowired
	private IPosition positionServ;

	@Autowired
	private IReport reportServ;

	@Autowired
	private IGradeService gradeService;

	@Autowired
	private ILoadService loadService;

	private Logger logger = LoggerFactory.getLogger(ReportController.class);

	/**
	 * 调用gradeService，保存视频
	 * 
	 * @param testId
	 * @param items
	 * @return
	 */
	@RequestMapping(value = "/saveInterview/{testId}", method = { RequestMethod.POST })
	public @ResponseBody
	EPResponse<BaseResponse> saveInterview(@PathVariable long testId,
			@RequestBody List<InterviewItem> items) {
		EPResponse<BaseResponse> epResponse = new EPResponse<BaseResponse>();
		try {
			epResponse.setData(gradeService.saveInterview(testId, items));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call saveInterview ", e);
		}
		return epResponse;
	}

	/**
	 * 调用gradeService，获取视频
	 * 
	 * @param testId
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getInterview/{testId}")
	public @ResponseBody
	EPResponse<BaseResponse> getInterview(@PathVariable long testId,
			HttpSession session) {
		final int TEST_TYPE = 1; // 社招

		EPResponse<BaseResponse> epResponse = new EPResponse<BaseResponse>();
		try {
			int emloyerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
			epResponse.setData(gradeService.getInterview(emloyerId, TEST_TYPE,
					testId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call getInterview ", e);
		}
		return epResponse;
	}

	/**
	 * 获取报告
	 * 
	 * @param testId
	 * @return
	 */
	@RequestMapping("/getReport/{positionId}/{testId}")
	public @ResponseBody
	EPResponse<GetReportResponse> getReport(HttpSession session,
			@PathVariable int positionId, @PathVariable long testId) {
		EPResponse<GetReportResponse> epResponse = new EPResponse<GetReportResponse>();
		int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
		try {
			PFResponse pfResponse = reportServ.ownReport(employerId, testId);
			if (pfResponse.getCode().equals(FuncBaseResponse.SUCCESS)) {
				GetReportResponse grr = gradeService.getReport(testId);
				if (grr.getErrorCode() == 0)
					// 更新报告状态为已读
					reportServ.setReportStateRead(employerId, positionId,
							testId);
				epResponse.setData(grr);
			}
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call getReport ", e);
		}
		return epResponse;
	}

	/**
	 * 非登录人员获取只读报告信息
	 * 
	 * @param session
	 * @param testId
	 * @param passport
	 * @return
	 */
	@RequestMapping("/getReportRO/{testId}/{passport}")
	public @ResponseBody
	EPResponse<GetReportResponse> getReportReadOnly(HttpSession session,
			@PathVariable long testId, @PathVariable String passport) {
		EPResponse<GetReportResponse> epResponse = new EPResponse<GetReportResponse>();
		try {
			GetReportResponse grr = gradeService.getReport(testId, passport);
			epResponse.setData(grr);
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getReportReadOnly error ", e);
		}
		return epResponse;
	}

	/**
	 * 获取PDF报告信息
	 * 
	 * @param session
	 * @param testId
	 * @return
	 */
	@RequestMapping("/exportReport/{testId}/{reportName}.pdf")
	public void exportReport(HttpSession session, @PathVariable long testId,
			HttpServletRequest request, HttpServletResponse response) {
		exportReport(session, testId, null, request, response);
	}

	/**
	 * 获取PDF报告信息
	 * 
	 * @param session
	 * @param testId
	 * @param passport
	 * @return
	 */
	@RequestMapping("/exportReportRO/{testId}/{passport}/{reportName}.pdf")
	public void exportReport(HttpSession session, @PathVariable long testId,
			@PathVariable String passport, HttpServletRequest request,
			HttpServletResponse response) {
		try {
			String baseUrl = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort();
			if (request.getContextPath() != null)
				baseUrl += request.getContextPath();
			ExportReportResponse exportReportResponse = loadService
					.exportReport(testId, passport, baseUrl);
			if (exportReportResponse.getErrorCode() != BaseResponse.SUCCESS) {
				logger.error("报告导出异常：" + exportReportResponse.getErrorDesc());
				return;
			}

			OutputStream os = response.getOutputStream();
			response.reset();
			response.setHeader("Content-Disposition", "attachment");
			response.setContentType("application/octet-stream; charset=utf-8");
			response.setContentLength(exportReportResponse.getData().length);
			os.write(exportReportResponse.getData());
			os.flush();
		} catch (Exception e) {
			logger.error("error call exportReportPdf", e);
		}
	}

	/**
	 * 获取试卷报告模板
	 * 
	 * @param pos
	 * @return
	 */
	/*
	 * @RequestMapping(value = "/getReportTemplate", method = {
	 * RequestMethod.POST }) public @ResponseBody EPResponse<PaperModel>
	 * getReportTemplate(@RequestBody Position pos) { EPResponse<PaperModel>
	 * epResponse = new EPResponse<PaperModel>(); try {
	 * epResponse.setData(positionServ.analysiPosition(pos));
	 * epResponse.setCode(SysBaseResponse.SUCCESS); } catch (Exception e) {
	 * logger.error("error analysiPosition ", e);
	 * epResponse.setCode(SysBaseResponse.ESYSTEM); } return epResponse; }
	 */

	/**
	 * 获取试卷报告模板
	 * 
	 * @param pos
	 * @return
	 */
	@RequestMapping(value = "/getReportTemplateByPositionId/{positionId}")
	public @ResponseBody
	EPResponse<PaperModel> getReportTemplateByPositionId(
			@PathVariable int positionId, HttpSession session) {
		logger.debug("getReportTemplateByPositionId by positionId {} ",
				positionId);
		EPResponse<PaperModel> epResponse = new EPResponse<PaperModel>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			PFResponse pfResponse = positionServ.ownPosition(employerId,
					positionId);
			if (pfResponse.getCode().equals(FuncBaseResponse.SUCCESS))
				epResponse.setData(reportServ.getPaperModel(positionId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("error getReportTemplateByPositionId ", e);
			epResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return epResponse;
	}

	/**
	 * 根据试卷id获取试卷报告模板
	 * 
	 * @param pos
	 * @return
	 */
	@RequestMapping(value = "/getReportTemplateByPaperId/{paperId}")
	public @ResponseBody
	EPResponse<PaperModel> getReportTemplateByPaperId(
			@PathVariable int paperId, HttpSession session) {
		logger.debug("getReportTemplateByPaperId by paperId {} ", paperId);
		EPResponse<PaperModel> epResponse = new EPResponse<PaperModel>();
		try {
			epResponse.setData(reportServ.getPaperModelByPaperId(paperId));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("error getReportTemplateByPaperId ", e);
			epResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return epResponse;
	}

	/**
	 * 设置推荐和淘汰
	 * 
	 * @param positionId
	 * @param invitationId
	 * @param testResult
	 * @return
	 */
	@RequestMapping("/setTestResult/{positionId}/{testId}/{testResult}")
	public @ResponseBody
	EPResponse<PFResponse> setTestResult(HttpSession session,
			@PathVariable int positionId, @PathVariable long testId,
			@PathVariable int testResult) {
		EPResponse<PFResponse> epResponse = new EPResponse<PFResponse>();
		int employerId = (Integer) session.getAttribute(Constant.EMPLOYERID);
		try {
			PositionStatistics ps = reportServ.setTestResult(employerId,
					positionId, testId, testResult);
			epResponse.setData(ps);
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			epResponse.setMessage(e.getMessage());
		}
		return epResponse;
	}

	/**
	 * 根据某个职位获取报告列表
	 * 
	 * @param positionId
	 * @param testResult
	 * @param page
	 * @param result
	 * @return
	 */
	@RequestMapping(value = "/positionReport", method = RequestMethod.POST)
	public @ResponseBody
	EPResponse<List<CandReportAndInfo>> getPositionReport(HttpSession session,
			@RequestBody GetReportParam param) {
		EPResponse<List<CandReportAndInfo>> epResponse = new EPResponse<List<CandReportAndInfo>>();
		try {
			int employerId = (Integer) session
					.getAttribute(Constant.EMPLOYERID);
			param.setEmployerId(employerId);
			List<CandReportAndInfo> list = reportServ.getReport(param);
			epResponse.setData(list);
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			if (logger.isDebugEnabled())
				logger.debug("call getPositionReport error ", e);
		}
		return epResponse;
	}

	@RequestMapping(value = "/getComparedReports", method = RequestMethod.POST)
	public @ResponseBody
	EPResponse<GetComparedReportsResponse> getComparedReports(
			@RequestBody List<Long> testIds) {
		EPResponse<GetComparedReportsResponse> epResponse = new EPResponse<GetComparedReportsResponse>();
		try {
			epResponse.setData(gradeService.getComparedReports(testIds));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getComparedReports error ", e);
		}
		return epResponse;
	}

	@RequestMapping(value = "/scoreQuestion")
	public @ResponseBody
	EPResponse<BaseResponse> setScoreQuestion(@RequestParam int anchor,
			@RequestParam long testId, @RequestParam long questionId,
			@RequestParam double score) {
		EPResponse<BaseResponse> epResponse = new EPResponse<BaseResponse>();
		try {
			epResponse.setData(gradeService.scoreQuestion(anchor, testId,
					questionId, score));
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call setScoreQuestion error ", e);
		}
		return epResponse;
	}
}
