const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('./models/User');
const Club = require('./models/club');
const Password = require('./models/password');
const connectDB = require('./config/userDB');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadFile = require('./cloudinary/cloudConfig');
const Resource = require('./models/resource');
const Member = require('./models/member');
const fs = require('fs');
const TempInstitute = require('./models/tempInstitute');
const Institute = require('./models/institute');
const client = require('./redis/client');
const appendInstitute = require('./jsonFiles/append');
const retrieve = require('./jsonFiles/retrieveInstitutes');

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

app.get('/api',(req,res) => {
  res.send("this is api page");
});

app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname,'./public','index.html'));
});

app.get('/home',(req,res) => {
  res.sendFile(path.join(__dirname,'./public','home.html'));
});

app.get('/institutes',(req,res) => {
  res.sendFile(path.join(__dirname,'./public','institutes.html'));
});

app.get('/tempInstitutes',(req,res) => {
  res.sendFile(path.join(__dirname,'./public','tempInstitutes.html'));
});

app.get('/exploreClubs',(req,res) => {
  res.sendFile(path.join(__dirname,'./public','exploreClubs.html'));
});

app.get('/register',(req,res) => {
  res.sendFile(path.join(__dirname,'./public','register.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'signup.html'));
});

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

app.get('/social', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'social.html'));
});

app.get('/cultural', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'cultural.html'));
});

app.get('/branchSpecific', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'branchSpecific.html'));
});

app.get('/magazines', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'magazines.html'));
});

