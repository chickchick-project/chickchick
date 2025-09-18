import { JsonValue } from "@prisma/client/runtime/library";
import { Option } from "@/lib/constants/options";

interface LocalizedName {
  en: string;
  ko?: string;
}

interface FilterOptionMeta {
  selectedOption: Option;
  currentOption?: string;
}

const typedKeys = <T extends object>(obj: T): Array<keyof T> =>
  Object.keys(obj) as Array<keyof T>;

const toOption = (item: { id: string; name: JsonValue }) => {
  const name = item.name as unknown as LocalizedName;
  return {
    label: name.ko ? name.ko : name.en,
    value: item.id,
  };
};

const getFilterOptionMeta = (
  filters: string[],
  label: string
): FilterOptionMeta => {
  const selected = Array.from(filters);
  return {
    selectedOption: {
      label: selected.length > 0 ? `${label} ${selected.length}` : label,
      value: "",
    },
    currentOption: selected[0],
  };
};

export { typedKeys, toOption, getFilterOptionMeta };
