/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Gestion des examens
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Exam:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - subject
 *         - program
 *         - academicTerm
 *         - duration
 *         - examDate
 *         - examTime
 *         - examType
 *         - createdBy
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant auto-généré de l'examen
 *         name:
 *           type: string
 *           description: Nom de l'examen
 *         description:
 *           type: string
 *           description: Description de l'examen
 *         subject:
 *           type: string
 *           description: ID de la matière
 *         program:
 *           type: string
 *           description: ID du programme
 *         academicTerm:
 *           type: string
 *           description: ID du trimestre académique
 *         duration:
 *           type: string
 *           description: Durée de l'examen (ex: "3 heures")
 *         examDate:
 *           type: string
 *           format: date
 *           description: Date de l'examen
 *         examTime:
 *           type: string
 *           description: Heure de l'examen
 *         examType:
 *           type: string
 *           enum: [quiz, mid-term, final-term, oral]
 *           description: Type d'examen
 *         createdBy:
 *           type: string
 *           description: ID de l'enseignant qui a créé l'examen
 *         academicYear:
 *           type: string
 *           description: ID de l'année académique
 *         classLevel:
 *           type: string
 *           description: ID du niveau de classe
 */

/**
 * @swagger
 * /api/v1/exams:
 *   post:
 *     summary: Créer un nouvel examen
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exam'
 *     responses:
 *       "201":
 *         description: Examen créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       "400":
 *         description: Requête incorrecte
 *       "401":
 *         description: Non autorisé
 *   get:
 *     summary: Obtenir tous les examens
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Examens récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exam'
 *       "401":
 *         description: Non autorisé
 */

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   get:
 *     summary: Obtenir un examen par ID
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'examen
 *     responses:
 *       "200":
 *         description: Examen récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Examen non trouvé
 *   put:
 *     summary: Mettre à jour un examen
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'examen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exam'
 *     responses:
 *       "200":
 *         description: Examen mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       "400":
 *         description: Requête incorrecte
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Examen non trouvé
 */



const AysncHandler = require("express-async-handler");
const Exam = require("../../model/Academic/Exam");
const Teacher = require("../../model/Staff/Teacher");

//@desc  Create Exam
//@route POST /api/v1/exams
//@acess Private  Teachers only

exports.createExam = AysncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
    academicYear,
    classLevel,
  } = req.body;
  //find teacher
  const teacherFound = await Teacher.findById(req.userAuth?._id);
  if (!teacherFound) {
    throw new Error("Teacher not found");
  }
  //exam exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    throw new Error("Exam already exists");
  }
  //create
  const examCreated = new Exam({
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    createdBy,
    duration,
    examDate,
    examTime,
    examType,
    subject,
    program,
    createdBy: req.userAuth?._id,
  });
  //push the exam into teacher
  teacherFound.examsCreated.push(examCreated._id);
  //save exam
  await examCreated.save();
  await teacherFound.save();
  res.status(201).json({
    status: "success",
    message: "Exam created",
    data: examCreated,
  });
});

//@desc  get all Exams
//@route GET /api/v1/exams
//@acess  Private

exports.getExams = AysncHandler(async (req, res) => {
  const exams = await Exam.find().populate({
    path: "questions",
    populate: {
      path: "createdBy",
    },
  });
  res.status(201).json({
    status: "success",
    message: "Exams fetched successfully",
    data: exams,
  });
});

//@desc  get single exam
//@route GET /api/v1/exams/:id
//@acess  Private Teahers only

exports.getExam = AysncHandler(async (req, res) => {
  const exams = await Exam.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Exam fetched successfully",
    data: exams,
  });
});

//@desc   Update  Exam
//@route  PUT /api/v1/exams/:id
//@acess  Private  - Teacher only

exports.updatExam = AysncHandler(async (req, res) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    createdBy,
    academicYear,
    classLevel,
  } = req.body;
  //check name exists
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    throw new Error("Exam already exists");
  }

  const examUpdated = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      subject,
      program,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      createdBy,
      academicYear,
      classLevel,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Exam  updated successfully",
    data: examUpdated,
  });
});
