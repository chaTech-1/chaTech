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
adminid FOREIGN KEY REFERENCES admins(adminid));


CREATE TABLE participants(
participantid SERIAL PRIMARY KEY,
name VARCHAR(225),
email VARCHAR(225)
);


CREATE TABLE messages(
messageid INT PRIMARY KEY,
time DATETIME,
messagebody TEXT,
roomid FOREIGN KEY REFERENCES rooms(roomid),
participantid FOREIGN KEY REFERENCES participants(participantid)
);