/**
 * @swagger
 * tags:
 *   name: Academic Terms
 *   description: Gestion des trimestres académiques
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AcademicTerm:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - duration
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré
 *         name:
 *           type: string
 *           description: Nom du trimestre
 *         description:
 *           type: string
 *           description: Description du trimestre
 *         duration:
 *           type: string
 *           description: Durée du trimestre
 *       example:
 *         name: "Premier Trimestre"
 *         description: "Premier trimestre de l'année scolaire"
 *         duration: "3 mois"
 */

/**
 * @swagger
 * /api/v1/academic-terms:
 *   post:
 *     summary: Créer un nouveau trimestre académique
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicTerm'
 *     responses:
 *       "201":
 *         description: Trimestre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicTerm'
 *       "400":
 *         description: Données invalides
 *       "401":
 *         description: Non autorisé
 *       "403":
 *         description: Accès interdit
 * 
 *   get:
 *     summary: Récupérer tous les trimestres académiques
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Liste des trimestres académiques
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AcademicTerm'
 *       "401":
 *         description: Non autorisé
 *       "403":
 *         description: Accès interdit
 */

/**
 * @swagger
 * /api/v1/academic-terms/{id}:
 *   get:
 *     summary: Récupérer un trimestre académique par ID
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du trimestre académique
 *     responses:
 *       "200":
 *         description: Trimestre académique trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicTerm'
 *       "404":
 *         description: Trimestre académique non trouvé
 *       "401":
 *         description: Non autorisé
 *       "403":
 *         description: Accès interdit
 * 
 *   put:
 *     summary: Mettre à jour un trimestre académique
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du trimestre académique
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicTerm'
 *     responses:
 *       "200":
 *         description: Trimestre académique mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicTerm'
 *       "400":
 *         description: Données invalides
 *       "404":
 *         description: Trimestre académique non trouvé
 *       "401":
 *         description: Non autorisé
 *       "403":
 *         description: Accès interdit
 * 
 *   delete:
 *     summary: Supprimer un trimestre académique
 *     tags: [Academic Terms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du trimestre académique
 *     responses:
 *       "200":
 *         description: Trimestre académique supprimé
 *       "404":
 *         description: Trimestre académique non trouvé
 *       "401":
 *         description: Non autorisé
 *       "403":
 *         description: Accès interdit
 */




const express = require("express");
const {
  createAcademicTerm,
  deleteAcademicTerm,
  getAcademicTerm,
  getAcademicTerms,
  updateAcademicTerms,
} = require("../../controller/academics/academicTermCtrl");

const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");

const academicTermRouter = express.Router();

// academicTerRouter.post("/", isLogin, isAdmin, createAcademicYear);
// academicTerRouter.get("/", isLogin, isAdmin, getAcademicYears);

academicTermRouter
  .route("/")
  .post(isLogin, isAdmin, createAcademicTerm)
  .get(isLogin, isAdmin, getAcademicTerms);

academicTermRouter
  .route("/:id")
  .get(isLogin, isAdmin, getAcademicTerm)
  .put(isLogin, isAdmin, updateAcademicTerms)
  .delete(isLogin, isAdmin, deleteAcademicTerm);

// academicTerRouter.get("/:id", isLogin, isAdmin, getAcademicYear);
// academicTerRouter.put("/:id", isLogin, isAdmin, updateAcademicYear);
// academicTerRouter.delete("/:id", isLogin, isAdmin, deleteAcademicYear);

module.exports = academicTermRouter;
