import model from "../model/noteModel.js";

const getAll = (req: any, res: any) => {
  const email = req.body.email;

  if (email) {
    model
      .find({ user: email })
      .then((notes) => {
        res.json(notes);
      })
      .catch((error) => res.status(500).send(error));
  }
};

const addOne = (req: any, res: any) => {
  const newNote = new model(req.body);
  newNote
    .save()
    .then(res.json(newNote))
    .catch((error) => res.sendStatus(500).send(error));
};

const editNote = (req: any, res: any) => {
  const noteId = req.params.id;
  const updatedNote = req.body;
  console.log(updatedNote)
  console.log(noteId)

  model
    .findByIdAndUpdate(noteId, updatedNote, { new: false })
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => res.sendStatus(500).send(error));
};

const deleteNoteById = (req: any, res: any) => {
  const { id } = req.params;

  model
    .deleteOne({ _id: id })
    .then(res.json(id))
    .catch((error) => res.sendStatus(500).send(error));
};

export default {
  getAll,
  addOne,
  editNote,
  deleteNoteById,
};
