const Appointment = require("../models/appointment");
const Department = require("../models/department");
const Doctor = require("../models/doctor");
const Schedule = require("../models/schedule");
const User = require("../models/user");



exports.bookAppointment = async (req,res) =>{

    try {
        
        const {doctor ,schedule, appointmentDate, startingTime, reason} = req.body;

        // get patient id--->
        const patient = req.userId;

        if(!patient || !doctor || !schedule || !appointmentDate || !startingTime || !reason){
            return res.status(400).json({
                success:false,
                message:"Please provide all required details"
            });
        }

        // check patient account--->
        const patientUser = await User.findById(patient);

        if(!patientUser || patientUser.role !== "patient" || patientUser.status === false){
            return res.status(403).json({
                success:false,
                message:"Invalid or inactive patient account"
            });
        }


        // check doctor----->
        const doctorDetails = await Doctor.findById(doctor);
        
        if(!doctorDetails || doctorDetails.status !== true){
            return res.status(404).json({
                success:false,
                message:"Doctor not found or inactive"
            });
        }

        // check doctor's user account----->
        
        const userId = doctorDetails.user.toString();

        const doctorUser = await User.findById(userId)
            .select("_id name email role status");



        // if(!doctorUser || doctorUser.role !== "doctor" || doctorUser.status === false){
        //      return res.status(400).json({
        //         success:false,
        //         message:"Doctor account is inactive"
        //     });
        // }

        if (!doctorUser) {
            return res.status(404).json({
                success: false,
                message: "Doctor user account not found"
            });
        }

        if (doctorUser.role !== "doctor") {
            return res.status(400).json({
                success: false,
                message: "User role is not doctor"
            });
        }

        if (doctorUser.status === false) {
            return res.status(400).json({
                success: false,
                message: "Doctor user account is inactive"
            });
        }

        //check department----->
        const department = await Department.findById(doctorDetails.department);

        if(!department || department.status !== true){
            return res.status(400).json({
                success:false,
                message:"Doctor's department  is inactive"
            });
        }

        //checks doctor's schedule----->
        const doctorSchedule = await Schedule.findById(schedule);

        if(!doctorSchedule || doctorSchedule.isAvailable !== true){
             return res.status(400).json({
                success: false,
                message: "Schedule not found or unavailable"
            });
        }

        //checks if the schedule is selected doctor's---->
        if(doctorSchedule.doctor.toString() !== doctor){
            return res.status(400).json({
                success: false,
                message: "This schedule does not belong to the selected doctor"
            });
        }

        // validating  appointment date----> 
        const date = new Date(`${appointmentDate}T00:00:00.000Z`);

        if(
            ! /^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) ||
            Number.isNaN(date.getTime()) ||
            date.toISOString().slice(0, 10) !== appointmentDate
        ){
             return res.status(400).json({
                success: false,
                message: "Invalid appointment date"
            });
        }

        //check if the appointment is in the future--->
         const nowParts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }).formatToParts(new Date());

        const now = {};
        nowParts.forEach(part => {
            if (part.type !== "literal") {
                now[part.type] = part.value;
            }
        });

        const today = `${now.year}-${now.month}-${now.day}`;
        const currentTime = `${now.hour}:${now.minute}`;

        if (
            appointmentDate < today ||
            (appointmentDate === today && startingTime <= currentTime)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please select a future appointment time"
            });
        }

        //check selected day is correct--->
        const dayOfWeek = new Intl.DateTimeFormat("en-Us",{
            weekday: "long",
            timeZone: "UTC"
        }).format(date);

        if(doctorSchedule.dayOfWeek !== dayOfWeek){
             return res.status(400).json({
                success: false,
                message: "Doctor is not available on this day"
            });
        }

        // validates requested time---->
        if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(startingTime)) {
            return res.status(400).json({
                success: false,
                message: "Invalid starting time"
            });
        }

        const requestedMinutes =
            Number(startingTime.split(":")[0]) * 60 +
            Number(startingTime.split(":")[1]);

        let selectedEndTime = null;

         for (const session of doctorSchedule.sessions) {

            const sessionStart =
                Number(session.startingTime.split(":")[0]) * 60 +
                Number(session.startingTime.split(":")[1]);

            const sessionEnd =
                Number(session.endTime.split(":")[0]) * 60 +
                Number(session.endTime.split(":")[1]);

            const slotDuration = Number(session.slotDuration || 30);

            const selectedEnd = requestedMinutes + slotDuration;

            if (
                requestedMinutes >= sessionStart &&
                selectedEnd <= sessionEnd &&
                (requestedMinutes - sessionStart) % slotDuration === 0
            ) {
                const hours = Math.floor(selectedEnd / 60);
                const minutes = selectedEnd % 60;

                selectedEndTime =
                    `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

                break;
            }

        }

        if (!selectedEndTime) {
            return res.status(400).json({
                success: false,
                message: "Selected time is outside available sessions"
            });
        }

        // checks for duplicate bookings---->
        const existingApppointment = await Appointment.findOne({
            doctor,
            appointmentDate:date,
            startingTime,
            status: {$ne: "cancelled"}
        });
        
        if(existingApppointment){
            return res.status(409).json({
                success: false,
                message: "This appointment slot is already booked"
            });
        }

        //create appointment---->
        const appointment = new Appointment({
            patient,
            doctor,
            schedule,
            appointmentDate:date,
            startingTime,
            endTime:selectedEndTime,
            reason
        })

        await appointment.save();

            await appointment.populate({
    path: "doctor",
    select: "user department specialization qualification consultationFee",
    populate: [
        {
            path: "user",
            select: "name email"
        },
        {
            path: "department",
            select: "name"
        }
    ]
});

await appointment.populate("schedule");

        res.status(200).json({
            success:true,
            message:"Appointment booked successfully",
            appointment
        })


    } catch (error) {
       res.status(500).json({
            success:false,
            message:error.message
        });  
    }

}

exports.viewAllAppointmentsAdmin = async (req,res)=>{

    try {
        
        const appointment = await Appointment.find()
            .populate("patient", "name email phone")
            .populate({
                path:"doctor",
                select:"user department specialization qualification",

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

            .populate("schedule", "dayOfWeek sessions")
            .sort({appointmentDate: -1})

            res.status(200).json({
                success:true,
                count:appointment.length,
                appointment
            })

    } catch (error) {
         res.status(500).json({
            success:false,
            message:error.message
        });
    }

}

exports.viewPatientAppointment = async (req,res)=>{

    try {
        
        const patient = req.userId;

        if(!patient){
            return res.status(401).json({
                success: false,
                message: "Patient authentication required"
            });
        }

        const appointment = await Appointment.find(
            {
                patient:patient
            }
        )

        .populate({
            path:"doctor",
            select:"user department specialization qualification consultationFee",
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
        .populate("schedule", "dayOfWeek sessions")
        .sort({appointmentDate: -1});

        res.status(200).json({
            success:true,
            count:appointment.length,
            appointment
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }

}

exports.viewDoctorAppointments = async (req,res)=>{

    try {
        
        const userId = req.userId;

        if(!userId){
            return res.status(401).json({
                success: false,
                message: "authentication required"
            });
        }

        const doctor = await Doctor.findOne({
            user:userId
        })

        

        if(!doctor){
            return res.status(401).json({
                success: false,
                message: "Doctor profile not found"
            });
        }

        console.log("Logged-in User ID:", userId);
console.log("Logged-in Doctor ID:", doctor._id);
         

        const appointments = await Appointment.find({
                doctor:doctor._id
            })

            

        .populate("patient", "name email phone")
        .populate("schedule", "dayOfWeek sessions")
        .sort({
            appointmentDate: 1,
            startingTime: 1
        });
        console.log("Matched Appointments:", appointments);

        res.status(200).json({
            success:true,
            count:appointments.length,
            appointments    
        })

    } catch (error) {
         console.log("Controller Error:", error);

        res.status(500).json({
            success:false,
            message:error.message
        });
    }

}

exports.viewAppointmentById = async (req,res)=>{

    try {
        
        const {id} = req.params;

        if(!id){
            return res.status(401).json({
                success: false,
                message: "Appointment ID is missing"
            });
        }

        const appointment = await Appointment.findById(id)

        .populate("patient", "name email phone")

        .populate({
            path:"doctor",
            select:"user department specialization qualification consultationFee",
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
        .populate("schedule", "dayOfWeek sessions")

        if(!appointment){
            return res.status(401).json({
                success: false,
                message: "Appointment not found"
            });
        }
        

        res.status(200).json({
            success:true,
             message: "Appointment retrieved successfully",
            appointment
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }

}

exports.cancelAppointment = async (req,res) =>{

    try {
        
        const {id} = req.params;
        const userId = req.userId;
        const userRole = req.userRole;

        if(!id){
            return res.status(401).json({
                success: false,
                message: "Appointment ID is missing"
            });
        }

        const appointment = await Appointment.findById(id);

        if(!appointment){
            return res.status(401).json({
                success: false,
                message: "Appointment not found"
            });
        }

        if(
            userRole === "patient" && appointment.patient.toString() !== userId.toString()
        ){
            return res.status(403).json({
                success: false,
                message: "You cannot cancel another patient's appointment"
            });
        }

        //check status of the appointment
        if(
            appointment.status === "cancelled" || 
            appointment.status === "completed" 
        ){
             return res.status(400).json({
                success: false,
                message: "this appointment cannot be cancelled"
            });
        }

        appointment.status = "cancelled";

        await appointment.save();

        res.status(200).json({
            success:true,
             message: "Appointment cancelled successfully",
            appointment
        })


    } catch (error) {
         res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

rescheduleAppointment = async (req,res)=>{

    try {
        
        const {id} = req.params;
        const userId = req.userId;
        const userRole = req.userRole;

        const {schedule ,appointmentDate, startingTime} = req.body;

        if(!id || !schedule || !appointmentDate || !startingTime){
            return res.status(400).json({
                success: false,
                message: "Please provide all required details"
            });
        }

        

    } catch (error) {
        
    }

}
