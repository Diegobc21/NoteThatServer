import Password from "../model/passwordModel.js";
import Section from "../model/sectionModel.js";
import User from "../model/userModel.js";

// Obtener todas las contraseñas del usuario
export const getAllPasswords = (req: any, res: any): void => {
  try {
    const userPasswords = Password.find({ user: req.user });
    res.json(userPasswords);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving passwords." });
  }
};

// Obtener todas las secciones del usuario
export const getUserSections = (req: any, res: any) => {
  const user = req.params.user;

  if (user) {
    Section.find({ user })
      .then((sections) => {
        res.json(sections);
      })
      .catch((error) => res.status(500).send(error));
  }
};

// Obtener contraseñas por sección
export const getPasswordsBySection = async (
  req: any,
  res: any
): Promise<void> => {
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
    const password = await Password.find({
      user,
      section,
    });

    if (!password) {
      return res.status(404).json({
        message: "Contraseña no encontrada para esta sección y usuario",
      });
    }

    // Devuelve la contraseña de la sección especificada
    res.json(password);
  } catch (error) {
    console.error("Error al obtener contraseñas:", error);
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
    const { title } = req.body;

    if (!title) {
      res
        .status(400)
        .json({ error: "El título de la sección es obligatorio." });
      return;
    }

    // Verificar si la sección ya existe
    const existingSection = await Section.findOne({ title });

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
        .status(409)
        .json({ error: "La sección no existe en la base de datos." });
      return;
    }

    // Si existe, eliminar la sección y sus contraseñas asociadas
    const removedSection = await Section.deleteOne({ _id: id })
      .then(() => {
        Password.deleteMany({
          section: existingSection.title,
        }).then();
        res.status(200);
      })
      .catch((error) => res.sendStatus(500).send(error));


    res.status(201).json(removedSection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
