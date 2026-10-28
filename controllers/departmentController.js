const Department = require("../models/department");

exports.createDepartment = async(req,res)=>{

    try {
        
        const {name , description} = req.body;

        if(!name.trim()){
            return res.status(400).json({
                success:false,
                message:"department name is required"
            })
        }

        const existingDepartment = await Department.findOne({
            name:name.trim()
        });

        if(existingDepartment){
            return res.status(409).json({
                success:false,
                message:"department already exists"
            });
        }

        const department = await Department.create({
            name:name.trim(),
            description
        });

        res.status(201).json({
            success:true,
            message:"department created successfully",
            department
        })

    } catch (error) {
         res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

}

exports.viewAllDepartments = async(req,res)=>{

    try {
        
        const departments = await Department.find({
            status:true
        })

        if(!departments){
            return res.status(404).json({
            success:false,
            message:"department not found"
        });
        }

        res.status(200).json({
        success:true,
        count:departments.length,
        departments
    });


    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

}

exports.viewAllDepartmentsAdmin = async(req,res)=>{

    try {
        
        const departments = await Department.find()

        if(!departments){
            return res.status(404).json({
            success:false,
            message:"department not found"
        });
        }

        res.status(200).json({
        success:true,
        count:departments.length,
        departments
    });


    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

}

exports.viewDepartmentById = async(req,res)=>{


    try {
        
        const {id} = req.params;
        
        if(!id){
            return res.status(400).json({
            success:false,
            message:"  missing department ID"
          });
        }

        const department = await Department.findById(id);

        if(!department){
            return res.status(404).json({
            success:false,
            message:" department not found"
          });
        }

        res.status(200).json({
        success:true,
        department
        });

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

}

exports.updateDepartment = async(req,res)=>{

    try {
        
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
            success:false,
            message:"  missing department ID"
          });
        }

        const {name,description} = req.body;

        if(!name.trim() || !description){
            return res.status(400).json({
                success:false,
                message:"department name & description is required"
            })
        }

        const department = await Department.findByIdAndUpdate(id, req.body,{new:true})

        res.status(200).json({
        success:true,
        message:"department successfully updated",
        department
        });


    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

}

exports.updateDepartmentStatus = async(req,res)=>{

    try {
        
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
            success:false,
            message:"  missing department ID"
          });
        }

        const department = await Department.findById(id);

        if(!department){
            return res.status(404).json({
            success:false,
            message:" department not found"
          });
        }

        department.status = !department.status;
        await department.save();

        res.status(200).json({
            success:true,
            message:"department status updated successfully",
            department
        });



    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

}