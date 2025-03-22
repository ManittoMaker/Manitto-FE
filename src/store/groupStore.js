import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGroupStore = create(
  persist(
    (set) => ({
      groupId: "",
      groupName: "",
      leaderName: "",
      groupPassword: "",
      matches: [],
      setGroupInfo: ({ groupId, groupName, leaderName, groupPassword }) =>
        set({ groupId, groupName, leaderName, groupPassword }),
      setMatches: (matches) => set({ matches }), 
    }),
    {
      name: "group-storage",
    }
  )
);

export default useGroupStore;
