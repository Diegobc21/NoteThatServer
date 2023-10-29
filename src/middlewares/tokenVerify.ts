import { jwt } from '../helpers/tokens.js';

const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token not given' });
  }

  jwt.verify(token, 'token', (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

export {
  verifyToken
};

