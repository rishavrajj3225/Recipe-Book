import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { List, message } from "antd";
import { useSelector } from "react-redux";
import RecipeDetailsModal from "../components/RecipeDetailsModal.jsx";
import RecipeEditModal from "../components/RecipeEditModal.jsx";
import RecipeCard from "../components/RecipeCard.jsx"; // ⬅️ Imported reusable card

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState({});
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRecipeDetails, setSelectedRecipeDetails] = useState({});

  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser.data.data.user._id;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `/api/v1/recipe/userRecipes/${userId}`
        );
        setRecipes(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipes();
  }, [userId]);

  const handleDelete = async (recipeId) => {
    try {
      await axios.delete(`/api/v1/recipe/delete/${recipeId}`);
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeId)
      );
      message.success("Recipe deleted successfully");
    } catch (error) {
      message.error("Failed to delete recipe");
    }
  };

  const handleEdit = (recipe) => {
    setEditedRecipe({
      _id: recipe._id,
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients.join(","),
      instructions: recipe.instructions,
      cookingTime: recipe.cookingTime.toString(),
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `/api/v1/recipe/update/${editedRecipe._id}`,
        editedRecipe
      );
      setIsModalVisible(false);
      message.success("Recipe updated successfully");

      const response = await axios.get(`/api/v1/recipe/userRecipes/${userId}`);
      setRecipes(response.data.data);
    } catch (error) {
      message.error("Failed to update recipe");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getMoreDetailsOfRecipe = async (recipeId) => {
    try {
      const response = await axios.get(`/api/v1/recipe/${recipeId}`);
      setSelectedRecipeDetails(response.data.data);
      setDetailsModalVisible(true);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch recipe details");
    }
  };

  const closeModal = () => {
    setDetailsModalVisible(false);
    setSelectedRecipeDetails({});
  };

  return (
    <>
      <Navbar />
      <div className="myRecipesContainer container">
        <p className="sectionHeading">My Recipes</p>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
          }}
          dataSource={recipes}
          renderItem={(recipe) => (
            <List.Item>
              <RecipeCard
                recipe={recipe}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onReadMore={getMoreDetailsOfRecipe}
                creatorName="You"
              />
            </List.Item>
          )}
        />

        <RecipeEditModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onUpdate={handleUpdate}
          editedRecipe={editedRecipe}
          setEditedRecipe={setEditedRecipe}
        />

        <RecipeDetailsModal
          visible={detailsModalVisible}
          onCancel={closeModal}
          recipeDetails={selectedRecipeDetails}
        />
      </div>
    </>
  );
}
