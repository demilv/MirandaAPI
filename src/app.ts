import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import checkUser from './mongodb/HashingChecking/HashCheck';
import routerRooms from './routes/roomRoutes';
import routerUsers from './routes/userRoutes';
import routerReviews from './routes/reviewRoutes';
import routerBookings from './routes/bookingRoutes';
import AuthMiddleware from './middleware/auth';  
import serverless from 'serverless-http';
import mysql from 'mysql2/promise';

dotenv.config();

export const app = express();
app.use(cors());

let db: mysql.Connection;

const start = async () => {
    try {
        db = await mysql.createConnection({
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASS,
            database: process.env.MYSQLDB,
        });
        console.log('Conectado a MySQL');
        mysqlRoutes();
    } catch (error) {
        console.error('Error conectando a MySQL:', error);
        process.exit(1);
    }
};

const mysqlRoutes = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (_req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.post('/login', async (req: Request, res: Response, _next: NextFunction) => {
      const { name, password } = req.body;
      
      try {
          const [result] = await db.execute<mysql.RowDataPacket[]>('SELECT * FROM Users WHERE name = ?', [name]);

          if (result.length === 0) {    
              return res.status(401).json({ error: true, message: 'Usuario no encontrado' });
          }

          const authenticated = await checkUser(db, name, password);

          if (authenticated) {
              const token = jwt.sign({ name }, process.env.MYKEY || "secretKey", { expiresIn: "1800s" });
              return res.json({ token });
          } else {
              return res.status(401).json({ error: true, message: 'Credenciales inválidas' });
          }
      } catch (error) {
        console.error('Error al hacer /login:', error);
          return res.status(500).json({ error: true, message: 'Error en el servidor' });
      }
  });

  app.use('/rooms', AuthMiddleware, routerRooms(db));
  app.use('/users', AuthMiddleware, routerUsers(db));
  app.use('/reviews', AuthMiddleware, routerReviews(db));
  app.use('/bookings', AuthMiddleware, routerBookings(db));

  // app.use('/auth', AuthMiddleware, routerAuth);

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err);
      return res.status(500).json({ error: true, message: err.message || 'Application error' });
  });
}

start();

export const handler = serverless(app);
