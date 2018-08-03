import * as React from 'react';

export const { Consumer, Provider } = React.createContext({
  // on client we don't require HeadCollector
  list: [],
  addClientInstance: () => -1,
  addServerTag: () => {},
  removeClientInstance: () => {},
});
