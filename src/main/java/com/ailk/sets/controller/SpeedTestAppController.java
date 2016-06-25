/**
 * author :  lipan
 * filename :  SpeedTestAppController.java
 * create_time : 2014年8月20日 下午4:03:08
 */
package com.ailk.sets.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ailk.sets.common.EPResponse;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.grade.intf.BaseResponse;
import com.ailk.sets.platform.intf.common.Constants;
import com.ailk.sets.platform.intf.domain.ActivityAddressSignal;
import com.ailk.sets.platform.intf.domain.ActivityRecruitAddress;
import com.ailk.sets.platform.intf.empl.service.IConfigSysParamService;
import com.ailk.sets.platform.intf.empl.service.ISchoolPositionService;
import com.ailk.sets.platform.intf.model.campus.CampusRsp;

/**
 * @author : lipan
 * @create_time : 2014年8月20日 下午4:03:08
 * @desc : 测速App接口
 * @update_person:
 * @update_time :
 * @update_desc :
 *
 */
@RestController
@RequestMapping("/speedtest")
public class SpeedTestAppController
{
    public static final Logger logger = Logger.getLogger(SpeedTestAppController.class);

    @Autowired
    private ISchoolPositionService iSchoolPositionService;

    @Autowired
    private IConfigSysParamService iConfigSysParamService;

    /**
     *  查询基本信息
     * @return
     */
    @RequestMapping(value = "/getBasicInfo")
    public @ResponseBody EPResponse<Map<String, String>> getBasicInfo()
    {
        EPResponse<Map<String, String>> epResponse = new EPResponse<Map<String, String>>();
        Map<String, String> data = new HashMap<String, String>();
        try
        {
            data.put("uploadUrl", iConfigSysParamService.getConfigSysParam(Constants.SPEED_TEST_UPLOAD_URL));// 上传url
            data.put("downloadUrl", iConfigSysParamService.getConfigSysParam(Constants.SPEED_TEST_DOWNLOAD_URL));// 下载url
            data.put("downloadUrlHost", iConfigSysParamService.getConfigSysParam(Constants.SPEED_TEST_DOWNLOAD_HOST));// 下载url主机
            data.put("downloadUrlPort", iConfigSysParamService.getConfigSysParam(Constants.SPEED_TEST_DOWNLOAD_PORT));// 下载url端口
            data.put("downloadUrlPath", iConfigSysParamService.getConfigSysParam(Constants.SPEED_TEST_DOWNLOAD_PATH));// 下载url路径
            data.put("formulaNum", iConfigSysParamService.getConfigSysParam(Constants.SPEED_TEST_FORMULA_NUM));// 公式常量值
            data.put("comments", iConfigSysParamService.getConfigSysParam(Constants.SPEED_TEST_NEED_TO_KNOW));// 需知。。
            data.put("errorCode", BaseResponse.SUCCESS+"");
            epResponse.setCode(SysBaseResponse.SUCCESS);
        } catch (Exception e)
        {
            data.put("errorCode", BaseResponse.EABORT+"");
            epResponse.setCode(SysBaseResponse.ESYSTEM);
            logger.error("error call getBasicInfo ", e);
        }finally
        {
            epResponse.setData(data);
        }
        return epResponse;
    }
    
    /**
     * 校验口令、根据口令查询学校信息
     * @param passport
     * @return
     */
    @RequestMapping(value = "/checkPassport/{passport}")
    public @ResponseBody EPResponse<CampusRsp> checkPassport(@PathVariable String passport)
    {
        EPResponse<CampusRsp> epResponse = new EPResponse<CampusRsp>();
        try
        {
            epResponse.setCode(SysBaseResponse.SUCCESS);
            epResponse.setData(iSchoolPositionService.getAddListByEpPassport(passport));
        } catch (Exception e)
        {
            epResponse.setCode(SysBaseResponse.ESYSTEM);
            logger.error("error call saveInterview ", e);
        }
        return epResponse;
    }
    
    /**
     * 新增/更新学校地址信息
     * @param passport
     * @return
     */
    @RequestMapping(value = "/saveAddress")
    public @ResponseBody EPResponse<CampusRsp> saveAddress(@RequestBody ActivityRecruitAddress address)
    {
        EPResponse<CampusRsp> epResponse = new EPResponse<CampusRsp>();
        try
        {
            epResponse.setCode(SysBaseResponse.SUCCESS);
            epResponse.setData(iSchoolPositionService.saveAddress(address));
        } catch (Exception e)
        {
            epResponse.setCode(SysBaseResponse.ESYSTEM);
            logger.error("error call saveInterview ", e);
        }
        return epResponse;
    }
    
    /**
     * 上传学校信号、带宽数据
     * @param passport
     * @return
     */
    @RequestMapping(value = "/uploadResult")
    public @ResponseBody EPResponse<CampusRsp> uploadResult(@RequestBody ActivityRecruitAddress address)
    {
        EPResponse<CampusRsp> epResponse = new EPResponse<CampusRsp>();
        try
        {
            epResponse.setCode(SysBaseResponse.SUCCESS);
            epResponse.setData(iSchoolPositionService.updateAddress(address));
        } catch (Exception e)
        {
            epResponse.setCode(SysBaseResponse.ESYSTEM);
            logger.error("error call saveInterview ", e);
        }
        return epResponse;
    }
    
    /**
     * 上传测速日志数据
     * @param passport
     * @return
     */
    @RequestMapping(value = "/uploadLogs")
    public @ResponseBody EPResponse<CampusRsp> uploadLogs(@RequestBody List<ActivityAddressSignal> signalList )
    {
        EPResponse<CampusRsp> epResponse = new EPResponse<CampusRsp>();
        try
        {
            epResponse.setCode(SysBaseResponse.SUCCESS);
            epResponse.setData(iSchoolPositionService.saveSpeedTestLog(signalList));
        } catch (Exception e)
        {
            epResponse.setCode(SysBaseResponse.ESYSTEM);
            logger.error("error call saveInterview ", e);
        }
        return epResponse;
    }
    
}
