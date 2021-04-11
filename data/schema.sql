DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS messages;


CREATE TABLE admins(
adminid SERIAL PRIMARY KEY,
name VARCHAR(225),
password VARCHAR(225));


CREATE TABLE rooms(
roomid SERIAL PRIMARY KEY,
name VARCHAR(225),
admin_id int,
FOREIGN KEY (admin_id) REFERENCES admins(adminid)
);


CREATE TABLE participants(
participantid SERIAL PRIMARY KEY,
name VARCHAR(225),
email VARCHAR(225)
);


CREATE TABLE messages(
messageid SERIAL PRIMARY KEY,
time DATETIME,
messagebody TEXT,
rooid INT,
roomid FOREIGN KEY REFERENCES rooms(roomid),
participantid INT,
participantid FOREIGN KEY REFERENCES participants(participantid)
);