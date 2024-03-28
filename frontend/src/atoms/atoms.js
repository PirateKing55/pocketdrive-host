import { atom, atomFamily, selector } from "recoil";

export const collectionsState = atom({
  key: "collectionsState",
  default: [],
});

export const initialCollectionsState = atom({
  key: "initialCollectionsState",
  default: [],
});

export const itemsState = atom({
  key: "itemsState",
  default: [],
});

export const collectionsStateFamily = atomFamily({
  key: "collectionsStateFamily",
  default: [],
});
