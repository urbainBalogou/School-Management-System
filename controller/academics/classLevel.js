/**
 * @swagger
 * tags:
 *   name: Class Levels
 *   description: Gestion des niveaux de classe
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClassLevel:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - duration
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant auto-généré du niveau de classe
 *         name:
 *           type: string
 *           description: Nom du niveau de classe
 *         description:
 *           type: string
 *           description: Description du niveau de classe
 *         duration:
 *           type: string
 *           description: Durée du niveau de classe
 *         createdBy:
 *           type: string
 *           description: ID de l'administrateur qui a créé le niveau
 *       example:
 *         name: "Niveau 100"
 *         description: "Première année de licence"
 *         duration: "4 ans"
 */

/**
 * @swagger
 * /api/v1/class-levels:
 *   post:
 *     summary: Créer un nouveau niveau de classe
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassLevel'
 *     responses:
 *       "201":
 *         description: Niveau de classe créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassLevel'
 *       "400":
 *         description: Requête incorrecte
 *       "401":
 *         description: Non autorisé
 *       "409":
 *         description: Niveau de classe déjà existant
 *   get:
 *     summary: Obtenir tous les niveaux de classe
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Niveaux de classe récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClassLevel'
 *       "401":
 *         description: Non autorisé
 */

/**
 * @swagger
 * /api/v1/class-levels/{id}:
 *   get:
 *     summary: Obtenir un niveau de classe par ID
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du niveau de classe
 *     responses:
 *       "200":
 *         description: Niveau de classe récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassLevel'
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Niveau de classe non trouvé
 *   put:
 *     summary: Mettre à jour un niveau de classe
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du niveau de classe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassLevel'
 *     responses:
 *       "200":
 *         description: Niveau de classe mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassLevel'
 *       "400":
 *         description: Requête incorrecte
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Niveau de classe non trouvé
 *       "409":
 *         description: Niveau de classe déjà existant
 *   delete:
 *     summary: Supprimer un niveau de classe
 *     tags: [Class Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du niveau de classe
 *     responses:
 *       "200":
 *         description: Niveau de classe supprimé avec succès
 *       "401":
 *         description: Non autorisé
 *       "404":
 *         description: Niveau de classe non trouvé
 */



const AysncHandler = require("express-async-handler");
const ClassLevel = require("../../model/Academic/ClassLevel");
const Admin = require("../../model/Staff/Admin");

//@desc  Create Class Level
//@route POST /api/v1/class-levels
//@acess  Private
exports.createClassLevel = AysncHandler(async (req, res) => {
  const { name, description, duration } = req.body;
  //check if exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    throw new Error("Class  already exists");
  }
  //create
  const classCreated = await ClassLevel.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });
  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classCreated._id);
  //save
  await admin.save();

  res.status(201).json({
    status: "success",
    message: "Class created successfully",
    data: classCreated,
  });
});

//@desc  get all class levels
//@route GET /api/v1/class-levels
//@acess  Private
exports.getClassLevels = AysncHandler(async (req, res) => {
  const classes = await ClassLevel.find();
  res.status(201).json({
    status: "success",
    message: "Class Levels fetched successfully",
    data: classes,
  });
});

//@desc  get single Class level
//@route GET /api/v1/class-levels/:id
//@acess  Private
exports.getClassLevel = AysncHandler(async (req, res) => {
  const classLevel = await ClassLevel.findById(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Class fetched successfully",
    data: classLevel,
  });
});

//@desc   Update  Class Level
//@route  PUT /api/v1/class-levels/:id
//@acess  Private

exports.updateclassLevel = AysncHandler(async (req, res) => {
  const { name, description } = req.body;
  //check name exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    throw new Error("Class already exists");
  }
  const classLevel = await ClassLevel.findByIdAndUpdate(
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
    message: "Class  updated successfully",
    data: classLevel,
  });
});

//@desc   Delete  class level
//@route  PUT /api/v1/aclass-levels/:id
//@acess  Private
exports.deleteClassLevel = AysncHandler(async (req, res) => {
  await ClassLevel.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Class level deleted successfully",
  });
});
