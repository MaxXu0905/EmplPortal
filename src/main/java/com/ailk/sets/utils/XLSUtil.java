package com.ailk.sets.utils;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import jxl.Sheet;
import jxl.Workbook;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;

import com.ailk.sets.model.CandidateMail;
import com.ailk.sets.model.CandidateResult;

public class XLSUtil {

	private Workbook book;

	private List<String> pageEmailList; // 页面已存在的邮箱列表
	
	public XLSUtil(InputStream input , List<String> emailList) {

		try {
			this.book = Workbook.getWorkbook(input);
			this.pageEmailList = emailList;
		} catch (Exception e) {
			throw new RuntimeException("init XLSUtil error...");
		}
	}

	public Sheet getSheet(int number) {
		return book.getSheet(number);
	}

	public int getRows(Sheet sheet) {
		return sheet.getRows();
	}

	public int getCells(Sheet sheet) {
		return sheet.getColumns();
	}

	public String getDate(Sheet sheet, int cell, int row) {
		return sheet.getCell(cell, cell).getContents();
	}

	public CandidateResult resultexcel() {

		Sheet sheet = getSheet(0);
		int rows = getRows(sheet);
		ArrayList<CandidateMail> list = new ArrayList<CandidateMail>(); //
		ArrayList<String> errors = new ArrayList<String>(); // 异常信息
		ArrayList<String> emails = new ArrayList<String>(); // 邮件集合
		Pattern pattern = Pattern
				.compile("^[\\w\\-][\\w\\-\\.]*@[a-zA-Z0-9]+([a-zA-Z0-9\\-\\.]*[a-zA-Z0-9\\-]+)*\\.[a-zA-Z0-9]{2,}$");
		// 内容不为空的行数
		int total = 0; 
		for (int i = 2; i < rows; i++) {
			CandidateMail user = new CandidateMail();
			String name = sheet.getCell(0, i).getContents().trim(); // 姓名
			String email = sheet.getCell(1, i).getContents().trim(); // 邮箱
			if (StringUtils.isBlank(email) && StringUtils.isBlank(name)) {
			    continue;
			}
			String errorStr = ""; // 异常信息
			int emailIndex = emails.indexOf(email); // Excel中的邮箱是否存在重复记录
			int pageIndex = -1;
			if(!CollectionUtils.isEmpty(pageEmailList) && (pageIndex = pageEmailList.indexOf(email))!=-1)
            {
                errorStr = "第" + (i + 1) + "行【"
                        + pageEmailList.get(pageIndex) + "】" + "和下方已导入的第" + (pageIndex + 1)
                        + "行邮箱重复\n";
            }else if (StringUtils.isBlank(name) && !StringUtils.isBlank(email))
			{
				errorStr = "第" + (i + 1) + "行【" + email + "】没有写姓名\n";
			}	
			else if (StringUtils.isBlank(email) && !StringUtils.isBlank(name))
			{
			    errorStr = "第" + (i + 1) + "行【" + name + "】没有写邮箱\n";
			}    
			else if(!pattern.matcher(email).matches())
			{
				errorStr = "第" + (i + 1) + "行【" + email + "】邮箱格式不正确\n";
			}
			else if(!EmailUtils.lookupDomain(email))
			{
				errorStr = "第" + (i + 1) + "行【" + email + "】邮箱地址不正确\n";
			}else if (emails.indexOf(email) >= 0)
            {
                errorStr = "第" + (i + 1) + "行【"
                        + emails.get(emailIndex) + "】" + "和第" + (emailIndex + 3)
                        + "行邮箱重复\n";
            }
			
			// 内容不为空的行数+1
			total ++;
			
			emails.add(email);

			if (!StringUtils.isBlank(errorStr)) {
				errors.add(errorStr);
				continue;
			}

			user.setEmail(email);
			user.setName(name);
			list.add(user);
		}

		CandidateResult result = new CandidateResult(list, errors, total);
		return result;
	}
}
