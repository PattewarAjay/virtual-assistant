import { ADDRGETNETWORKPARAMS } from 'dns'
import uploadOnCloudinary from '../configs/cloudinary.js'
import User from '../modules/usermodule.js'
import { response } from 'express'
import moment from 'moment' 
import geminiResponse from '../gemini.js'

export const getCurrentUser=async(req, res)=>{
    try {
        const userId= req.userId
        const user= await User.findById(userId).select('-password')
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        return res.status(200).json(user)

        
    } catch (error) {
        return res.status(404).json({message:'get current user error'})

    }
}

export const updateUser=async(req,res)=>{
    try {
        const{assistantname,imageUrl}=req.body
        let assistantimage;
        if(req.file){
            assistantimage=await uploadOnCloudinary(req.file.path)
        }else{
            assistantimage=imageUrl
        }

        const user=await User.findByIdAndUpdate(req.userId,{assistantname,assistantimage},
            {new:true}).select('-password')
            return res.status(200).json(user)
            
        
    } catch (error) {
        return res.status(404).json({message:'upadteassitant error'})

        
    }

}

export const asktoassistant=async(req,res)=>{
    try {
        const user=await User.findById(req.userId)
        const username=user.name
        const assistantname=user.assistantname
        const {command}=req.body
        user.history.push(command)
        user.save()

        const result=await geminiResponse(command,assistantname,username)
        console.log("Command received:", command);
console.log("User:", username, "Assistant:", assistantname);


        const jsonmatch=result.match(/{[\s\S]*}/)
        if(!jsonmatch){
            return res.status(400).json({response:'Invalid JSON format'})
        }

        const gemresult=JSON.parse(jsonmatch[0])
        const type=gemresult.type

        switch(type){
            case 'get-date':
                return res.json({
                    type,
                    userInput:gemresult.userInput,
                    response:`current DATE is ${moment().format('YYYY-MM-DD')}`

                })

            case 'get-time':
                return res.json({
                    type,
                    userInput:gemresult.userInput,
                    response:`current TIME is ${moment().format('hh:mm A')}`

                })

                case 'get-day':
                return res.json({
                    type,
                    userInput:gemresult.userInput,
                    response:`TODAY is ${moment().format('dddd')}`

                })

                case 'get-month':
                return res.json({
                    type,
                    userInput:gemresult.userInput,
                    response:`Toady is ${moment().format('MMMM')}`

                })
        case 'google-search':
      case 'youtube-search':
      case 'youtube-play':
      case 'general':
      case  "calculator-open":
      case "instagram-open": 
       case "facebook-open": 
       case "weather-show" :
        case "wikipedia-search":
        case "gmail-open":
        case "calendar-open":
        case "chatgpt-open":
        case "whatsapp-open":
        case "pinterest-open":
        case "spotify-open":
        case "google-trends":
        case "google-maps-open":

       return res.json({
        type,
        userInput:gemresult.userInput,
        response:gemresult.response
       })

       default:
        return res.status(400).json({response:'I didnt understand thar command'})
        }

        
    } catch (error) {
         return res.status(500).json({response:'ask assistant error'})
    }
}