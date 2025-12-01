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

// happy path = good
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    order: [[ 'createdAt', ' DESC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "emailAddress"],
      },
    ],
  });
  console.log(courses);
    res.status(200).json(courses);
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: {exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: User,
      attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
    },
  });
  
  if (course) {
    res.status(200).json({ course });
  } else {
    res.sendStatus(404);
  }
}));

router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  let course;

  try {
    course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
  } catch (error) {
    if (error.name = 'SequelizeValidationError') {
      const errors = error.errors.map( err => err.message);
      res.status(400).json( {errors} );
    } else {
      throw error;
    }
  }
})
);
  //     title: req.body.title,
  //     description: req.body.description,
  //     estimatedTime: req.body.estimatedTime,
  //     materialsNeeded: req.body.materialsNeeded,
  // });

router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const userId = user.id;
  let course;

  try {
    course = await Course.findByPk(req.params.id);
    if (course) {
      await course.update(req.body);
      res.status(204).location(`/courses/${course.id}`).end();
    } else {
      res.sendStatus(403);
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

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  let course;
  
  course = await Course.findByPk(req.params.id);
  if (course) {
    await course.destroy();
    req.status(204).end();
  } else {
    res.status(403).end();
  }
}));

module.exports = router