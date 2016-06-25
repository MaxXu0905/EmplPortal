package com.ailk.sets.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

public class BCSUtil {
	public String setSHA1Code(String httpMethodName, String objectName,
			String contentLength) {

		String content = "MBO" + "\n" + "Method=" + httpMethodName + "" + "\n"
				+ "Bucket=setsvideo" + "\n" + "Object=" + objectName + ""
				+ "\n" + "Content-Type = application/octet-stream" + "\n"
				+ "Content-Length=" + contentLength + "\n";

		String digestStr = "";
		try {
			SecretKeySpec signingKey = new SecretKeySpec(
					"wl2tRdlpkOPwERPG6uQwMqrbkNr8LANs".getBytes(), "HmacSHA1");
			Mac mac = Mac.getInstance("HmacSHA1");
			mac.init(signingKey);

			byte[] rawHmac = mac.doFinal(content.getBytes());
			digestStr = URLEncoder.encode(Base64.encodeBase64String(rawHmac),
					"UTF-8");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		} catch (InvalidKeyException e) {
			e.printStackTrace();
			return null;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return null;
		}

		return digestStr;
	}

	public String setSHA1Code(String httpMethodName, String bucketName,
			String objectName, long contentLength) {
		String content = "MBO" + "\n" + "Method=" + httpMethodName + "" + "\n"
				+ "Bucket=setsvideo" + "\n" + "Object=" + objectName + ""
				+ "\n" + "Content-Type = application/octet-stream" + "\n"
				+ "Content-Length=" + contentLength + "\n";

		String digestStr = "";
		try {
			SecretKeySpec signingKey = new SecretKeySpec(
					"wl2tRdlpkOPwERPG6uQwMqrbkNr8LANs".getBytes(), "HmacSHA1");
			Mac mac = Mac.getInstance("HmacSHA1");
			mac.init(signingKey);

			byte[] rawHmac = mac.doFinal(content.getBytes());
			digestStr = URLEncoder.encode(Base64.encodeBase64String(rawHmac),
					"UTF-8");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		} catch (InvalidKeyException e) {
			e.printStackTrace();
			return null;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return null;
		}

		return digestStr;
	}

}
