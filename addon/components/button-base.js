import Component from '@ember/component';
import layout from '../templates/components/button-base';
import moment from 'moment';
import { assert } from '@ember/debug';
import { get, getWithDefault, computed } from '@ember/object';
import {alias} from '@ember/object/computed';

export default Component.extend({
  attributeBindings: ['href', 'target'],
  tagName: 'a',
  target: '_blank',

  layout,

  didRecieveAttrs() {
    this._super(...arguments);
    assert('`tagName` must be `a`', get(this, 'tagName') === 'a')
  },

  href: computed('event.@each', function() {
    const event = get(this, 'event');
    let args = {
      startTime: this._starTime(),
      duration: this._duration(),
      endTime: this._endTime(),
      location: get(event, 'location'),
      description: getWithDefault(event, 'description', ''),
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

  /* PRIVATE FUNCTIONS
  --------------------------------------------------------------------------------------------------------------------*/
  _starTime() {
    const start = this.get('event.start');
    return moment.isMoment(start) ? start : moment(start);
  },

  _endTime() {
    const start = this.get('event.start');
    const end = this.get('event.end') || false;

    if (end) {
      return moment.isMoment(end) ? end : moment(end);
    }

    return start.add(90, 'minutes');
  },

  _duration() {
    const event = this.get('event');
    const duration = this.get('event.duration');

    if (duration) {
      return duration;
    }

    let start = this.get('event.start'),
        end = this.get('event.end');

    return start.diff(end);
  },

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
