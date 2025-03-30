const bcrypt = require('bcryptjs');
const { UserModel, DeletedUserModel ,AdminUserModel } = require('../models/usertable')


//--------------- Login details ------------------- //
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }); 

        if (!user) {
            const admin = await AdminUserModel.findOne({ email });
            if (!admin) {
                return res.json({ message: "Invalid user" }); 
            }

            const isMatchAdmin = await bcrypt.compare(password, admin.password);
            if (isMatchAdmin) {
                return res.json({ message: "Successfullogin", role: admin.role, getuser: admin });
            } else {
                return res.json({ message: "Invalidcredentials" });
            }
        }

        const isMatchUser = await bcrypt.compare(password, user.password);
        if (isMatchUser) {
            return res.json({ message: "Successfullogin", role: user.role, getuser: user });
        } else {
            return res.json({ message: "Invalidcredentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};


//--------------- Signup details ------------------- ///
const signupuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await UserModel.findOne({ email }); //02


            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await UserModel.create({ ...req.body, password: hashedPassword }); 
            res.json({ message: "UserCreated" });
        
    } catch (err) {
        console.error("Signup error:", err);
        res.status(400).json({ error: "Error creating user. Please try again." });
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

const SentOTP = (req, res) => {
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
    }, 1000 * 60 * 1);

    console.log("otpStore Object ", otpStore);

    res.json({ otp });
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




//--------------- Forgot password ------------------- //
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

//---------- Update user profile ------------------//
const updateprofile = async (req, res) => {
    try {
        const { username, address, phone, email } = req.body;

        const updatedUser = await UserModel.findOneAndUpdate({ email },
            { $set: { username, address, phone } },
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
        const users = await UserModel.find(); 
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






 
module.exports = { loginuser, signupuser, updateuserpw, displayuser , deleteuser , displaydeletuser ,addAdmin, displayadmin , deleteaccount , updateprofile , checkregister , SentOTP , verifyOTP};