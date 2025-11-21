// components/common/Toast.tsx
import { useEffect } from "react";

interface Props {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
      {message}
    </div>
  );
}
