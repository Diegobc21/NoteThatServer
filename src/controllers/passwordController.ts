import { Response } from "express";
import Password from "../model/passwordModel.js";
import Section from "../model/sectionModel.js";
import User from "../model/userModel.js";
import { AuthenticatedRequest } from "../middlewares/tokenVerify.js";

type PasswordPayload = {
  title?: unknown;
  section?: unknown;
  password?: unknown;
  email?: unknown;
  username?: unknown;
};

const ownerOf = (req: AuthenticatedRequest): string => req.user!.username;
const hasString = (value: unknown): value is string => typeof value === "string";

const ownershipFilter = (user: string) => ({
  $or: [
    { user },
    // Passwords created by the legacy client stored their owner in `email`.
    { user: { $exists: false }, email: user },
  ],
});

const censored = <T extends { password?: unknown }>(password: T) => ({
  ...password,
  password: null,
});

export const getCensoredPasswordsBySection = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = ownerOf(req);
    const section = await Section.findOne({
      _id: req.params.sectionId,
      user,
    }).lean();

    if (!section) {
      res.status(404).json({ error: "Section not found." });
      return;
    }

    const passwords = await Password.find({
      $and: [
        ownershipFilter(user),
        {
          $or: [
            { section: section._id.toString() },
            // Keep records written by the title-based legacy API visible.
            { section: section.title },
          ],
        },
      ],
    })
      .sort({ creationDate: -1 })
      .lean();

    res.json(passwords.map(censored));
  } catch (error) {
    console.error("Unable to list passwords:", error);
    res.status(500).json({ error: "Unable to retrieve passwords." });
  }
};

export const getUncensoredPasswordById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const password = await Password.findOne({
      _id: req.params.id,
      ...ownershipFilter(ownerOf(req)),
    }).lean();

    if (!password) {
      res.status(404).json({ error: "Password not found." });
      return;
    }

    res.json({ password: password.password });
  } catch (error) {
    console.error("Unable to retrieve password:", error);
    res.status(404).json({ error: "Password not found." });
  }
};

export const addPassword = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { title, section, password, email, username } = req.body as PasswordPayload;

  if (!hasString(title) || title.trim().length === 0) {
    res.status(400).json({ error: "A password title is required." });
    return;
  }

  if (!hasString(password) || password.length === 0) {
    res.status(400).json({ error: "A password value is required." });
    return;
  }

  if (!hasString(section) || section.length === 0) {
    res.status(400).json({ error: "A section ID is required." });
    return;
  }

  if (email !== undefined && !hasString(email)) {
    res.status(400).json({ error: "Email must be text." });
    return;
  }

  if (username !== undefined && !hasString(username)) {
    res.status(400).json({ error: "Username must be text." });
    return;
  }

  try {
    const user = ownerOf(req);
    const ownedSection = await Section.exists({ _id: section, user });

    if (!ownedSection) {
      res.status(404).json({ error: "Section not found." });
      return;
    }

    const savedPassword = await Password.create({
      title: title.trim(),
      section,
      password,
      email: hasString(email) ? email.trim() || undefined : undefined,
      username: hasString(username) ? username.trim() || undefined : undefined,
      user,
    });

    res.status(201).json(censored(savedPassword.toObject()));
  } catch (error) {
    console.error("Unable to create password:", error);
    res.status(500).json({ error: "Unable to create password." });
  }
};

export const editPassword = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { title, password, email, username } = req.body as PasswordPayload;
  const changes: {
    title?: string;
    password?: string;
    email?: string;
    username?: string;
  } = {};

  if (title !== undefined) {
    if (!hasString(title) || title.trim().length === 0) {
      res.status(400).json({ error: "A password title cannot be empty." });
      return;
    }
    changes.title = title.trim();
  }

  if (password !== undefined) {
    if (!hasString(password) || password.length === 0) {
      res.status(400).json({ error: "A password value cannot be empty." });
      return;
    }
    changes.password = password;
  }

  if (email !== undefined) {
    if (!hasString(email)) {
      res.status(400).json({ error: "Email must be text." });
      return;
    }
    changes.email = email.trim();
  }

  if (username !== undefined) {
    if (!hasString(username)) {
      res.status(400).json({ error: "Username must be text." });
      return;
    }
    changes.username = username.trim();
  }

  if (Object.keys(changes).length === 0) {
    res.status(400).json({ error: "Provide password fields to update." });
    return;
  }

  try {
    const user = ownerOf(req);
    const updatedPassword = await Password.findOneAndUpdate(
      { _id: req.params.id, ...ownershipFilter(user) },
      { $set: { ...changes, user } },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedPassword) {
      res.status(404).json({ error: "Password not found." });
      return;
    }

    res.json(censored(updatedPassword));
  } catch (error) {
    console.error("Unable to update password:", error);
    res.status(404).json({ error: "Password not found." });
  }
};

export const deletePasswordById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const password = await Password.findOneAndDelete({
      _id: req.params.id,
      ...ownershipFilter(ownerOf(req)),
    }).exec();

    if (!password) {
      res.status(404).json({ error: "Password not found." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Unable to delete password:", error);
    res.status(404).json({ error: "Password not found." });
  }
};

export const makePasswordsVisible = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { password } = req.body as { password?: unknown };

  if (!hasString(password)) {
    res.status(400).json({ error: "An account password is required." });
    return;
  }

  try {
    const user = await User.findOne({ email: ownerOf(req) }).lean();
    res.json({ valid: user?.password === password });
  } catch (error) {
    console.error("Unable to verify account password:", error);
    res.status(500).json({ error: "Unable to verify account password." });
  }
};
