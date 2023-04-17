import model from '../model/softwareModel.js'

const getAll = (req, res) => {
  if (Object.keys(req.query).length > 0) {
    if (req.query.category) {
      model.find({ 'categorias.listado': req.query.category })
        .then((object) => {
          res.json(object)
        })
        .catch((error) => res.sendStatus(500).send(error))
    } else {
      res.send(500)
    }
  } else {
    model.find()
      .then((object) => {
        res.json(object)
      })
      .catch((error) => res.sendStatus(500).send(error))
  }
}

const getOne = (req, res) => {
  if (req.params.name) {
    model.findOne({ nombre: req.params.name })
      .then((object) => {
        res.json(object)
      })
      .catch((error) => res.sendStatus(500).send(error))
  }
}

const categories = (req, res) => {
  model.distinct('categorias.listado')
    .then((object) => {
      res.json(object)
    })
    .catch((error) => res.sendStatus(500).send(error))
}

export default {
  getAll,
  getOne,
  categories
}
