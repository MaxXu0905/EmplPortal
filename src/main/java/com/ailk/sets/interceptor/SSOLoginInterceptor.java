package com.ailk.sets.interceptor;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.EmployerRegistInfo;
import com.ailk.sets.platform.intf.empl.service.ISSOLogin;

public class SSOLoginInterceptor extends HandlerInterceptorAdapter {
	private Logger logger = LoggerFactory.getLogger(SessionInterceptor.class);
	@Autowired
    private ISSOLogin ssoLogin;
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		super.postHandle(request, response, handler, modelAndView);
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		HttpSession session = request.getSession();
		String type = request.getHeader(Constant.X_REQUEST_TYPE);

		Object employerId = session.getAttribute(Constant.EMPLOYERID);
		if (employerId == null) {
			StringBuffer url = request.getRequestURL();
			String tocken = url.substring(url.lastIndexOf("/") + 1, url.length());
			String urlStr = url.toString();
			int ssoType = 0;
			if (urlStr.contains("/outpage/aimrjob/")) {
				ssoType = 1;
			} else {
				ssoType = 11;
			}
		    //TODO 验证tocken
			EmployerRegistInfo res = ssoLogin.ssoLogin(tocken, ssoType);
			if(res.getCode().equals(FuncBaseResponse.SUCCESS)){//先模拟用100000004账号登陆
//				session.setAttribute(Constant.EMPLOYERID, 100000004);
				session.setAttribute(Constant.EMPLOYERID, res.getEmployerId());
				session.setAttribute(Constant.EMPLOYERNAME, res.getEmployerName());
			}else{
				if (StringUtils.isNotEmpty(type) && type.equals(Constant.X_REQUEST_VALUE)) {
					JSONObject jo = new JSONObject();
					jo.put("status", SysBaseResponse.ERRORTOKEN);
					response.getWriter().write(jo.toString());
					return false;
				} else {
					request.getRequestDispatcher("/sets/page/error.jsp").forward(request, response);
					return false;
				}
			}
			return super.preHandle(request, response, handler);
		}
		return super.preHandle(request, response, handler);
	}
}
