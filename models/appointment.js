const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },

    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
        required:true
    },

    schedule:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"schedule",
        required:true
    },

    appointmentDate:{
        type:Date,
        required:true
    },

    startingTime:{
        type:String,
        required:true
    },

    endTime:{
        type:String,
        required:true
    },

    reason:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:[
            "pending",
            "completed",
            "confirmed",
            "cancelled"
        ],
        defaut:"pending"
    }

},{
    timestamps:true
});

const Appointment = mongoose.model("Appointment",appointmentSchema);

module.exports = Appointment