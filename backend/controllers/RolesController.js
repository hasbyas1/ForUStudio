import Roles from "../models/RolesModel.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await Roles.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await Roles.findByPk(req.params.id);
    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoleByName = async (req, res) => {
  try {
    const role = await Roles.findOne({
      where: { roleName: req.params.roleName },
    });
    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRole = async (req, res) => {
  try {
    const { roleName, description } = req.body;
    const newRole = await Roles.create({ roleName, description });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { roleName, description } = req.body;
    const [updated] = await Roles.update(
      { roleName, description },
      {
        where: { roleId: req.params.id },
      }
    );
    if (updated) {
      const updatedRole = await Roles.findByPk(req.params.id);
      res.json(updatedRole);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deleted = await Roles.destroy({
      where: { roleId: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
