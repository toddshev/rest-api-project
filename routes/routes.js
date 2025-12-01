const express = require('express');
const morgan = require('morgan');
const {User, Course} = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const {asyncHandler} = require('../middleware/async-handler');

// Construct a router instance.
const router = express.Router();

// setup a friendly greeting for the root route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Return details of the authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  
  res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
  });
}));

// Create new user as long as required fields are provided
router.post('/users', asyncHandler(async (req, res) =>{
  const user = req.body;
  
  try{
    await User.create(req.body);
    res.status(201).location('/').end();
  } catch (error) {
    console.log(error);
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ){
      const errors = error.errors.map( (err) => err.message);
      res.status(400).json({ errors });
    }else {
        throw error;
    }
  }  
}));

// Get list of all courses including the user
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    order: [[ "createdAt", "DESC"]],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "emailAddress"],
      },
    ],
  });
  res.status(200).json(courses);
}));

//Get specific course by ID including user
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: {exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: User,
      attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
    },
  });
  
  if (course) {
    res.status(200).json(course);
  } else {
    res.sendStatus(404);
  }
}));

// Add new course as long as required fields are provided
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  let course;

  try {
    course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
  } catch (error) {
    if (error.name = 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json( {errors} );
    } else {
      throw error;
    }
  }
}));

//Update course by ID if authenticated user is the owner
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  let course;

  try {
    course = await Course.findByPk(req.params.id);
    
    if (course) {
      if (course.userId !== user.id) {
        res.sendStatus(403).end()
      }
    
      await course.update(req.body);
      res.status(204).location(`/courses/${course.id}`).end();
    } else {
      res.sendStatus(403).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map( err => err.message);
      res.status(400).json( {errors} );
    } else {
      throw error;
    }
  }
}));

// Delete course by ID if authenticated user is the owner
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  let course;
  
  course = await Course.findByPk(req.params.id);
  if (course) {
    if (course.userId !== user.id) {
      res.sendStatus(403).end();
    }
        
    await course.destroy();
    res.sendStatus(204).end();
  } else {
      res.sendStatus(404).end();
  }
}));

module.exports = router