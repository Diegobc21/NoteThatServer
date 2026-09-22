import { Response } from "express";
import Password from "../model/passwordModel.js";
import Section from "../model/sectionModel.js";
import { AuthenticatedRequest } from "../middlewares/tokenVerify.js";

type SectionPayload = {
  title?: unknown;
};

const ownerOf = (req: AuthenticatedRequest): string => req.user!.username;

const passwordOwnershipFilter = (user: string) => ({
  $or: [
    { user },
    { user: { $exists: false }, email: user },
  ],
});

export const getUserSections = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const sections = await Section.find({ user: ownerOf(req) })
      .sort({ creationDate: 1 })
      .exec();
    res.json(sections);
  } catch (error) {
    console.error("Unable to list sections:", error);
    res.status(500).json({ error: "Unable to retrieve sections." });
  }
};

export const addSection = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { title } = req.body as SectionPayload;

  if (typeof title !== "string" || title.trim().length === 0) {
    res.status(400).json({ error: "A section title is required." });
    return;
  }

  try {
    const user = ownerOf(req);
    const normalizedTitle = title.trim();
    const existingSection = await Section.exists({ title: normalizedTitle, user });

    if (existingSection) {
      res.status(409).json({ error: "A section with this title already exists." });
      return;
    }

    const section = await Section.create({ title: normalizedTitle, user });
    res.status(201).json(section);
  } catch (error) {
    console.error("Unable to create section:", error);
    res.status(500).json({ error: "Unable to create section." });
  }
};

export const editSection = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { title } = req.body as SectionPayload;

  if (typeof title !== "string" || title.trim().length === 0) {
    res.status(400).json({ error: "A section title is required." });
    return;
  }

  try {
    const user = ownerOf(req);
    const normalizedTitle = title.trim();
    const duplicate = await Section.exists({
      _id: { $ne: req.params.id },
      title: normalizedTitle,
      user,
    });

    if (duplicate) {
      res.status(409).json({ error: "A section with this title already exists." });
      return;
    }

    const existingSection = await Section.findOne({
      _id: req.params.id,
      user,
    }).lean();

    if (!existingSection) {
      res.status(404).json({ error: "Section not found." });
      return;
    }

    const section = await Section.findOneAndUpdate(
      { _id: req.params.id, user },
      { $set: { title: normalizedTitle } },
      { new: true, runValidators: true },
    ).exec();

    // Move legacy title-linked passwords to the stable section ID.
    await Password.updateMany(
      {
        $and: [
          passwordOwnershipFilter(user),
          { section: existingSection.title },
        ],
      },
      { $set: { section: req.params.id, user } },
    ).exec();

    res.json(section);
  } catch (error) {
    console.error("Unable to update section:", error);
    res.status(404).json({ error: "Section not found." });
  }
};

export const removeSection = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = ownerOf(req);
    const section = await Section.findOneAndDelete({
      _id: req.params.id,
      user,
    }).lean();

    if (!section) {
      res.status(404).json({ error: "Section not found." });
      return;
    }

    await Password.deleteMany({
      $and: [
        passwordOwnershipFilter(user),
        {
          $or: [
            { section: section._id.toString() },
            { section: section.title },
          ],
        },
      ],
    }).exec();

    res.status(204).send();
  } catch (error) {
    console.error("Unable to delete section:", error);
    res.status(404).json({ error: "Section not found." });
  }
};
