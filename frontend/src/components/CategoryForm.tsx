import React from "react";
import { Button, TextField, FormControl } from "../vibes";
import { useCategoryForm } from "../hooks/useCategoryForm";
import { Category } from "../types";

interface CategoryFormProps {
  onSuccess?: (category: Category) => void;
  onCancel?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useCategoryForm({
      onSuccess,
      onClose: onCancel,
    });

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    padding: "1rem 0",
  };

  const errorStyle: React.CSSProperties = {
    color: "var(--color-error, #ef4444)",
    backgroundColor: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "0.375rem",
    padding: "0.75rem",
    fontSize: "0.875rem",
  };

  const actionStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {errors.length > 0 && <div style={errorStyle}>{errors.join(", ")}</div>}

      <FormControl label="Category Name">
        <TextField
          name="name"
          placeholder="e.g. Subscriptions, Utilities, Dining Out"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          disabled={isSubmitting}
        />
      </FormControl>

      <div style={actionStyle}>
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting || !formData.name.trim()}
        >
          {isSubmitting ? "Saving..." : "Add Category"}
        </Button>
      </div>
    </form>
  );
};
