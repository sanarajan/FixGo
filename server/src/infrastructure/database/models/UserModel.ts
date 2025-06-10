import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  fullname: { type: String,default:"" },
  companyName: { type: String },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String,default:"" },
  password: { type: String ,default:""},
  role: {
    type: String,
    enum: ["admin", "customer", "provider", "worker", "staff"],
    required: true,
  },
  providerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  status: { type: String, default: 'Inactive' },
  authProvider: { type: String,enum:[ 'google' ,'local'], default: 'local' },
  type:{ 
      type: String,
      enum: [ "provider", "worker", "staff"],
  },
  // isApproved: { type: Boolean, default: false },
  image:{type:String,default: 'noimage.png'},

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = model("User", userSchema);

export  {UserModel};
