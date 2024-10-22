// Define the Blog schema
import { Schema, model, Document } from 'mongoose';

// Interface for subheadings with content
export interface ISubheadingContent {
    subheading: string;
    content: string;
}

// Blog interface representing the schema structure for TypeScript
export interface IHeadingContent {
    heading: string;
    subheadings?: ISubheadingContent[]; // Optional array of subheadings
}
export interface IBlog extends Document {
    title: string;
    mainHead:string;
    tags?: string[]; // Optional tags
    description?: string; // Optional description
    image?: {
        url: string;
        fileId: string;
    };
    createdBy: Schema.Types.ObjectId; // Reference to the Admin who created the blog
    headings: IHeadingContent[]; // Array of headings
}

const BlogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        // required: false,
    },
    mainHead: {
        type: String,
        // required: false,
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
    headings: [{
        heading: {
            type: String,
            // required: true,
        },
        subheadings: [{
            subheading: {
                type: String,
                // required: true,
            },
            content: {
                type: String,
                // required: true,
            }
        }]
    }],
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the Blog model
export default model<IBlog>('Blog', BlogSchema);
