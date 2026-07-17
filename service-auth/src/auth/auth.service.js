import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from './auth.model.js';

export const registerUser = async ({ nombre, username, email, password }) => {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
        const error = new Error(
            existingUser.email === email
                ? 'El correo ya está registrado'
                : 'El nombre de usuario ya está en uso'
        );
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await argon2.hash(password);
    const user = new User({ nombre, username, email, password: hashedPassword });

    await user.save();
    return user;
};

export const loginUser = async ({ identifier, password }) => {
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user || !(await argon2.verify(user.password, password))) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { sub: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return { user, token };
};