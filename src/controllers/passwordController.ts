import { title } from "process";
import Password from "../model/passwordModel.js";
import Section from "../model/sectionModel.js";
import User from "../model/userModel.js";

// Obtener todas las contraseñas del usuario
export const getAllPasswords = async (req: any, res: any): Promise<void> => {
  try {
    const userPasswords = Password.find({ user: req.user });
    res.json(userPasswords);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving passwords." });
  }
};

// Obtener todas las secciones del usuario
export const getUserSections = async (req: any, res: any) => {
  const user = req.params.user;

  if (user) {
    Section.find({ user })
      .then((sections) => {
        res.json(sections);
      })
      .catch((error) => res.status(500).send(error));
  }
};

// Obtener contraseñas por sección con censura
export const getCensoredPasswordsBySection = async (req: any, res: any) => {
  const { section } = req.params;
  const user = req.user.username;
  
  try {
    // Busca el usuario por su email
    if (!(await User.findOne({ email: user }))) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Busca la sección por su nombre
    const sectionObj = await Section.findOne({ title: section });
    
    if (!sectionObj) {
      return res.status(404).json({ message: "Sección no encontrada" });
    }
    
    // Busca la contraseña correspondiente al usuario y sección
    let passwords = await Password.find({
      user,
      section,
    });
    
    
    if (!passwords) {
      return res.status(404).json({
        message: "Este usuario no contiene contraseñas en la sección: " + section,
      });
    }
    
    passwords.forEach(p => p.password = null);

    // Devuelve las contraseñas de la sección especificada para el usuario en cuestión
    res.json(passwords);
  } catch (error) {
    console.error("Error al obtener contraseñas:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
    
  }
};

// Obtener contraseña sin censura
export const getUncensoredPassword = async (req: any, res: any) => {
  const { id } = req.params;
  const user = req.user.username;
  
  try {
    // Busca el usuario por su email
    if (!(await User.findOne({ email: user }))) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Busca la contraseña correspondiente al usuario y sección
    let password = await Password.findOne({
      _id: id,
      user
    });
    
    
    if (!password) {
      return res.status(404).json({
        message: "No se ha encontrado contraseña con identificador:" + id,
      });
    }

    // Devuelve las contraseñas de la sección especificada para el usuario en cuestión
    res.json({password: password.password});
  } catch (error) {
    console.error("Error al obtener contraseña sin censura:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Agregar una nueva contraseña
export const addPassword = (req: any, res: any): void => {
  const newPass = new Password(req.body);
  newPass
    .save()
    .then(res.json(newPass))
    .catch((error) => res.sendStatus(500).send(error));
};

// Eliminar una contraseña
export const deletePasswordById = (req: any, res: any) => {
  const { id } = req.params;

  Password.deleteOne({ _id: id })
    .then(res.json(id))
    .catch((error) => res.sendStatus(500).send(error));
};

// Agregar una nueva sección
export const addSection = async (req: any, res: any) => {
  try {
    const { title, user } = req.body;

    if (!title) {
      res
        .status(400)
        .json({ error: "El título de la sección es obligatorio." });
      return;
    }

    // Verificar si la sección ya existe
    const existingSection = await Section.findOne({ title, user });

    if (existingSection) {
      res
        .status(409)
        .json({ error: "La sección ya existe en la base de datos." });
      return;
    }

    // Si no existe, agregar la nueva sección
    const newSection = new Section(req.body);
    const savedSection = await newSection.save();

    res.status(201).json(savedSection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// Editar una sección existente
export const editSection = async (req: any, res: any) => {
  try {
    const { section, user } = req.body;

    if (!section) {
      res
        .status(400)
        .json({ error: "No se ha proporcionado ninguna sección." });
      return;
    }

    // Verificar si la sección ya existe
    let existingSection = await Section.updateOne(
      { _id: section._id, user },
      {
        $set: {
          title: section.title,
        },
      }
    );

    if (!existingSection) {
      res
        .status(409)
        .json({ error: "La sección no existe en la base de datos." });
      return;
    }

    res.status(201).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// Editar una contraseña existente
export const editPassword = async (req: any, res: any) => {
  try {
    const { password, user } = req.body;

    if (!password) {
      res
        .status(400)
        .json({ error: "No se ha proporcionado ninguna contraseña." });
      return;
    }

    // Verificar si la sección ya existe
    let existingPassword = await Password.updateOne(
      { _id: password._id, user },
      {
        $set: {
          title: password.title,
        },
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

// Eliminar una sección y sus contraseñas
export const removeSection = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "El ID de la sección es obligatorio." });
      return;
    }

    // Verificar si la sección ya existe
    const existingSection = await Section.findOne({ _id: id });

    if (!existingSection) {
      res
        .status(404)
        .json({ error: "La sección no existe en la base de datos." });
      return;
    }

    // Si existe, eliminar la sección y sus contraseñas asociadas
    const removedSection = await Section.deleteOne({ _id: id })
      .then(() => {
        Password.deleteMany({ section: existingSection.title }).then(
          () => null
        );
        res.status(200);
      })
      .catch((error) => res.sendStatus(500).send(error));

    res.status(201).json(removedSection);
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
