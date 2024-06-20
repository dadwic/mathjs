import create from "zustand";

const useStore = create((set) => ({
  tags: [],
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (index) =>
    set((state) => ({ tags: state.tags.filter((_, i) => i !== index) })),
  updateTag: (index, newTag) =>
    set((state) => ({
      tags: state.tags.map((tag, i) => (i === index ? newTag : tag)),
    })),
}));

export default useStore;
