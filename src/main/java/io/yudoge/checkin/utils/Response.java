package io.yudoge.checkin.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response {
    private Boolean successed;
    private Object data;
    private String errorMsg;

    public static Response ok(Object data) {
        return new Response(true, data, null);
    }

    public static Response faild(String errorMsg) {
        return new Response(false, null, errorMsg);
    }

    public static Response ok() {
        return ok(null);
    }

    public static Response faild() {
        return faild(null);
    }

}
