import React, { createContext } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';

interface AnnouncementContextValue {
  isVisible: boolean;
  toggleAnnouncement: () => void;
}

// Create a context
const AnnouncementContext: React.Context<AnnouncementContextValue> = createContext(null);

const COOKIE_NAME = 'stable-cadence-announcement-dismissed'

// Create a context provider component
const _AnnounecementProvider: React.FC = ({ children }) => {
  const [cookies, setIsVisible] = useCookies([COOKIE_NAME]);
  const isVisible = !cookies[COOKIE_NAME];

  // in 7 days
  const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const toggleAnnouncement = () => {
    setIsVisible(COOKIE_NAME, !isVisible, {expires: futureDate});
  };

  return (
    <AnnouncementContext.Provider value={{ isVisible, toggleAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

const AnnouncementProvider: React.FC = ({children}) => {
  return (
    <CookiesProvider>
      <_AnnounecementProvider>{children}</_AnnounecementProvider>
    </CookiesProvider>
  )
}

export { AnnouncementProvider, AnnouncementContext };