'use client';

import { useRef } from 'react';

import { ServerState, useServer } from '@/store/serverStore';

export const ZustandProvider = ({
  serverState,
}: {
  serverState: ServerState;
}) => {
  const initialized = useRef(false);
  if (!initialized.current) {
    useServer.setState({ ...serverState });
    initialized.current = true;
  }
  return null;
};
