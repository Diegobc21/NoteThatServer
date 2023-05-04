import userModel from "../model/userModel.js";
import encryptPassword from "../helpers/md5.js"
import {generateToken} from "../helpers/tokens.js"

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
  newUser.password = encryptPassword(req.body.password)
  newUser
    .save()
    .then(
      res.json(newUser)
    ).catch((error) => res.sendStatus(500).send(error))
}

const login = (req, res) => {
  const user = req.body
  user.token.push(generateToken())

  user
    .save()
    .then(
      res.json(user)
    ).catch((error) => res.sendStatus(500).send(error))
}

export default {
  getAll,
  getOneByFullName,
  addOne,
  login
}; 
