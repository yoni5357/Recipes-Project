'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /** types intellisense:
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {typeof import('sequelize')} Sequelize
 */
  async up (queryInterface, Sequelize) {
await queryInterface.createTable("recipes", {
      id: {
        type: Sequelize.UUID,
        defaultValue:Sequelize.literal('(UUID())'), //not sure if needed
        primaryKey: true,
        unique:true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ingredients: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue:[],
      },
      instructions: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue:[],
      },
      cookingTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      servings: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      difficulty: {
        type: Sequelize.ENUM("easy","medium","hard"),
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue:true,
        allowNull: false,
      },
      userId:{
        type: Sequelize.UUID,
        allowNull:false,
        references:{
          model:'users',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  /** types intellisense:
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {typeof import('sequelize')} Sequelize
 */
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("recipes","userId");
    await queryInterface.dropTable("recipes");
  }
};
