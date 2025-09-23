/**
 * 병렬 라우팅의 기본 슬롯 컴포넌트
 *
 * 이 파일은 Next.js 병렬 라우팅에서 필요한 default.tsx 파일입니다.
 * 병렬 라우팅에서 특정 슬롯이 매치되지 않을 때 이 컴포넌트가 렌더링됩니다.
 *
 * 현재 구현에서는 모든 슬롯이 searchParams의 tab 값에 따라
 * 조건부 렌더링되므로, 이 컴포넌트는 null을 반환합니다.
 *
 * 관련 슬롯들:
 * - @collection: 컬렉션 탭
 * - @bookmarks: 북마크 탭
 * - @activity: 활동 탭
 * - @profile: 프로필 탭
 */
export default function Default() {
  return null;
}