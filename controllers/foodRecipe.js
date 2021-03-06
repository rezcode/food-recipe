const model = require("../models/foodRecipe");

// Get All Recipes
const getAllRecipes = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;

    if (page <= 0 || limit <= 0) {
      throw new Error("incorrect page or limit value");
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const data = await model.getAllRecipes();
    const paginationResult = data.rows.slice(startIndex, endIndex);

    if (paginationResult.length === 0) {
      const getData = await model.getAllRecipes();
      if (getData.rows.length === 0) {
        res.send({ message: "no data" });
      } else {
        res.send({
          message: "Success",
          data: getData.rows,
          totalData: getData.rowCount,
        });
      }
    } else {
      res.send({ data: paginationResult, totalData: paginationResult.length });
    }
    // const getData = await model.getAllRecipes();
    // res.send({
    //   data: getData.rows,
    //   totalData: getData.rowCount,
    // });
  } catch (error) {
    res.status(400).send("Something wrong, get all recipes failed!");
  }
};

// Get Recipes Detail by id
const getRecipeDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const getData = await model.getRecipeDetail(id);

    if (getData.rows.length === 0) {
      res.status(400).send("Food not found");
    } else {
      res.send({
        data: getData.rows,
      });
    }
  } catch (error) {
    res.status(400).send("Something wrong, get recipe detail failed!");
  }
};

// Get 5 recent recipe
const getRecentRecipe = async (req, res) => {
  try {
    const getData = await model.getRecentRecipe();
    res.send({
      data: getData.rows,
      totalData: getData.rowCount,
    });
  } catch (error) {
    res.status(400).send("Something wrong, get limit 5 recent recipe railed!");
  }
};

// Get Recipe Detail by title
const getRecipeTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const getData = await model.getRecipeTitle(title);

    res.send({
      data: getData.rows,
    });
  } catch (error) {
    res.status(400).send("Something wrong, get recipe title failed!");
  }
};

// Create New Recipe
const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, foodVideo } = req.body;
    const foodImage = req.file.path;
    const id = parseInt(req.body.userId, 10);
    await model.addRecipe({
      title,
      ingredients,
      foodVideo,
      foodImage,
      id,
    });
    res.send({
      message: `${title} recipe successfully added`,
      data: {
        title,
        ingredients,
        foodVideo,
        foodImage,
        id,
      },
    });
  } catch (error) {
    res.status(400).send("Something wrong, add recipe failed!");
  }
};

// Delete Recipe by id
const deleteRecipe = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await model.deleteRecipe(id);

    res.send({
      message: `recipe id ${id} successfully deleted`,
    });
  } catch (error) {
    res.status(400).send("Something wrong, delete recipe failed!");
  }
};

// edit recipe
const editRecipe = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, ingredients, foodVideo, foodImage } = req.body;

    await model.editRecipe({
      id,
      title,
      ingredients,
      foodVideo,
      foodImage,
    });
    res.send({ message: `edit ${title} recipe success` });
  } catch (error) {
    res.status(400).send("Something wrong, edit recipe failed!");
  }
};

module.exports = {
  getAllRecipes,
  addRecipe,
  deleteRecipe,
  getRecipeDetail,
  editRecipe,
  getRecipeTitle,
  getRecentRecipe,
};
