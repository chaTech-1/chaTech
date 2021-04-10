DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS messages;


CREATE TABLE admins(
admin_id SERIAL PRIMARY KEY,
name VARCHAR(225),
password VARCHAR(225));

CREATE TABLE rooms(
room_id SERIAL PRIMARY KEY,
name VARCHAR(225),
admin_id FOREIGN KEY,
REFERENCES admins(admin_id));


CREATE TABLE participants(
participant_id SERIAL PRIMARY KEY,
email VARCHAR(225),
name VARCHAR(225));


CREATE TABLE messages(
message_id INT PRIMARY KEY,
time DATETIME,
message_body TEXT,
room_id FOREIGN KEY,
participant_id FOREIGN KEY,
REFERENCES participants(participant_id) rooms(room_id));