const handleShare = async () => {
  try {
    const currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    alert("링크가 클립보드에 복사되었습니다!");
  } catch (err) {
    console.error("링크 복사 실패:", err);
    alert("링크 복사에 실패했습니다.");
  }
};

export default handleShare;
