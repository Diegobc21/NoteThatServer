import model from "../model/userModel.js";
import encryptPassword from "../helpers/md5.js"

const getAll = (req, res) => {
  if (req.query.email) { // Search by email
    getOneByEmail(req, res)
  } else { // Search all entries
    model.find()
      .then((object) => {
        res.json(object)
      })
      .catch((error) => res.sendStatus(500).send(error))
  }
}

const getOneByFullName = (req, res) => {
  if (req.params.fullname) {
    model
      .findOne({ fullname: req.params.fullname })
      .then((object) => {
        object === null ? res.sendStatus(404) : res.json(object)
      })
      .catch((error) => res.sendStatus(500).send(error))
  }
}

const getOneByEmail = (req, res) => {
  model
    .findOne({ email: req.query.email })
    .then((object) => {
      object === null ? res.sendStatus(404) : res.json(object)
    })
    .catch((error) => res.sendStatus(500).send(error))
}

const addOne = (req, res) => {
  const newUser = new model(req.body)
  newUser.password = encryptPassword(req.body.password)

  newUser
    .save()
    .then(
      res.sendStatus(201)
    ).catch((error) => res.sendStatus(500).send(error))
}

export default {
  getAll,
  getOneByFullName,
  addOne
};
