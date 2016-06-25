package com.ailk.sets.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.EPResponse;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.model.CandidateResult;
import com.ailk.sets.platform.intf.cand.service.ICandidateTest;
import com.ailk.sets.platform.intf.model.Page;
import com.ailk.sets.platform.intf.model.candidateTest.AbNormalInfo;
import com.ailk.sets.utils.BCSUtil;
import com.ailk.sets.utils.XLSUtil;
import com.google.gson.Gson;

@Controller
public class FileController {

	Logger logger = LoggerFactory.getLogger(FileController.class);
	
	@Autowired
	private ICandidateTest candidateTestService;

	/**
	 * 获取异常图片
	 * 
	 * @author Mia
	 * @param request
	 * @param response
	 * @param httpMethodName
	 *            PUT GET DELETE LIST....
	 * @param keyBucket
	 *            取得bucketName的key
	 * @param objectName
	 *            bcs objectName
	 * @throws IOException
	 *             isAbnomal 0 正常，1异常
	 * @return
	 */
	@RequestMapping(value = "/getTestMonitor/{testId}")
	public @ResponseBody
	EPResponse<AbNormalInfo> getBCSUploadPath(HttpServletRequest request, HttpServletResponse response, @PathVariable long testId) throws IOException {

		EPResponse<AbNormalInfo> emResponse = new EPResponse<AbNormalInfo>();
		try {
			Page page = new Page();
			page.setPageSize(8);
			AbNormalInfo info = candidateTestService.getTestMonitor(testId, 1 ,page);
			emResponse.setCode(SysBaseResponse.SUCCESS);
			emResponse.setData(info);
		} catch (Exception e) {
			e.printStackTrace();
			emResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return emResponse;
	}

	/**
	 * 候选人列表导入
	 * 
	 * @author Mia
	 * @param request
	 * @param response
	 * @throws IOException
	 * @return
	 */
	@RequestMapping("/importCandidates")
	public void importCandidates(HttpServletRequest request, HttpServletResponse response) throws IOException {
	    List<String> emailList = new ArrayList<String>();
	    String emails = request.getParameter("emails");
	    if(!StringUtils.isBlank(emails))
	    {
	        emailList = Arrays.asList(emails.split("\\|"));
	    }
		CandidateResult result = null;
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
						if(logger.isDebugEnabled())
						{
						    logger.debug("importCandidates {}...", filename);
						}
						XLSUtil xls = new XLSUtil(item.getInputStream() , emailList);
						result = xls.resultexcel();
					}
				}
			} catch (Exception e) {
			    logger.error(" importCandidates error ...",e);
			}

		}
		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().write(new Gson().toJson(result));

	}

	/**
	 * 得到加密MBO
	 * 
	 * @author Mia
	 * @param request
	 * @param response
	 * @param httpMethodName
	 *            PUT GET DELETE LIST....
	 * @param keyBucket
	 *            取得bucketName的key
	 * @param objectName
	 *            bcs objectName
	 * @throws IOException
	 * @return
	 */
	@RequestMapping(value = "/getBcsUploadPath/{keyBucket}/{objectName}")
	public void getBCSUploadPath(HttpServletRequest request, HttpServletResponse response, @PathVariable String keyBucket, @PathVariable String objectName) throws IOException {

		Map<String, Object> result = new HashMap<String, Object>();
		try {
			BCSUtil bcs = new BCSUtil();

			// String bucketName = "SETSTITLEIMG";
			String bucketName = "setstitleimg";

			int em = Integer.parseInt((String) request.getSession().getAttribute(Constant.EMPLOYERID));

			String message = "http://" + "" + bucketName + ".bcs.duapp.com" + "/" + em + "/" + objectName + "?sign=MBO:" + "lpzTfYczyf9jB3Uc0xluTWi3" + ":"
					+ bcs.setSHA1Code("PUT", bucketName, "/" + em + "/" + objectName);

			result.put("code", SysBaseResponse.SUCCESS);
			result.put("message", message);
		} catch (Exception e) {
			result.put("code", SysBaseResponse.ESYSTEM);
		}
		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().write(new Gson().toJson(result)); // 上传成功
	}

	public static void main(String[] args) {

		Properties pros = System.getProperties();
		Enumeration<Object> enumds = pros.keys();
		while (enumds.hasMoreElements()) {
			System.out.println(enumds.nextElement() + "    " + pros.get(enumds.nextElement()));
		}

	}

}
