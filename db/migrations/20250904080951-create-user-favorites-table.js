'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    /** types intellisense:
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {typeof import('sequelize')} Sequelize
 */
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('userFavorites',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
      },
      userId:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'users',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      recipeId:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'recipes',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      createdAt:{
        type:Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    })
  },

  /** types intellisense:
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {typeof import('sequelize')} Sequelize
 */
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('userFavorites')
  }
};
