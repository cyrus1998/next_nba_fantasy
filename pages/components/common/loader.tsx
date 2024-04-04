import React from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

export default function Loading () {
    return(
          <Dimmer active inverted>
        <Loader size='large'>Loading</Loader>
      </Dimmer>
    )
} 


