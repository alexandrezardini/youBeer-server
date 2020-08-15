import express from 'express'
import RecipesController from './controllers/RecipesController'

const routes = express.Router()

const recipesController = new RecipesController()

routes.post('/recipes', recipesController.create)


export default routes