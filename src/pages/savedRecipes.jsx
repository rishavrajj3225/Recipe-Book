import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, message } from "antd";
import Navbar from "../components/Navbar.jsx";
import { useSelector } from "react-redux";
import RecipeDetailsModal from "../components/RecipeDetailsModal.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

export default function SavedRecipes() {
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser.data.data.user._id;

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRecipeDetails, setSelectedRecipeDetails] = useState({});
  const [usernamesMap, setUsernamesMap] = useState({});

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/recipe/savedRecipes/${userId}`
        );
        setSavedRecipes(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userId]);

  useEffect(() => {
    const fetchAllUsernames = async () => {
      const userIds = new Set(savedRecipes.map((r) => r.userOwner));
      for (let userId of userIds) {
        if (!usernamesMap[userId]) {
          try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${userId}`);
            const username = res.data.data.username;
            setUsernamesMap((prev) => ({
              ...prev,
              [userId]: username,
            }));
          } catch (err) {
            console.error("Failed to fetch user:", userId);
            setUsernamesMap((prev) => ({
              ...prev,
              [userId]: "Unknown User",
            }));
          }
        }
      }
    };

    if (savedRecipes.length > 0) {
      fetchAllUsernames();
    }
  }, [savedRecipes]);

  const getMoreDetailsOfRecipe = async (savedRecipeId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/recipe/${savedRecipeId}`);
      setSelectedRecipeDetails(response.data.data);
      setDetailsModalVisible(true);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch recipe details");
    }
  };

  const removeSavedRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/recipe/removeSaved/${recipeID}/${userId}`,
        {
          recipeID,
          userID: currentUser._id,
        }
      );
      setSavedRecipes(response.data.data.savedRecipes);
      message.success("Recipe removed from saved!");
    } catch (err) {
      console.error(err);
      message.error("Failed to remove recipe from saved");
    }
  };

  const closeModal = () => {
    setDetailsModalVisible(false);
    setSelectedRecipeDetails({});
  };

  return (
    <>
      <Navbar />
      <div className="savedRecipesContainer container">
        <p className="sectionHeading">Saved Recipes</p>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
          }}
          dataSource={savedRecipes}
          renderItem={(recipe) => (
            <List.Item>
              <RecipeCard
                recipe={recipe}
                onDelete={removeSavedRecipe}
                onReadMore={getMoreDetailsOfRecipe}
                creatorName={usernamesMap[recipe.userOwner]}
              />
            </List.Item>
          )}
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
