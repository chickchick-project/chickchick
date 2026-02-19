import { Option } from "../../../lib/constants/options";
interface IDropdownMenuProps {
  options: Option[];
  handleSelectOption: (option: Option) => void;
}

export default function DropdownMenu({
  options,
  handleSelectOption,
}: IDropdownMenuProps) {
  return (
    <>
      <ul
        className="absolute mt-1 right-0 w-full px-2 py-2 flex flex-col gap-1 border bg-white border-gray-200 rounded-md tablet:rounded-lg text-black-200 z-10"
        role="menu"
      >
        {options.map((option: Option) => (
          <li
            onClick={() => handleSelectOption(option)}
            className="list-none py-1 text-label-1 tablet:text-body-2 font-medium hover:bg-gray-300 rounded-md tablet:rounded-lg cursor-pointer"
            key={`${option.value}`}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectOption(option);
              }
            }}
          >
            <div className="tablet:px-2">{option.label}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
