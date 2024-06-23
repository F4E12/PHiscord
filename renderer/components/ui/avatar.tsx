interface AvatarProps {
  src: string;
  alt?: string;
  fallback?: string;
}

function Avatar({ src, alt, fallback }: AvatarProps) {
  return (
    <div className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full">
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full" />
      ) : (
        <span className="text-gray-500">{fallback}</span>
      )}
    </div>
  );
}

export default Avatar;
