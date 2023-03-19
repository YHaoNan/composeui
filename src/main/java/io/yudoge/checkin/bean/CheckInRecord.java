package io.yudoge.checkin.bean;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
@TableName("tb_checkin")
public class CheckInRecord {
    @TableId
    private Integer id;
    private String name;
    private String sid;
    private String classname;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone="GMT+8")
    private Date checkdate;
}
