import * as React from 'react';
import PropTypes from 'prop-types';
import { Provider } from './headTagsContext';

const cascadingTags = ['title', 'meta'];

export default class HeadProvider extends React.Component {
  static propTypes = {
    headTags: PropTypes.array,
    children: PropTypes.node.isRequired,
  };

  componentDidMount() {
    const ssrTags = document.head.querySelectorAll(`[data-rh=""]`);
    ssrTags.forEach(e => e.remove());
  }

  state = {
    addServerTag: tagNode => {
      const { headTags } = this.props;
      // tweak only cascading tags
      if (cascadingTags.indexOf(tagNode.type) !== -1) {
        const index = headTags.findIndex(
          prev =>
            prev.type === tagNode.type && prev.props.name === tagNode.props.name
        );
        if (index !== -1) {
          headTags.splice(index, 1);
        }
      }
      headTags.push(tagNode);
    },
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

HeadProvider.defaultProps = {
  headTags: [],
};
