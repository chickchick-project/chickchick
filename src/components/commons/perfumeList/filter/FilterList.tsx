import Image from "next/image";
import { useFilterStore } from "@/client/stores/perfumeStore";
import { useVisibilityStore } from "@/client/stores/uiStore";
import ICONS from "@/shared/constants/icons";
import { Option } from "@/shared/constants/options";
import ListModal from "../modal/ListModal";

type FilterOptions = {
  gender: Option[];
  brand?: Option[];
  notes: Option[];
  accords: Option[];
};

const FilterList = ({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) => {
  const committedFilters = useFilterStore((state) => state.committedFilters);
  const closeFilter = useFilterStore((state) => state.closeFilter);
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const { isOpen, open, close } = useVisibilityStore();

  const hasActiveFilters = Object.values(committedFilters).some(
    (set) => set.length > 0
  );

  const filterIcon = hasActiveFilters ? ICONS.FilterPrimary : ICONS.FilterGray;

  return (
    <>
      <button
        type="button"
        disabled={!hasActiveFilters}
        onClick={() => open("list")}
        className={`flex items-center gap-2 tablet:px-3 tablet:py-2 p-2 rounded-md border h-fit self-end  ${
          hasActiveFilters
            ? "border-primary-200 text-primary-200 hover:bg-gray-300"
            : "border-gray-100 text-gray-100"
        }`}
      >
        <Image
          src={filterIcon.src}
          alt={filterIcon.alt}
          width={20}
          height={20}
          className="object-contain tablet:w-5 tablet:h-5 w-4 h-4"
        />
        <span className="tablet:block hidden">필터 목록</span>
      </button>
      <ListModal
        visible={isOpen("list")}
        close={() => close("list")}
        filters={committedFilters}
        filterOptions={filterOptions}
        closeFilter={closeFilter}
        resetFilters={resetFilters}

      />
    </>
  );
};

export default FilterList;
