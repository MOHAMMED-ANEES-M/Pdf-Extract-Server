const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true,'Please add username'],
    unique: [true,'username already exist'],
    },
  fname: { 
    type: String, 
    required: [true,'Please add first name'],
    },
  lname: { 
        type: String, 
        required: [true,'Please add last name'],
    },
  password: { 
    type: String, 
    required: [true,'Please add password']
     }, 
},
{
    timestamps:true
}
);

const User = mongoose.model('User', userSchema);


module.exports = User;