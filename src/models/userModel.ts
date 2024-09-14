import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Create the schema for the User model
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
