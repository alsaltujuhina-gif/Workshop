import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import userModel from "./models/userModel.js";
import workshopModel from "./models/workshopModel.js";
import { Enrollment } from "./models/EnrollmentModel.js";


dotenv.config();

// -------------------- PATH FIX --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- EXPRESS APP --------------------
const app = express();
app.use(express.json());
app.use(cors());

// Serve workshop uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- MULTER UPLOAD --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// -------------------- MONGODB CONNECTION --------------------
const connectionString = `mongodb+srv://ibtihaj:1234@cluster0.emanzla.mongodb.net/workshopsDB`;

mongoose.connect(connectionString)
  .then(() => console.log("Database Connected Successfully!"))
  .catch(err => console.log("DB Connection Error:", err));


// ---------------- REGISTER ----------------

app.post("/register", async (req, res) => {
  const { userEmail, userPassword, role, userPhone, userAddress } = req.body;

  try {
    const existingUser = await userModel.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new userModel({
      userEmail,              
      userPassword: hashedPassword,
      role: role || "user",
      userPhone,
      userAddress,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await userModel.findOne({ userEmail }); 
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      message: "Login successful",
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


/* ============================================================
    ADD WORKSHOP
============================================================ */
app.post("/addWorkshop", upload.single("image"), async (req, res) => {
  try {
    const newWorkshop = new workshopModel({
      courseName: req.body.courseName,
      date: req.body.date,
      time: req.body.time,
      courseType: req.body.courseType,
      description: req.body.description,
      location: req.body.location,
      image: req.file ? req.file.filename : null,
    });

    await newWorkshop.save();
    res.json({ msg: "Workshop added successfully", success: true });
  } catch (err) {
    console.error(err);
    res.json({ msg: "Error adding workshop", success: false });
  }
});

/* ============================================================
    UPDATE WORKSHOP
============================================================ */
app.put("/updateWorkshop/:id", upload.single("image"), async (req, res) => {
  try {
    const fields = {};

    if (req.body.courseName) fields.courseName = req.body.courseName;
    if (req.body.date) fields.date = req.body.date;
    if (req.body.time) fields.time = req.body.time;
    if (req.body.courseType) fields.courseType = req.body.courseType;
    if (req.body.description) fields.description = req.body.description;
    if (req.body.location) fields.location = req.body.location;
    if (req.file) fields.image = req.file.filename;

    const updated = await workshopModel.findByIdAndUpdate(
      req.params.id,
      fields,
      { new: true }
    );

    if (!updated)
      return res.json({ msg: "Workshop not found", success: false });

    res.json({
      msg: "Workshop updated successfully",
      success: true,
      workshop: updated,
    });
  } catch (err) {
    console.error(err);
    res.json({ msg: "Error updating workshop", success: false });
  }
});

/* ============================================================
    DELETE WORKSHOP
============================================================ */
app.delete("/deleteWorkshop/:id", async (req, res) => {
  try {
    await workshopModel.findByIdAndDelete(req.params.id);
    res.json({ msg: "Workshop deleted", success: true });
  } catch (err) {
    res.json({ msg: "Error deleting", success: false });
  }
});

/* ============================================================
    GET ALL WORKSHOPS
============================================================ */
app.get("/allWorkshops", async (req, res) => {
  try {
    const workshops = await workshopModel.find().sort({ createdAt: -1 });
    const workshopsWithImageUrl = workshops.map((w) => ({
      ...w._doc,
      image: w.image ? `http://localhost:5000/uploads/${w.image}` : null,
    }));
    res.json(workshopsWithImageUrl);
  } catch (err) {
    res.json({ msg: "Error fetching workshops" });
  }
});

//Bring one workshop by ID and add the image link
app.get("/workshops/:id", async (req, res) => {
  try {
    const workshop = await workshopModel.findById(req.params.id);
    if (!workshop) return res.status(404).json({ msg: "Workshop not found" });

    const workshopWithImageUrl = {
      ...workshop._doc,
      image: workshop.image ? `http://localhost:5000/uploads/${workshop.image}` : null,
    };

    res.json(workshopWithImageUrl);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching workshop" });
  }
});

//Get all the workshops that a specific user has enrolled for.
app.get("/api/enrollments/my-enrollments/:userId", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.params.userId });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// POST new enrollment
app.post("/api/enrollments", async (req, res) => {
  console.log("Request body:", req.body); 
  try {
    const { userId, title, date } = req.body;
    console.log("userId:", userId, "title:", title, "date:", date); 
    
    const newEnrollment = new Enrollment({ userId, title, date });
    await newEnrollment.save();
    res.json(newEnrollment);
  } catch (err) {
    console.error("Error saving enrollment:", err);
    res.status(500).json({ error: "Cannot enroll" });
  }
});

// GET user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // MongoDB
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



/* ============================================================
    START SERVER
============================================================ */
app.listen(5000, () => console.log(" Server running on port 5000"));
