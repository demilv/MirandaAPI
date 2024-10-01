import { UserModel } from "../Schemas/user";
const bcrypt = require('bcryptjs');
const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (err) {
      throw new Error('Error en la generación del hash de la contraseña');
    }
  }
  
  export default async function checkUser(name: string, password: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ name:name }).exec();
      if (!user) {
        console.log('Usuario no encontrado');
        return false;
      }

      const matchPass = await bcrypt.compare(password, user.pass);
      
      if (matchPass) {
        console.log('Autenticación exitosa noice');
        return true;
      } else {
        console.log('Contraseña incorrecta');
        return false;
      }
    } catch (err) {
      console.error('Error al verificar las credenciales:', err);
      return false;
    }
  }