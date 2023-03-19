package io.yudoge.checkin.repositories;

import io.yudoge.checkin.bean.Klass;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface KlassMapper {
    @Insert("INSERT INTO tb_class (classname, need_check_in) VALUES (#{classname}, false)")
    int addClass(@Param("classname") String classname);

    @Select("SELECT * FROM tb_class")
    List<Klass> findAll();

    @Select("SELECT * FROM tb_class WHERE need_check_in = true")
    List<Klass> findAllNeedCheckIn();

    int setNeedCheckInClasses(@Param("ids") List<Integer> ids);
}
