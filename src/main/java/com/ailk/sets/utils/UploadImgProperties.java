package com.ailk.sets.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class UploadImgProperties {
	private static Properties config;
	static {
		config = new Properties();
		InputStream inputStream = UploadImgProperties.class.getClassLoader().getResourceAsStream("uploadImg.properties");
		try {
			config.load(inputStream);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static String getController(String key)
	{
		return config.getProperty(key);
	}
	
	public static void main(String[] args)
	{
		System.out.println(UploadImgProperties.getController("img.upload.path"));
	}
}
