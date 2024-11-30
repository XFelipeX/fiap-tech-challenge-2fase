const express = require('express');
const router = express.Router();
const { StudentModel } = require('../models/student.model');
const studentModel = new StudentModel();
const verifyToken = require('../middlewares/authMiddleware');
const { responseMiddleware } = require('../middlewares/responseMiddleware');

router.get(
  '/',
  verifyToken,
  async function (req, res, next) {
    const studentList = await studentModel.listStudents();
    req.customData = { title: 'Listar Alunos', students: studentList };
    next();
  },
  responseMiddleware,
);

router.get(
  '/:id',
  verifyToken,
  async function (req, res, next) {
    const id = parseInt(req.params.id);
    const student = await studentModel.getStudent(id);

    if (!student) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    req.customData = { title: 'Detalhes do Aluno', currentStudent: student };
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

    const student = await studentModel.createStudent(name);

    if (student) {
      req.customData = student;
      req.status = 201;
    } else {
      return res.status(500).json({ error: 'Failed to create student.' });
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

    const student = await studentModel.getStudent(id);

    if (!student) return res.status(404).send({ error: 'Student not found.' });

    if (name) student.name = name;

    const result = await studentModel.editStudent(student.id, student.name);

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

    const student = await studentModel.getStudent(id);

    if (!student) return res.status(404).send({ error: 'Student not found.' });

    const result = await studentModel.deleteStudent(student.id);
    res.customData = result;
    res.status = 204;

    next();
  },
  responseMiddleware,
);

module.exports = router;
