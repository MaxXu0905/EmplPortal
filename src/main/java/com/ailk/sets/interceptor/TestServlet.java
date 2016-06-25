package com.ailk.sets.interceptor;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TestServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		System.out.println("get ===============");
		// TODO Auto-generated method stub
		super.doGet(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");  
	    resp.setCharacterEncoding("UTF-8");  
	    System.out.println("============================" + req.getParameter("test"));
	    InputStream ins =  req.getInputStream();
	    byte[] bytes = new byte[ins.available()];
	    String aaa = new String(bytes);
	    System.out.println("ins =========== " + aaa);
        PrintWriter out = resp.getWriter();  
      	 out.print("success"); 
		
	}
}
