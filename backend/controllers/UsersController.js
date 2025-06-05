import Users from "../models/UsersModel.js";
import Roles from "../models/RolesModel.js";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      include: [
        {
          model: Roles,
          as: "role",
          attributes: ["roleName"], // ambil roleId dan roleName saja
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findByPk(req.params.id, {
      include: [
        {
          model: Roles,
          as: "role",
          attributes: ["roleName"], // ambil roleId dan roleName saja
        },
      ],
    });

    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    // ✅ Validasi input required fields
    const { email, username, password, fullName, roleId } = req.body;
    
    if (!email || !username || !password || !fullName) {
      return res.status(400).json({ 
        message: "Email, username, password, and fullName are required" 
      });
    }

    // ✅ Validasi roleId exists
    if (roleId) {
      const roleExists = await Roles.findByPk(roleId);
      if (!roleExists) {
        return res.status(400).json({ message: "Invalid roleId" });
      }
    }

    const newUser = await Users.create(req.body);
    res.status(201).json({ 
      message: "User Created Successfully", 
      user: newUser 
    });
  } catch (error) {
    console.error("Error creating user:", error);
    
    // ✅ Handle specific validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    // ✅ Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(409).json({ 
        message: `${field} already exists` 
      });
    }

    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    // ✅ Check if user exists
    const existingUser = await Users.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Validasi roleId jika diberikan
    if (updateData.roleId) {
      const roleExists = await Roles.findByPk(updateData.roleId);
      if (!roleExists) {
        return res.status(400).json({ message: "Invalid roleId" });
      }
    }

    // ✅ Remove fields yang tidak boleh diupdate
    const allowedFields = [
      'email', 'username', 'password', 'fullName', 
      'gender', 'phone', 'roleId', 'isActive'
    ];
    
    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        // ✅ Handle null values untuk optional fields
        if (key === 'phone' && updateData[key] === '') {
          filteredData[key] = null;
        } else if (updateData[key] !== undefined && updateData[key] !== '') {
          filteredData[key] = updateData[key];
        }
      }
    });

    // ✅ Jangan update password jika kosong
    if (filteredData.password === '') {
      delete filteredData.password;
    }

    console.log("Updating user with data:", filteredData);

    // ✅ Update user
    const [updatedRowsCount] = await Users.update(filteredData, {
      where: { userId: userId }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    // ✅ Fetch updated user with role
    const updatedUser = await Users.findByPk(userId, {
      include: [
        {
          model: Roles,
          as: "role",
          attributes: ["roleName"],
        },
      ],
    });

    res.status(200).json({ 
      message: "User Updated Successfully", 
      user: updatedUser 
    });

  } catch (error) {
    console.error("Error updating user:", error);
    
    // ✅ Handle specific validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    // ✅ Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(409).json({ 
        message: `${field} already exists` 
      });
    }

    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // ✅ Check if user exists
    const existingUser = await Users.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Users.destroy({
      where: { userId: userId }
    });

    res.status(200).json({ 
      message: "User Deleted Successfully",
      deletedUserId: userId 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};