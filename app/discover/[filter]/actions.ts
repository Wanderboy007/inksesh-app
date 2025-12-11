"use server";

import { prisma } from "@/lib/db/prisma";
import { Gender, TattooSize } from "@/app/generated/prisma/enums";

export type FilterType = "gender" | "size" | "bodyPart";

export type FilteredDesign = {
  id: string;
  imageUrl: string;
  title: string;
  gender: string;
  size: string;
  bodyPart: string;
  styles: string[];
  themes: string[];
  artist: {
    id: string;
    username: string;
  };
};

export type FilterOptions = {
  genders: string[];
  sizes: string[];
  bodyParts: string[];
};

export async function getFilterOptions(): Promise<FilterOptions> {
  const [bodyParts] = await Promise.all([
    prisma.design.findMany({
      select: { bodyPart: true },
      distinct: ["bodyPart"],
    }),
  ]);

  return {
    genders: Object.values(Gender),
    sizes: Object.values(TattooSize),
    bodyParts: bodyParts.map((d) => d.bodyPart).sort(),
  };
}

export async function getFilteredDesigns(
  filterType: FilterType,
  filterValue: string,
  limit: number = 50
): Promise<{ 
  designs: FilteredDesign[]; 
  total: number; 
  filterOptions: FilterOptions;
}> {
  const where: Record<string, unknown> = {};

  switch (filterType) {
    case "gender":
      where.gender = filterValue as Gender;
      break;
    case "size":
      where.size = filterValue as TattooSize;
      break;
    case "bodyPart":
      where.bodyPart = { equals: filterValue, mode: "insensitive" };
      break;
  }

  const [designs, total, filterOptions] = await Promise.all([
    prisma.design.findMany({
      where,
      select: {
        id: true,
        imageUrl: true,
        title: true,
        gender: true,
        size: true,
        bodyPart: true,
        styles: true,
        themes: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.design.count({ where }),
    getFilterOptions(),
  ]);

  return {
    designs: designs.map((d) => ({
      id: d.id,
      imageUrl: d.imageUrl,
      title: d.title,
      gender: d.gender,
      size: d.size,
      bodyPart: d.bodyPart,
      styles: d.styles,
      themes: d.themes,
      artist: {
        id: d.user.id,
        username: d.user.username,
      },
    })),
    total,
    filterOptions,
  };
}
