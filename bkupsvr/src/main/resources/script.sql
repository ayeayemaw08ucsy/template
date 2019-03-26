insert into users (id,status, firstname, lastname,password,username,enabled,accountnonexpired,accountnonlocked,credentialsnonexpired) values (1,23, 'admin', 'admin','$2a$04$EZzbSqieYfe/nFWfBWt2KeCdyq0UuDEM1ycFF8HzmlVR6sbsOnw7u','admin',1,1,1,1);
insert into users (id,status, firstname, lastname,password,username,enabled,accountnonexpired,accountnonlocked,credentialsnonexpired) values (2,23, 'ppa', 'ppa','$2a$04$EZzbSqieYfe/nFWfBWt2KeCdyq0UuDEM1ycFF8HzmlVR6sbsOnw7u','ppa',1,1,1,1);

INSERT INTO `bbi_user_func_list` (`user_limits_mst_seq_id`, `function_code`, `entity`, `username`) VALUES ('2323232', 'FA_NEW', 'EN1', 'admin');


insert into role (id, name) values (1, 'roleone');
insert into role (id, name) values (2, 'roletwo');

insert into user_role_link (user_id,role_id) values (1 , 1);
insert into user_role_link (user_id,role_id) values (2 , 2);

insert into access (id,access_link,access_name) values (1,'role_1', 'getting user list');
insert into access (id,access_link,access_name) values (2,'ROLE_2', 'Add User');
insert into access (id,access_link,access_name) values (3,'ROLE_3', 'Find User by Id');

insert into role_access_link (role_id,access_id) values (1 , 1);
insert into role_access_link (role_id,access_id) values (1 , 2);
insert into role_access_link (role_id,access_id) values (2 , 3);

insert into holiday (holiday_id,date, event, year) values (1111111, '2019-01-04', 'Independence Day', 2019);

insert into bbi_weeklywork_policy (workday_seq_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday) values ('weeklypolicy_id', true, true, true, true, true, false, false);

create table if not exists oauth_access_token (
  token_id VARCHAR(255),
  token LONG VARBINARY,
  authentication_id VARCHAR(255) PRIMARY KEY,
  user_name VARCHAR(255),
  client_id VARCHAR(255),
  authentication LONG VARBINARY,
  refresh_token VARCHAR(255)
);
create table if not exists oauth_refresh_token (
  token_id VARCHAR(255),
  token LONG VARBINARY,
  authentication LONG VARBINARY
);


	

/**code initial startup script.*/
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("000","Entity",4,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("002","Region Codes",3,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("003","Branch Codes",4,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("004","Department Codes",3,now());

/**User 026-050*/
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("026","Role Codes",2,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("027","Function Codes",4,now());

INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("028","Limit Codes",3,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("029","Matrix Codes",3,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("031","Gender",1,now());

/**Product 051-200*/
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("051","Product Codes",2,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("052","Asset Type Codes",2,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("053","Asset Sub_type Codes",3,now());

/**Global 301-400*/
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("301","Country Codes",2,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("302","Currency Codes",3,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("303","Numeric Currency Codes",3,now());

/**Processing 401-500*/
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("401","Product Status Codes",2,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("402","Transaction Status Codes",2,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("403","Transaction Type Codes",2,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("404","Transaction Sub-type Codes",2,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("405","Depreciation Collection Frequency",1,now());

INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("451","Update Flag",1,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("452","Archive Flag",1,now());


/**Batch 501 - 600*/
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("501","Job Category",3,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("502","Job Frequency",3,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("503","Job Level",3,now());
INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("504","Job Status",1,now());

INSERT INTO  bbi_code_id (code_id,code_id_desc,code_val_length,created_date) values ("005","Vendor Codes",3,now());

INSERT INTO `bbi_code_val_mst` (`code_val_mst_seq_id`, `code_val`, `long_desc`, `short_desc`, `code_id`, `code_val_update_flag`) VALUES ('19-Jan-15489095535546544', 'AAA', 'LIMIT CODE', 'Level One', '028', 'Y');
INSERT INTO `bbi_code_val_mst` (`code_val_mst_seq_id`, `code_val`, `long_desc`, `short_desc`, `code_id`, `code_val_update_flag`) VALUES ('19-Jan-15489095335546544', 'BBB', 'LIMIT CODE', 'Level Two', '028', 'Y');
INSERT INTO `bbi_code_val_mst` (`code_val_mst_seq_id`, `code_val`, `long_desc`, `short_desc`, `code_id`, `code_val_update_flag`) VALUES ('19-Jan-25489095335546544', 'CCC', 'LIMIT CODE', 'Level Three', '028', 'Y');
INSERT INTO `bbi_code_val_mst` (`code_val_mst_seq_id`, `code_val`, `long_desc`, `short_desc`, `code_id`, `code_val_update_flag`) VALUES ('19-Jan-25489095335546546', 'DDD', 'LIMIT CODE', 'Level Four', '028', 'Y');
INSERT INTO `bbi_code_val_mst` (`code_val_mst_seq_id`, `code_val`, `long_desc`, `short_desc`, `code_id`, `code_val_update_flag`) VALUES ('19-Jan-15489095535546564', 'FA_AMEND', 'FUNCTION CODE', 'Update FA', '027', 'Y');

INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`) VALUES ('1002', '1', 'Start Of Day', 'Online Status Change - Online', 'Daily', 'SSCG1002', '6:00');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`) VALUES ('1003', '1', 'Start Of Day', 'Notification (Online, Ready)', 'Daily', 'SNTF1003', '6:00');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`) VALUES ('2000', '1', 'End Of Day', 'Notification (going offline, sign-off)', 'Daily', 'ENTF2000', '17:00');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2001', '1', 'End Of Day', 'disconnect/logoff users', 'Daily', 'EDSC2001', '18:00', '2002', 'ESCG2002');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2002', '1', 'End Of Day', 'Online Status Change - Offline', 'Daily', 'ESCG2002', '18:00', '2003', 'EBKP2003');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2003', '1', 'End Of Day', 'Database Backup', 'Daily', 'EBKP2003', '18:00', '2004', 'EFAA2004');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2004', '1', 'End Of Day', 'Postings - Fixed Assets', 'Daily', 'EFAA2004', '18:00', '2005', 'EDEP2005');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2005', '1', 'End Of Day', 'Depreciation processing', 'Daily', 'EDEP2005', '18:00', '2006', 'EDAA2006');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2006', '1', 'End Of Day', 'Postings - Depreciation', 'Daily', 'EDAA2006', '18:00', '2007', 'EDPP2007');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2007', '1', 'End Of Day', 'Depreciation Plan', 'Daily', 'EDPP2007', '18:00', '2008', 'EFAR2008');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2008', '1', 'End Of Day', 'Postings Report - Fixed Assets', 'Daily', 'EFAR2008', '18:00', '2009', 'EDER2009');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2009', '1', 'End Of Day', 'Postings Report - Depreciation', 'Daily', 'EDER2009', '18:00', '2010', 'ER012010');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`, `next_job_id`, `next_job_name`) VALUES ('2010', '1', 'End Of Day', 'FA Daily Transaction', 'Daily', 'ER012010', '18:00', '2011', 'ER022011');
INSERT INTO `bbi_batch_job_mst` (`job_id`, `active_status`, `job_category`, `job_description`, `job_freq`, `job_name`, `job_start_time`) VALUES ('2011', '1', 'End Of Day', 'System Activty Report', 'Daily', 'ER022011', '18:00');
