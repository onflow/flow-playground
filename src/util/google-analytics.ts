import ReactGA from 'react-ga4';

export const initialize = (trackingCode: string) => {
  ReactGA.initialize([
    {
      trackingId: trackingCode,
    },
  ]);
};

export const pageview = (location: any) => {
  const page = location.pathname + location.search;
  ReactGA.send({ hitType: 'pageview', page });
};

export const event = (name: string) => {
  ReactGA.event({
    category: 'User',
    action: name,
  });
};
