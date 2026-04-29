import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

const normalizeSearch = (value) => value?.trim();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//Signup controller
export const signupController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone
    ) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    if (password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      address,
      city,
      country,
      phone,
    });

    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ _id: newUser._id }, secretKey, {
      expiresIn: "7d",
    });

    return res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV !== "development",
        httpOnly: true,
        sameSite: "strict",
      })
      .send({
        success: true,
        message: "Registration successful",
        token,
        user: newUser,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in signup",
      error,
    });
  }
};

//Login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    const isEmailExist = await User.findOne({ email });
    if (!isEmailExist) {
      return res.status(400).send({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, isEmailExist.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const secretKey = process.env.JWT_SECRET;

    const token = jwt.sign({ _id: isEmailExist._id }, secretKey, {
      expiresIn: "7d",
    });

    if (token) {
      return res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          secure: process.env.NODE_ENV !== "development",
          httpOnly: true,
          sameSite: "strict",
        })
        .send({
          success: true,
          message: "Login successful",
          token,
          user: isEmailExist,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//Get Profile controller
export const getProfileController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User profile fetched successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        city: user.city,
        country: user.country,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture?.url,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting profile",
      error,
    });
  }
};

//Logout controller
export const logoutController = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "No token found",
      });
    } else {
      res
        .status(200)
        .cookie("token", "", {
          expires: new Date(Date.now()),
          secure: process.env.NODE_ENV !== "development",
          httpOnly: true,
        })
        .send({
          success: true,
          message: "Logout successful",
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in logout",
      error,
    });
  }
};

//update profile controller
export const updateProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, password, address, city, country, phone } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      if (password.length < 6) {
        return res.status(400).send({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      user.password = await bcrypt.hash(password, 10);
    }
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in updating profile",
      error,
    });
  }
};

//updated Password controller
export const updatePasswordController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Old password is incorrect",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in updating password",
      error,
    });
  }
};

//get all users for admin controller
export const getAllUsersController = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10);
    const limit = Number.parseInt(req.query.limit, 10);
    const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
    const pageLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const keyword = normalizeSearch(req.query.keyword);
    const role = normalizeSearch(req.query.role);
    const filter = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: escapeRegex(keyword), $options: "i" } },
        { email: { $regex: escapeRegex(keyword), $options: "i" } },
        { phone: { $regex: escapeRegex(keyword), $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalUsers / pageLimit));
    const safePage = Math.min(currentPage, totalPages);
    const skip = (safePage - 1) * pageLimit;
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    return res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      users,
      totalUsers,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: safePage,
        pageSize: pageLimit,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting users",
      error,
    });
  }
};

//update profile picture controller
export const updateProfilePictureController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const file = getDataUri(req.file);

    //delete existing profile picture from cloudinary
    if (user.profilePicture && user.profilePicture.public_id) {
      await cloudinary.v2.uploader.destroy(user.profilePicture.public_id);
    }

    //upload new profile picture to cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(file.content, {
      folder: "One-Stop-Solution/Profile-Pictures",
    });

    user.profilePicture = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in updating profile picture",
      error,
    });
  }
};

//delete profile picture controller
export const deleteProfilePictureController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.profilePicture?.public_id) {
      await cloudinary.v2.uploader.destroy(user.profilePicture.public_id);
    }

    user.profilePicture = null;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Profile picture deleted successfully",
      profilePicture: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in deleting profile picture",
      error,
    });
  }
};
