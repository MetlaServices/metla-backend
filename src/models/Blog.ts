import { Schema, model, Document } from 'mongoose';

// Blog interface representing the schema structure for TypeScript
export interface IBlog extends Document {
    title: string;
    content: string;
    tags: string[];
    image?: {
        url: string;
        fileId: string;
    };
    createdBy: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
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
        // required: true,
    },
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

export default model<IBlog>('Blog', BlogSchema);
