import { useEffect, useState } from "react";

export default function Welcome({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <section className="absolute inset-0 z-10 flex h-screen flex-col justify-center bg-black p-6 font-mono text-green-400">
      <div className="loading-relaxed space-y-2 text-lg">
        <p className="typing" style={{ animationDelay: "0s" }}>
          Welcome to my React Homeworks.
        </p>
        <p className="typing" style={{ animationDelay: "2s" }}>
          Loading university labs...
        </p>
        <p className="typing" style={{ animationDelay: "4s" }}>
          Loading successful.
        </p>
      </div>
    </section>
  );
}
