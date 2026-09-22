import { Response } from "express";
import Note from "../model/noteModel.js";
import { AuthenticatedRequest } from "../middlewares/tokenVerify.js";

type NotePayload = {
  title?: unknown;
  content?: unknown;
};

const ownerOf = (req: AuthenticatedRequest): string => req.user!.username;

const hasString = (value: unknown): value is string => typeof value === "string";

const getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ user: ownerOf(req) })
      .sort({ creationDate: -1 })
      .exec();
    res.json(notes);
  } catch (error) {
    console.error("Unable to list notes:", error);
    res.status(500).json({ error: "Unable to retrieve notes." });
  }
};

const getOne = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: ownerOf(req),
    }).exec();

    if (!note) {
      res.status(404).json({ error: "Note not found." });
      return;
    }

    res.json(note);
  } catch (error) {
    console.error("Unable to retrieve note:", error);
    res.status(404).json({ error: "Note not found." });
  }
};

const addOne = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, content } = req.body as NotePayload;

  if (!hasString(title) || title.trim().length === 0) {
    res.status(400).json({ error: "A note title is required." });
    return;
  }

  if (content !== undefined && !hasString(content)) {
    res.status(400).json({ error: "Note content must be text." });
    return;
  }

  try {
    const note = await Note.create({
      title: title.trim(),
      content: content ?? "",
      user: ownerOf(req),
    });
    res.status(201).json(note);
  } catch (error) {
    console.error("Unable to create note:", error);
    res.status(500).json({ error: "Unable to create note." });
  }
};

const editNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, content } = req.body as NotePayload;
  const changes: { title?: string; content?: string } = {};

  if (title !== undefined) {
    if (!hasString(title) || title.trim().length === 0) {
      res.status(400).json({ error: "A note title cannot be empty." });
      return;
    }
    changes.title = title.trim();
  }

  if (content !== undefined) {
    if (!hasString(content)) {
      res.status(400).json({ error: "Note content must be text." });
      return;
    }
    changes.content = content;
  }

  if (Object.keys(changes).length === 0) {
    res.status(400).json({ error: "Provide a title or content to update." });
    return;
  }

  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: ownerOf(req) },
      { $set: changes },
      { new: true, runValidators: true },
    ).exec();

    if (!note) {
      res.status(404).json({ error: "Note not found." });
      return;
    }

    res.json(note);
  } catch (error) {
    console.error("Unable to update note:", error);
    res.status(404).json({ error: "Note not found." });
  }
};

const deleteNoteById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: ownerOf(req),
    }).exec();

    if (!note) {
      res.status(404).json({ error: "Note not found." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Unable to delete note:", error);
    res.status(404).json({ error: "Note not found." });
  }
};

export default {
  getAll,
  getOne,
  addOne,
  editNote,
  deleteNoteById,
};
