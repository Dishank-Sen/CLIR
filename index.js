const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('./models/User');
const Club = require('./models/club');
const connectDB = require('./config/userDB');
const connectClubDB = require('./config/clubsDB');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadFile = require('./cloudinary/cloudConfig');
const uploadFile1 = require('./cloudinary/cloudConfig1');
const Resource = require('./models/resource');
const Member = require('./models/member');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("./uploads", express.static("uploads"));
app.set('view engine','ejs')
app.set('views', path.join(__dirname, './public', 'views'));

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Uploads will be stored in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

connectDB();
connectClubDB();



app.get('/api',(req,res) => {
  res.send("this is api page");
});

app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname,'./public','index.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'signup.html'));
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'login.html'));
});

app.get('/clubs', (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "clubs.html"));
});

app.get('/createClub', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'createClub.html'));
});

app.get('/technical', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'technical.html'));
});

app.get('/cultural', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'cultural.html'));
});


app.get('/adminPortal',(req,res) => {
    res.sendFile(path.join(__dirname, './public', 'adminPortal.html'));
});

app.get('/adminDashboard',(req,res) => {
    res.sendFile(path.join(__dirname, './public', 'adminDashboard.html'));
});

app.get('/dashboard',(req,res) => {
    res.sendFile(path.join(__dirname, './public', 'dashboard.html'));
});

app.get('/joinClub',(req,res) => {
    res.sendFile(path.join(__dirname, './public', 'joinClub.html'));
});

app.get('/announcement',(req,res) => {
    res.sendFile(path.join(__dirname, './public', 'announcement.html'));
});

app.get('/featuredClub',(req,res) => {
    res.sendFile(path.join(__dirname, './public', 'featuredClub.html'));
});

// API endpoint for sign up
app.post('/api/signup', async (req, res) => {
  
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// API endpoint for login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const uniqueCookieName = `token_${user._id.toString()}`;
    res.cookie(uniqueCookieName, token, {
      httpOnly: true, // For security, prevents client-side access
      secure: true, // Set to true in production (use HTTPS)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      sameSite: 'strict'
    });
    res.status(200).json({ message: 'Login successful' , userId: user._id});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/verify', async (req,res) => {
  try{
      const userId = req.body['userId'];
      // console.log(userId);
      const uniqueCookieName = `token_${userId}`;
      const token = req.cookies[uniqueCookieName];
      if (!token) {
          return res.status(401).json({ message: 'Not a valid JWT token' });
      }
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
          if (err) {
              if (err.name === 'TokenExpiredError') {
                  return res.status(401).json({ message: 'Token has expired' });
              }
              return res.status(401).json({ message: 'Invalid token' });
          }
          return res.status(200).json({ message: 'Logged in' });
      });
  }catch(err){
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/getInfo', async (req,res) => {
  try{
    const userId = req.body['userId'];
    const user = await User.findOne({ _id:userId });
    const username = user.username;
    const email = user.email;
    res.status(200).json({message:'user information',username:username, email:email});
  }catch(error){
    console.log(error)
    res.status(500).json({message:'server error'});
  }
});

