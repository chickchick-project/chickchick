interface BookmarkIconProps {
  isActive?: boolean;
}

export const BookmarkIcon = ({ isActive = false }: BookmarkIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 9.5278C4 6.92197 4 5.61906 4.87868 4.80953C5.75736 4 7.17157 4 10 4H14C16.8284 4 18.2426 4 19.1213 4.80953C20 5.61906 20 6.92197 20 9.5278V15.8181C20 18.2902 20 19.5263 19.1557 19.9043C18.3114 20.2824 17.2565 19.5187 15.1465 17.9914L14.4713 17.5026C13.2849 16.6438 12.6917 16.2144 12 16.2144C11.3083 16.2144 10.7151 16.6438 9.52871 17.5026L8.85346 17.9914C6.74355 19.5187 5.68859 20.2824 4.84429 19.9043C4 19.5263 4 18.2902 4 15.8181V9.5278Z"
        fill={isActive ? "currentColor" : "#FFFFFF"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
};
