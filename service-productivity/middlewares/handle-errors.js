// Middleware global para manejo centralizado de errores
export const errorHandler = (err, req, res, next) => {
    console.error(`Error in Productivity Server: ${err.message}`);
    console.error(`Request: ${req.method} ${req.path}`);

    // Errores de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token inválido',
            error: 'INVALID_TOKEN',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expirado',
            error: 'TOKEN_EXPIRED',
        });
    }

    // Error personalizado con statusCode definido (ej. fallas al consumir el Task Service)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err.code || 'CUSTOM_ERROR',
        });
    }

    // Error genérico del servidor
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' && {
            details: err.message,
            stack: err.stack,
        }),
    });
};
