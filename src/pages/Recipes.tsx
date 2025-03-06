import { useState, useEffect } from "react";
import {
  fetchData,
  createData,
  updateData,
  deleteData,
} from "../services/apiService";

interface Recipe {
  id: number;
  name: string;
  ingredients: string;
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setTheError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchData<{ recipes: Recipe[] }>("recipes")
      .then((data) => setRecipes(data.recipes))
      .catch(() => setTheError("Failed to Catch the Data Recipes"))
      .finally(() => setLoading(false));
  }, []);

  const addRecipe = async () => {
    setLoading(true);
    setTheError("");
    try {
      const randomId = Math.floor(Math.random() * 30) + 1;
      const dummyRecipe = await fetchData<Recipe>(`recipes/${randomId}`);
      const localId = new Date().getTime();
      const newRecipe = {
        id: localId,
        name: dummyRecipe.name,
        ingredients: dummyRecipe.ingredients,
      };

      setRecipes((prev) => [newRecipe, ...prev]);

      const recipeFromAPI = await createData<Recipe>("recipes/add", {
        name: dummyRecipe.name,
        ingredients: dummyRecipe.ingredients,
      });

      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === localId ? { ...recipe, id: recipeFromAPI.id } : recipe
        )
      );
    } catch (error) {
      console.error("Failed to Add Recipe to API:", error);
      setTheError("Failed to Add Recipe");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async (
    id: number,
    name: string,
    ingredients: string
  ) => {
    if (id > 30) {
      alert(
        "This data is only stored on the frontend and cannot be updated in the API."
      );
      return;
    }

    const updatedName = prompt("Edit Name:", name);
    const updatedIngredients = prompt("Edit Ingredients:", ingredients);
    if (!updatedName || !updatedIngredients) return;

    setLoading(true);
    try {
      const updatedRecipe = await updateData<Recipe>("Recipes", id, {
        name: updatedName,
        ingredients: updatedIngredients,
      });
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === id ? updatedRecipe : recipe))
      );
    } catch (error) {
      console.error("Failed to Update Recipe:", error);
      setTheError("Failed to Update Recipe");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const removeRecipe = async (id: number) => {
    if (id > 30) {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      return;
    }

    setLoading(true);
    try {
      await deleteData("Recipes", id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Failed to Remove Recipe:", error);
      setTheError("Failed to Remove Recipe");
      setTimeout(() => setTheError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Recipes</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-green-700">Loading...</p>}
      <div className="mb-4">
        <button
          onClick={addRecipe}
          className="w-full bg-green-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add the Recipe"}
        </button>
      </div>
      <div className="space-y-3">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex flex-col bg-white p-3 rounded shadow"
          >
            <h3 className="font-bold text-lg">{recipe.name}</h3>
            <p className="text-gray-700">{recipe.ingredients}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() =>
                  updateRecipe(recipe.id, recipe.name, recipe.ingredients)
                }
                className="text-blue-400"
              >
                Edit
              </button>
              <button
                onClick={() => removeRecipe(recipe.id)}
                className="text-stone-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
