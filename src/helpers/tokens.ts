import jwt from 'jsonwebtoken';

const generateToken = () => Date.now().toString(32) + Math.random().toString(32).substring(2)

export {
    generateToken,
    jwt
}