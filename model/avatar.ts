import mongoose, { Schema, Document } from 'mongoose';
import { unique } from 'next/dist/build/utils';


export interface avatar {
    _id: { $oid: string };
    name: string
    avatar: string
}


const avatarSchema: Schema = new mongoose.Schema<avatar>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    avatar:{
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.models.Avatar || mongoose.model('Avatar', avatarSchema);

