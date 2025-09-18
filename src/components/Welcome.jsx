import { useEffect, useState } from "react";

export default function Welcome() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const shown = localStorage.getItem("welcomeShown");
    if (shown) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      localStorage.setItem("welcomeShown", "true");
    }, 3000);

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
      </div>
    </section>
  );
}
