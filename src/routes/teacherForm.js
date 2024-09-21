const express = require('express');
const router = express.Router();
const { TeacherModel } = require('../models/teacher.model');
const teacherModel = new TeacherModel();
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, function (req, res) {
  res.render('teacherForm', {
    title: 'Criar Professor',
    isEdit: false,
    teacher: null,
    formAction: '/teachers',
  });
});

router.get('/:id', verifyToken, async function (req, res) {
  const id = req.params.id;

  const teacher = await teacherModel.getTeacher(id);
  const formAction = `/teachers/${id}?_method=PUT`;
  res.render('teacherForm', {
    title: 'Editar Professor',
    isEdit: true,
    teacher: teacher,
    formAction: formAction,
  });
});

module.exports = router;
