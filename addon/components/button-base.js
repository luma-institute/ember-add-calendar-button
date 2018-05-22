import Component from '@ember/component';
import layout from '../templates/components/button-base';
import moment from 'moment';
import {assert} from '@ember/debug';
import {get, getWithDefault, computed} from '@ember/object';
import {alias} from '@ember/object/computed';

export default Component.extend({
  layout,
  didRecieveAttrs() {
    this._super(...arguments);
    assert('`tagName` must be `a`', get(this, 'tagName') === 'a')
  },
  attributeBindings: ['href', 'target'],
  tagName: 'a',
  target: '_blank',
  href: computed('event.@each', function() {
    let event = get(this, 'event');
    let args = {
      startTime: _getstartTime(),
      duration: _getEndTime(),
      endTime: _getDuration(),
      location: get(event, 'location'),
      description: get(event, 'description'),
      title: get(event, 'title')
    };

    return this.generateHref(args);
  }),

  /**
   * Just pass click event up the chain
   * @private
   */
  click(event) {
    get(this, 'onClick')(event);
  },
  //Properties
  _getStartTime() {
    let start = get(this, 'event.start');
    return (moment.isMoment(start)) ? start : moment(start);
  }),
  _getEndTime() {
    let start = get(this, 'event.start');
    let end = get(this, 'event.end') || false;

    if (end) {
      return (moment.isMoment(end)) ? end : moment(end);
    }

    return start.add(90, 'minutes');
  }),

  _getDuration() {
    if (get(this, 'event.duration')) {
      return get(this, 'event.duration');
    }

    let start = this._getStartTime(),
        end = this._getEndTime();

    return start.diff(end);
  }),

  // Must Implment by exented component
  // Should return encodeURI()'d string
  generateHref({start, duration, location, description}) {
    assert('Please BYO method in subclass', false);
  },
  /**
   * Convert object to querystring
   * @private
   */
  _toQString(props) {
    let keys = Object.keys(props);
    let pairs = keys.map(x => {
      return x + '=' + props[x];
    });

    return pairs.join('&')
  }
});
