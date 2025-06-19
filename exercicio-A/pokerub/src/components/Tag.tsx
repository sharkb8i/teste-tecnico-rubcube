interface TagProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Tag({ label, icon, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm bg-neutral-700 text-white capitalize ${className}`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}