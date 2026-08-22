"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (
      session?.user?.mustChangePassword &&
      pathname !== "/dashboard/ganti-password"
    ) {
      router.push("/dashboard/user/gantipass");
    }
  }, [session, pathname]);

  return <>{children}</>;
}
