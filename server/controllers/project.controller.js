import Project from "../models/project.model.js";

export const create = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is required" });
    }

    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const list = async (_req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects" });
    }
};

export const read = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: "Invalid project id" });
    }
};

export const update = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is required" });
    }

    try {
        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Project not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: "Invalid project id" });
    }
};

export const remove = async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Project not found" });
        res.json({ message: "Deleted successfully", id: deleted._id });
    } catch (err) {
        res.status(400).json({ error: "Invalid project id" });
    }
};

export const removeAll = async (_req, res) => {
    try {
        const result = await Project.deleteMany({});
        res.json({ message: "All projects deleted", deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete projects" });
    }
};
