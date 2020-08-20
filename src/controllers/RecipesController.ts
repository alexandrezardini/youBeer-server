import { Request, Response } from 'express';

import db from '../database/connection';

interface alesItem {
  ale_type: string;
  ales: string;
}

export default class RecipesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const type = filters.type as string;
    const ale_type = filters.ale_type as string;
    const ales = filters.ales as string;

    if (!filters.ale_type || !filters.type || !filters.ales) {
      return response.status(400).json({
        error: 'Missing filters to search recipes'
      });
    }

    const recipes = await db('recipes')
      .whereExists(function () {
        this.select('ales.*')
          .from('ales')
          .whereRaw('`ales`.`recipe_id` = `recipes`.`id`')
          .where('ale_type', '=', ale_type)
          .where('ales', '=', ales);
      })
      .where('recipes.type', '=', type)
      .join('users', 'recipes.user_id', '=', 'users.id')
      .select(['recipes.*', 'users.*',]);

    return response.send(recipes);
  }

  async create(request: Request, response: Response) {
    const { name, avatar, type, recipe, likes = 0, ales } = request.body;

    const trx = await db.transaction();

    try {
      const insertedUserIds = await trx('users').insert({
        name,
        avatar
      });

      const user_id = insertedUserIds[0];

      const insertedRecipesIds = await trx('recipes').insert({
        recipe,
        type,
        likes,
        user_id
      });

      const recipe_id = insertedRecipesIds[0];

      const beerType = ales.map((alesItem: alesItem) => {
        return {
          ale_type: alesItem.ale_type,
          ales: alesItem.ales,
          recipe_id
        };
      });

      await trx('ales').insert(beerType);

      await trx.commit();

      response.status(201).send('Success!!');
    } catch (e) {
      await trx.rollback();

      response.status(400).json({
        erro: `Unexpected erro while creating a new recipe - ${e}`
      });
    }
  }
}
