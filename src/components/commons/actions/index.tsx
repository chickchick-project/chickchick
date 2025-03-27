export const ACTION_TYPES = {
  EDIT: "edit",
  DELETE: "delete",
  REPLY: "reply",
  SUBMIT: "submit",
} as const;

export const ACTION_SIZES = {
  DEFAULT: "default",
  LARGE: "large",
} as const;

const DEFAULT_LABEL: Record<ActionType, string> = {
  [ACTION_TYPES.EDIT]: "수정",
  [ACTION_TYPES.DELETE]: "삭제",
  [ACTION_TYPES.REPLY]: "답글",
  [ACTION_TYPES.SUBMIT]: "완료",
};

const ACTION_SIZE_STYLES = {
  [ACTION_SIZES.DEFAULT]: "text-label-1",
  [ACTION_SIZES.LARGE]: "text-body-1",
};

type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

type ActionSize = (typeof ACTION_SIZES)[keyof typeof ACTION_SIZES];

interface ActionItem {
  type: ActionType;
  label?: string;
  onClick: () => void;
}

interface ActionsProps {
  actions: ActionItem[];
  size?: ActionSize;
}

export const Actions = ({ actions, size = "default" }: ActionsProps) => {
  return (
    <div className="flex gap-3 items-center">
      {actions.map(({ type, label, onClick }, index) => (
        <>
          {index !== 0 && <span className="bg-gray-200 h-3 w-[1px]"></span>}
          <button
            className={`text-black-300 ${ACTION_SIZE_STYLES[size]}`}
            key={type}
            onClick={onClick}
          >
            {label ?? DEFAULT_LABEL[type]}
          </button>
        </>
      ))}
    </div>
  );
};
