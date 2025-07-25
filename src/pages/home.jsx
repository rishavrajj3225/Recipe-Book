import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Button, Card, message, Modal } from "antd";
import { SaveOutlined, CheckOutlined, DownOutlined } from "@ant-design/icons";
import Navbar from "../components/Navbar.jsx";
import "../styles/home.css";

import { useSelector } from "react-redux";

const { Meta } = Card;
import RecipeDetailsModal from "../components/RecipeDetailsModal.jsx";

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRecipeDetails, setSelectedRecipeDetails] = useState({});
    const [usernamesMap, setUsernamesMap] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const userID = currentUser.data.data.user._id;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(
                  `${import.meta.env.VITE_BACKEND_URL}/api/v1/recipe`
                );
                setRecipes(response.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(
                   `${import.meta.env.VITE_BACKEND_URL}/api/v1/recipe/savedRecipes/ids/${userID}`
                );
                setSavedRecipes(response.data.data.savedRecipes);
            } catch (err) {
                console.error(err);
            }   
        };

        fetchRecipes();
        fetchSavedRecipes();
    }, [userID]);
    const fetchUsername = async (userId) => {
      if (usernamesMap[userId]) return; // Already fetched

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${userId}`);
        const username = response.data.data.username;
        setUsernamesMap((prev) => ({
          ...prev,
          [userId]: username,
        }));
      } catch (error) {
        console.error("Error fetching username for user:", userId, error);
        setUsernamesMap((prev) => ({
          ...prev,
          [userId]: "Unknown User",
        }));
      }
    };
    useEffect(() => {
      const fetchAllUsernames = async () => {
        const userIds = new Set(recipes.map((r) => r.userOwner));
        for (let userId of userIds) {
          await fetchUsername(userId);
        }
      };

      if (recipes.length > 0) {
        fetchAllUsernames();
      }
    }, [recipes]);

    const saveRecipe = async (recipeID) => {
        try {
            const response = await axios.put(
               `${import.meta.env.VITE_BACKEND_URL}/api/v1/recipe/save`,
              {
                recipeID,
                userID,
              }
            );
            setSavedRecipes(response.data.data.savedRecipes);
            message.success("Recipe saved!");
        } catch (err) {
            console.error(err);
            message.error("Failed to save recipe");
        }
    };

    const isRecipeSaved = (id) => savedRecipes.includes(id);

    const truncateDescription = (description) => {
        const words = description.split(" ");
        if (words.length > 10) {
            return words.slice(0, 10).join(" ") + "...";
        }
        return description;
    };

    const getMoreDetailsOfRecipe = async (recipeId) => {
        try {
            const response = await axios.get(
               `${import.meta.env.VITE_BACKEND_URL}/api/v1/recipe/${recipeId}`
            );
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
        <div className="homeContainer container">
          <p className="sectionHeading">Recipes</p>
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
                <Card
                  className="recipeCard"
                  title={
                    <>
                      <div>{recipe.name}</div>
                      <div style={{ fontSize: "0.85em", color: "#888" }}>
                        by {usernamesMap[recipe.userOwner] || "Loading..."}
                      </div>
                    </>
                  }
                  cover={<img alt={recipe.name} src={recipe.recipeImg} />}
                  actions={[
                    <Button
                      type="primary"
                      icon={
                        isRecipeSaved(recipe._id) ? (
                          <CheckOutlined />
                        ) : (
                          <SaveOutlined />
                        )
                      }
                      onClick={() => saveRecipe(recipe._id)}
                      disabled={isRecipeSaved(recipe._id)}
                    >
                      {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                    </Button>,
                    <Button
                      type="primary"
                      icon={<DownOutlined />}
                      onClick={() => getMoreDetailsOfRecipe(recipe._id)}
                    >
                      Read More
                    </Button>,
                  ]}
                >
                  <Meta description={truncateDescription(recipe.description)} />
                </Card>
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