// src/components/RecipeCard.jsx
import React from "react";
import { Card, Button } from "antd";
import {
  SaveOutlined,
  CheckOutlined,
  DownOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

const RecipeCard = ({
  recipe,
  isSaved,
  onSave,
  onReadMore,
  creatorName,
  onEdit,
  onDelete,
}) => {
  const truncateDescription = (description) => {
    const words = description.split(" ");
    return words.length > 10
      ? words.slice(0, 10).join(" ") + "..."
      : description;
  };

  const actions = [];

  if (onDelete)
    actions.push(
      <Button
        type="primary"
        icon={<DeleteOutlined />}
        onClick={() => onDelete(recipe._id)}
      />
    );

  if (onEdit)
    actions.push(
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => onEdit(recipe)}
      />
    );

  if (onSave !== undefined)
    actions.push(
      <Button
        type="primary"
        icon={isSaved ? <CheckOutlined /> : <SaveOutlined />}
        onClick={() => onSave(recipe._id)}
        disabled={isSaved}
      >
        {isSaved ? "Saved" : "Save"}
      </Button>
    );

  if (onReadMore)
    actions.push(
      <Button
        type="primary"
        icon={<DownOutlined />}
        onClick={() => onReadMore(recipe._id)}
      />
    );

  return (
    <Card
      className="recipeCard"
      title={
        <>
          <div>{recipe.name}</div>
          {creatorName && (
            <div style={{ fontSize: "0.85em", color: "#888" }}>
              by {creatorName}
            </div>
          )}
        </>
      }
      cover={<img alt={recipe.name} src={recipe.recipeImg} />}
      actions={actions}
    >
      <Meta description={truncateDescription(recipe.description)} />
    </Card>
  );
};

export default RecipeCard;
