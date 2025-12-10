import { Suspense } from "react";
import Step2SelectContent from "./content";

export default function Step2SelectPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-neutral-950">
          <p className="text-white">Loading...</p>
        </div>
      }
    >
      <Step2SelectContent />
    </Suspense>
  );
}
