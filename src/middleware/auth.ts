import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

/*export const TokenAccess = () =>{
  return (_req: Request, _res: Response, _next: NextFunction) => {
    const token = jwt.sign({email: "kdeveral0@nifty.com"}, process.env.MYKEY as string, { expiresIn: '1200s'})
    _req.headers["authorization"] = `Bearer ${token}`
    _next()
  }
}*/

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] as string;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    next(res.status(401).json({ error: true, message: 'Token not provided' }));
    return;
  }

  jwt.verify(token, process.env.MYKEY as string, (err: any) => {
    if (err) {
      next(res.status(403).json({ error: true, message: 'Token is not valid' }));
      return;
    }
    next();
  });
}

export default AuthMiddleware;
