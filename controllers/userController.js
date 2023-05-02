import model from "../model/userModel.js";
import encryptPassword from "../helpers/md5.js"

const getAll = (req, res) => {
  model.find()
    .then((object) => {
      res.json(object)
    })
    .catch((error) => res.sendStatus(500).send(error))
}

const getOne = (req, res) => {
  if (req.params.fullname) {
    model
      .findOne({ fullname: req.params.fullname })
      .then((object) => {
        object === null ? res.sendStatus(404) : res.json(object)
      })
      .catch((error) => res.sendStatus(500).send(error))
  }
}

const addOne = (req, res) => {
  const nuevoUsuario = new model(req.body)
  nuevoUsuario.password = encryptPassword(nuevoUsuario.password)

  nuevoUsuario
    .save() 
    .then(
      res.sendStatus(201)
    ).catch((error) => res.sendStatus(500).send(error))

}

const addUser = (req, res) => {

  // console.log(encryptPassword('password'));
  res.log('addUser called')
}

export default {
  getAll,
  getOne,
  addOne
};
