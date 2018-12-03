BEGIN TRANSACTION;

INSERT INTO tbusers (name, email, entries, age, pet, joined) VALUES ('Nak', 'nak@gmail.com', '5', '27', 'Dragon', '2018-11-09 22:07:28.787');
INSERT INTO tblogin (hash, email) VALUES ('$2a$10$nF2Zoye4TTobUdtwSgk4XOoryhwh9vVJ/IPTFDlJjzaKaEHBFgQLW', 'nak@gmail.com');

COMMIT;
