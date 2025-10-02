/**
 * @swagger
 * tags:
 *   name: Programs
 *   description: Gestion des programmes académiques
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Program:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant auto-généré du programme
 *         name:
 *           type: string
 *           description: Nom du programme
 *         description:
 *           type: string
 *           description: Description du programme
 *         createdBy:
 *           type: string
 *           description: ID de l'administrateur qui a créé le programme
 *         subjects:
 *           type: array
 *           items:
 *             type: string
 *           description: Tableau des IDs de matières associées au programme
 *       example:
 *         name: "Informatique"
 *         description: "Licence en Informatique"
 */

/**
 * @swagger
 * /api/v1/programs:
 *   post:
 *     summary: Créer un nouveau programme
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       "201":
 *         description: Programme créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       "400":
 *         description: Requête incorrecte
 *       "401":
 *         description: Non autorisé
 *       "409":
 *         description: Programme déjà existant
 *   get:
 *     summary: Obtenir tous les programmes
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Programmes récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 *       "401":
 *         description: Non autorisé
 */

/**
 * @swagger
 * /api/v1/programs/{id}:
 *   get:
 *     summary: Obtenir un programme par ID
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du programme
 *     responses:
 *       "200":
 *         description: Programme récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Programme non trouvé
 *   put:
 *     summary: Mettre à jour un programme
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du programme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       "200":
 *         description: Programme mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       "400":
 *         description: Requête incorrecte
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Programme non trouvé
 *       "409":
 *         description: Programme déjà existant
 *   delete:
 *     summary: Supprimer un programme
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du programme
 *     responses:
 *       "200":
 *         description: Programme supprimé avec succès
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Programme non trouvé
 */

/**
 * @swagger
 * /api/v1/programs/{id}/subjects:
 *   put:
 *     summary: Ajouter une matière à un programme
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du programme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la matière à ajouter
 *     responses:
 *       "201":
 *         description: Matière ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       "400":
 *         description: Requête incorrecte
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Programme ou matière non trouvée
 *       "409":
 *         description: Matière déjà existante dans le programme
 */


const AysncHandler = require("express-async-handler");
const ClassLevel = require("../../model/Academic/ClassLevel");
const Program = require("../../model/Academic/Program");
const Subject = require("../../model/Academic/Subject");
const Admin = require("../../model/Staff/Admin");

//@desc  Create Program
//@route POST /api/v1/programs
//@acess  Private

exports.createProgram = AysncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check if exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    throw new Error("Program  already exists");
  }
  //create
  const programCreated = await Program.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });
  //push program into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.programs.push(programCreated._id);
  //save
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Program created successfully",
    data: programCreated,
  });
});

//@desc  get all Programs
//@route GET /api/v1/programs
//@acess  Private

exports.getPrograms = AysncHandler(async (req, res) => {
  const programs = await Program.find();
  res.status(201).json({
    status: "success",
    message: "Programs fetched successfully",
    data: programs,
  });
});

//@desc  get single Program
//@route GET /api/v1/programs/:id
//@acess  Private
exports.getProgram = AysncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Program fetched successfully",
    data: program,
  });
});

//@desc   Update  Program
//@route  PUT /api/v1/programs/:id
//@acess  Private

exports.updatProgram = AysncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check name exists
  const programFound = await ClassLevel.findOne({ name });
  if (programFound) {
    throw new Error("Program already exists");
  }
  const program = await Program.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: req.userAuth._id,
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    message: "Program  updated successfully",
    data: program,
  });
});

//@desc   Delete  Program
//@route  PUT /api/v1/programs/:id
//@acess  Private
exports.deleteProgram = AysncHandler(async (req, res) => {
  await Program.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Program deleted successfully",
  });
});
//@desc   Add subject to Program
//@route  PUT /api/v1/programs/:id/subjects
//@acess  Private
exports.addSubjectToProgram = AysncHandler(async (req, res) => {
  const { name } = req.body;
  //get the program
  const program = await Program.findById(req.params.id);
  if (!program) {
    throw new Error("Program not found");
  }
  //Find the subject
  const subjectFound = await Subject.findOne({ name });
  if (!subjectFound) {
    throw new Error("Subject not found");
  }
  //Check if subject exists
  const subjectExists = program.subjects?.find(
    sub => sub?.toString() === subjectFound?._id.toString()
  );
  if (subjectExists) {
    throw new Error("Subject already exists");
  }
  //push the subj into program
  program.subjects.push(subjectFound?._id);
  //save
  await program.save();
  res.status(201).json({
    status: "success",
    message: "Subject added successfully",
    data: program,
  });
});
