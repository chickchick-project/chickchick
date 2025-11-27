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
      images: [{ url: finalImage, width: 800, height: 600 }],
      type: "website",
    },
  };
}
