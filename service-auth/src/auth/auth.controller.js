import { registerUser, loginUser } from './auth.service.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,20}$/;
const MIN_PASSWORD_LENGTH = 6;

const validateRegisterInput = ({ nombre, username, email, password }) => {
    if (!nombre || !username || !email || !password) {
        return 'nombre, username, email y password son obligatorios';
    }

    if (nombre.trim().length < 2) {
        return 'El nombre debe tener al menos 2 caracteres';
    }

    if (!USERNAME_REGEX.test(username)) {
        return 'El username debe tener 3-20 caracteres (letras, números, "_" o ".")';
    }

    if (!EMAIL_REGEX.test(email)) {
        return 'El formato del correo no es válido';
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
    }

    return null;
};

const validateLoginInput = ({ identifier, password }) => {
    if (!identifier || !password) {
        return 'identifier (email o username) y password son obligatorios';
    }

    return null;
};

export const registerController = async (req, res, next) => {
    try {
        const { nombre, username, email, password } = req.body;

        const validationError = validateRegisterInput({ nombre, username, email, password });
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const user = await registerUser({ nombre, username, email, password });

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user
        });
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;

        const validationError = validateLoginInput({ identifier, password });
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const { user, token } = await loginUser({ identifier, password });

        return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            user,
            token
        });
    } catch (error) {
        next(error);
    }
};