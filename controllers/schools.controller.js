const fs = require("fs");

const {
  isValid,
  isValidString,
  isValidObject,
  isValidEmail,
} = require("../utils");


const schoolsModel = require("../models/school.model");
const { lookup } = require("dns");
const { append } = require("express/lib/response");
const { send } = require("process");
// const { isValid } = require("../utils");

const getAllschools = async (req, res) => {
  // console.log("I am here");
  // return res.send("All schools");
  const response = {
    success: true,
    code: 200,
    message: "school List",
    error: null,
    data: null,
    resourse: req.originalUrl,
  };
  try {
    const schools = await schoolsModel.find({  // find function find all schools if deleted = false.
      isDeleted: false,    // I dont want to deleted user so I want to existed todo 
      userId: res.locals.userId,
    });
    response.data = { schools };
    return res.status(200).json(response);
  } catch (error) {
    response.error = error;
    response.message = error.message;
    response.code = error.code ? error.code : 500;
    return res.status(500).json(response);
  };
};

const getschoolById = async (req, res) => {

  const { schoolId } = req.params;
  console.log({ schoolId });
  const response = {
    success: true,
    code: 200,
    message: "schools details",
    error: null, data: null, resource: req.originalUrl,
  };
  try {
    const school = await schoolsModel.findOne({ _id: schoolId });
    if (!school) throw new Error("school does not exist");
    response.data = { school };
    return res.status(200).json(response);
  } catch (error) {
    response.error = error;
    response.message = error.message;
    response.code = error.code ? error.code : 500;
    return res.status(500).json(response);
  }
};



const createschool = async (req, res) => {
  // return res.send("new school created.")
  const body1 = req.body
  console.log(body1);
  const response = {
    success: true,
    code: 200,
    message: "school Created Succesfully",
    error: null,
    data: null,
    resourse: req.originalUrl,
  }
  if (!isValid(body1) && !isValidObject(body1)) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data";
    response.error = "Invalid requset data";
    return res.status(400).json(response);
  }
  try {
    const isschoolNameExist = await schoolsModel.findOne({ mobile: body1.mobile });
    if (isschoolNameExist)
      throw new Error(`${body1.isbn} is mobile already register`)
  } catch (error) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: error.message,
      error: error,
      data: null,
      resourse: req.originalUrl,
    })
  }
  if (!isValid(body1.name) || (isValid(body1.name) && !isValidString(body1.name))) {
    response.success = false;
    response.code = 400;
    response.message = "Invalid request data.Name is reqired";
    response.error = "Invalid request data.Name is reqired";
    return res.status(400).json(response);
  }
  try {
    const newschool = await schoolsModel.create({
      name: body1.name.trim(),
      userId: res.locals.userId,
      tagline: body1.tagline,
      mobile:body1.mobile,
      address:body1.address,
      isDeleted: false,
    });
    response.data = { schools: newschool };
    return res.status(201).json(response);
  } catch (error) {
    response.error = error;
    response.code = error.code ? error.code : 500;
    return res.status(500).json(response);
  }
};


const updateschool = async (req, res) => {
  const { schoolId } = req.params;
  const schoolData = req.body;
  if (!(schoolData) || (isValid(schoolData) && !isValidObject(schoolData))) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Empty request body, nothing to update.",
      error: null,
      data: null,
      resource: req.originalUrl,
    });
  }
  if (!isValid(schoolData.name) || isValid(schoolData.name) && !isValidString(schoolData.name)) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Empty school name, nothing to update.",
      error: null,
      data: null,
      resource: req.originalUrl,
    });
  }
  try {
    const isschoolExist = await schoolsModel.findOne({ _id: schoolId, isDeleted: false });
    if (!isschoolExist)
      return res.status(400).json({
        success: false,
        code: 404,
        message: "Invalid request school item not exist.",
        error: null,
        data: null,
        resource: req.originalUrl,
      });
    if(isschoolExist.userId.toString()!==res.locals.userId){
      return res.status(403).json({
        success: false,
        code: 403,
        message: "Unauthorise user, user not owner",
        data: null,
        error: null,
        resource: req.originalUrl,
      })
    }
    const updatedschool = await schoolsModel.findByIdAndUpdate(
      schoolId,
      { $set: schoolData },
      { new: true }   //// findByIdAndUpdate is take three parameter('where to update', 'updated data', 'if you want to show updated data( make true)')
    );
    await updatedschool.save();
    return res.status(200).json({
      success: true,
      code: 200,
      message: "school updated successfully",
      error: null,
      data: { school: updatedschool },
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      code: 404,
      message: error.message,
      error: error,
      data: null,
      resource: req.originalUrl,
    });
  }
};

const deleteschool = async (req, res) => {
  const { schoolId } = req.params;  // OR const schoolId = req.params.schoolId
  console.log('UserId from authentication info is ' + res.locals.userId);

  try {
    // const isschoolExist = await schoolsModel.findByIdAndDelete(schoolId);    // This is hard delete.
    // const isschoolExist = await schoolsModel.findByIdAndUpdate(schoolId,{ isDeleted: true, deletedAt:new Date().toISOString()}, {new:true});
    const isschoolExist = await schoolsModel.findOne({ _id: schoolId, isDeleted: false });

    if (!isschoolExist)
      throw new Error("Invalid school id. school does not exist with this id.");
    if (isschoolExist.userId.toString() !== res.locals.userId) {
      return res.status(403).json({
        success: false,
        code: 403,
        message: "Unauthorise user, user not owner",
        data: null,
        error: null,
        resource: req.originalUrl,
      });
    }
    isschoolExist.isDeleted = true,
    isschoolExist.deletedAt = new Date().toISOString();
    await isschoolExist.save();
    // this is soft delete.

    //isTodoExist.delete();
    return res.status(200).json({
      success: true,
      code: 200,
      message: "school deleted successfully",
      error: null,
      data: { school: isschoolExist },
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      code: 404,
      message: error.message,
      error: error,
      data: null,
      resource: req.originalUrl,
    });
  }
};

const getByCategory =async  (req, res)=>{
  // const {category} = req.params
  const  category = req.params.category; 
  console.log(category);
  const isCategoryExist = await schoolsModel.find({userId:res.locals.userId, category:category, isDeleted:false})
  // console.log("I am here"+ isCategoryExist);
  if(!isCategoryExist){
    return res.status(403).json({
      success: false,
      code: 403,
      message: "Category is not exist",
      data: null,
      error: null,
      resource: req.originalUrl,
    });
  }
  // if( isCategoryExist.userId.toString()!== res.locals.userId){
  //   return res.status(403).json({
  //     success: false,
  //     code: 403,
  //     message: "You are not owner !",
  //     data: null,
  //     error: null,
  //     resource: req.originalUrl,
  //   });
  // }
  
  return res.status(200).json({
    success:true,
    code:200, 
    message:"school list based on category for authenticate owner.",
    data: { isCategoryExist },
    error:null,
    resource:req.originalUrl,
  })
 
}
module.exports = {
  getAllschools,
  createschool,
  getschoolById,
  updateschool,
  deleteschool,
  getByCategory,
}