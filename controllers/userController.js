import { generateToken } from "../helpers/tokens.js"
import userModel from "../model/userModel.js"

const getAll = (req, res) => {
  if (req.query.email) { // Search by email
    getOneByEmail(req, res)
  } else { // Search all entries
    userModel.find()
      .then((object) => {
        res.json(object)
      })
      .catch((error) => res.sendStatus(500).send(error))
  }
}

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
      object === null ? res.sendStatus(404) : res.json(object)
    })
    .catch((error) => res.sendStatus(500).send(error))
}

const addOne = (req, res) => {
  const newUser = new userModel(req.body)
  newUser
    .save()
    .then(
      res.json(newUser)
    ).catch((error) => res.sendStatus(500).send(error))
}

const login = (req, res) => {
  const { email, password, actualToken } = req.body

  // Comprobar si el usuario existe en la base de datos
  userModel.findOne({ email }).exec()
    .then(user => {
      if (!user) {
        throw new Error('User does not exist');
      }

      // Comprobar si la contraseña es correcta
      if (user.password !== password) {
        throw new Error('Incorrect password');
      }

      if (!actualToken || !user.token.includes(actualToken)) {
        // Generar y almacenar token de inicio de sesión
        user.token.push(generateToken());
        user.actualToken = user.token[user.token.length - 1]
      }

      return user.save();
    })
    .then(user => {
      // Devolver información del usuario con token de inicio de sesión
      res.status(200).json({
        fullname: user.fullname,
        email: user.email,
        actualToken: user.token[user.token.length - 1]
      });
    })
    .catch(error => {
      // Manejo de errores
      res.status(401).json({ error: error.message });
    });
}

export default {
  getAll,
  getOneByFullName,
  addOne,
  login
}; 
