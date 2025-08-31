

const recipeSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 3,
            maxLength: 100,
            errorMessage: {
                type: "Title must be a string.",
                minLength: "Title must be at least 3 characters.",
                maxLength: "Title must be at most 100 characters."
            }
        },
        description: {
            type: "string",
            minLength: 10,
            maxLength: 500,
            errorMessage: {
                type: "Description must be a string.",
                minLength: "Description must be at least 10 characters.",
                maxLength: "Description must be at most 500 characters."
            }
        },
        ingredients: {
            type: "array",
            minItems: 1,
            items: { type: "string" },
            errorMessage: {
                type: "Ingredients must be an array.",
                minItems: "At least one ingredient is required."
            }
        },
        instructions: {
            type: "array",
            minItems: 1,
            items: { type: "string" },
            errorMessage: {
                type: "Instructions must be an array.",
                minItems: "At least one instruction is required."
            }
        },
        cookingTime: {
            type: "number",
            exclusiveMinimum: 0,
            errorMessage: {
                type: "Cooking time must be a number.",
                exclusiveMinimum: "Cooking time must be greater than 0."
            }
        },
        servings: {
            type: "integer",
            exclusiveMinimum: 0,
            errorMessage: {
                type: "Servings must be an integer.",
                exclusiveMinimum: "Servings must be greater than 0."
            }
        },
        difficulty: {
            type: "string",
            enum: ["easy", "medium", "hard"],
            errorMessage: {
                type: "Difficulty must be a string.",
                enum: "Difficulty must be one of: easy, medium, hard."
            }
        },
    },
    required: ["title", "description", "ingredients", "instructions", "cookingTime", "servings", "difficulty"],
    errorMessage: {
        required: {
            title: "Title is required.",
            description: "Description is required.",
            ingredients: "Ingredients are required.",
            instructions: "Instructions are required.",
            cookingTime: "Cooking time is required.",
            servings: "Servings are required.",
            difficulty: "Difficulty is required."
        },
        properties: {
            title: "Invalid title.",
            description: "Invalid description.",
            ingredients: "Invalid ingredients.",
            instructions: "Invalid instructions.",
            cookingTime: "Invalid cooking time.",
            servings: "Invalid servings.",
            difficulty: "Invalid difficulty."
        }
    }
}

export default recipeSchema;