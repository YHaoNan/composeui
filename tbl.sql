CREATE TABLE tb_checkin (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(10) NOT NULL,
                            sid CHAR(10) NOT NULL,
                            checkdate DATE NOT NULL,
                            classname VARCHAR(10) NOT NULL,
                            UNIQUE idx_sid_date(sid, checkdate)
);

CREATE TABLE tb_class(
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         classname VARCHAR(10) NOT NULL UNIQUE,
                         need_check_in bool NOT NULL
);