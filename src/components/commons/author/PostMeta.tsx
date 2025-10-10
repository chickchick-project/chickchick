import React from "react";
import IconBadge from "../author/IconBadge";
import ICONS from "@/lib/constants/icons";
import { PostMetaProps } from "./author.types";

export default function PostMeta({ meta }: PostMetaProps) {
  return (
    <div className="flex gap-2">
      {meta.map((item) => (
        <IconBadge
          key={item.type}
          iconSrc={ICONS[item.type]?.src || ""}
          altText={item.type}
          count={item.count}
        />
      ))}
    </div>
  );
}
