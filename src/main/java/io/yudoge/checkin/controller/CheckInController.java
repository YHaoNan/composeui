package io.yudoge.checkin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.yudoge.checkin.bean.CheckInRecord;
import io.yudoge.checkin.repositories.CheckInMapper;
import io.yudoge.checkin.utils.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/checkin")
public class CheckInController {
    private Map<String, Date> ipAccessList = new HashMap<>();

    private CheckInMapper mapper;

    @Autowired
    public CheckInController(CheckInMapper mapper) {
        this.mapper = mapper;
    }

    @PostMapping("/{sid}/{name}/{clz}")
    public Response checkIn(@PathVariable("sid") String sid, @PathVariable("name") String name, @PathVariable("clz") String clz,
                            HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        Date today = new Date();
        if (ipAccessList.containsKey(ip)) {
            if (sameDay(ipAccessList.get(ip), today)) {
                return Response.faild("这台机器今天已经签到过了");
            }
        }

        if (mapper.checkIn(name, sid, clz, new Date()) == 1) {
            ipAccessList.put(ip, today);
            return Response.ok();
        }
        return Response.faild();
    }

    @GetMapping(value = {"/{page}/{size}/{sid}","/{page}/{size}"})
    public Response page(@PathVariable("page") Integer page, @PathVariable("size") Integer size, @PathVariable(value = "sid", required = false) String sid) {
        if (sid == null) sid = "";
        return Response.ok(
                mapper.page(new Page<CheckInRecord>(page, size), sid)
        );
    }

    private boolean sameDay(Date date1, Date date2) {
        Calendar cal1 = Calendar.getInstance();
        Calendar cal2 = Calendar.getInstance();
        cal1.setTime(date1);
        cal2.setTime(date2);
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
                cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR);
    }
}
