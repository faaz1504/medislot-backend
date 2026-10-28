const { generateToken } = require('../middlewares/auth');
const User = require('../models/user');

exports.createUser = async (req,res) =>{
    try {
        console.log("body--->",req.body);

        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"please fill all data"
            });
        }

        const user = await User.create(req.body)

        res.status(201).json({
            success:true,
            message:"user created successfully",
            user
        });

    } catch (error) {
        
        res.status(500).json({
            success:false,
            message:error.message
        });

    }
}

exports.getAllUsers = async (req,res) =>{
    try {
        
        const users = await User.find().select("-password")
        
        if(!users){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }

        res.status(200).json({
            success:true,
            count:users.length, 
            users
        })

    } catch (error) {
        
         res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

exports.getUserById = async(req,res) =>{

    try {
        
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
            success:false,
            message:"user id is missing"
          });
        }

        const user = await User.findById(id).select("-password")

        if(!user){
            return res.status(404).json({
            success:false,
            message:"user not found"
          });
        }

        res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
}

exports.LoginUser = async(req,res) =>{

try {
    
        const {email , password} = req.body;

         if(!email || !password){
          return res.status(400).json({
            success:false,
            message:"please fill all datas"
          });
        } 

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                success:false,
                message:"invalid email or password"
            })
        }

        const isPasswordMatches = await user.comparePassword(password);
        
        if(!isPasswordMatches){
            return res.status(401).json({
                success:false,
                message:"invalid email or password"
            })
        }

        if(!user.status){
            return res.status(403).json({
              success:false,
              message:"user is inactive"
            });
        }

        // const newUser = user.toObject();

        // delete newUser.password;

        const token = await generateToken(user._id,user.role)

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token not generated"
            })
        }





        res.status(200).cookie("token",token,{
            maxAge: 60 * 1000 * 60 * 24,
            httpOnly:true,
            secure:false

        }).json({
            success:true,
            message:"user logged in successfully",
            user
        })

} catch (error) {
        
    res.status(400).json({
            success:false,
            message:error.message
            
          });
}

}

exports.updateUserRole = async(req,res) =>{

    try {
        
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
            success:false,
            message:"user id is missing"
          });
        }

        const {role} = req.body;

        if(!role){
            return res.status(400).json({
            success:false,
            message:"role is missing"
          });
        }

        const user = await User.findById(id).select("-password")

        if(!user){
            return res.status(401).json({
              success:false,
              message:"invalid password or email"
            });
        }

        user.role = role;

        await user.save()

        res.status(200).json({
            success:true,
            message:"user role updated successfully",
            user
        })

    } catch (error) {
         res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

} 

exports.updateUserStatus = async(req,res) =>{

    try {
        
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
            success:false,
            message:"user id is missing"
          });
        }

        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({
              success:false,
              message:"invalid password or email"
            });
        }

        user.status = !user.status;

        await user.save();

        res.status(200).json({
            success:true,
            message:"user status updated successfully",
            user
        })


    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

}

exports.Logout = (req,res) =>{

    try {
        
        res.status(200).clearCookie("token",{
            httpOnly:true,
            secure:false,

        }).json({
            success:true,
            message:"user logged out successfully"
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
            
          });
    }

}