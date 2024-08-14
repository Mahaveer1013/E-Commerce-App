import jwt from 'jsonwebtoken';
import { accessTokenSecret, refreshTokenSecret } from './constant.js';

export function generateAccessToken(payload) {
    return jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' });
}

export function generateRefreshToken(payload) {
    return jwt.sign(payload, refreshTokenSecret, { expiresIn: '30d' });
}