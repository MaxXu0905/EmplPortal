package com.ailk.sets.controller;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ailk.sets.common.Constant;
import com.ailk.sets.grade.intf.IGradeService;
import com.ailk.sets.grade.intf.report.GetReportResponse;
import com.ailk.sets.platform.intf.empl.service.IQbBase;
import com.ailk.sets.utils.UploadImgProperties;
import com.google.gson.Gson;

/**
 * 测试用
 */
@Controller
@RequestMapping("/page")
public class IndexController {

	@Autowired
	private IQbBase qbBase;

	@Autowired
	private IGradeService gradeService;

	private static final Gson gson = new Gson();

	@RequestMapping("/jumpInvite/{positionId}")
	public String jump(HttpServletRequest request, @PathVariable int positionId) {
		request.setAttribute(Constant.POSITIONID, positionId);
		return "post_invite";
	}

	@RequestMapping("/index")
	public String index() {
		return "index";
	}

	@RequestMapping("/error")
	public String error() {
		return "error";
	}

	@RequestMapping("/logout")
	public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpSession session = request.getSession();
		session.removeAttribute(Constant.EMPLOYERID);
		response.sendRedirect(request.getContextPath() + "/sets/page/index");
	}

	@RequestMapping("/home")
	public String home() {
		return "home";
	}

	@RequestMapping("/testReport/{testId}/{paperType}")
	public String testReport(HttpServletRequest request, @PathVariable Long testId, @PathVariable Integer paperType) {
		request.setAttribute(Constant.TESTID, testId);
		request.setAttribute(Constant.PAPER_TYPE, paperType);
		return "testReport";
	}

	@RequestMapping("/testReportCommon/{testId}/{paperType}")
	public String testReportCommon(HttpServletRequest request, @PathVariable Long testId,
			@PathVariable Integer paperType) {
		request.setAttribute(Constant.TESTID, testId);
		request.setAttribute(Constant.PAPER_TYPE, paperType);
		return "testReportCommon";
	}

	@RequestMapping("/reportlist/{positionId}")
	public String reportlist(HttpServletRequest request, @PathVariable int positionId) {
		request.setAttribute(Constant.POSITIONID, positionId);
		return "reportlist";
	}

	@RequestMapping("/postjob")
	public String postJob() {
		return "postJob";
	}

	@RequestMapping("/testModel")
	public String testModel() {
		return "testModel";
	}

	@RequestMapping("/skillreport/{positionId}/{testId}")
	public String skillreport(HttpServletRequest request, @PathVariable int positionId, @PathVariable long testId) {
		request.setAttribute(Constant.POSITIONID, positionId);
		request.setAttribute(Constant.TESTID, testId);
		return "skill_report";
	}

	@RequestMapping("/goReportRO/{positionId}/{testId}/{passport}")
	public String goReportReadOnly(HttpServletRequest request, @PathVariable int positionId, @PathVariable long testId,
			@PathVariable String passport) {
		request.setAttribute(Constant.POSITIONID, positionId);
		request.setAttribute(Constant.PASSPORT, passport);
		request.setAttribute(Constant.TESTID, testId);
		request.setAttribute(Constant.SHOW_SAMPLE, true);
		return "skill_report";
	}

	@RequestMapping("/goReportForPdf/{positionId}/{testId}/{passport}")
	public String goReportForPdf(HttpServletRequest request, @PathVariable int positionId, @PathVariable long testId,
			@PathVariable String passport) {
		request.setAttribute(Constant.POSITIONID, positionId);
		request.setAttribute(Constant.PASSPORT, passport);
		request.setAttribute(Constant.TESTID, testId);

		try {
			GetReportResponse report = gradeService.getReport(testId, passport);
			request.setAttribute(Constant.REPORT, gson.toJson(report));
			request.setAttribute(Constant.HAS_REPORT, "1");
		} catch (Exception e) {
		}

		return "skill_report";
	}

	@RequestMapping("/login/{action}")
	public String login(HttpServletRequest request, @PathVariable int action) {
		request.setAttribute("action", action);
		request.setAttribute("actionUrl", request.getParameter("actionUrl"));
		return "login";
	}

	@RequestMapping("/regist")
	public String register() {
		return "regist";
	}

	@RequestMapping("/freeTest")
	public String freeTest() {
		return "freeTest";
	}

	@RequestMapping("/modPassword")
	public String modPassword() {
		return "modPassword";
	}

	@RequestMapping("/newPassword")
	public String newPassword() {
		return "modPassword";
	}

	@RequestMapping("/singleFrame")
	public String singleFrame() {
		return "singleFrame";
	}

	@RequestMapping("/regularInformation")
	public String regularInformation() {
		return "regularInformation";
	}

	@RequestMapping("/createpost")
	public String createpost() {
		return "create_post";
	}

	@RequestMapping("/createcampus")
	public String createcampus(HttpServletRequest request) {
		request.setAttribute("realtime", System.currentTimeMillis());
		return "create_campus";
	}

	@RequestMapping("/createpaper/{seriesId}/{level}/{positionName}")
	public String createpaper(HttpServletRequest request, @PathVariable String seriesId, @PathVariable String level,
			@PathVariable String positionName) {
		request.setAttribute("seriesId", seriesId);
		request.setAttribute("level", level);
		request.setAttribute("positionName", positionName);
		return "create_paper";
	}

	@RequestMapping("/createcampuspaper/{positionName}")
	public String createcampuspaper(HttpServletRequest request, @PathVariable String positionName) {
		request.setAttribute("positionName", positionName);
		return "create_campus_paper";
	}

	@RequestMapping("/editpost/{positionId}")
	public String createpost(HttpServletRequest request, @PathVariable int positionId) {
		request.setAttribute(Constant.POSITIONID, positionId);
		return "create_post";
	}

	@RequestMapping("/editcampus/{positionId}")
	public String createcampus(HttpServletRequest request, @PathVariable int positionId) {
		request.setAttribute(Constant.POSITIONID, positionId);
		return "create_campus";
	}

	@RequestMapping("/postinvite/{positionId}")
	public String postinvite(HttpServletRequest request, @PathVariable int positionId) {
		request.setAttribute(Constant.POSITIONID, positionId);
		return "post_invite";
	}

	// 合并邀请
	@RequestMapping("/mergeInvite/{positionIds}")
	public String mergeInvite(HttpServletRequest request, @PathVariable String positionIds) {
		request.setAttribute("position_ids", positionIds);
		return "post_invite";
	}
	
	// 合并邀请选择
	@RequestMapping("/mergeInviteChoose")
	public String mergeInviteChoose(HttpServletRequest request) {
		return "merge_invite";
	}

	@RequestMapping("/test")
	public String test() {
		return "test";
	}

	@RequestMapping("/newPass/{uuid}")
	public String newPass(@PathVariable String uuid, HttpSession session) {
		session.setAttribute(Constant.UUID, uuid);
		return "newPassword";
	}

	@RequestMapping("goCompareReport/{ids}")
	public String goCompareReport(HttpServletRequest request, @PathVariable String ids) {
		request.setAttribute(Constant.PARAM, ids);
		return "compareReport";
	}

	// 题库管理
	@RequestMapping("/questionlibMgr")
	public String questionlibMgr(HttpServletRequest request) {
		return "importQueslib";
	}

	// 产品手册
	@RequestMapping("/handbook")
	public String productBook(HttpServletRequest request) {
		return "handbook";
	}

	// 产品手册
	@RequestMapping("/statement")
	public String statement(HttpServletRequest request) {
		return "state";
	}

	// 校招说明
	@RequestMapping("/campussplash")
	public String guide1(HttpServletRequest request) {
		return "campus_splash";
	}

	// 校招使用百一微信号说明
	@RequestMapping("/campusguide101/{positionId}")
	public String guide2(HttpServletRequest request, @PathVariable String positionId) {
		request.setAttribute("positionId", positionId);
		return "campus_guide101";
	}

	// 校招使用企业微信号说明
	@RequestMapping("/campusguideself/{positionId}")
	public String guide3(HttpServletRequest request, @PathVariable String positionId) {
		request.setAttribute("positionId", positionId);
		return "campus_guideself";
	}

	// 题目列表
	@RequestMapping("/questionlist/{qbId}/{qbCategory}")
	public String questionlist(@PathVariable String qbId, @PathVariable String qbCategory, HttpServletRequest request)
			throws Exception {
		request.setAttribute("qbId", qbId);
		request.setAttribute("qbCategory", qbCategory);
		String qbName = qbBase.getQbName(Integer.parseInt(qbId));
		request.setAttribute("qbName", qbName);
		request.setAttribute("urlEncodeQbName", URLEncoder.encode(qbName + ".xls", "UTF-8"));
		return "questionlist";
	}

	// 选择题目
	@RequestMapping("/questionSelect")
	public String questionSelect(HttpServletRequest request) {
		return "questionSelect";
	}

	// 添加题目
	@RequestMapping("/addQuestion/{qbId}/{qbType}/{qbName}")
	public String addQuestion(@PathVariable String qbId, @PathVariable String qbType, @PathVariable String qbName,
			HttpServletRequest request) {
		request.setAttribute("qbId", qbId);
		request.setAttribute("qbType", qbType);
		request.setAttribute("qbOperator", "add");
		request.setAttribute("qbName", qbName);
		//获取图片上传路径
		String imgUploadUrl = UploadImgProperties.getController("img.upload.path");
		request.setAttribute("imgUploadUrl", imgUploadUrl + "upload/uploadQbPic/");
		if (qbType.equals("interview")) {
			request.setAttribute("title", "添加题组");
		} else {
			request.setAttribute("title", "添加题目");
		}
		return "addQuestion";
	}

	// 编辑题目
	@RequestMapping("/editQuestion/{qbId}/{questionId}/{qbType}/{qbName}")
	public String editQuestion(@PathVariable int qbId, @PathVariable long questionId, @PathVariable String qbType,
			@PathVariable String qbName, HttpServletRequest request) {
		request.setAttribute("qbId", qbId);
		request.setAttribute("qbType", qbType);
		request.setAttribute("questionId", questionId);
		request.setAttribute("qbOperator", "edit");
		request.setAttribute("qbName", qbName);
		String imgUploadUrl = UploadImgProperties.getController("img.upload.path");
		request.setAttribute("imgUploadUrl", imgUploadUrl + "upload/uploadQbPic/");
		if (qbType.equals("interview")) {
			request.setAttribute("title", "编辑题组");
		} else {
			request.setAttribute("title", "编辑题目");
		}
		return "addQuestion";
	}

	// 导入题目校验
	@RequestMapping("/importQuesVerify/{qbId}/{qbCategory}")
	public String importQuesVerify(@PathVariable String qbId, @PathVariable String qbCategory,
			HttpServletRequest request) throws Exception {
		request.setAttribute("qbId", qbId);
		request.setAttribute("qbCategory", qbCategory);
		String qbName = qbBase.getQbName(Integer.parseInt(qbId));
		request.setAttribute("urlEncodeQbNameError", URLEncoder.encode(qbName + "-错误.xls", "UTF-8"));
		return "importQuesVerify";
	}

	// 查看评论
	@RequestMapping("/viewAllComments/{questionId}")
	public String viewAllComments(@PathVariable String questionId, HttpServletRequest request) {
		request.setAttribute("questionId", questionId);
		return "viewAllComments";
	}

	// 导入试卷
	@RequestMapping("/importPaper/{testType}/{seriesId}/{level}/{paperName}")
	public String importPaper(@PathVariable String paperName, @PathVariable int testType, @PathVariable int seriesId,
			@PathVariable int level, HttpServletRequest request) {
		request.setAttribute("testType", testType);
		request.setAttribute("seriesId", seriesId);
		request.setAttribute("level", level);
		request.setAttribute("paperName", paperName);
		return "importPaper";
	}

}
