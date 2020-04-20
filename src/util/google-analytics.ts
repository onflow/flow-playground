import ReactGA from "react-ga";

export const initialize = (trackingCode: string) => {
  ReactGA.initialize(trackingCode);
};

export const pageview = (location: any) => {
  const page = location.pathname + location.search
  ReactGA.pageview(page);
};
