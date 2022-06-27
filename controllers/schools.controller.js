const fs = require("fs");

const {
  isValid,
  isValidString,
  isValidObject,
  
 
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
      isDeleted: false,     
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



// const createschool = async (req, res) => {
//   // return res.send("new school created.")
//   const body1 = req.body
//   console.log( body1.schoolname);
//   const response = {
//     success: true,
//     code: 200,
//     message: "school Created Succesfully",
//     error: null,
//     data: null,
//     resourse: req.originalUrl,
//   }
//   if (!isValid(body1) && !isValidObject(body1)) {
//     response.success = false;
//     response.code = 400;
//     response.message = "Invalid request data";
//     response.error = "Invalid requset data";
//     return res.status(400).json(response);
//   }
  // try {
  //   const isSchoolNameExist = await schoolsModel.findOne({ mobile: body1.mobile });
  //   if (isSchoolNameExist)
  //     throw new Error(`${body1.mobile} is isbn already register`)
  // } catch (error) {
  //   return res.status(400).json({
  //     success: false,
  //     code: 400,
  //     message: error.message,
  //     error: error,
  //     data: null,
  //     resourse: req.originalUrl,
  //   })
  // }
  // if (!isValid(body1.schoolname) || (isValid(body1.schoolname) && !isValidString(body1.schoolname))) {
  //   response.success = false;
  //   response.code = 400;
  //   response.message = "Invalid request data.Name is required";
  //   response.error = "Invalid request data.Name is required";
  //   return res.status(400).json(response);
  // }
//  try{
// const newschool=await schoolsModel.create({
//   userId:res.locals.userId,
//   schoolname:body1.schoolname,
//   tagline:body1.tagline,
//   mobile:body1.mobile,
//       address:body1.address,
//       city:body1.city,
//       pincode:body1.pincode,
//       isDeleted: false,

// })

// console.log (newschool)

//     response.data = { schools: newschool };
//   return res.status(201).json(response);
//   } catch (error) {
//     response.error = error;
//     response.code = error.code ? error.code : 500;
//     return res.status(500).json(response);
//   }
// };

const createschool = async (req, res) => {
  const body1 = req.body
  console.log(body1);
  const response = {
    success: true,
    code: 200,
    message: "School Created Succesfully",
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
    const isSchoolNameExist = await schoolsModel.findOne({ tagline: body1.tagline});
    if (isSchoolNameExist)
      throw new Error(`${body1.tagline} is tagline already register`)
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
  // if (!isValid(body1.schoolname) || (isValid(body1.schoolname) && !isValidString(body1.schoolname))) {
  //   response.success = false;
  //   response.code = 400;
  //   response.message = "Invalid request data.Name is reqired";
  //   response.error = "Invalid request data.Name is reqired";
  //   return res.status(400).json(response);
  // }
  try {
    //console.log("hii");
    const newSchool = await schoolsModel.create({
      schoolname: body1.schoolname.trim(),
      userId: res.locals.userId,
      mobile: body1.mobile,
      pincode: body1.pincode,
      address: body1.address,
     city: body1.city,
     tagline:body1.tagline,
      isDeleted: false,
    });
    response.data = { schools: newSchool };
    return res.status(201).json(response);
  } catch (error) {
    response.error = error;
    //response.code = error.code ? error.code : 500;
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
  if (!isValid(schoolData.schoolname) || isValid(schoolData.schoolname) && !isValidString(schoolData.schoolname)) {
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
      { new: true }  
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
    const isschoolExist = await schoolsModel.findOne({ _id: schoolId, isDeleted:false });

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

// const updateschool = async (req, res) => {
//   const schoolId = req.params.schoolId;
//   const reqData = req.body;
//   if (!isValid(reqData) || (isValid(reqData) && !isValidObject(reqData))) {
//     return res.status(400).json({
//       success: false,
//       code: 400,
//       message: "Invalid request, missing request data.",
//       data: null,
//       error: null,
//       resource: req.originalUrl,
//     });
//   }
//   if (
//     !isValid(reqData.school) ||
//     (isValid(reqData.school) && !isValidString(reqData.school))
//   ) {
//     return res.status(400).json({
//       success: false,
//       code: 400,
//       message: "Invalid request, missing required school name.",
//       data: null,
//       error: null,
//       resource: req.originalUrl,
//     });
//   }

//   if (!isValidObjectId(schoolId)) {
//     return res.status(400).json({
//       success: false,
//       code: 400,
//       message: "Invalid school id",
//       data: null,
//       error: null,
//       resource: req.originalUrl,
//     });
//   }

//   try {
//     const school = await schoolModel.findOne({ _id: schoolId, isDeleted: false });
//     if (!school) {
//       return res.status(404).json({
//         success: false,
//         code: 404,
//         message: "Invalid request, school item does not exist",
//         data: null,
//         error: null,
//         resource: req.originalUrl,
//       });
//     }
//     if (school.userId.toString() !== res.locals.userId) {
//       return res.status(403).json({
//         success: false,
//         code: 403,
//         message: "Invalid request, forbidden",
//         data: null,
//         error: null,
//         resource: req.originalUrl,
//       });
//     }
//     school.school = reqData.school;
//     await school.save();
//     return res.status(200).json({
//       success: true,
//       code: 200,
//       message: "school updated successfully",
//       data: { school },
//       error: null,
//       resource: req.originalUrl,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       code: 500,
//       message: error.message,
//       data: null,
//       error: error,
//       resource: req.originalUrl,
//     });
//   }
// };

// const deleteschool = async (req, res) => {
//   const schoolId = req.params.schoolId;
//   if (!isValidObjectId(schoolId)) {
//     return res.status(400).json({
//       success: false,
//       code: 400,
//       message: "Invalid school id",
//       data: null,
//       error: null,
//       resource: req.originalUrl,
//     });
//   }
//   try {
//     const school = await schoolModel.findOne({ _id: schoolId, isDeleted: false });
//     if (!school) {
//       return res.status(404).json({
//         success: false,
//         code: 404,
//         message: "Invalid request, school item does not exist",
//         data: null,
//         error: null,
//         resource: req.originalUrl,
//       });
//     }
//     if (school.userId.toString() !== res.locals.userId) {
//       return res.status(403).json({
//         success: false,
//         code: 403,
//         message: "Invalid request, forbidden",
//         data: null,
//         error: null,
//         resource: req.originalUrl,
//       });
//     }
//     school.isDeleted = true;
//     school.deletedAt = new Date().toISOString();
//     await school.save();
//     return res.status(200).json({
//       success: true,
//       code: 200,
//       message: "school deleted successfully",
//       data: { school },
//       error: null,
//       resource: req.originalUrl,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       code: 500,
//       message: error.message,
//       data: null,
//       error: error,
//       resource: req.originalUrl,
//     });
//   }
// };

// const updateschoolStatus = async (req, res) => {
//   const schoolId = req.params.schoolId;
//   if (!isValidObjectId(schoolId)) {
//     return res.status(400).json({
//       success: false,
//       code: 400,
//       message: "Invalid school id",
//       data: null,
//       error: null,
//       resource: req.originalUrl,
//     });
//   }
//   try {
//     const school = await schoolModel.findOne({ _id: schoolId, isDeleted: false });
//     if (!school) {
//       return res.status(404).json({
//         success: false,
//         code: 404,
//         message: "Invalid request, school item does not exist",
//         data: null,
//         error: null,
//         resource: req.originalUrl,
//       });
//     }
//     if (school.userId.toString() !== res.locals.userId) {
//       return res.status(403).json({
//         success: false,
//         code: 403,
//         message: "Invalid request, forbidden",
//         data: null,
//         error: null,
//         resource: req.originalUrl,
//       });
//     }
//     school.isCompleted = Boolean(req.body.isCompleted);
//     await school.save();
//     return res.status(200).json({
//       success: true,
//       code: 200,
//       message: "school status updated successfully",
//       data: { school },
//       error: null,
//       resource: req.originalUrl,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       code: 500,
//       message: error.message,
//       data: null,
//       error: error,
//       resource: req.originalUrl,
//     });
//   }
// };
module.exports = {
  getAllschools,
  createschool,
  getschoolById,
  updateschool,
  deleteschool,
  
 
}