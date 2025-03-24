const mongoose = require('mongoose');

const InstituteSchema = new mongoose.Schema({
    basicInfo:{
        name:{
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        contact:{
            type: Number,
            required: true,
            unique: true,
            match: [/^\d{10}$/, "Invalid phone number"],
        },
        website:{
            type: String,
            required: true,
            trim: true,
        },
        logo:{
            type: String,       // cloudinary uri
            required: true,
        }
    },
    locationDetail:{
        country:{
            type: String,
            required: true,
        },
        state:{
            type: String,
            required: true,
        },
        city:{
            type: String,
            required: true,
        },
        pinCode:{
            type: Number,
            required: true,
        },
        address:{
            type: String,
            required: true,
        },
        mapLocation:{
            type: String,
            required: true,
        }
    },
    documentDetail:{
        registrationCertificate:{
            type: String,            // cloudinary uri
            required: true,
        },
        affilationCertificate:{
            type: String,            // cloudinary uri
            required: true,
        },
        letterHead:{
            type: String,            // cloudinary uri
            required: true,
        }
    }
},{timestamps: true});

module.exports = mongoose.model('Institute', InstituteSchema);