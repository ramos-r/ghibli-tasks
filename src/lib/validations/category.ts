import { z } from "zod";

export const categoryColors = [
  "#7C9473", // moss
  "#7FA8B8", // sky
  "#9C8FB8", // lavender
  "#C08552", // clay
  "#C68B8B", // rose
  "#D1A94C", // honey
  "#8C8878", // stone
  "#A5678E", // berry
] as const;

export const categoryIcons = [
  "Folder",
  "Briefcase",
  "Home",
  "Heart",
  "BookOpen",
  "ShoppingCart",
  "Utensils",
  "Dumbbell",
  "Plane",
  "Palette",
  "Code",
  "GraduationCap",
] as const;

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  color: z.enum(categoryColors),
  icon: z.enum(categoryIcons),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().min(1),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
