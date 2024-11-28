"use client";
import Link from "next/link";
import React from "react";
import Button from "./sharedUI/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function CallToAction() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return (
      <div className="max-w-[600px] mx-auto w-full">
        <Link href="/dashboard">
          <Button dark full text="Go to dashboard" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-fit mx-auto">
      <Link href="/dashboard">
        <Button text="Login / Register" dark />
      </Link>
    </div>
  );
}
