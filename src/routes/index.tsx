import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // React Router + canvas/DND libs touch `document` at module scope, so we
  // load the whole app dynamically in the browser only.
  const [App, setApp] = useState<ComponentType | null>(null);
  useEffect(() => {
    import("../app/App").then((m) => setApp(() => m.default));
  }, []);
  if (!App) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-kid-page">
        <div className="text-lg font-bold text-primary"> ...جاري التحميل</div>
      </div>
    );
  }
  return <App />;
}
