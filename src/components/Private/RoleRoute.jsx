"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
     if (status === "unauthenticated") {
      router.push("/login");
    } else if (
      status === "authenticated" && 
      !allowedRoles.includes(session?.user?.role)
    ) {

      router.push("/");
    }
  }, [session, status, router, allowedRoles]);


  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  if (status === "authenticated" && allowedRoles.includes(session?.user?.role)) {
    return <>{children}</>;
  }

  return null;
};

export default RoleRoute;