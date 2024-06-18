const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
           "studname":String,
           "courseid":String,
            "admno":String,
            "department":String,
            "email":String,
            "year":String,
            "password":String,
            "facid":String,
            "facname":String,
            "lab":String,
            "hour":String,
            "subject":String,
            "password1":String,
            "email1":String
          
            
    }
)
let labmodel =mongoose.model("lab",schema);
module.exports={labmodel}