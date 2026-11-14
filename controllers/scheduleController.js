const Doctor = require("../models/doctor");
const Schedule = require("../models/schedule");


exports.createSchedule = async(req,res) =>{

    try {
        
        const {doctor, dayOfWeek, sessions, isAvailable} = req.body;

        if(!doctor || !dayOfWeek || !sessions){
            return res.status(400).json({
                success:false,
                message:"please povide all required details"
            })
        }

        const doctorExists = await Doctor.findById(doctor);

        if(!doctorExists){
            return res.status(400).json({
                success:false,
                message:"Doctor not found"
            });
        }

        if(doctorExists.status !== true){
            return res.status(400).json({
                success:false,
                message:"Doctor is inactive"
            });
        }

        const existingSchedule = await Schedule.findOne({
            doctor,
            dayOfWeek
        });

        if(existingSchedule){
            return res.status(409).json({
                success:false,
                message:"Schedule already exists for this doctor on this day"
            });
        }

        for(const session of sessions){

            if(!session.startingTime || !session.endTime){
                
                return res.status(400).json({
                success:false,
                message:"session start time and end time are required"
            });
            }

            if(session.startingTime >= session.endTime){
                return res.status(400).json({
                success:false,
                message:"end time must be later than start time"
            });
            }

        }

        const schedule = new Schedule({
            doctor,
            dayOfWeek,
            sessions,
            isAvailable
        })

        await schedule.save();

        res.status(200).json({
            success:true,
            message:"schedule created successfully",
            schedule

        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
    
};

exports.viewDoctorSchedule = async(req,res) =>{
    
    try {
        
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
                success:false,
                message:"missing doctor ID"
            });
        }

        const doctor = await Doctor.findById(id)
                                   .populate("user", "name email status role")
                                   .populate("department", "name status");

          if (!doctor || doctor.status !== true ||
            !doctor.user ||
            doctor.user.status !== true ||
            doctor.user.role !== "doctor" ||
            !doctor.department ||
            doctor.department.status !== true) {
             return res.status(404).json({
                success:false,
                message:"doctor not found"
            });
        }

        const schedules = await Schedule.find({
            doctor:id
            

        });

        res.status(200).json({
            success:true,
            doctor,
            count:schedules.length,
            schedules
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        });
    }

};

exports.updateSchedule = async(req,res) =>{

    try {
        
        const {id} = req.params;

        
        if(!id){
            return res.status(400).json({
                success:false,
                message:"schedule ID is missing"
            });
        }

        const {dayOfWeek, sessions, isAvailable} = req.body;

        if(
            dayOfWeek === undefined &&
            sessions === undefined &&
            isAvailable === undefined
        ){
            return res.status(400).json({
                success:false,
                message:"please provide data to update"
            });
        }

        if(sessions !== undefined){
            if(!Array.isArray(sessions) || sessions.length === 0){
               return res.status(400).json({
                success:false,
                message:"please provide valid sessions"
            }); 
            }

            for(const session of sessions){
                if(!session.startingTime || !session.endTime){

                 return res.status(400).json({
                success:false,
                message:"session timing  are required"
            });    

            }
                
                if(session.startingTime >= session.endTime){
                    return res.status(400).json({
                    success:false,
                    message:"end time must be later than start time"
                     });
                }   
            }

        }

        const schedule = await Schedule.findByIdAndUpdate(
            id, req.body,
            {
                new:true,
                runValidators:true
            }
        )

        if(!schedule){
            return res.status(404).json({
                success:false,
                message:"schedule not found"
            }); 
        }

        res.status(200).json({
            success:true,
            message:"schedule updated successfully",
            schedule
        })
        
    } catch (error) {
        if(error.code === 11000){
            return res.status(409).json({
                success:false,
                message:"Schedule already exists for this doctor and day"
            }); 
        }

        res.status(400).json({
            success:false,
            message:error.message
        });
    }

}

exports.viewAllScheduleAdmin = async(req,res)=>{

    try {
        
        const schedules = await Schedule.find()
                .populate({
                    path:"doctor",
                    select:"user department specialization qualification status",
                    
                    populate:[
                        {
                            path:"user",
                            select:"name email"
                        },
                        {
                            path:"department",
                            select:"name"
                        }
                    ]
                })

                res.status(200).json({
                    success:true,
                    count:schedules.length,
                    schedules
                })


    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }

}

exports.updateScheduleStatus = async(req,res) => {

    try {
        
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
                success:false,
                message:"schedule ID is missing"
            });
        }

        const schedule = await Schedule.findById(id);

        if(!schedule){
            return res.status(404).json({
                success:false,
                message:"schedule not found"
            }); 
        }

        schedule.isAvailable = !schedule.isAvailable;

        await schedule.save();

        res.status(200).json({
                    success:true,
                    message:schedule.isAvailable
                        ? "schedule activated successfully"
                        : "schedule deactivated successfully",
                    schedule
                    
                })


    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }

}
