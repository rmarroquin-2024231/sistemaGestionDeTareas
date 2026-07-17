import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },
        username: {
            type: String,
            required: [true, 'El nombre de usuario es obligatorio'],
            unique: true,
            trim: true,
            lowercase: true
        },
        email: {
            type: String,
            required: [true, 'El correo es obligatorio'],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria']
        }
    },
    { timestamps: true }
);

userSchema.methods.toJSON = function () {
    const { password, __v, ...user } = this.toObject();
    return user;
};

export default model('User', userSchema);