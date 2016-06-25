package com.ailk.sets.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ailk.sets.common.Constant;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.service.ILogin;

public class NewPasswordInterceptor extends HandlerInterceptorAdapter {

	@Autowired
	private ILogin loginServ;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		StringBuffer url = request.getRequestURL();
		String uuid = url.substring(url.lastIndexOf("/") + 1, url.length());
		PFResponse pfResponse = loginServ.validateForgetPass(uuid);
		if (pfResponse.getCode().equals(FuncBaseResponse.SUCCESS))
			return super.preHandle(request, response, handler);
		else {
			request.getSession().setAttribute(Constant.STATUS, pfResponse.getCode());
			response.sendRedirect(request.getContextPath() + "/sets/page/error");
			return false;
		}
	}
}
