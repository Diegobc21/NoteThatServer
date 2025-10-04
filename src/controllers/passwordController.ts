import Password from "../model/passwordModel.js";
import Section from "../model/sectionModel.js";
import User from "../model/userModel.js";

// Obtener contraseñas por sección con censura
export const getCensoredPasswordsBySection = async (req: any, res: any) => {
  const section = req.body;
  const user = req.user.username;

  try {
    // Busca el usuario por su email
    if (!(await User.findOne({ email: user }))) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Busca la sección por su nombre
    const sectionObj = await Section.findOne({ _id: section._id });

    if (!sectionObj) {
      return res.status(404).json({ message: "Sección no encontrada" });
    }

    // Busca la contraseña correspondiente al usuario y sección
    let passwords = await Password.find({
      user,
      section: sectionObj.title,
    });

    if (!passwords) {
      return res.status(404).json({
        message:
          "Este usuario no contiene contraseñas en la sección: " + section,
      });
    }

    passwords.forEach((p) => (p.password = null));

    // Devuelve las contraseñas de la sección especificada para el usuario en cuestión
    res.json(passwords);
  } catch (error) {
    console.error("Error al obtener contraseñas:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Obtener contraseña sin censura
export const getUncensoredPasswordById = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    // Busca la contraseña correspondiente al usuario y sección
    let password = await Password.findOne({
      _id: id,
    });

    if (!password) {
      return res.status(404).json({
        message: "No se ha encontrado contraseña con identificador:" + id,
      });
    }

    // Devuelve las contraseñas de la sección especificada para el usuario en cuestión
    res.json({ password: password.password });
  } catch (error) {
    console.error("Error al obtener contraseña sin censura:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Agregar una nueva contraseña
export const addPassword = (req: any, res: any): void => {
  try {
    const newPass = new Password(req.body);
    newPass
      .save()
      .then(res.json(newPass))
      .catch((error) => res.sendStatus(500).send(error));
  } catch (error) {
    console.error(error);
  }
};

// Eliminar una contraseña
export const deletePasswordById = (req: any, res: any) => {
  const { id } = req.params;

  Password.deleteOne({ _id: id })
    .then(res.json(id))
    .catch((error) => res.sendStatus(500).send(error));
};

// Editar una contraseña existente
export const editPassword = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { password, user } = req.body;

    if (!password) {
      res
        .status(400)
        .json({ error: "No se ha proporcionado ninguna contraseña." });
      return;
    }

    // Verificar si la sección ya existe
    let existingPassword = await Password.updateOne(
      { _id: id, user },
      {
        $set: password,
      }
    );

    if (!existingPassword) {
      res
        .status(409)
        .json({ error: "La contraseña no existe en la base de datos." });
      return;
    }

    res.status(201).json(password);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// Obtener todas las contraseñas del usuario
export const makePasswordsVisible = async (
  req: any,
  res: any
): Promise<void> => {
  try {
    const { email, password } = req.body;
    User.findOne({ email })
      .then((user) => {
        if (user?.password === password) {
          res.status(200).json({ valid: true });
          return;
        } else {
          res.status(500).json({ valid: false });
          return;
        }
      })
      .catch((error) => res.sendStatus(500).json(error));
  } catch (error) {
    res.status(500).json({ error: "Error retrieving passwords." });
  }
};
