import Qualification from "../models/qualification.model.js";

export const create = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is required" });
    }

    try {
        const newQual = await Qualification.create(req.body);
        res.status(201).json(newQual);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const list = async (_req, res) => {
    try {
        const qualifications = await Qualification.find();
        res.json(qualifications);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch qualifications" });
    }
};

export const read = async (req, res) => {
    try {
        const qualification = await Qualification.findById(req.params.id);
        if (!qualification) return res.status(404).json({ error: "Qualification not found" });
        res.json(qualification);
    } catch (err) {
        res.status(400).json({ error: "Invalid qualification id" });
    }
};

export const update = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is required" });
    }

    try {
        const updated = await Qualification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Qualification not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: "Invalid qualification id" });
    }
};

export const remove = async (req, res) => {
    try {
        const deleted = await Qualification.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Qualification not found" });
        res.json({ message: "Deleted successfully", id: deleted._id });
    } catch (err) {
        res.status(400).json({ error: "Invalid qualification id" });
    }
};

export const removeAll = async (_req, res) => {
    try {
        const result = await Qualification.deleteMany({});
        res.json({ message: "All qualifications deleted", deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete qualifications" });
    }
};
