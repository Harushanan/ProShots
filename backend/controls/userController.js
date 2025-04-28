const bcrypt = require('bcryptjs');
const { UserModel, DeletedUserModel ,AdminUserModel } = require('../models/usertable')
const BookingSchema = require('../models/EventBookingModel')
const orderSchema = require('../models/Order')
const sendEmail = require('../config/mailService');
const { deleteModel } = require('mongoose');


//--------------- Login details ------------------- //
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }); //02

        if (!user) {
            return res.json({ message: "Invalid user" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ message: "Successfullogin" , role: user.role , getuser: user});
        }
        
        else {
            res.json({ message: "Invalidcredentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};


//-------------- checkregister -----------//
const checkregister = async (req, res) => {
    try {
        const { email } = req.body;
        const userExists = await UserModel.findOne({ email });
        const deleteuser = await DeletedUserModel.findOne({ email });

        if (userExists) {
            return res.json({ message: "EmailAlreadyExists" }); 
        }

        if (deleteuser) {
            return res.json({ message: "Alreadydeleteuser" });
        }

        console.log("New user");
        return res.json({ message: "newuser" });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(400).json({ error: "Error checking user. Please try again." });
    }
};


const otpStore = {};

// --------- Sent OTP -------//
const SentOTP = async(req, res) => {
    const { email } = req.body;
    const otp = Math.floor(10000 + Math.random() * 90000); 

    if (!otpStore[email]) {
        otpStore[email] = {};
    }

    otpStore[email].otp = otp;

    setTimeout(() => {
        if (otpStore[email]) { 
            delete otpStore[email]; 
        }
    }, 1000 * 60 * 5);

    console.log("otpStore Object ", otpStore);

   
    let to = email;
    let emailSubject = `Your OTP Delivered Successfully.`;
    let emailText = `Your OTP Code below to verify your identity : ${otp}.
    
        This OTP will expire in 5 minutes.`;
    
    if (emailSubject && emailText) {
        await sendEmail(to, emailSubject, emailText);
    }

    res.json({ otp });
};

// --------- Sent OTP passworddchange -------//
const sendotpchangepassword = async(req, res) => {
    const { email } = req.body;
    const otp = Math.floor(10000 + Math.random() * 90000); 

    if (!otpStore[email]) {
        otpStore[email] = {};
    }

    otpStore[email].otp = otp;

    setTimeout(() => {
        if (otpStore[email]) { 
            delete otpStore[email]; 
        }
    }, 1000 * 60 * 5);

    let to = email;
    let emailSubject = `Your OTP for Password Change`;
    let emailText = `Your OTP Code to change your password is : ${otp}.
    This OTP will expire in 5 minutes.`;
    
    if (emailSubject && emailText) {
        await sendEmail(to, emailSubject, emailText);
    }

    res.json({message: "OTP sent successfully" , otp: otp });



};

//------------------ Verify OTP -------------//
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    console.log("Data Body Email  :", email);
    console.log("Data Body OTP  :", otp);

    if (otpStore[email] && otpStore[email].otp == otp) {
        delete otpStore[email]; 
        res.json({ message: "OTP Verified" });
    } else {
        res.json({ message: "Invalid OTP" });
    }
};



//------------------ Verify OTP for change password -------------//
const verifyotpchangepassword = async (req, res) => {
    const { email, otp } = req.body;
    
    if (otpStore[email] && otpStore[email].otp == otp) {
        delete otpStore[email]; 
        res.json({ message: "OTP Verified" });
    } else {
        res.json({ message: "Invalid OTP" });
    }
};






//--------------- Signup details ------------------- //
const signupuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await UserModel.findOne({ email }); //02

        if (!userExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await UserModel.create({ ...req.body, password: hashedPassword }); 
            res.json({ message: "UserCreated" });
        } else {
            res.json({ message: "EmailAlreadyExists" });
        }
    } catch (err) {
        console.error("Signup error:", err);
        res.status(400).json({ error: "Error creating user. Please try again." });
    } 
};

