// "use client";

// import { useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter, usePathname } from "next/navigation";

// export default function AuthGuard({ children }: { children: React.ReactNode }) {
//   const { data: session } = useSession();

//   const router = useRouter();

//   const pathname = usePathname();

//   useEffect(() => {
//     if (
//       session?.user?.mustChangePassword &&
//       pathname !== "/dashboard/ganti-password"
//     ) {
//       router.push("/dashboard/user/gantipass");
//     }
//   }, [session, pathname]);

//   return <>{children}</>;
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    // Belum login
    if (!token || !userString) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(userString);

      // Wajib ganti password
      if (user.mustChangePassword && pathname !== "/dashboard/user/gantipass") {
        router.replace("/dashboard/user/gantipass");
        return;
      }

      setChecking(false);
    } catch (error) {
      console.error("AUTH GUARD ERROR:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.replace("/login");
    }
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
