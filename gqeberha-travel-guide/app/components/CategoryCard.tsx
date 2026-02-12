interface CategoryCardProps {
  name: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
  onClick?: () => void;
}

export function CategoryCard({
  name,
  description,
  icon,
  color,
  count,
  onClick,
}: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-line-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-6 cursor-pointer hover:shadow-lg transition duration-300"
    >
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-dark-gray dark:text-white">{name}</h3>
      <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
        {description || `Explore ${name.toLowerCase()}`}
      </p>
      {count !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-pe-blue">
            {count} {count === 1 ? "place" : "places"}
          </span>
        </div>
      )}
    </div>
  );
}
