import express from 'express'
import RecipesController from './controllers/RecipesController'

const routes = express.Router()

const recipesController = new RecipesController()

routes.get('/recipes', recipesController.index)
routes.post('/recipes', recipesController.create)


export default routes