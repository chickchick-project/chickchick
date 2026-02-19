import { Metadata } from "next";

interface IMetaParams {
  title: string;
  description: string;
  image?: string | null;
  url?: string;
}

export function generateSeo({
  title,
  description,
  image,
  url,
}: IMetaParams): Metadata {
  const finalImage = image || "/images/LogoForShare.png";

  return {
    title: `${title} | ChickChick`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      images: [{ url: finalImage, width: 1200, height: 630, alt: title }],
      type: "website",
      siteName: "ChickChick",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [finalImage],
    },
  };
}
