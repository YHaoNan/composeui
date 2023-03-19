package io.yudoge.checkin.repositories;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.yudoge.checkin.bean.CheckInRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Date;

@Mapper
public interface CheckInMapper extends BaseMapper<CheckInRecord> {
    @Insert("INSERT INTO tb_checkin (name, sid, checkdate, classname) VALUES (#{name}, #{sid}, #{date}, #{clz})")
    int checkIn(@Param("name") String name, @Param("sid") String sid, @Param("clz") String clz, @Param("date") Date date);
    /**
     * 根据sid模糊查询并分页
     */
    @Select("SELECT * FROM tb_checkin WHERE sid LIKE CONCAT('%', #{sid}, '%') ORDER BY checkdate DESC")
    Page<CheckInRecord> page(Page<CheckInRecord> page, @Param("sid") String sid);
}
