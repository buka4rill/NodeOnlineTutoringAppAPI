/** 
 * This checks to see if there's a token and header
 */
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorisation denied'});
    }

    // If there's a token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        
        // Admin user model
        // Check if user is admin
        // If admin ... return req.adminUser
        // else 
        // err - user not an admin


        // Assign user to request object
        req.adminUser = decoded.adminUser;

        

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}