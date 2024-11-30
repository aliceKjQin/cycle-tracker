"use client";

import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Logout() {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  if (pathname === "/") {
    return (
      <Link href={"/dashboard"} className="font-bold textGradient">
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href={"/dashboard"}
      className="font-bold textGradient"
      onClick={logout}
    >
      Logout
    </Link>
  );
}
