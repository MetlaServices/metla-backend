import { Schema, model, Document } from 'mongoose';

// Blog interface representing the schema structure for TypeScript
export interface IBlog extends Document {
    title: string;
    content: string;
    tags?: string[]; // Make tags optional if it’s not required
    description?: string; // Make description optional if it’s not required
    image?: {
        url: string;
        fileId: string;
    };
    createdBy: Schema.Types.ObjectId; // Reference to the Admin who created the blog
}

// Define the Blog schema
const BlogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
    },
    description: {
        type: String,
        required: false, // Specify if it's optional
    },
    tags: {
        type: [String], // An array of strings for tags
        required: false,
    },
    image: {
        url: {
            type: String,
            required: false,
        },
        fileId: {
            type: String,
            required: false,
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true, // It’s typically good to enforce that a blog is created by an admin
    },
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the Blog model
export default model<IBlog>('Blog', BlogSchema);
