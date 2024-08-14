import dotenv from 'dotenv'
dotenv.config()

export const googleClientId = process.env.GOOGLE_CLIENT_SECRET

export const mongoURI = process.env.MONGOURI

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

export const jwtSecret = process.env.JWT_SECRET
