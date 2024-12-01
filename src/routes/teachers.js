const express = require('express');
const router = express.Router();
const { TeacherModel } = require('../models/teacher.model');
const teacherModel = new TeacherModel();
const verifyToken = require('../middlewares/authMiddleware');
const { responseMiddleware } = require('../middlewares/responseMiddleware');

router.get(
  '/',
  async function (req, res, next) {
    const teacherList = await teacherModel.listTeachers();
    req.customData = { title: 'Professores', teachers: teacherList };
    next();
  },
  responseMiddleware,
);

router.get(
  '/:id',
  async function (req, res, next) {
    const id = parseInt(req.params.id);
    const teacher = await teacherModel.getTeacher(id);

    if (!teacher) return res.status(404).send({ error: 'Teacher not found.' });

    req.customData = {
      title: 'Detalhes do Professor',
      currentTeacher: teacher,
    };
    next();
  },
  responseMiddleware,
);

router.post(
  '/',
  verifyToken,
  async function (req, res, next) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Name is required.',
      });
    }

    const teacher = await teacherModel.createTeacher(name);

    if (teacher) {
      req.customData = teacher;
      req.status = 201;
    } else {
      return res.status(500).json({ error: 'Failed to create teacher.' });
    }

    next();
  },
  responseMiddleware,
);

router.put(
  '/:id',
  verifyToken,
  async function (req, res, next) {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    const teacher = await teacherModel.getTeacher(id);

    if (!teacher) return res.status(404).send({ error: 'Teacher not found.' });

    if (name) teacher.name = name;

    const result = await teacherModel.editTeacher(teacher.id, teacher.name);

    res.customData = result;

    next();
  },
  responseMiddleware,
);

router.delete(
  '/:id',
  verifyToken,
  async function (req, res, next) {
    const id = parseInt(req.params.id);

    const teacher = await teacherModel.getTeacher(id);

    if (!teacher) return res.status(404).send({ error: 'Teacher not found.' });

    const result = await teacherModel.deleteTeacher(teacher.id);
    res.customData = result;
    res.status(204);

    next();
  },
  responseMiddleware,
);

module.exports = router;
