interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function Button({
  label,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded text-sm font-medium transition-colors";

  const variants = {
    primary: baseClasses + " bg-blue-600 text-white hover:bg-blue-700",
    secondary: baseClasses + " bg-gray-200 text-gray-900 hover:bg-gray-300",
  };

  return (
    <button className={variants[variant]} onClick={onClick}>
      {label}
    </button>
  );
}
