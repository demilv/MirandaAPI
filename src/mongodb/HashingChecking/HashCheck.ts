import { Connection, RowDataPacket } from 'mysql2/promise';

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
  
  export default async function checkUser(connection: Connection, name: string, password: string): Promise<boolean> {
    try {
      const [rows]: [RowDataPacket[], any] = await connection.query('SELECT pass FROM Users WHERE name = ?', [name]);
      
      console.log(name)
      console.log(rows)

      if (!Array.isArray(rows) || rows.length === 0) {
        console.log('Usuario no encontrado');
        return false;
      }

      const user = rows[0];

      const matchPass = await bcrypt.compare(password, user.pass);

      if (matchPass) {
        console.log('Autenticación exitosa');
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