import { CustomLoadingCard } from "@/components/custom/CustomLoadingCard";
import React from "react";

interface ImageCardProps {
  image: string;
  title?: string; // texto opcional que aparece sobre la imagen
  alt?: string;   // alt de la imagen
  isLoading?: boolean; // <-- nuevo prop
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  title,
  alt = "Imagen",
  isLoading = false, // <-- default false
}) => {
  if (isLoading) {
    return <CustomLoadingCard />;
  }

  return (
    <div className="stat-card stat-card-image aspect-auto h-full min-h-[120px] relative">
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover rounded-xl absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
      {title && (
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-white text-sm font-medium drop-shadow">
            {title}
          </span>
        </div>
      )}
    </div>
  );
};