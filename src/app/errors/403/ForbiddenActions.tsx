"use client";

import { useRouter } from "next/navigation";

export default function ForbiddenActions() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-8">
      <button
        type="button"
        onClick={handleBack}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          px-6
          py-3
          rounded-xl
          border
          border-slate-300
          bg-white
          text-slate-700
          font-semibold
          transition
          hover:bg-slate-50
          hover:border-slate-400
          active:scale-[0.98]
        "
      >
        ← Kembali
      </button>

      <button
        type="button"
        onClick={handleHome}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          px-6
          py-3
          rounded-xl
          bg-blue-600
          text-white
          font-semibold
          shadow-lg
          shadow-blue-600/20
          transition
          hover:bg-blue-700
          active:scale-[0.98]
        "
      >
        🏠 Dashboard
      </button>
    </div>
  );
}
