"use client";

import { Compass, Utensils, Home as HomeIcon, Camera } from "lucide-react";
import { CategoryCard } from "./CategoryCard";

interface Category {
  name: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

interface CategoryNavigationProps {
  title?: string;
  categories?: Category[];
  onCategoryClick?: (category: string) => void;
}

export function CategoryNavigation({
  title = "Quick Navigation",
  categories,
  onCategoryClick,
}: CategoryNavigationProps) {
  const defaultCategories: Category[] = [
    { name: "Explore", icon: <Compass className="w-6 h-6" />, color: "bg-blue-500" },
    { name: "Eat", icon: <Utensils className="w-6 h-6" />, color: "bg-orange-500" },
    { name: "Stay", icon: <HomeIcon className="w-6 h-6" />, color: "bg-teal-500" },
    { name: "Adventures", icon: <Camera className="w-6 h-6" />, color: "bg-emerald-500" },
  ];

  const displayCategories = categories || defaultCategories;

  return (
    <section className="mb-20 py-12 border-t border-gray-200 dark:border-slate-800">
      <h2 className="text-3xl font-bold text-dark-gray dark:text-white mb-8">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayCategories.map((cat, idx) => (
          <div key={idx} onClick={() => onCategoryClick?.(cat.name)}>
            <CategoryCard
              name={cat.name}
              icon={cat.icon}
              color={cat.color}
              count={cat.count}
              onClick={() => onCategoryClick?.(cat.name)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
