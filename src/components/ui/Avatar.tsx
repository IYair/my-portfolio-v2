import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size: number;
  className?: string;
}

// Función para generar un color consistente basado en el nombre
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generar colores vibrantes pero no demasiado brillantes
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-indigo-500",
  ];

  return colors[Math.abs(hash) % colors.length];
}

// Función para obtener las iniciales del nombre
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function Avatar({ src, alt, size, className = "" }: AvatarProps) {
  const baseClasses = `flex-shrink-0 rounded-full ${className}`;

  // Si hay imagen, mostrarla
  if (src && src.trim() !== "") {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`${baseClasses} bg-gray-50 object-cover dark:bg-gray-800`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }

  // Si no hay imagen, generar avatar con iniciales
  const initials = getInitials(alt);
  const bgColor = stringToColor(alt);

  return (
    <div
      className={`${baseClasses} ${bgColor} flex items-center justify-center font-semibold text-white`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <span className="text-inherit" style={{ fontSize: `${size * 0.4}px` }}>
        {initials}
      </span>
    </div>
  );
}
