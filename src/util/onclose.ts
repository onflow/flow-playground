import Mixpanel from "../util/mixpanel";

export const registerOnCloseSaveMessage = () => {
  if (typeof document !== "undefined") {
    window.onbeforeunload = () => {
      Mixpanel.track("Project closed", {});
      return "You have unsaved work in the playground, are you sure you want to exit?";
    };
  }
};

export const unregisterOnCloseSaveMessage = () => {
  if (typeof document !== "undefined") {
    window.onbeforeunload = null;
  }
};
