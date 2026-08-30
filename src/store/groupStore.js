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
      // 그룹별 공유 완료 상태 — { [groupId]: { [giver]: true } }
      // 새로고침해도 "누구에게 보냈는지" 체크 표시가 유지되도록 persist에 포함
      sentStatusByGroup: {},
      setGroupInfo: ({ groupId, groupName, leaderName, groupPassword }) =>
        set({ groupId, groupName, leaderName, groupPassword }),
      setMatches: (matches) => set({ matches }),
      markSent: (groupId, giver) =>
        set((state) => ({
          sentStatusByGroup: {
            ...state.sentStatusByGroup,
            [groupId]: { ...state.sentStatusByGroup[groupId], [giver]: true },
          },
        })),
    }),
    {
      name: "group-storage",
    }
  )
);

export default useGroupStore;
