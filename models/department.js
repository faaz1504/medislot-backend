const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema ({

    name:{
        type:String,
        unique:true,
        trim:true
    },

    description:{
        type:String,
        trim:true,
        default:""
    },

    status:{
        type:Boolean,
        default:true
    }


},{
    timestamps:true
});

const Department = mongoose.model("Department",departmentSchema);

module.exports = Department;