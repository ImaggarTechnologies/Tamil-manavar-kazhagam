import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tmm_super_secret_key_change_me';

export interface AuthenticatedRequest extends Request {
  adminId?: string;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      req.adminId = decoded.adminId;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
};
