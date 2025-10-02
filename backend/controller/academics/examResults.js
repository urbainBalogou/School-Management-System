/**
 * @swagger
 * tags:
 *   name: Exam Results
 *   description: Gestion des résultats d'examens
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ExamResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant auto-généré du résultat
 *         exam:
 *           type: string
 *           description: ID de l'examen
 *         student:
 *           type: string
 *           description: ID de l'étudiant
 *         classLevel:
 *           type: string
 *           description: ID du niveau de classe
 *         academicTerm:
 *           type: string
 *           description: ID du trimestre académique
 *         academicYear:
 *           type: string
 *           description: ID de l'année académique
 *         grade:
 *           type: number
 *           description: Note obtenue à l'examen
 *         score:
 *           type: number
 *           description: Score obtenu à l'examen
 *         remark:
 *           type: string
 *           enum: [excellent, very good, good, fair, poor]
 *           description: Remarque sur le résultat
 *         position:
 *           type: number
 *           description: Position de l'étudiant dans la classe
 *         subject:
 *           type: string
 *           description: ID de la matière
 *         isPublished:
 *           type: boolean
 *           description: Indique si le résultat est publié
 *         createdBy:
 *           type: string
 *           description: ID de l'enseignant qui a créé le résultat
 */

/**
 * @swagger
 * /api/v1/exam-results:
 *   get:
 *     summary: Obtenir tous les résultats d'examens d'un étudiant
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Résultats d'examens récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExamResult'
 *       "401":
 *         description: Non autorisé
 */

/**
 * @swagger
 * /api/v1/exam-results/{id}/checking:
 *   get:
 *     summary: Consulter un résultat d'examen spécifique
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du résultat d'examen
 *     responses:
 *       "200":
 *         description: Résultat d'examen consulté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamResult'
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Résultat d'examen non trouvé
 */

/**
 * @swagger
 * /api/v1/exam-results/{id}/admin-toggle-publish:
 *   put:
 *     summary: Basculer le statut de publication d'un résultat (Administrateur uniquement)
 *     tags: [Exam Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du résultat d'examen
 *     responses:
 *       "200":
 *         description: Statut de publication du résultat modifié avec succès
 *       "401":
 *         description: Non autorisé
 *       "403":
 *         description: Interdit - Accès administrateur requis
 *       "404":
 *         description: Résultat d'examen non trouvé
 */










const AysncHandler = require("express-async-handler");
const ExamResult = require("../../model/Academic/ExamResults");
const Student = require("../../model/Academic/Student");

//@desc  Exam results checking
//@route POST /api/v1/exam-results/:id/checking
//@acess  Private - Students only

exports.checkExamResults = AysncHandler(async (req, res) => {
  //find the student
  const studentFound = await Student.findById(req.userAuth?._id);
  if (!studentFound) {
    throw new Error("No Student Found");
  }
  //find the exam results
  const examResult = await ExamResult.findOne({
    studentID: studentFound?.studentId,
    _id: req.params.id,
  })
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");
  //check if exam is published
  if (examResult?.isPublished === false) {
    throw new Error("Exam result is not available, check out later");
  }
  res.json({
    status: "success",
    message: "Exam result",
    data: examResult,
    student: studentFound,
  });
});

//@desc  Get all Exam results (name, id)
//@route POST /api/v1/exam-results
//@acess  Private - Students only

exports.getAllExamResults = AysncHandler(async (req, res) => {
  const results = await ExamResult.find().select("exam").populate("exam");
  res.status(200).json({
    status: "success",
    message: "Exam Results fetched",
    data: results,
  });
});

//@desc  Admin publish exam results
//@route PUT /api/v1/exam-results/:id/admin-toggle-publish
//@acess  Private - Admin only

exports.adminToggleExamResult = AysncHandler(async (req, res) => {
  //find the exam Results
  const examResult = await ExamResult.findById(req.params.id);
  if (!examResult) {
    throw new Error("Exam result not foound");
  }
  const publishResult = await ExamResult.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Exam Results Updated",
    data: publishResult,
  });
});
