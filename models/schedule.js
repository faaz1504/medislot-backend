const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({

    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },

    dayOfWeek:{
        type:String,
        enum:[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ],

        required:true

    },

    sessions:[
            {
            startingTime:{
                type:String,
                required:true
            },

            endTime:{
                type:String,
                required:true
            },

            slotDuration:{
                type:String,
                required:true
            }
        }
    ],

    isAvailable:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true
})

scheduleSchema.index(
    {doctor:1, dayOfWeek:1},{unique:true}
)

const Schedule = mongoose.model("Schedule",scheduleSchema);

module.exports = Schedule;