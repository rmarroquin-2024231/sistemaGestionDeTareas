import jwt from 'jsonwebtoken';

// Middleware para validar el token JWT en cada request protegido.
// El token es emitido por el service-auth con el payload:
// { sub: user._id, email: user.email, username: user.username }
export const validateJWT = (req, res, next) => {
    const secret = process.env.JWT_SECRET;

    // Verificar que el secret esté configurado
    if (!secret) {
        return res.status(500).json({
            success: false,
            message: 'Configuración del servidor inválida: falta JWT_SECRET',
        });
    }

    // Aceptar token por header x-token o Authorization Bearer
    const token =
        req.header('x-token') ||
        req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No se proporcionó un token',
            error: 'MISSING_TOKEN',
        });
    }

    try {
        // El service-auth no firma con issuer/audience, solo con el secret compartido
        const decoded = jwt.verify(token, secret);

        // Exponer solo la info necesaria del usuario en el request
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            username: decoded.username,
        };

        // Se conserva el token para propagarlo al Task Service
        req.token = token;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'El token ha expirado',
                error: 'TOKEN_EXPIRED',
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido',
                error: 'INVALID_TOKEN',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error al validar el token',
            error: 'TOKEN_VALIDATION_ERROR',
        });
    }
};
