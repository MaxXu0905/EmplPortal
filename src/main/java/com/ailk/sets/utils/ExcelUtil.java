package com.ailk.sets.utils;


import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import jxl.Cell;
import jxl.Workbook;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

public class ExcelUtil  {
 
	public  WritableWorkbook wwb = null;   								//excel 工作区
	public WritableSheet currentsheet = null;							//当前的sheet
	
	public int sheetnum = 0;												//sheet 的数量
	
	public ExcelUtil(String filename)   //根据文件路径，转换成excel格式
	{
		try {
			wwb = Workbook.createWorkbook(new File(filename));
			currentsheet = wwb.getSheet(0);
			} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public Cell getCell(int row,int column)
	{
		return currentsheet.getCell(row, column);
	}
	
	
	
}
