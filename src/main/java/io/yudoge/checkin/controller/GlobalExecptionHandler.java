package io.yudoge.checkin.controller;

import io.yudoge.checkin.utils.Response;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExecptionHandler {
    @ExceptionHandler(Throwable.class)
    public Response handle(Throwable e) {
        e.printStackTrace();
        return Response.faild(e.getClass().getSimpleName());
    }
}
