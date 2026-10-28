const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"please the your name"]
    },

    email:{
        type:String,
        unique:[true,"the email you entered already exists"],
        required:[true,"please enter the email"]
    },

    password:{
        type:String,
        required:[true,"please enter the password"]
    },

    phone:{
        type:String
    },

    role:{
        type:String,
        enum:["patient","admin","doctor"],
        default:"patient",
    },

    status:{
        type:Boolean,
        default:true
    }


    },

    {
        timestamps:true,
    }

);

userSchema.pre("save",async function () {
    
    if(!this.isModified("password")){
        return this.password;
    }

    this.password = await bcrypt.hash(this.password,10);

});

userSchema.methods.comparePassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword,this.password)
    
}

const User = mongoose.model("User",userSchema);

module.exports = User;