import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // Align with frontend: single name field plus message body.
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, match: /.+\@.+\..+/ },
    message: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