//--------------- Forgot password ------------------- ///
const updateuserpw = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }); //04

        if (!user) {
            return res.json({ message: "Invalid user" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await UserModel.updateOne({ email }, { $set: { password: hashedPassword } });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};

//--------------- check is Forgot password ------------------- ///
const checkupdateuserpw = async (req, res) => {
    try {
        const { email} = req.body;
        const user = await UserModel.findOne({ email }); //04

        if (!user) {
            return res.json({ message: "Invalid user" });
        }

        else{
            return res.json({ message: "current user" });
        }
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};

//---------- Update user profile ------------------//
const updateprofile = async (req, res) => {
    try {
        const { username, address, phone, email, profileImage } = req.body;

        const updatedUser = await UserModel.findOneAndUpdate({ email },
            { $set: { username, address, phone , profileImage: profileImage} },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Updated successfully", newprofile: updatedUser });

    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//--------------- Display user data ------------------- //
const displayuser = async (req, res) => {
    try {
        const users = await UserModel.find({role:'customer'}); 
        res.json(users);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database connection failed" });
    }
};

const displaydeletuser = async (req, res) => {
    try {
        const users = await DeletedUserModel.find(); //04
        res.json(users);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database connection failed" });
    }
};

//-----Deleteuser --------------------//
const deleteuser = async (req, res) => {
    try {
        const { email, reason } = req.body;
    
        const user = await UserModel.findOne({ email });
        
        if (user) {
            await DeletedUserModel.create({ 
                username: user.username, 
                email: user.email,
                phone: user.phone,
                address: user.address,
                reason: reason ,
                removeby:"Admin",
                date: new Date().toISOString().split('T')[0]
            });
    
            const deletedUser = await UserModel.findOneAndDelete({ email });
    
            if (deletedUser) {
                let to = email;
                let emailSubject = `Account Removal Notice`;
                let emailText = `Your account has been removed due to: ${reason}.
                For any questions, please contact us.`;
                
                if (emailSubject && emailText) {
                    await sendEmail(to, emailSubject, emailText);
                }
                return res.json({ message: 'UserDeleted' });
                
            } else {
                return res.status(404).json({ message: 'UserNotFound' });
            }
        } else {
            return res.status(404).json({ message: 'UserNotFound' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }

};

//-----Add Deleteuser --------------------//
const adduser = async (req, res) => {
    try {
        const { email } = req.body;
        const deletedUser = await DeletedUserModel.findOneAndDelete({ email });
    
            if (deletedUser) {
                let to = email;
                let emailSubject = `Account Approval Notice`;
                let emailText = `Your account request has been approved by the Admin.
                You can now re-sign up and continue using our services. 
                For any questions, please contact us.`;

                
                if (emailSubject && emailText) {
                    await sendEmail(to, emailSubject, emailText);
                }
                return res.json({ message: 'UserAdd' });
            } else {
                return res.status(404).json({ message: 'UserNotFound' });
            }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add user' });
    }
};




const deleteaccount =  async (req, res) => {
    try {
        const { myemail } = req.body;
    
        const user = await UserModel.findOne({ email:myemail });
    
    
        if (user) {
            await DeletedUserModel.create({ 
                username: user.username, 
                email: user.email,
                phone: user.phone,
                address: user.address,
                reason: "Customer delete account",
                removeby:"Account Owner",
                date: new Date().toISOString().split('T')[0]
            });
    
            const deletedUser = await UserModel.findOneAndDelete({ email:myemail});
    
            if (deletedUser) {
                return res.json({ message: 'UserDeleted' });
            } else {
                return res.status(404).json({ message: 'UserNotFound' });
            }
        } else {
            return res.status(404).json({ message: 'UserNotFound' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};



//----------- Add as Admin --------------//
const addAdmin = async (req, res) => {
    try {
        const { email} = req.body;
        console.log("Email:", email);
    
        const user = await UserModel.findOne({ email });

        console.log("---------- I am in Add as Admin -----------")
    
        if (user) {
            await AdminUserModel.create({ 
                username: user.username, 
                email: user.email,
                phone: user.phone,
                address: user.address,
                role:"Admin",
                date: new Date().toISOString().split('T')[0]
            });
    
            const deletedUser = await UserModel.findOneAndDelete({ email });
    
            if (deletedUser) {
                return res.json({ message: 'UserDeleted' });
            } else {
                return res.status(404).json({ message: 'UserNotFound' });
            }
        } else {
            return res.status(404).json({ message: 'UserNotFound' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

const displayadmin = async (req, res) => {
    try {
        const users = await AdminUserModel.find(); //04
        res.json(users);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database connection failed" });
    }
};

//============== Admin View user  booking , order =================//
const getuserdeatiles = async (req, res) => {
    try {
        const { id } = req.query;

        let currentusers = await UserModel.findById(id);

        if (!currentusers) {
            const deleteuser = await DeletedUserModel.findById(id);
            currentusers = deleteuser;
        }

        if (!currentusers) {
            return res.status(404).json({ message: "User not found" });
        }

        const eventbooking = await BookingSchema.find({ email: currentusers.email });
        const order = await orderSchema.find({ email: currentusers.email });

        res.json({ user: currentusers, eventbooking, order });

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database connection failed" });
    }
};







 
module.exports = { loginuser, signupuser, updateuserpw, displayuser , deleteuser , displaydeletuser ,addAdmin, displayadmin , deleteaccount , updateprofile , checkregister , SentOTP , verifyOTP , getuserdeatiles , sendotpchangepassword , verifyotpchangepassword , adduser , checkupdateuserpw};