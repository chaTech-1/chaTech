INSERT INTO rooms (name,adminid)
VALUES ('room-1' , 1),
 ('room-2' , 1),
 ('room-3' , 1),
 ('room-4' , 1),
 ('room-5' , 1),
 ('room-6' , 1),
 ('room-7' , 1),
 ('room-8' , 1);

INSERT INTO participants (name,email,password)
VALUES ('user-1' , 'email-1', '123'),
('user-2' , 'email-2', '456'),
('user-3' , 'email-3', '789');

INSERT INTO messages (messagebody,roomid,participantid)
VALUES ('Praesent eu elementum enim, in mattis nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.', 3, 1),
('Mauris non elementum massa. Maecenas eget velit at sapien aliquam.', 3, 1),
('Phasellus lectus nunc, consectetur eu tellus in, commodo sollicitudin sapien.', 3, 1),
('Mauris non elementum massa. Maecenas eget velit at sapien aliquam.', 3, 2),
('Phasellus lectus nunc, consectetur eu tellus in, commodo sollicitudin sapien.', 3, 2),
('Maecenas eget velit at sapien aliquam.', 4, 1),
('Mauris non elementum massa. Maecenas eget velit at sapien aliquam.', 4, 1),
('Phasellus lectus nunc, consectetur eu tellus in, commodo sollicitudin sapien.', 4, 1),
('Maecenas eget velit at sapien aliquam.', 4, 1),
('Mauris non elementum massa. Maecenas eget velit at sapien aliquam.', 5, 2),
('Phasellus lectus nunc, consectetur eu tellus in, commodo sollicitudin sapien.', 5, 2),
('Mauris non elementum massa. Maecenas eget velit at sapien aliquam.', 5, 1),
('Phasellus lectus nunc, consectetur eu tellus in, commodo sollicitudin sapien.', 6, 1),
('Maecenas eget velit at sapien aliquam.', 6, 2),
('Mauris non elementum massa. Maecenas eget velit at sapien aliquam.', 7, 1),
('Phasellus lectus nunc, consectetur eu tellus in, commodo sollicitudin sapien.', 8, 1);


