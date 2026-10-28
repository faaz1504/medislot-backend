const Department = require("../models/department");
const Doctor = require("../models/doctor");
const User = require("../models/user");

exports.createDoctor = async(req,res)=>{

    try {
        
        const {user ,department ,specialization, qualification, 
                experienceYears, consultationFee , bio} = req.body;

        if(!user ||
           !department ||
           !specialization ||
           !qualification ||
           !experienceYears == null || 
           !consultationFee == null ||
           !bio
        ){
            return res.status(400).json({
                success:false,
                message:"Please Provide All Required Details"
            })
        }

        const doctorUser = await User.findById(user);
        if(!doctorUser){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

        if(doctorUser.role !== "doctor"){
            return res.status(400).json({
                success:false,
                message:"User Does Not Have Doctor Role"
            })
        }

        const doctorDepartment = await Department.findById(department); 
        
        if(!doctorDepartment){
            return res.status(404).json({
                success:false,
                message:"Department Not Found"
            });
        }

        if(!doctorDepartment.status === "false"){
             return res.status(400).json({
                success:false,
                message:"Department is Inactive"
            })
        }

        const existingDoctor = await Doctor.findOne({
            user:user
        })

        if(existingDoctor){
            return res.status(409).json({
                success:false,
                message:"doctor profile already exists"
            })
        }

        const doctor = new Doctor({
            user,
            department,
            specialization,
            qualification,
            experienceYears,
            consultationFee,
            bio
        });

        await doctor.save();

        res.status(200).json({
            success:true,
            message:"Doctor Created Successfully",
            doctor
        });


    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

};

exports.viewAllDoctors = async(req,res)=>{

    try {
        
        const doctors = await Doctor.find({status:true}).populate("user", "name status role")
                                                        .populate("department", "name status");
                                                    
            if(!doctors){
            return res.status(404).json({
                success:false,
                message:"doctor not found"
            });
        }      

        const activeDoctors = doctors.filter((doctor) =>{
            return doctor.user && 
                   doctor.user.status === true &&
                   doctor.user.role === "doctor" &&
                   doctor.department &&
                   doctor.department.status === true

        });

        
        res.status(200).json({
            success:true,
            count:activeDoctors.length,
            doctors:activeDoctors
        });

        } catch (error) {
         res.status(400).json({
            success:false,
            message:error.message
        });
    }

};