import { generateToken, jwt } from "../helpers/tokens.js"
import userModel from "../model/userModel.js"

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
      console.log(object);
      if (object === null) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json(object);
      }
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

  // Create token using JWT
  const token = jwt.sign({ username: email }, 'token', { expiresIn: '2h' });

  // Comprobar si el usuario existe en la base de datos
  userModel.findOne({ email }).exec()
    .then(user => {
      if (!user) {
        throw new Error('User does not exist')
      }

      // Verify credentials
      if (user.password !== password) {
        throw new Error('Incorrect password')
      }

      user.altualToken = token
      user.save()
    })
    .then(() => {
      // Return login token & user email
      res.status(200).json({
        email: email,
        actualToken: token
      })
    })
    .catch(() => {
      res.status(401).json({ error: 'Invalid credentials' })
    });
}

const logout = (req, res) => {
  const { email, actualToken } = req.body

  userModel.findOne({ email }).exec()
    .then(user => {
      if (!user) {
        throw new Error('User does not exist')
      }

      if (actualToken && user.token.includes(actualToken)) {
        const index = user.token.indexOf(actualToken)
        user.token.splice(index, 1)
        user.actualToken = null
      }

      return user.save();
    })
    .then(() => {
      // Devolver información del usuario con token de inicio de sesión
      res.status(200)
    })
    .catch(error => {
      // Manejo de errores
      res.status(401).json({ error: error.message });
    })
}

export default {
  getAll,
  getOneByFullName,
  addOne,
  login,
  logout
}; 
