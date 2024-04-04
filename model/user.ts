import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

export interface user {
    email: string,
    password: string,
    name: string,
    role: string,
    createdAt: Date,
    avatar: string,
    avatar_img: string
}

const userSchema:Schema = new mongoose.Schema<user>({
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be at least 6 characters long"],
        select: false, //dont send back password after request
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: {
            values: [
                'user',
                'admin'
            ],
        }
    },
    avatar: {
        type: String,
        default: ""  
    },
    avatar_img: {
        type: String,
        default: ""  
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

// ENCRYPTION 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function(enteredPassword: string){
    return await bcrypt.compare(enteredPassword, this.password)
}


export default mongoose.models.User || mongoose.model('User', userSchema)