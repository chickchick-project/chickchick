import { CollectionItem } from "../sections.type";

// 새 컬렉션 아이템이 추가되었을 때 호출
export const triggerCollectionAdded = (newCollection?: CollectionItem) => {
  const event = new CustomEvent("collection-added", {
    detail: newCollection,
  });
  window.dispatchEvent(event);
};

// 컬렉션 아이템이 삭제되었을 때 호출
export const triggerCollectionRemoved = (collectionId?: string) => {
  const event = new CustomEvent("collection-removed", {
    detail: { id: collectionId },
  });
  window.dispatchEvent(event);
};

// 컬렉션 데이터가 업데이트되었을 때 호출
export const triggerCollectionUpdated = () => {
  const event = new CustomEvent("collection-updated");
  window.dispatchEvent(event);
};
