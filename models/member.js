const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  clubName: {type: String, required:true},
  clubMember: [ {
    memberName : {type:String, required:true},
    memberEmail : {type:String, required:true},
    memberPassword : {type : String, required:true}
  }]
},{timestamps:true});

module.exports = mongoose.model('Member', memberSchema);
