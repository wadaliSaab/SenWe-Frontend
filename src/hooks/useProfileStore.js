
import profileStore from "../store/profileStore";


export function useProfileStore() {
  return {
  
    settingActions: profileStore((state) => state.settingActions),

    scheduledMessages: profileStore((state) => state.scheduledMessages),

    groupPassword: profileStore((state) => state.groupPassword),

    


    setSettingActions: profileStore(
      (state) => state.setSettingActions
    ),

    setScheduledMessages: profileStore(
      (state) => state.setScheduledMessages
    ),

    setGroupPassword: profileStore(
      (state) => state.setGroupPassword
    ),

    clearSettingActions: profileStore(
      (state) => state.clearSettingActions
    ),

    resetProfileStore: profileStore(
      (state) => state.resetProfileStore
    ),
  
  };
}