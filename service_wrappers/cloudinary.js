const cloudinaryModule  = require('cloudinary');
const api_key = process.env.cloudinary_API 
const api_secret = process.env.cloudinary_SECRET 
const cloud_name = process.env.cloudinary_cloud_name 

cloudinaryModule.config({
  cloud_name,
  api_key,
  api_secret,
});

module.exports = cloudinaryModule;