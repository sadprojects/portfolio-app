import {
  Apple,
  BatteryFull,
  Bluetooth,
  Search,
  Volume2,
  Wifi,
} from 'lucide-react';
import { useSyncExternalStore } from 'react';
import styled from 'styled-components';

import { MENU_BAR_HEIGHT } from './laptopArtwork';

const APP = 'Preview';
const MENUS = ['File', 'Edit', 'View', 'Go', 'Tools', 'Window', 'Help'];
const MINUTE_MS = 60_000;

const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${MENU_BAR_HEIGHT}%;
  display: flex;
  align-items: center;
  gap: 1.1em;
  padding: 0 1.2%;
  background: ${({ theme }) => `${theme.colors.card}f2`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: clamp(0.45rem, 0.75vw, 0.75rem);
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.foreground};
  white-space: nowrap;

  svg {
    width: 1.15em;
    height: 1.15em;
  }
`;

const AppName = styled.span`
  font-weight: 700;
`;

const Status = styled.span`
  display: flex;
  align-items: center;
  gap: 0.9em;
  margin-left: auto;
`;

/* The clock ticks once a minute, from a snapshot that only changes then. */
const everyMinute = (onTick: () => void) => {
  const ticker = setInterval(onTick, MINUTE_MS);
  return () => clearInterval(ticker);
};
const currentMinute = () => Math.floor(Date.now() / MINUTE_MS);

const MenuClock = () => {
  const minute = useSyncExternalStore(everyMinute, currentMinute);
  const now = new Date(minute * MINUTE_MS);
  const day = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(now);
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
  return (
    <span>
      {day}&ensp;{time}
    </span>
  );
};

/** The strip along the top of the laptop's screen: the app's menus, the status icons, the clock. */
export const MenuBar = () => (
  <Bar aria-hidden="true">
    <Apple />
    <AppName>{APP}</AppName>
    {MENUS.map((menu) => (
      <span key={menu}>{menu}</span>
    ))}
    <Status>
      <Bluetooth />
      <Wifi />
      <Volume2 />
      <BatteryFull />
      <Search />
      <MenuClock />
    </Status>
  </Bar>
);
