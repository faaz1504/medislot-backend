const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },

    schedule:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Schedule",
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