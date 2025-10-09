export const ProfileRow = ({
  label,
  isRequired = false,
  children,
  htmlFor,
}: {
  label: string;
  isRequired?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}) => (
  <>
    {htmlFor ? (
      <label htmlFor={htmlFor} className="text-sm text-gray-600">
        {label}
        {isRequired && <span className="text-red">*</span>}
      </label>
    ) : (
      <p className="text-sm text-gray-600">{label}</p>
    )}
    {children}
  </>
);
