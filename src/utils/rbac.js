
/**
 * Middleware to validate the role of the admin.
 * @param {Array} allowedRoles - An array of roles that are allowed to access the route.
 * @returns {Function} Middleware function to validate role.
 */
export const validateRole = (allowedRoles) => {
    return (req, res, next) => {
      try {
        const { user } = req; // Assuming `validateAdminToken` adds the user info to req
        if (!user) {
          return res.status(401).send({ error: "Unauthorized: User not found" });
        }
  
        if (!allowedRoles.includes(user.role)) {
          return res
            .status(403)
            .send({ error: "Forbidden: Insufficient permissions" });
        }
  
        next(); // User has the required role, proceed to the next middleware
      } catch (err) {
        return res.status(500).send({ error: "Internal Server Error" });
      }
    };
  };
  