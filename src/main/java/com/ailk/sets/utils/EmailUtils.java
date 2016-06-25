/**
 * author :  lipan
 * filename :  EmailUtils.java
 * create_time : 2014年8月8日 上午11:44:08
 */
package com.ailk.sets.utils;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.xbill.DNS.Lookup;
import org.xbill.DNS.Type;

/**
 * @author : lipan
 * @create_time : 2014年8月8日 上午11:44:08
 * @desc : 邮件工具类
 * @update_person:
 * @update_time :
 * @update_desc :
 * 
 */
public class EmailUtils
{
    public static final Logger logger = Logger.getLogger(EmailUtils.class);

    /**
     * 检查邮箱域名是否合法
     * 
     * @param email
     */
    public static boolean lookupDomain(String email)
    {
        logger.info(" check email domain [" + email + "] begin ...");
        if (StringUtils.isBlank(email))
        {
            return false;
        }
        String domain = StringUtils.substringAfter(email, "@");
        try
        {
            // 查询邮件交换记录
            Lookup lookup = new Lookup(domain, Type.MX);
            lookup.run();
            if (lookup.getResult() != Lookup.SUCCESSFUL)
            {
                logger.info(" email domain [" + email + "] incorrect ...");
                return false;
            }
        } catch (Exception e)
        {
            logger.info(" check email domain [" + email + "] faild ...", e);
            return false;
        }
        logger.info(" email domain [" + email + "] correct ...");
        return true;
    }

    public static void main(String[] args)
    {
        System.out.println(lookupDomain("ablipan@163.com1"));
    }
}
