import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Consumer } from './headTagsContext';
import { isBrowser } from './common';

export default class HeadTag extends React.Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
  };

  state = {
    discarded: false,
  };

  headTags = null;
  domRef;
  hasAssignToProvider = false;

  constructor(props) {
    super(props);
    this.domRef = React.createRef();
  }

  componentWillUnmount() {
    this.headTags.removeClientInstance(this);
  }

  componentDidMount() {
    this.headTags.addClientInstance(this);
  }

  render() {
    const { tag: Tag, ...rest } = this.props;

    return (
      <Consumer>
        {headTags => {
          this.headTags = headTags;

          if (this.state.discarded) {
            return null;
          }

          if (isBrowser) {
            // if (!this.hasAssignToProvider) {
            const ClientComp = <Tag {...rest} ref={this.domRef} />;
            return ReactDOM.createPortal(ClientComp, document.head);
          }

          const ServerComp = <Tag data-rh="" {...rest} />;
          headTags.addServerTag(ServerComp);
          return null;
        }}
      </Consumer>
    );
  }
}
