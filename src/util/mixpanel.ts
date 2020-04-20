//@ts-ignore
import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.MIXPANEL_TOKEN);

let env_check = typeof document !== "undefined";
let is_dev = process.env.NODE_ENV === "development";

let actions = {
  //@ts-ignore
  identify: id => {
    if (env_check) mixpanel.identify(id);
  },
  //@ts-ignore
  alias: id => {
    if (env_check) mixpanel.alias(id);
  },
  //@ts-ignore
  track: (name, props) => {
    if (env_check) mixpanel.track(name, { ...props, is_dev });
  },
  people: {
    //@ts-ignore
    set: props => {
      if (env_check) mixpanel.people.set(props);
    }
  }
};

export default actions;
