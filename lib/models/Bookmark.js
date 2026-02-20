import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
}, { timestamps: true });

export const Bookmark = mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);