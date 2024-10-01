import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export const authController = {
  loginUser: async (req: Request, res: Response) => {
    const { name, pass } = req.body;

    try {
      const isAuthenticated = await AuthService.authenticateUser(name, pass);
      
      if (isAuthenticated) {
        res.status(200).json({ success: true, message: 'Usuario autenticado con éxito' });
      } else {
        res.status(401).json({ success: false, message: 'Fallo al buscar al usuario' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error del servidor' });
    }
  }
};
