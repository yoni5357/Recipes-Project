import { sequelize } from "../connections";

async function addToFavorites(userId:string,recipeId:string){
    const [result] = await sequelize.query(
        `INSERT INTO userFavorites (userId,recipeId)
        VALUES(:userId,:recipeId)`,
        {replacements:{userId,recipeId}}
    )
}