const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const {labmodel}= require("./models/Lab")
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")


const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://sreepriya:sreepriya73@cluster0.rwd5pdm.mongodb.net/labdb?retryWrites=true&w=majority&appName=Cluster0")

const  generateHashedpassword= async(password)=>{
    const  salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

app.post("/addstud",async(req,res)=>{
    let input=req.body
    let hashedpassword=await generateHashedpassword(input.password)
    console.log(hashedpassword)
    input.password=hashedpassword
    let lab=new labmodel(input)
    lab.save()
    res.json({"status":"success"})
})

app.post("/studlogin",(req,res)=>{
    let input = req.body
   labmodel.find({"email":req.body.email}).then(
    (response)=>{
       if (response.length>0) {
        let dbpassword=response[0].password
        console.log(response)
        bcrypt.compare(input.password,dbpassword,(error,isMatch)=>{
            if (isMatch) {
                jwt.sign({email:input.email},"lab-app",
                    {expiresIn:"1d"},(error,token)=>{
                        if (error) {
                            res.json({"status":"unable to create token"})
                        } else {
                           res.json({"status":"success",userId:response[0]._id,"token":token}) 
                        }
                    }
                )
            } else {
               res.json({"status":"incorrect"}) 
            }
        })
       } else {
        res.json({"status":"not exist"})
       }
    }
   ).catch()
})


app.post("/addfac",(req,res)=>{
    let input=req.body
   
    let lab=new labmodel(input)
    lab.save()
    res.json({"status":"success"})
})

app.post("/addattend",(req,res)=>{
    let input=req.body
    let lab=new labmodel(input)
    lab.save()
    res.json({"status":"success"})
})


app.get("/view",(req,res)=>{
    let token=req.headers["token"]
    jwt.verify(token,"lab-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"unauthorised access"})
        } else {
            labmodel.find().then(
                (data)=>{
                    res.json(data)
                }
            ).catch(
                (error)=>{
                    res.send("error")
                }
            )
        }
    })
    
    
})

app.post("/search",(req,res)=>{
    let input=req.body
    labmodel.find(input).then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.send("error")
        }
    )
})



app.post("/delete",(req,res)=>{
    let input=req.body
    labmodel.findByIdAndDelete(input).then(
    (data)=>{
        res.json({"status":"success"})
    }
    ).catch(
        (error)=>{
            res.json({"status":"failed"})
        }
    )
})





app.listen(8080,()=> {
    console.log("server started")
})