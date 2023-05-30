import { jwt } from "../helpers/tokens.js";
import userModel from "../model/userModel.js";

const getAll = (req, res) => {
  if (req.query.email) { // Búsqueda por correo electrónico
    getOneByEmail(req, res);
  } else { // Búsqueda de todas las entradas
    userModel.find()
      .then((objects) => {
        res.json(objects);
      })
      .catch((error) => res.status(500).send(error));
  }
};

const getOneByFullName = (req, res) => {
  if (req.params.fullname) {
    userModel
      .findOne({ fullname: req.params.fullname })
      .then((object) => {
        object === null ? res.sendStatus(404) : res.json(object)
      })
      .catch((error) => res.sendStatus(500).send(error))
  }
}

const getOneByEmail = (req, res) => {
  userModel
    .findOne({ email: req.query.email })
    .then((object) => {
      object === null ?
        res.status(404).json({ error: 'User not found' }) : res.status(200).json(object);

    })
    .catch((error) => res.status(500).send(error));
};

const addOne = (req, res) => {
  const newUser = new userModel(req.body)
  newUser
    .save()
    .then(
      res.json(newUser)
    ).catch((error) => res.sendStatus(500).send(error))
}

const login = (req, res) => {
  const { email, password } = req.body

  const token = jwt.sign({ username: email }, 'token', { expiresIn: '15m' });

  userModel.findOne({ email }).exec()
    .then(user => {
      if (!user) {
        res.status(404).json({ error: 'User not found' })
      }

      if (user.password !== password) {
        res.status(401).json({ error: 'Wrong password' })
      }

      user.save()
    })
    .then(() => {
      res.status(200).json({
        email,
        token
      })
    })
    .catch(() => {
      res.status(401)
    });
}

const logout = (req, res) => {
  const { email } = req.body

  userModel.findOne({ email }).exec()
    .then(user => {
      if (!user) {
        res.status(404).json({ error: 'User not found' })
      }

      user.save()
    })
    .then(() => {
      res.status(200).json({
        email: email
      })
    })
    .catch(() => {
      res.status(401)
    })
}

export default {
  getAll,
  getOneByFullName,
  addOne,
  login,
  logout
}; 
