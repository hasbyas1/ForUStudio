import jwt from "jsonwebtoken";
import Users from "../models/UsersModel.js";
import Roles from "../models/RolesModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user to make sure they still exist and are active
    const user = await Users.findByPk(decoded.userId, {
      include: [
        {
          model: Roles,
          as: "role",
          attributes: ["roleId", "roleName", "description"],
        },
      ],
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Add user info to request object
    req.user = {
      userId: user.userId,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      roleId: user.roleId,
      roleName: user.role?.roleName,
      isActive: user.isActive
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.roleName !== 'admin') {
    return res.status(403).json({ 
      message: "Access denied. Admin privileges required." 
    });
  }

  next();
};

// Middleware to check if user is owner or admin
export const requireOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const targetUserId = parseInt(req.params.id);
  const currentUserId = req.user.userId;
  const isAdmin = req.user.roleName === 'admin';

  if (!isAdmin && currentUserId !== targetUserId) {
    return res.status(403).json({ 
      message: "Access denied. You can only access your own data." 
    });
  }

  next();
};