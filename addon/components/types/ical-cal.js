import Base from '../button-base';
import layout from '../../templates/components/types/ical-cal';
import moment from 'moment';
import {computed, get} from '@ember/object';
import {dasherize} from '@ember/string';

// Fastboot support
const doc = document || {URL: false}

export default Base.extend({
  layout,
  attributeBindings: ['download'],

  download: computed('event.@each', function() {
    let event = this.get('event');
    let title = `${get(event, 'title')}-${get(event, 'start').format('YYYY-MM-DD')}`
    let safe = dasherize(title)
    return `${safe
    }.ics`;
  }),

  generateHref({startTime = '', endTime = '', location = '', title = '', description = ''}){
    if (!moment.isMoment(startTime)) {
      startTime = moment(startTime);
    }
    if (!moment.isMoment(endTime)) {
      endTime = moment(endTime);
    }
    let start = startTime.format('YYYYMMDDTHHmmss');
    let end = endTime.format('YYYYMMDDTHHmmss');

    let text = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VTIMEZONE',
          'TZNAME:EST',
          'TZID:America/New_York',
          'END:VTIMEZONE',
          'BEGIN:VEVENT',
          'URL:' + doc.URL,

          `DTSTART;TZID=America/New_York:${start}`,
          `DTEND;TZID=America/New_York:${end}`,
          `SUMMARY:${title}`,
          `DESCRIPTION:${description}`,
          `LOCATION:${location}`,
          'END:VEVENT',
          'END:VCALENDAR'
        ];

      return encodeURI(`data:text/calendar;charset=utf8,${text.join('\n')}`)
  }
});
