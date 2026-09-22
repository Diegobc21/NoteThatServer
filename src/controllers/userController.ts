import { jwt } from "../helpers/tokens.js";
import userModel from "../model/userModel.js";

export const getAll = async (req: any, res: any) => {
  if (req.query.email) {
    // Búsqueda por correo electrónico
    getOneByEmail(req, res);
  } else {
    // Búsqueda de todas las entradas
    userModel
      .find()
      .then((objects) => {
        res.json(objects);
      })
      .catch((error) => res.status(500).send(error));
  }
};

export const getOneByFullName = async (req: any, res: any) => {
  if (req.params.fullname) {
    userModel
      .findOne({ fullname: req.params.fullname })
      .then((object) => {
        object === null ? res.sendStatus(404) : res.json(object);
      })
      .catch((error) => res.sendStatus(500).send(error));
  }
};

export const getOneByEmail = async (req: any, res: any) => {
  userModel
    .findOne({ email: req.query.email })
    .then((object) => {
      object === null
        ? res.status(404).json({ error: "User not found" })
        : res.status(200).json(object);
    })
    .catch((error) => res.status(500).send(error));
};

export const addOne = async (req: any, res: any) => {
  const newUser = new userModel(req.body);
  newUser
    .save()
    .then(res.json(newUser))
    .catch((error) => res.sendStatus(500).send(error));
};

export const login = async (req: any, res: any): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).exec();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ error: "Wrong password" });
      return;
    }

    const token = jwt.sign(
      { username: email },
      process.env.JWT_SECRET ?? "token",
      { expiresIn: "12h" },
    );
    res.status(200).json({ email, token });
  } catch (error) {
    console.error("Unable to log in:", error);
    res.status(500).json({ error: "Unable to log in" });
  }
};
