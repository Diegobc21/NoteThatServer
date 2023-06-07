import model from "../model/noteModel.js";

const getNotesByUserEmail = (req, res) => {
    const email = req.query.email
    
    if (email) {
        model.find({user: email})
            .then((notes) => {
                res.json(notes);
            })
            .catch((error) => res.status(500).send(error))
    }
}

const addOne = (req, res) => {
    const newNote = new model(req.body)
    newNote
        .save()
        .then(
            res.json(newNote)
        ).catch((error) => res.sendStatus(500).send(error))
}

const deleteNoteById = (req, res) => {
    const { id } = req.params

    model
        .deleteOne({ _id: id })
        .then(
            res.json(id)
        ).catch((error) => res.sendStatus(500).send(error))
}

export default {
    getNotesByUserEmail,
    addOne,
    deleteNoteById
}
