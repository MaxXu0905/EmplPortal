package com.ailk.sets.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.EPResponse;
import com.ailk.sets.common.SearchCondition;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.cand.service.ICandidateInfoService;
import com.ailk.sets.platform.intf.domain.ConfigCollege;

/**
 * 
 * @author panyl
 *
 */
@RestController
@RequestMapping("info")
public class InfoController {

	@Autowired
	private ICandidateInfoService candidateInfoService;

	private Logger logger = LoggerFactory.getLogger(InfoController.class);


	/**
	 * 搜索大学
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping("/getBySearchCondition")
	public @ResponseBody
	EPResponse<List<ConfigCollege>> getBySearchCondition(HttpSession session, @RequestBody SearchCondition condition) {
		logger.debug("searchCondition is {}", condition.toString());
		EPResponse<List<ConfigCollege>> cpResponse = new EPResponse<List<ConfigCollege>>();
		try {
			String searchName = condition.getSearchName();
			if (StringUtils.isEmpty(searchName)) {
				searchName = "";
			}
			List<ConfigCollege> list = candidateInfoService.getConfigColleges(searchName, Constant.SEARCH_SIZE);
			logger.debug("InfoNeed size is {}", list == null ? 0 : list.size());
			cpResponse.setData(list);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("get getBySearchCondition info error ", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return cpResponse;
	}

}
