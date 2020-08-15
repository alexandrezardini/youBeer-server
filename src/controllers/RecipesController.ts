import { Request, Response } from 'express';

import db from '../database/connection';

interface alesItem {
  ale_type: string;
  ales: string;
}

export default class RecipesController {
  async index(request: Request, response: Response) {}

  async create(request: Request, response: Response) {
    const { name, avatar, type, recipe, ales } = request.body;

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
        erro: `Unexpected erro while creating a new class - ${e}`
      });
    }
  }
}
