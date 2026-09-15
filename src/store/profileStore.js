import { create } from "zustand";


const ProfileStore = create(

    (set) => ({
      settingActions: [],
      scheduledMessages: [],
      groupPassword: "",

      setSettingActions: (actions) =>
        set({ settingActions: actions }),

      setScheduledMessages: (messages) =>
        set({ scheduledMessages: messages }),

      setGroupPassword: (password) => set({ groupPassword: password }),
      clearSettingActions: () =>
        set({ settingActions: [] }),

      resetProfileStore: () =>
  set({
    settingActions: [],
    scheduledMessages: [],
  }),
    }),
   
  )


export default ProfileStore;