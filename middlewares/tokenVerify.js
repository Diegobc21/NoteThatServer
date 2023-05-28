import { jwt } from '../helpers/tokens.js'

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  // Verifica el token usando JWT
  jwt.verify(token, 'token', (err, decoded) => {
    console.log(decoded)
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Almacenar los datos del usuario en el objeto de solicitud para su uso posterior
    req.user = decoded;
    next();
  });
}

export {
  verifyToken
} 