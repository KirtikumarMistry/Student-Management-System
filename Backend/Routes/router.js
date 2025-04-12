const express=require('express');
const router=express.Router();

const user=require('../Controllers/user');
const uploadAndAllocate = require("../Controllers/assignmentTeacher");
const studentAssignments = require("../Controllers/assignmentStudent");

// routes for authenication
router.post('/createuser', user.createUserAccount);
router.post('/login', user.login);
router.get('/getusers', user.getUsers);
router.post('/updatestatus', user.updateUserStatus); // Route to update user status
router.post('/resetpassword', user.resetPassword);
router.post('/completeprofile', user.completeProfile);


router.post("/assignment/upload/:teacher_id", uploadAndAllocate);// Teacher routes
router.get("/assignment/view/:student_id", studentAssignments.getAssignments);// Student routes
router.get("/assignment/download/:fileName", studentAssignments.downloadAssignments);//download assignment files

module.exports=router;