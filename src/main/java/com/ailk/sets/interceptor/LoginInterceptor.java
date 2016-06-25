package com.ailk.sets.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ailk.sets.common.Constant;

public class LoginInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		
		HttpSession session = request.getSession();
		Object employerId = session.getAttribute(Constant.EMPLOYERID);
		if(employerId != null)
		{
			response.sendRedirect(request.getContextPath() + "/sets/page/home");
			return false;
		}
		return super.preHandle(request, response, handler);
	}

}
