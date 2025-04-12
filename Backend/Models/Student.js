// models/Student.js
const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    username: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    batch: { type: String },
    program: { type: String },
    admissionDate: { type: Date },
    currentSemester: { type: Number },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    attendance: [{ date: { type: Date }, present: { type: Boolean }, courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
    }],
    grades: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        assignments: [{
        name: { type: String },
        grade: { type: Number },
        maxGrade: { type: Number }
        }],
        midtermGrade: { type: Number },
        finalGrade: { type: Number },
        totalGrade: { type: Number }
    }],
    fees: [{
        semester: { type: Number },
        amount: { type: Number },
        paid: { type: Boolean, default: false },
        dueDate: { type: Date },
        paymentDate: { type: Date }
    }],
});

module.exports = mongoose.model('Student', studentSchema);