app.get('/miscellaneous', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'miscellaneous.html'));
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
    const { username, email, institute, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, institute, password: hashedPassword });
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
      if(!userId){
        return res.status(404).json({message:'user ID not found'});
      }
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
    if(!userId){
      return res.status(404).json({message: 'User ID not provided'});
    }
    const user = await User.findOne({ _id:userId });
    if(!user){
      return res.status(401).json({message: 'no user found'});
    }
    const email = user.email;
    const username = user.username;
    return res.status(200).json({message:'user information',username:username, email:email});
  }catch(error){
    console.log(error)
    return res.status(500).json({message:'server error'});
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
      return res.status(401).json({ message: 'Club already exists' });
    }

    // Ensure files are received
    if (!req.files || !req.files.adminProfileImage || !req.files.clubIcon) {
      return res.status(400).json({ message: 'Missing required files' });
    }

    const actualPassword = await Password.findOne({clubName:clubName, clubEmail:clubEmail})
    if(!actualPassword){
      return res.status(401).json({ message: 'Club not assigned yet' });
    }

    try{
      console.log(actualPassword.password)
      const isMatch = await bcrypt.compare(permissionPassword, actualPassword.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }catch(error){
      return res.status(400).json({ message: 'Club not assigned' });
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
        return res.status(401).json({ message: 'club already exist' });
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
    fs.unlinkSync(permissionDocumentPath)
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

app.post('/api/social', async (req,res) => {
  try {
    // Fetch only clubs where category is 'Social'
    const socialClubs = await Club.find({ category: 'Social' });

    // Return the social clubs as a JSON response
    res.json(socialClubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching social clubs' });
  }
});

app.post('/api/branchSpecific', async (req,res) => {
  try {
    // Fetch only clubs where category is 'branchSpecific'
    const branchSpecificClubs = await Club.find({ category: 'Branch Specific' });

    // Return the social clubs as a JSON response
    res.json(branchSpecificClubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching Branch Specific clubs' });
  }
});

app.post('/api/magazines', async (req,res) => {
  try {
    // Fetch only clubs where category is 'magazines'
    const magazinesClubs = await Club.find({ category: 'Magazines' });

    // Return the magazines clubs as a JSON response
    res.json(magazinesClubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching magazines clubs' });
  }
});

app.post('/api/miscellaneous', async (req,res) => {
  try {
    // Fetch only clubs where category is 'miscellaneous'
    const miscellaneousClubs = await Club.find({ category: 'Miscellaneous' });

    // Return the miscellaneous clubs as a JSON response
    res.json(miscellaneousClubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching miscellaneous clubs' });
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
    if(!email || !password){
      return res.status(404).json({ message: 'no eamil or password found' });
    }
    const admin = await Club.findOne({ "admin.email": email });
    if (!admin) {
      return res.status(401).json({ message: 'You are not Admin' });
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
    if(!admin){
      return res.status(401).json({message:"not admin of any club"});
    }
    return res.status(200).json({message:'isAdmin'});
  }catch(error){
    console.log(error)
    return res.status(500).json({message:'server error'});
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
});



app.post('/api/passwordManager', async (req, res) => {
  try{
   
    const formData = req.body;
    const clubEmail = formData.clubEmail;
    const clubName = formData.clubName;
    const clubPassword = formData.clubPassword;
    const existingMember = await Password.findOne({clubName:clubName});
    if(existingMember){
      return res.status(401).json({ message: 'club already exist' });
    }
    const hashedPassword = await bcrypt.hash(clubPassword, 10);
    const newClub = new Password({clubName:clubName, clubEmail:clubEmail, password:hashedPassword});
    await newClub.save();
    res.status(200).json({ message: "password saved"});
  }catch(error){
    console.log(error);
    return res.status(500).json({message:error});
  }
});

app.post('/api/register', upload.fields([
  { name: "instituteLogo", maxCount: 1 },
  { name: "registrationCertificate", maxCount: 1 },
  { name: "affilationCertificate", maxCount: 1 },
  { name: "letterHead", maxCount: 1 },
]) , async (req,res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
      const formData = req.body;
      const instituteName = formData.instituteName;
      const instituteEmail = formData.instituteEmail;
      const instituteContact = formData.instituteContact;
      const instituteWebsite = formData.instituteWebsite;
      const country = formData.country;
      const state = formData.state;
      const city = formData.city;
      const pinCode = formData.pinCode;
      const address = formData.address;
      const mapLocation = formData.mapLocation;
      const instituteLogoPath = req.files.instituteLogo[0].path;
      const registrationCertificatePath = req.files.registrationCertificate[0].path;
      const affilationCertificatePath = req.files.affilationCertificate[0].path;
      const letterHeadPath = req.files.letterHead[0].path;
      const logoRes = await uploadFile(instituteLogoPath,{
        resource_type: "image",
        folder: "images",
        use_filename: true,
        unique_filename: false,
        flags: "attachment",
      })
      const registrationCertificateRes = await uploadFile(registrationCertificatePath,{
        resource_type: 'raw',
        folder: 'documents',
        use_filename: true,
        unique_filename: false,
        format: "pdf",
        flags: "attachment",
      })
      const affilationCertificateRes = await uploadFile(affilationCertificatePath,{
        resource_type: 'raw',
        folder: 'documents',
        use_filename: true,
        unique_filename: false,
        format: "pdf",
        flags: "attachment",
      })
      const letterHeadRes = await uploadFile(letterHeadPath,{
        resource_type: 'raw',
        folder: 'documents',
        use_filename: true,
        unique_filename: false,
        format: "pdf",
        flags: "attachment",
      });
      if(!logoRes || !registrationCertificateRes || !affilationCertificateRes || !letterHeadRes){
        return res.status(400).json({ error: "File upload failed for some required files" });
      }
      const newInstitute = new TempInstitute({
        basicInfo: {
          name: instituteName,
          email: instituteEmail,
          contact: instituteContact,
          website: instituteWebsite,
          logo: logoRes,
        },
        locationDetail: {
          country:country,
          state:state,
          city:city,
          pinCode:pinCode,
          address:address,
          mapLocation:mapLocation,
        },
        documentDetail: {
          registrationCertificate: registrationCertificateRes,
          affilationCertificate: affilationCertificateRes,
          letterHead: letterHeadRes,
        },
      })
      await newInstitute.save();
      await client.lPush("tempInstitutes",JSON.stringify(newInstitute));
      res.status(201).json({ message: "Institute Registered Successfully, your institute will be added as soon as posible!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/tempInstitutes', async (req,res) => {
    try {
      const cacheData = await client.lRange("tempInstitutes",0,-1);
      if(cacheData.length != 0){
        // console.log("cache hit");
        const recInstitutes = await cacheData.map((institute) => JSON.parse(institute));
        return res.status(200).json(recInstitutes);
      }
      const tempInstitutes = await TempInstitute.find();
      tempInstitutes.forEach(async (institute) =>{
        await client.lPush("tempInstitutes",JSON.stringify(institute));
      });
      // console.log("cache miss");
      return res.status(200).json(tempInstitutes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/approve', async (req,res) => {
    try {
      const formData = req.body;
      const name = formData.name;
      const institute = await TempInstitute.findOne({"basicInfo.name":name});
      if(!institute){
        res.status(401).json({message:"institute not found"});
      }
      await appendInstitute(institute.basicInfo.name);
      const newInstitute = new Institute({
        basicInfo: {
          name: institute.basicInfo.name,
          email: institute.basicInfo.email,
          contact: institute.basicInfo.contact,
          website: institute.basicInfo.website,
          logo: institute.basicInfo.logo,
        },
        locationDetail: {
          country:institute.locationDetail.country,
          state:institute.locationDetail.state,
          city:institute.locationDetail.city,
          pinCode:institute.locationDetail.pinCode,
          address:institute.locationDetail.address,
          mapLocation:institute.locationDetail.mapLocation,
        },
        documentDetail: {
          registrationCertificate: institute.documentDetail.registrationCertificate,
          affilationCertificate: institute.documentDetail.affilationCertificate,
          letterHead: institute.documentDetail.letterHead,
        },
      })
      await newInstitute.save();
      await client.lRem("tempInstitutes",0,JSON.stringify(institute));
      await institute.deleteOne();
      res.status(201).json({message:"Approved Successfully!"});
      } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/reject', async (req,res) => {
    try {
      const formData = req.body;
      const name = formData.name;
      const institute = await TempInstitute.findOne({"basicInfo.name":name});
      if(!institute){
        res.status(401).json({message:"institute not found"});
      }
      await client.lRem("tempInstitutes",0,JSON.stringify(institute));
      await institute.deleteOne();
      res.status(201).json({message:"Rejected Successfully!"});
      } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/institutes', async (req,res) => {
    try {
      const cacheData = await client.lRange("institutes",0,-1);
      if(cacheData.length != 0){
        const recInstitutes = cacheData.map((institute) => JSON.parse(institute));
        return res.status(200).json({message:recInstitutes});
      }
      const institutes = await Institute.find();
      if(institutes.length == 0){
        return res.status(200).json({message:null});
      }

      const recInstitutes = institutes.map((institute) => ({
        logo:institute.basicInfo.logo,
        name:institute.basicInfo.name,
        email:institute.basicInfo.email,
        contact:institute.basicInfo.contact,
        website:institute.basicInfo.website,
      }));
    
      institutes.forEach(async (institute) => {
        await client.lPush("institutes", JSON.stringify({
          logo:institute.basicInfo.logo,
          name:institute.basicInfo.name,
          email:institute.basicInfo.email,
          contact:institute.basicInfo.contact,
          website:institute.basicInfo.website,
        }));
      })
      return res.status(200).json({message:recInstitutes});
    } catch (error) {
      console.log(error);
      return res.status(500).json({message:"server error",error:error});
    }
});

app.get('/api/retrieveInstituteNames', (req,res) => {
  try {
    const names = retrieve();
    return res.status(201).json({message:names});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"server side error"});
  }
});

app.get('/api/retrieveRegionData', (req,res) => {
  try {
    const data = fs.readFileSync('./jsonFiles/regionData.json','utf-8');
    const jsonData = JSON.parse(data);
    return res.status(201).json({message:jsonData});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"server side error"});
  }
});

app.get('/loadClubs/:instituteName', async (req,res) => {
    try {
      const instituteName = decodeURIComponent(req.params.instituteName);
      const institute = await 
    } catch (error) {
      
    }
});

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});

module.exports = app;