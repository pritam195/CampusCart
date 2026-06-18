const User = require("../models/User");
const OtpVerification = require("../models/OtpVerification");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailService");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};




exports.sendOtp = async (req, res) => {
  try {
    const { name, email, password, university, phone } = req.body;

    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();


    
    
    
    
    
    

    
    await OtpVerification.deleteMany({ email });

    await OtpVerification.create({
      name,
      email,
      password,
      university,
      phone,
      emailOtp,

    });

    
    
    const emailSent = await sendEmail({
      to: email,
      subject: "CampusCart - Your Registration OTP",
      text: `Hello ${name},\n\nYour One-Time Password (OTP) for CampusCart registration is: ${emailOtp}\n\nThis OTP will expire in 10 minutes.\n\nWelcome to CampusCart!`
    });

    if (!emailSent) {
      console.error(`Failed to send email OTP to ${email}`);
      // Clean up the pending OTP since email failed
      await OtpVerification.deleteMany({ email });
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please check your email address and try again.",
      });
    }

    
    console.log(`\n========== OTP GENERATED ==========`);
    console.log(`Email to: ${email} -> OTP: [ ${emailOtp} ] (Actually Sent via Nodemailer!)`);

    console.log(`===================================\n`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.verifyOtp = async (req, res) => {
  try {
    const { email, emailOtp } = req.body;

    
    const pendingUser = await OtpVerification.findOne({ email });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid. Please sign up again.",
      });
    }

    
    if (pendingUser.emailOtp !== emailOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email OTP",
      });
    }

    
    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password, 
      university: pendingUser.university,
      phone: pendingUser.phone,
    });

    
    await pendingUser.deleteOne();

    
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered and verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.register = async (req, res) => {
  try {
    const { name, email, password, university, phone } = req.body;

    
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    
    const user = await User.create({
      name,
      email,
      password,
      university,
      phone,
    });

    
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.updateProfile = async (req, res) => {
  try {
    const { name, email, university, phone, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    
    let avatarUrl = avatar;
    if (req.file) {
      avatarUrl = req.file.path;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.university = university || user.university;
    user.phone = phone || user.phone;
    user.avatar = avatarUrl || user.avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
