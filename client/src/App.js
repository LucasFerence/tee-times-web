import React from 'react';
import { MantineProvider } from '@mantine/core';

import Clubs from './views/Clubs';

class App extends React.Component {

  render() {
    return (
      <MantineProvider>
        
        <Clubs />

      </MantineProvider>
    );
  }
}

export default App;
