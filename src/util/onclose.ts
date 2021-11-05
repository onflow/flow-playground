import Mixpanel from "util/mixpanel";

export const registerOnCloseSaveMessage = () => {
  window.onbeforeunload = () => {
    Mixpanel.track("Project closed", {});
    return "You have unsaved work in the playground, are you sure you want to exit?";
  };
};

export const unregisterOnCloseSaveMessage = () => {
  window.onbeforeunload = null;
};
