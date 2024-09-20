import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  age: Number,
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
});

usersSchema.plugin(mongoosePaginate);

// Moodelo utilizado para manejar la base de datos
export const userModel = mongoose.model(userCollection, usersSchema);
