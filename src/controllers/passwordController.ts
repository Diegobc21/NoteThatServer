import Password from "../model/passwordModel.js";
import Section from "../model/sectionModel.js";

// Obtener todas las contraseñas del usuario
export const getAllPasswords = (req: any, res: any): void => {
  try {
    const userPasswords = Password.find({ user: req.user });
    res.json(userPasswords);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving passwords." });
  }
};

// Obtener todas las contraseñas del usuario
export const getAllSections = (req: any, res: any) => {
  const user = req.params.user;
  if (user) {
    Section.find({ user })
      .then((sections) => {
        console.log(sections)
        res.json(sections);
      })
      .catch((error) => res.status(500).send(error));
  }
};

// Obtener contraseñas por sección
export const getPasswordsBySection = (req: any, res: any): void => {
  const { section, user } = req.params;
  try {
    const userPasswords = Password.find({ user, section });
    res.json(userPasswords);
  } catch (error) {
    res.status(500).json({ error: "Error: cannot get passwords by section" });
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

// Agregar una nueva sección
export const addSection = async (req: any, res: any): Promise<void> => {
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
