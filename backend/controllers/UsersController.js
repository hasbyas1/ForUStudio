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
    await Users.create(req.body);
    res.status(201).json({ message: "User Created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    await Users.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "User Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await Users.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