app.post('/api/logout', (req, res) => {
  try {
      const userId = req.body['userId']; // If your cookie name is dynamic
      const uniqueCookieName = `token_${userId}`; // Construct the cookie name
      res.cookie(uniqueCookieName, '', {
          httpOnly: true, // Same options as the original cookie
          secure: true, // Should be true in production with HTTPS
          expires: new Date(0), // Set expiration to a past date
          sameSite: 'strict',
      });
      return res.status(200).json({ message: 'Logged out and cookie deleted' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

// API endpoint for club creation
app.post('/api/createClub', upload.fields([
  { name: "adminProfileImage", maxCount: 1 },
  { name: "clubIcon", maxCount: 1 },
  { name: "permissionDocument", maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      clubName, 
      adminName, 
      adminEmail, 
      adminPhone, 
      clubPassword, 
      permissionPassword,
      category, 
      clubEmail
    } = req.body;
    
    const existingClub = await Club.findOne({ clubName });
    if (existingClub) {
      return res.status(400).json({ message: 'Club already exists' });
    }

    // Ensure files are received
    if (!req.files || !req.files.adminProfileImage || !req.files.clubIcon) {
      return res.status(400).json({ message: 'Missing required files' });
    }

    // Get the file paths
    const adminProfileImagePath = req.files.adminProfileImage[0].path;
    const clubIconPath = req.files.clubIcon[0].path;
    const permissionDocumentPath = req.files.permissionDocument ? req.files.permissionDocument[0].path : null;
    console.log(permissionDocumentPath)
    // Upload the files to Cloudinary
    const adminProfileInfo = await uploadFile(adminProfileImagePath);
    const clubIconInfo = await uploadFile(clubIconPath);
    const permissionDocumentInfo = await uploadFile(permissionDocumentPath);
    
    const adminProfileURL = adminProfileInfo.secure_url;
    const clubIconURL = clubIconInfo.secure_url;
    const permissionDocumentURL = permissionDocumentInfo.secure_url;
    
    //saving data to database
    try{
      const existingClub = await User.findOne({ clubName });
      console.log(existingClub)
      if (existingClub) {
        return res.status(400).json({ message: 'club already exist' });
      }
      const hashedClubPassword = await bcrypt.hash(clubPassword, 10);
      const hashedPermissionPassword = await bcrypt.hash(permissionPassword, 10);
      const newClub = new Club({
        clubName,
        admin: {
          name: adminName,
          email: adminEmail,
          phone: adminPhone,
          profileImage: adminProfileURL,  // Cloudinary URL
        },
        icon: clubIconURL,  // Cloudinary URL
        clubPassword: hashedClubPassword,
        institutePermissionDocument: permissionDocumentURL,  // Cloudinary URL
        institutePermissionPassword: hashedPermissionPassword,
        category,
        email: clubEmail,
      });
      console.log("testing 1")
      // Save the club to the database
      await newClub.save();
      console.log("testing 2")
      console.log("club created")
    }catch(error){
      console.log(`error occured: ${error}`);
      res.status(500).json({ message: 'Server error one' });
    }
    fs.unlinkSync(adminProfileImagePath)
    fs.unlinkSync(clubIconPath)
    fs.unlink(permissionDocumentPath)
    res.status(201).json({ message: 'Club created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error two' });
  }
});

app.post('/api/technical', async (req,res) => {
  try {
    // Fetch only clubs where category is 'Technical'
    const technicalClubs = await Club.find({ category: 'Technical' });

    // Return the technical clubs as a JSON response
    res.json(technicalClubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching technical clubs' });
  }
});

app.post('/api/cultural', async (req,res) => {
  try {
    // Fetch only clubs where category is 'Technical'
    const culturalClubs = await Club.find({ category: 'Cultural' });

    // Return the technical clubs as a JSON response
    res.json(culturalClubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching technical clubs' });
  }
});

app.get('/clubDetail/:clubName',async (req,res) => {
  try{
      const clubName = req.params.clubName;
      const club = await Club.find({clubName:clubName});
      const iconURL = club[0].icon;
      const resource = await Resource.find({clubName:clubName})
      res.render("clubInfo",{
        clubName:clubName,
        icon:iconURL,
        resources:resource
      })
    }catch(error){
      console.log(`error occured in clubDetail:${error}`);
    }
});

app.post('/api/adminVerify', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Club.findOne({ "admin.email": email });
    if (!admin) {
      return res.status(404).json({ message: 'You are not Admin' });
    }
    const isMatch = await bcrypt.compare(password, admin.clubPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ admin_id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const uniqueCookieName = `token_${admin._id.toString()}`;
    res.cookie(uniqueCookieName, token, {
      httpOnly: true, // For security, prevents client-side access
      secure: true, // Set to true in production (use HTTPS)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      sameSite: 'strict'
    });
    res.status(200).json({ message: 'Login successful' , adminId: admin._id});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/restrictAdmin', async (req,res) => {
  try{
    const adminId = req.body['adminId'];
    const admin = await Club.findOne({ _id:adminId });
    res.status(200).json({message:"isAdmin"});
  }catch(error){
    console.log(error)
    res.status(500).json({message:'server error'});
  }
});

app.post('/api/getAdminInfo', async (req,res) => {
  try{
    const adminId = req.body['adminId'];
    const admin = await Club.findOne({ _id:adminId });
    res.status(200).json({message:"isAdmin",adminInfo:admin});
  }catch(error){
    console.log(error)
    res.status(500).json({message:'server error'});
  }
});

app.post('/api/addFile', upload.single('file'), async (req, res) => {
  try{
    if(!req.file){
      return res.status(400).json({message:'no file upload'});
  }
  if(req.file.size >= 10485760){
      return res.status(400).json({message:'file is too large'});
  }
   // Step 1: File is saved locally in the 'uploads' folder
  const formData = req.body;
  console.log(formData);
  const fileDescription = formData.fileDescription;
  const clubName = formData.clubName;

  const existingClub = await Resource.findOne({clubName:clubName});


  const localFilePath = req.file.path;
  const result = await uploadFile1(localFilePath);
  const asset_id = result.asset_id;
  const secure_url = result.secure_url;
  const downloadURL = `https://res-console.cloudinary.com/dijo7olfy/media_explorer_thumbnails/${asset_id}/download`;
  console.log(downloadURL)
  
  if(!existingClub){
    const newResource = new Resource({
      clubName:clubName,
      secureUrl:secure_url ? [secure_url] : [],
      downloadUrl:downloadURL ? [downloadURL] : [],
      fileDescription:fileDescription ? [fileDescription] : [],
      resourceLink:[],
      linkDescription:[]})
    await newResource.save();
  }else{
      existingClub.secureUrl.push(secure_url);
      existingClub.downloadUrl.push(downloadURL);
      existingClub.fileDescription.push(fileDescription);
      await existingClub.save();
  }
  fs.unlinkSync(localFilePath);
  res.status(200).json({ message: 'PDF uploaded successfully',downloadURL:downloadURL,secure_url:secure_url });

  }catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});

app.post('/api/addLink', async (req, res) => {
  try{
   
  const formData = req.body;
  console.log(formData);
  const clubName = formData.clubName;
  const resourceLink = formData.resourceLink;
  const linkDescription = formData.linkDescription;

  const existingClub = await Resource.findOne({clubName:clubName});

  
  if(!existingClub){
    const newResource = new Resource({
      clubName:clubName,
      secureUrl:[],
      downloadUrl:[],
      fileDescription:[],
      resourceLink:resourceLink ? [resourceLink] : [],
      linkDescription:linkDescription ? [linkDescription] : []})
    await newResource.save();
  }else{
      existingClub.resourceLink.push(resourceLink);
      existingClub.linkDescription.push(linkDescription);
      await existingClub.save();
  }

  res.status(200).json({ message: 'Link uploaded successfully'});

  }catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});

app.post('/api/addMember', async (req, res) => {
  try{
   
  const formData = req.body;
  console.log(formData);
  const clubName = formData.clubName;
  const memberName = formData.memberName;
  const memberEmail = formData.memberEmail;
  const memberPassword = formData.memberPassword;

  const existingClub = await Member.findOne({clubName:clubName});
  const hashedmemberPassword = await bcrypt.hash(memberPassword, 10);
  console.log(existingClub)
  
  if(!existingClub){
    const newMember = new Member({
      clubName:clubName,
      clubMember: [
        {
            memberName: memberName,
            memberEmail: memberEmail,
            memberPassword: hashedmemberPassword,
        },
      ],
    })
    await newMember.save();
  }else{
    const isMemberExist = existingClub.clubMember.some(
        (member) => member.memberEmail === memberEmail
    );

    if (!isMemberExist) {
        existingClub.clubMember.push({
            memberName: memberName,
            memberEmail: memberEmail,
            memberPassword: hashedmemberPassword,
        });

        await existingClub.save();
    }
  }
  res.status(200).json({ message: 'Member added successfully'});

  }catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});

app.post('/api/joinClub', async (req, res) => {
  try{
   
    const formData = req.body;
    const email = formData.email;
    const clubName = formData.clubName;
    const clubPassword = formData.clubPassword;
    const existingMember = await Member.findOne({clubName:clubName, "clubMember.memberEmail":email });
    const isMatch = await bcrypt.compare(clubPassword, existingMember.clubMember[0].memberPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = await User.findOne({email:email});
    if(!user){
      return res.status(401).json({ message: 'Invalid credentials(email)' });
    }
    user.clubMember.push(clubName);
    await user.save();
    res.status(200).json({ message: `You are now member of ${clubName}`});

  }catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});

app.post('/api/showClub', async (req,res) =>{
   try{
    const formData = req.body;
    const userEmail = formData.userEmail;

    const existingUser = await User.findOne({email:userEmail});
    if(!existingUser){
      return res.status(401).json({ message: 'not a user' });
    }

    const clubs = existingUser.clubMember;
    
    res.status(200).json({clubs:clubs});
   }catch(error){
    return res.status(500).json({message:error});
   }
})


// app.listen(3000, () => {
//   console.log(process.env.PORT);
// });

module.exports = app;