import React, {useState,useEffect}from 'react';
import { Modal } from 'antd';
import axios from 'axios';

const RecipeDetailsModal = ({ visible, onCancel, recipeDetails }) => {
  const userId = recipeDetails?.userOwner;
  const [owner, setOwner] = useState(null);

  const finduser = async (userId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    if (userId) {
      finduser(userId).then((data) => {
        setOwner(data);
      });
    }
  }, [userId]);
    return (
      <Modal
        title="Recipe Details"
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
        <p>
          <strong>Created by:</strong>{" "}
          {owner?.username || "Unknown User"}
        </p>

        {recipeDetails.recipeImg && (
          <img
            src={recipeDetails.recipeImg}
            alt={recipeDetails.name}
            style={{
              width: "100%",
              maxHeight: 300,
              objectFit: "cover",
              marginBottom: 16,
            }}
          />
        )}
        <p>
          <strong>Name: </strong> {recipeDetails.name}
        </p>

        <p>
          <strong>Description: </strong> {recipeDetails.description}
        </p>
        <p>
          <strong>Ingredients:</strong>{" "}
          {Array.isArray(recipeDetails.ingredients)
            ? recipeDetails.ingredients.join(", ")
            : ""}
        </p>
        <p>
          <strong>Instructions: </strong> {recipeDetails.instructions}
        </p>
      </Modal>
    );
};

export default RecipeDetailsModal;
