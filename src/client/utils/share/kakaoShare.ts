// Kakao SDK 동적 로딩 함수
const loadKakaoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 바로 resolve
    if (window.Kakao && window.Kakao.isInitialized()) {
      resolve();
      return;
    }

    // 스크립트가 이미 존재하는지 확인
    const existingScript = document.querySelector(
      'script[src="https://developers.kakao.com/sdk/js/kakao.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
        }
        resolve();
      });
      return;
    }

    // 새 스크립트 추가
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
      }
      resolve();
    };
    script.onerror = () => reject(new Error("Kakao SDK 로드 실패"));
    document.head.appendChild(script);
  });
};

const kakaoShare = async () => {
  try {
    // Kakao SDK 동적 로딩
    await loadKakaoSDK();

    if (!window.Kakao || !window.Kakao.isInitialized()) {
      console.error("Kakao SDK가 초기화되지 않았습니다.");
      return;
    }
  } catch (error) {
    console.error("Kakao SDK 로드 중 오류:", error);
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
