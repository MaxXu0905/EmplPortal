/**
 * author :  lipan
 * filename :  QRCodeController.java
 * create_time : 2014年8月5日 下午12:06:37
 */
package com.ailk.sets.controller;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.glxn.qrgen.QRCode;
import net.glxn.qrgen.image.ImageType;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ailk.sets.platform.intf.common.Constants;
import com.ailk.sets.platform.intf.model.qrcode.QRCodeInfo;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

/**
 * @author : lipan
 * @create_time : 2014年8月5日 下午12:06:37
 * @desc : 二维码处理类
 * @update_person:
 * @update_time :
 * @update_desc :
 *
 */
@RestController
@RequestMapping("/qrcode")
public class QRCodeController
{
	
	public static Map<Integer, Integer> sizeMap = new HashMap<Integer, Integer>(); // key: 像素  value: 长度(厘米)
	static{
		sizeMap.put(224, 8);
		sizeMap.put(336, 12);
		sizeMap.put(420, 15);
		sizeMap.put(840, 30);
		sizeMap.put(1400, 50);
	}
	
    /**
     * 生成二维码
     * 
     * @param testId
     * @param session
     * @return
     */
    @RequestMapping(value = "/genQRCode", method = { RequestMethod.POST })
    public void genQRCode(HttpServletResponse response , @RequestBody QRCodeInfo qrCodeInfo) {
        response.setContentType("image/png");
        response.setHeader("Pragma", "No-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expire", 0);
        response.setHeader("Content-disposition", "attachment; filename=qrcode.png");// 设定输出文件头
        try
        {
            QRCode.from(qrCodeInfo.getTextContent())
                    .to(ImageType.PNG)
                    .withCharset(Constants.CHARSET_UTF8)
                    .withSize(qrCodeInfo.getWidth(), qrCodeInfo.getHeight())
                    .writeTo(response.getOutputStream());
        } catch (IOException e)
        {
            e.printStackTrace();
        }
    }
    
    /**
     * 生成二维码2
     * 
     * @param testId
     * @param session
     * @return
     */
    @RequestMapping(value = "/genEntryQRCode/{size}/{entry}")
    public void genEntryQRCode(HttpServletResponse response , @PathVariable int size, @PathVariable String entry) {
    	response.setContentType("image/png");
    	response.setHeader("Pragma", "No-cache");
    	response.setHeader("Cache-Control", "no-cache");
    	response.setDateHeader("Expire", 0);
    	String imgName = "qrcode" + (sizeMap.get(size) == null ? "" : ("_" + sizeMap.get(size))) + ".png";
    	response.setHeader("Content-disposition", "attachment; filename=" + imgName);// 设定输出文件头
    	try
    	{
    	    String str = "http://www.101test.com/campus/wx/index/" + entry;
    	    BitMatrix bitMatrix = new MultiFormatWriter().encode(str, BarcodeFormat.QR_CODE, size, size, null);
    	    MatrixToImageWriter.writeToStream(bitMatrix, "png", response.getOutputStream());
    	} catch (Exception e)
    	{
    		e.printStackTrace();
    	}
    }

    public static void main(String[] args)
    {
        try
        {
            StringBuilder sb = new StringBuilder(1024);
            sb.append("http://182.92.1.225/campus/wx/index/VE5bjwJMZoDXdoH");            
            String str = sb.toString();
            String picFormat = "png";
            String path = "d:/test_qrcode";
            File file = new File(path + "." + picFormat);
            BitMatrix bitMatrix = new MultiFormatWriter().encode(str, BarcodeFormat.QR_CODE, 250, 250, null);
            MatrixToImageWriter.writeToFile(bitMatrix, picFormat, file);
        } catch (Exception e)
        {
            e.printStackTrace();
        }
        
    }
    
}
