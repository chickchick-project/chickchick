"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useModalStore, MODAL_KEYS } from "@/lib/stores/useModalStore";

interface PageWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useModalStore();

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl");

    if (callbackUrl) {
      openModal(MODAL_KEYS.LOGIN);

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("callbackUrl");

      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;

      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, openModal, router, pathname]);

  return <div className={className}>{children}</div>;
}
