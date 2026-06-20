"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'tmm_super_secret_key_change_me';
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Forbidden: Invalid token' });
            }
            req.adminId = decoded.adminId;
            next();
        });
    }
    else {
        res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
};
exports.authenticateJWT = authenticateJWT;
