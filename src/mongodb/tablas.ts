import dotenv from 'dotenv';
import { Connection } from 'mysql2/promise';

dotenv.config();

export async function tablas(conexion: Connection) {
  try {
    await conexion.query(`DROP TABLE IF EXISTS Users;`);
    await conexion.query(`DROP TABLE IF EXISTS RoomPhotos;`);
    await conexion.query(`DROP TABLE IF EXISTS RoomAmenities;`);
    await conexion.query(`DROP TABLE IF EXISTS Bookings;`);
    await conexion.query(`DROP TABLE IF EXISTS Rooms;`);
    await conexion.query(`DROP TABLE IF EXISTS Reviews;`);

    await conexion.query(`
      CREATE TABLE IF NOT EXISTS Users (
        _id INT PRIMARY KEY AUTO_INCREMENT,
        photo VARCHAR(255),
        name VARCHAR(50) NOT NULL,
        startDate DATE NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        job VARCHAR(50),
        phone VARCHAR(50),
        status BOOLEAN NOT NULL,
        pass VARCHAR(255) NOT NULL
      );
    `);

    await conexion.query(`
      CREATE TABLE IF NOT EXISTS Rooms (
        _id INT PRIMARY KEY AUTO_INCREMENT,
        number VARCHAR(10) NOT NULL,
        floor INT NOT NULL,
        bedType VARCHAR(50) NOT NULL,
        price INT NOT NULL,
        status BOOLEAN NOT NULL,
        offer INT DEFAULT 0
      );
    `);

    await conexion.query(`
      CREATE TABLE IF NOT EXISTS RoomPhotos (
        _id INT PRIMARY KEY AUTO_INCREMENT, 
        roomId INT, 
        photoLink VARCHAR(255) NOT NULL,
        FOREIGN KEY (roomId) REFERENCES Rooms(_id) ON DELETE CASCADE
      );
    `);

    await conexion.query(`
      CREATE TABLE IF NOT EXISTS RoomAmenities (
        _id INT PRIMARY KEY AUTO_INCREMENT,
        roomId INT, 
        amenity VARCHAR(30) NOT NULL,  
        FOREIGN KEY (roomId) REFERENCES Rooms(_id) ON DELETE CASCADE
      );
    `);
    

    await conexion.query(`
      CREATE TABLE IF NOT EXISTS Bookings (
        _id INT PRIMARY KEY AUTO_INCREMENT,
        fotoLink VARCHAR(255),
        guest VARCHAR(50) NOT NULL,
        orderDate DATE NOT NULL,
        checkInDate DATE NOT NULL,
        checkOutDate DATE NOT NULL,
        specialRequest TEXT,
        status ENUM('Check in', 'Check out', 'In progress') NOT NULL,
        roomId INT,
        FOREIGN KEY (roomId) REFERENCES Rooms(_id) ON DELETE CASCADE
      );
    `);

    await conexion.query(`
      CREATE TABLE IF NOT EXISTS Reviews (
        _id INT PRIMARY KEY AUTO_INCREMENT,
        date DATE NOT NULL,
        hora TIME NOT NULL,
        customerName VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        stars INT CHECK (stars BETWEEN 1 AND 5),
        review TEXT,
        status BOOLEAN NOT NULL,
        phone VARCHAR(15)
      );
    `);

    console.log('Tablas creadas');
  } catch (err) {
    console.error('Error creando tablas: ', err);
  } 
}
