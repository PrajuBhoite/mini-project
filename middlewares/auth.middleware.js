const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils");

const authMiddleware = async (req, res, next) => {
   const authorizationHeader = req.headers["authorization"];     
    if (!authorizationHeader) {
        return res.status(401).json({
            success: false,
            code: 401,
            message: 'Unauthorized access, missing authorization information',
            data: null,
            error: null,
        })
    }
    const [bearer, token] = authorizationHeader.split(" ");
    if (!bearer || !token || (bearer && bearer !== 'Bearer')) {    
        return res.status(401).json({
            success: false,
            code: 401,
            message: 'Unauthorized access, authorization information is not in a valid format',
            data: null,
            error: null,
        })
    }
;
try {
    const decodedToken = await jwt.verify(token, JWT_SECRET);
    res.locals.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      code: 401,
      message: "Unauthorized access " + error.message,
      data: null,
      error: null,
      resource: req.originalUrl,
    });
  }
 };

module.exports.authMiddleware = authMiddleware;