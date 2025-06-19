import React from "react";

interface StatusDotProps {
  status: string;
}

const statusColors: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-600",
  unknown: "bg-gray-500",
};

const StatusDot: React.FC<StatusDotProps> = ({ status }) => {
  const colorClass = statusColors[status] || statusColors.unknown;

  return (
    <span
      aria-label={`Status: ${status}`}
      className={`w-2 h-2 rounded-full animate-pulse inline-block ${colorClass}`}
    />
  );
};

export default StatusDot;