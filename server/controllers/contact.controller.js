import Contact from "../models/contact.model.js";

export const create = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is required" });
    }

    try {
        const newContact = await Contact.create(req.body);
        res.status(201).json(newContact);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const list = async (_req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
};

export const read = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ error: "Contact not found" });
        res.json(contact);
    } catch (err) {
        res.status(400).json({ error: "Invalid contact id" });
    }
};

export const update = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is required" });
    }

    try {
        const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Contact not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: "Invalid contact id" });
    }
};

export const remove = async (req, res) => {
    try {
        const deleted = await Contact.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Contact not found" });
        res.json({ message: "Deleted successfully", id: deleted._id });
    } catch (err) {
        res.status(400).json({ error: "Invalid contact id" });
    }
};

export const removeAll = async (_req, res) => {
    try {
        const result = await Contact.deleteMany({});
        res.json({ message: "All contacts deleted", deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete contacts" });
    }
};
