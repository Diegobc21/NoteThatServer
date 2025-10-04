import Password from "../model/passwordModel.js";
import Section from "../model/sectionModel.js";

// Obtener todas las secciones del usuario
export const getUserSections = async (req: any, res: any) => {
  const email = req.params.email;

  if (email) {
    Section.find({ user: email })
      .then((sections) => {
        res.json(sections);
      })
      .catch((error) => res.status(500).send(error));
  }
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
