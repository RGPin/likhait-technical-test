import { useState } from "react";
import { CategoryFormData, Category } from "../types";

const API_BASE_URL = "http://localhost:3000/api";

interface UseCategoryFormProps {
  onSuccess?: (newCategory: Category) => void;
  onClose?: () => void;
}

export function useCategoryForm({ onSuccess, onClose }: UseCategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({ name: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrors(["Name can't be blank"]);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: formData }),
      });

      if (response.ok) {
        const newCategory: Category = await response.json();

        setFormData({ name: "" });

        if (onSuccess) onSuccess(newCategory);
        if (onClose) onClose();
      } else {
        const data = await response.json();
        setErrors(data.errors || ["Failed to create category"]);
      }
    } catch (error) {
      console.error("Network error creating category:", error);
      setErrors(["Network error. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
