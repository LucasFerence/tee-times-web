import React from 'react';
import { MantineProvider, Button } from '@mantine/core';

import bookTime from './services/TeeTimeService'

class App extends React.Component {

  render() {
    return (
      <MantineProvider
        theme = {{
          
          colors: {
            'masters-green': ['#006747', '#006747', '#006747', '#006747', '#006747', '#006747', '#006747']
          }
        }}
      >
  
        <Button color="masters-green" onClick={bookTime}>Book time test</Button>
  
      </MantineProvider>
    );
  }
}

export default App;
