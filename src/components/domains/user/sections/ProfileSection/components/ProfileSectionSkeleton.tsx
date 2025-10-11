export const ProfileSectionSkeleton = () => {
  return (
    <div className="w-full flex flex-row items-start gap-12 p-[120px]">
      {/* 프로필 이미지 영역 */}
      <div className="w-1/3 flex-shrink-0">
        <div className="flex flex-col items-center gap-4">
          <div className="w-40 h-40 bg-gray-200 animate-pulse rounded-full" />
        </div>
      </div>

      {/* 개인정보 폼 영역 */}
      <div className="w-2/3 flex-grow">
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* 폼 필드 그리드 레이아웃 */}
          <div className="grid grid-cols-[100px_200px] justify-center items-center gap-y-3 gap-x-6">
            {/* 닉네임 */}
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />

            {/*  나이 */}
            <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-[117px] bg-gray-200 rounded-lg animate-pulse" />

            {/*  성별 */}
            <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-[117px] bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* 하단 버튼 영역 레이아웃 */}
          <div className="flex justify-center items-center gap-2 mt-20">
            <div className="flex gap-2 w-[368px]">
              {/* 탈퇴/수정 */}
              <div className="h-[43px] w-full bg-gray-200 rounded-full animate-pulse" />
              <div className="h-[43px] w-full bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
