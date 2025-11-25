const express = require('express');
const morgan = require('morgan');
const {User, Course} = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const {asyncHandler} = require('../middleware/async-handler');


// Construct a router instance.
const router = express.Router();

// setup a friendly greeting for the root route
//good
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// happy path = good
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  
  res.status(200).json({
    user
  });
}));

// happy path = good
router.post('/users', asyncHandler(async (req, res) =>{
  //console.log(req.body.toJSON());
  const user = req.body;
  console.log(user);
//  await User.create(req.body);
//  console.log(user.firstName, user.lastName, user.password);

  const newUser = await User.create(req.body);
  //    firstName: req.body.firstName,
  //    lastName: req.body.lastName,
  //    emailAddress: req.body.emailAddress,
  //    password: req.body.password
  //  });
  res.location('/');
  res.status(201).end()
  //   newUser
  // })    
  //res.location('/');
  //res.status(201).end();
  //res.redirect('/');
}));

// happy path = good
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll();
  console.log(courses);
    res.status(200).json({ courses });
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findOne( {
    where: {id: req.params.id} 
  });
  res.status(200).json({ course });
}));

router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const course = req.body;

  //   const {title, description,} = req.body;
  // if (!title){
  //   res.status(400).json( {msg: '"Title" is a required field'});
  // }
  // if (!description) {
  //   res.status(400).json( {msg: '"Description" is a required field'});
  // }
  await Course.create(course);
  //     title: req.body.title,
  //     description: req.body.description,
  //     estimatedTime: req.body.estimatedTime,
  //     materialsNeeded: req.body.materialsNeeded,
  // });
  res.location('/');
  res.status(201).end();
}));

router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  const course = await Course.findOne({ where: id == req.params.id });
  await course.update(req.body);
  res.status(204).end();
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const course = Course.findOne({ where: id == req.params.id });
  course.destroy();
  
  res.status(204).end();
}));

module.exports = router