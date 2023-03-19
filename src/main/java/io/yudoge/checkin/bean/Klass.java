package io.yudoge.checkin.bean;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("tb_class")
public class Klass {
    private Integer id;
    private String classname;
    private Boolean needCheckIn;
}
