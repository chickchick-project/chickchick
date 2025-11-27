const kakaoShare = () => {
  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error("Kakao SDK가 초기화되지 않았습니다.");
    return;
  }
  const title =
    document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute("content") ||
    document.title ||
    "ChickChick";

  const metaDesc = document
    .querySelector('meta[property="og:description"]')
    ?.getAttribute("content");
  let description = "향수 커뮤니티 ChickChick에서 이 글을 공유합니다!";

  if (metaDesc) {
    if (metaDesc.length > 100) {
      description = metaDesc.substring(0, 100) + "...";
    } else {
      description = metaDesc;
    }
  }

  let imageUrl =
    document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content") || "/images/LogoForShare.png";

  if (imageUrl.startsWith("/")) {
    imageUrl = window.location.origin + imageUrl;
  }

  const linkUrl = window.location.href;

  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: title,
      description: description,
      imageUrl: imageUrl,
      link: {
        mobileWebUrl: linkUrl,
        webUrl: linkUrl,
      },
    },
    buttons: [
      {
        title: "자세히 보기",
        link: {
          mobileWebUrl: linkUrl,
          webUrl: linkUrl,
        },
      },
    ],
  });
};

export default kakaoShare;
