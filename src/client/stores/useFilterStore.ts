import { create } from "zustand";

interface FilterStore {
  committedFilters: Record<string, string[]>;
  pendingFilters: Record<string, string[]>;

  handlePendingChange: (category: string, value: string) => void;
  resetPending: () => void;
  commitFilters: (category: string) => void;
  cancelPending: (category: string) => void;
  initializePending: () => void;

  // 개별 필터 항목 제거 (FilterList에서 사용)
  closeFilter: (id: string) => void;
  // 전체 필터 초기화
  resetFilters: () => void;

  // 레거시 호환성 (기존 코드와의 호환)
  filters: Record<string, string[]>;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  committedFilters: {},
  pendingFilters: {},

  // Pending 필터 변경 (토글)
  handlePendingChange: (category, value) =>
    set((state) => {
      const newPending = { ...state.pendingFilters };
      const prevArray = newPending[category] ?? [];

      const nextArray = prevArray.includes(value)
        ? prevArray.filter((v) => v !== value)
        : [...prevArray, value].sort();

      if (nextArray.length === 0) {
        delete newPending[category];
      } else {
        newPending[category] = nextArray;
      }

      return { pendingFilters: newPending };
    }),

  // Pending 초기화 (모달 내 "초기화" 버튼)
  resetPending: () =>
    set(() => ({
      pendingFilters: {},
    })),

  // Pending → Committed 적용 (모달 제출)
  commitFilters: (category) =>
    set((state) => {
      const newCommitted = { ...state.committedFilters };
      const pendingValue = state.pendingFilters[category];

      if (pendingValue && pendingValue.length > 0) {
        newCommitted[category] = pendingValue;
      } else {
        delete newCommitted[category];
      }

      return {
        committedFilters: newCommitted,
      };
    }),

  // 모달 취소 시 Pending 복원 (모달 열 때 committed 상태로 동기화)
  cancelPending: (category) =>
    set((state) => {
      const newPending = { ...state.pendingFilters };
      const committedValue = state.committedFilters[category];

      if (committedValue && committedValue.length > 0) {
        newPending[category] = [...committedValue]; // 복사본 생성
      } else {
        delete newPending[category];
      }

      return { pendingFilters: newPending };
    }),

  // 모달 열 때 전체 pending을 committed로 동기화
  initializePending: () =>
    set((state) => ({
      pendingFilters: JSON.parse(JSON.stringify(state.committedFilters)),
    })),

  // 개별 필터 제거 (FilterList의 X 버튼)
  closeFilter: (id) =>
    set((state) => {
      const newCommitted = { ...state.committedFilters };
      for (const category in newCommitted) {
        const values = newCommitted[category];
        if (values.includes(id)) {
          const nextArray = values.filter((v) => v !== id);
          if (nextArray.length === 0) {
            delete newCommitted[category];
          } else {
            newCommitted[category] = nextArray;
          }
        }
      }
      // pending도 동기화
      const newPending = { ...state.pendingFilters };
      for (const category in newPending) {
        const values = newPending[category];
        if (values.includes(id)) {
          const nextArray = values.filter((v) => v !== id);
          if (nextArray.length === 0) {
            delete newPending[category];
          } else {
            newPending[category] = nextArray;
          }
        }
      }
      return { committedFilters: newCommitted, pendingFilters: newPending };
    }),

  // 전체 필터 초기화
  resetFilters: () =>
    set({
      committedFilters: {},
      pendingFilters: {},
    }),

  // 레거시 호환성
  get filters() {
    return get().committedFilters;
  },
}));
