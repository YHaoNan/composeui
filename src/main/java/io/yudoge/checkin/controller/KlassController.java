package io.yudoge.checkin.controller;

import io.yudoge.checkin.repositories.KlassMapper;
import io.yudoge.checkin.utils.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/class")
public class KlassController {
    private KlassMapper mapper;

    @Autowired
    public KlassController(KlassMapper mapper) {
        this.mapper = mapper;
    }

    @PostMapping("/{name}")
    public Response addClass(@PathVariable("name") String name) {
        if (mapper.addClass(name) == 1)
            return Response.ok();
        return Response.faild();
    }

    @GetMapping
    public Response findAll() {
        return Response.ok(mapper.findAll());
    }
    @GetMapping("/needcheckin")
    public Response findAllNeedCheckIn() {
        return Response.ok(mapper.findAllNeedCheckIn());
    }

    @PostMapping("/update/{ids}")
    public Response setNeedCheckInClasses(@PathVariable("ids") List<Integer> ids) {
        mapper.setNeedCheckInClasses(ids);
        return Response.ok();
    }
}
