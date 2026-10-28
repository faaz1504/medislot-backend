const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
        required:true
    },
    
    specialization:{
        type:String,
        required:[true,"specialization is required"],
        trim:true
    },

    qualification:{
        type:String,
         required:[true,"qualification is required"],
        trim:true
    },

    experienceYears:{
        type:Number,
        required:[true,"experienceYears is required"],
        min:0
    },

    consultationFee:{
        type:Number,
        required:true,
        min:0
    },

    bio:{
        type:String,
        trim:true,
        maxlength:500,

    },

    status:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true
});

const Doctor = mongoose.model("Doctor",doctorSchema);

module.exports = Doctor;