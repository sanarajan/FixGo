"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = void 0;
const tsyringe_1 = require("tsyringe");
const protectedRoute = (req, res, next) => {
    const userRole = req.headers['userrole'];
    const refreshToken = req.cookies?.[`${userRole}_refreshToken`];
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!accessToken) {
        res.status(401).json({ message: 'Access token missing' });
        return;
    }
    const authService = tsyringe_1.container.resolve('AuthService');
    try {
        const payload = authService.verifyAccessToken(accessToken);
        req.user = payload; // attach user info for later use
        next();
    }
    catch (err) {
        console.error('Access token verification failed:', err.message);
        res.status(401).json({ message: 'Access token invalid or expired' });
    }
};
exports.protectedRoute = protectedRoute;
//# sourceMappingURL=authMiddleware.js.map