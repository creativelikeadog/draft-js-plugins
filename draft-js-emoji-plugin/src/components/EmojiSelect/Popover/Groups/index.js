import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import Group from './Group';

export default class Groups extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    emojis: PropTypes.object.isRequired,
    checkMouseDown: PropTypes.func.isRequired,
    onEmojiSelect: PropTypes.func.isRequired,
    onEmojiMouseDown: PropTypes.func.isRequired,
    onGroupScroll: PropTypes.func.isRequired,
    useNativeArt: PropTypes.bool,
  };

  componentDidMount() {
    this.calculateBounds();
  }

  componentDidUpdate() {
    this.calculateBounds();
  }

  onScroll = (values) => {
    const { groups, onGroupScroll } = this.props;
    let activeGroup = 0;
    groups.forEach((group, index) => {
      if (values.scrollTop >= group.top) {
        activeGroup = index;
      }
    });
    onGroupScroll(activeGroup);
  }

  onWheel = (e) => {
    // Disable page scroll, but enable groups scroll
    const { clientHeight, scrollHeight, scrollTop } = this.scrollbars.getValues();
    if (e.deltaY > 0) {
      if (scrollTop < scrollHeight - clientHeight - e.deltaY) {
        e.stopPropagation();
      } else {
        this.scrollbars.scrollToBottom();
      }
    } else {
      if (scrollTop > -e.deltaY) { // eslint-disable-line no-lonely-if
        e.stopPropagation();
      } else {
        this.scrollbars.scrollTop();
      }
    }
  }

  scrollToGroup = (groupIndex) => {
    const { groups } = this.props;

    this.scrollbars.scrollTop(groups[groupIndex].topList);
  }

  calculateBounds = () => {
    const { scrollHeight, scrollTop } = this.scrollbars.getValues();
    if (scrollHeight) {
      const { groups } = this.props;
      const containerTop = this.container.getBoundingClientRect().top - scrollTop;

      groups.forEach((group) => {
        const groupTop = group.instance.container.getBoundingClientRect().top;
        const listTop = group.instance.list.getBoundingClientRect().top;
        group.top = groupTop - containerTop; // eslint-disable-line no-param-reassign
        group.topList = listTop - containerTop; // eslint-disable-line no-param-reassign
      });
    }
  }

  render() {
    const {
      theme = {},
      groups = [],
      emojis,
      checkMouseDown,
      onEmojiSelect,
      onEmojiMouseDown,
      useNativeArt,
    } = this.props;

    return (
      <div
        className={theme.emojiSelectPopoverGroups}
        onWheel={this.onWheel}
        ref={(element) => { this.container = element; }}
      >
        <Scrollbars
          onScrollFrame={this.onScroll}
          renderTrackVertical={() => (
            <div className={theme.emojiSelectPopoverScrollbar} />
          )}
          renderThumbVertical={(props) => (
            <div {...props} className={theme.emojiSelectPopoverScrollbarThumb} />
          )}
          ref={(element) => { this.scrollbars = element; }}
        >
          {groups.map((group, index) => (
            <Group
              key={
                `group#${index}[${group.categories.join(',')}]` // eslint-disable-line react/no-array-index-key
              }
              theme={theme}
              group={group}
              emojis={emojis}
              checkMouseDown={checkMouseDown}
              onEmojiSelect={onEmojiSelect}
              onEmojiMouseDown={onEmojiMouseDown}
              ref={(element) => {
                group.instance = element; // eslint-disable-line no-param-reassign
              }}
              useNativeArt={useNativeArt}
            />
          ))}
        </Scrollbars>
      </div>
    );
  }
}
