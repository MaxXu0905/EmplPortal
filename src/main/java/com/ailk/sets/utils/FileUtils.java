/**
 * author :  lipan
 * filename :  FileUtils.java
 * create_time : 2014年7月11日 下午8:06:40
 */
package com.ailk.sets.utils;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

/**
 * @author : lipan
 * @create_time : 2014年7月11日 下午8:06:40
 * @desc : File工具类
 * @update_person:
 * @update_time :
 * @update_desc :
 * 
 */
public class FileUtils
{
    /**
     * 输入流转字节数组
     * @param in
     * @return
     * @throws Exception
     */
    public static byte[] getBytes(InputStream in) throws Exception
    {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] b = new byte[1024];
        int n;
        while ((n = in.read(b)) != -1)
        {
            out.write(b, 0, n);
        }
        in.close();
        return out.toByteArray();
    }
}
