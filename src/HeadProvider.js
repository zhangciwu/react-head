import * as React from 'react';
import PropTypes from 'prop-types';
import { Provider } from './headTagsContext';

const cascadingTags = ['title', 'meta'];

export default class HeadProvider extends React.Component {
  static propTypes = {
    headTags: PropTypes.array,
    children: PropTypes.node.isRequired,
  };

  headInstances = [];

  componentDidMount() {
    const ssrTags = document.head.querySelectorAll(`[data-rh=""]`);
    ssrTags.forEach(e => e.remove());
  }

  componentWillUnmount() {
    this.headInstances = [];
  }

  findLastDuplicatedInstance(tag, name, toSet) {
    const { headInstances } = this;
    for (let i = headInstances.length - 1; i >= 0; i -= 1) {
      const ins = headInstances[i];
      if (ins.props.tag === tag && ins.props.name === name) {
        ins.setState(toSet);
        break;
      }
    }
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
    addClientInstance: instance => {
      const { headInstances } = this;

      if (cascadingTags.indexOf(instance.props.tag) > -1) {
        this.findLastDuplicatedInstance(
          instance.props.tag,
          instance.props.name,
          {
            discarded: true, // discarded component renders null.
          }
        );
      }
      headInstances.push(instance);
    },

    removeClientInstance: instance => {
      const { headInstances } = this;
      const index = headInstances.indexOf(instance);
      if (index > -1) {
        headInstances.splice(index, 1);
      }
      if (cascadingTags.indexOf(instance.props.tag) > -1) {
        this.findLastDuplicatedInstance(
          instance.props.tag,
          instance.props.name,
          {
            discarded: false,
          }
        );
      }
    },
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

HeadProvider.defaultProps = {
  headTags: [],
};
