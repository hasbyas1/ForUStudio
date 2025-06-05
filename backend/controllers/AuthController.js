import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../models/UsersModel.js";
import Roles from "../models/RolesModel.js";

// Load environment variables
dotenv.config();

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in environment variables!");
  process.exit(1);
}

// Register new user
export const register = async (req, res) => {
  try {
    const { email, username, password, fullName, gender, phone, roleId } = req.body;

    // Validasi input required fields
    if (!email || !username || !password || !fullName) {
      return res.status(400).json({ 
        message: "Email, username, password, and fullName are required" 
      });
    }

    // Validasi password length
    if (password.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long" 
      });
    }

    // Check if user already exists
    const existingUser = await Users.findOne({
      where: {
        [Users.sequelize.Sequelize.Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: "Email already exists" });
      }
      if (existingUser.username === username) {
        return res.status(409).json({ message: "Username already exists" });
      }
    }

    // Validasi roleId exists
    if (roleId) {
      const roleExists = await Roles.findByPk(roleId);
      if (!roleExists) {
        return res.status(400).json({ message: "Invalid roleId" });
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Prepare user data
    const userData = {
      email: email.trim(),
      username: username.trim(),
      password: hashedPassword,
      fullName: fullName.trim(),
      gender: gender || "-",
      roleId: roleId || 3, // Default client role
    };

    // Add phone if provided
    if (phone && phone.trim()) {
      userData.phone = phone.trim();
    }

    // Create user
    const newUser = await Users.create(userData);

    res.status(201).json({ 
      message: "User registered successfully",
      userId: newUser.userId
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(409).json({ 
        message: `${field} already exists` 
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await Users.findOne({
      where: { email },
      include: [
        {
          model: Roles,
          as: "role",
          attributes: ["roleId", "roleName", "description"],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        message: "Account is deactivated. Please contact administrator." 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.userId,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role?.roleName 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data (without password)
    const userData = {
      userId: user.userId,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      gender: user.gender,
      phone: user.phone,
      roleId: user.roleId,
      isActive: user.isActive,
      role: user.role
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify token
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify JWT token
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

    // Return user data
    const userData = {
      userId: user.userId,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      gender: user.gender,
      phone: user.phone,
      roleId: user.roleId,
      isActive: user.isActive,
      role: user.role
    };

    res.status(200).json({
      message: "Token is valid",
      user: userData
    });

  } catch (error) {
    console.error("Token verification error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout (optional - mainly for client-side token removal)
export const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is typically handled client-side
    // But we can still provide a logout endpoint for consistency
    res.status(200).json({ 
      message: "Logout successful. Please remove the token from client storage." 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};