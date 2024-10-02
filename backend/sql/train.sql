CREATE DATABASE train;
USE train;

-- Tạo bảng Role
CREATE TABLE role (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Tạo bảng User
CREATE TABLE user (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255),
    phone VARCHAR(15) NOT NULL,
    mail VARCHAR(255) NOT NULL,
    can_cuoc VARCHAR(20) NOT NULL,
    role_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Tạo bảng Station
CREATE TABLE station (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_delete BOOLEAN DEFAULT 0 
);

-- Tạo bảng Train
CREATE TABLE train (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    pictureUrl VARCHAR(255),
    is_delete BOOLEAN DEFAULT 0
);

-- Tạo bảng Route
CREATE TABLE route (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    startStationId INTEGER NOT NULL,
    endStationId INTEGER NOT NULL,
    FOREIGN KEY (startStationId) REFERENCES station(id),
    FOREIGN KEY (endStationId) REFERENCES station(id),
    is_delete BOOLEAN DEFAULT 0 
);

-- Tạo bảng Schedules
CREATE TABLE schedules (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    train_id INTEGER NOT NULL,
    route_id INTEGER NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    FOREIGN KEY (train_id) REFERENCES train(id),
    FOREIGN KEY (route_id) REFERENCES route(id)
);

-- Tạo bảng Carriage
CREATE TABLE carriage (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    train_id INTEGER NOT NULL,
    description VARCHAR(255),
    is_delete BOOLEAN DEFAULT 0, 
    FOREIGN KEY (train_id) REFERENCES train(id)
);

-- Tạo bảng Seat (chỗ ngồi)
CREATE TABLE seat (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    carriage_id INTEGER NOT NULL,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    description VARCHAR(255),
    is_delete BOOLEAN DEFAULT 0, 
    FOREIGN KEY (carriage_id) REFERENCES carriage(id)
);

-- Tạo bảng Promotion
CREATE TABLE promotion (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    price DECIMAL(10, 2),
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    is_delete BOOLEAN DEFAULT 0 
);

-- Tạo bảng Ticket
CREATE TABLE ticket (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    schedules_id INTEGER NOT NULL, 
    seat_id INTEGER NOT NULL, 
    dateBuy DATETIME,
    status VARCHAR(50),
    object VARCHAR(255),
    fullname VARCHAR(255),
    can_cuoc VARCHAR(255),
    promotion_id INTEGER, 
    price DECIMAL(10, 2),
    price_reduced DECIMAL(10, 2),
    FOREIGN KEY (schedules_id) REFERENCES schedules(id),
    FOREIGN KEY (seat_id) REFERENCES seat(id),
    FOREIGN KEY (promotion_id) REFERENCES promotion(id)
);

-- Tạo bảng Order
CREATE TABLE `order` (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Tạo bảng Order_Item
CREATE TABLE order_item (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    ticket_id INTEGER NOT NULL, 
    order_id INTEGER NOT NULL, 
    FOREIGN KEY (ticket_id) REFERENCES ticket(id),
    FOREIGN KEY (order_id) REFERENCES `order`(id)
);
