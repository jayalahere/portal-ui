/* @flow */
/* eslint fp/no-class:0 */

import React from 'react';
import Relay from 'react-relay';

import FilePage from 'containers/FilePage';
import { prepareNodeParams } from 'routes/utils';
import { nodeQuery } from 'routes/queries';

class FileRoute extends Relay.Route {
  static routeName = 'FilePageRoute';
  static queries = nodeQuery;
  static prepareParams = prepareNodeParams('File');
}

export default (props: mixed) => (
  <Relay.Renderer
    Container={FilePage}
    queryConfig={new FileRoute(props)}
    environment={Relay.Store}
  />
);
