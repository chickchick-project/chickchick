interface ActionButtonsProps {
  isUploading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const ActionButtons = ({
  isUploading,
  onSave,
  onCancel,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-2 mt-2">
      <button
        type="button"
        onClick={onSave}
        disabled={isUploading}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {isUploading ? "저장 중..." : "이미지 저장"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isUploading}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        취소
      </button>
    </div>
  );
};
