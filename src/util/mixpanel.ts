import mixpanel from "mixpanel-browser";
import {Dict} from "mixpanel-browser"
mixpanel.init(process.env.MIXPANEL_TOKEN);

let is_dev = process.env.NODE_ENV === "development";

let actions = {
  identify(id: string) {
    if (is_dev)
      return
    mixpanel.identify(id);
  },
  alias(id: string) {
    if (is_dev)
      return
    mixpanel.alias(id);
  },
  track(name: string, props: Dict) {
    if (is_dev)
      return
    mixpanel.track(name, { ...props, is_dev });
  },
  people: {
    set: (props: Dict) => {
      if (is_dev)
        return
      mixpanel.people?.set(props);
    }
  }
};

export default actions;
