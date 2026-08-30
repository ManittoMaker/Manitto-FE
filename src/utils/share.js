// 구형 인앱 브라우저(navigator.clipboard 미지원) 대비 최후의 복사 수단
const copyWithExecCommand = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("클립보드 복사에 실패했습니다.");
};

// 모바일에서는 네이티브 공유 시트(navigator.share)를 우선 사용하고,
// 미지원 환경이나 사용자가 취소한 경우 클립보드 복사로 폴백
export const shareOrCopy = async (text) => {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (error) {
      // 사용자가 공유 시트를 닫은 경우 — 복사로 이어가지 않고 조용히 종료
      if (error.name === "AbortError") return "cancelled";
      // 그 외 실패(권한 등)는 클립보드 폴백 시도
    }
  }
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      // 권한 거부(transient activation 소실 등) 시 execCommand 폴백 진행
    }
  }
  copyWithExecCommand(text);
  return "copied";
};
