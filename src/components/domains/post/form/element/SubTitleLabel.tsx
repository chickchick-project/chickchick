interface ISubTitleLabelProps {
  label: string;
  htmlFor?: string;
  isRequired?: boolean;
  id?: string;
}

export default function SubTitleLabel({
  label,
  htmlFor,
  isRequired = false,
  id,
}: ISubTitleLabelProps) {
  const subTitleStyle = "text-black-100 text-title-1 font-semibold ";

  return htmlFor ? (
    <label className={subTitleStyle} htmlFor={htmlFor}>
      {label}
      {isRequired && <IsRequiredLabel />}
    </label>
  ) : (
    <h2 id={id} className={subTitleStyle}>
      {label}
      {isRequired && <IsRequiredLabel />}
    </h2>
  );
}

function IsRequiredLabel() {
  return (
    <span className="text-red ml-1" aria-hidden="true">
      *
    </span>
  );
}
