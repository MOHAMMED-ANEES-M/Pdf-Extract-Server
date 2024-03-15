const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  pdf: { 
    type: String, 
    required: [true,'Please add username'],
  },
  userId: { 
    type: String, 
    required: [true,'Please add username'],
  },
},
{
    timestamps:true
}
);

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;