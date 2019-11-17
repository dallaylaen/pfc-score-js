'use strict';

const PFC = (function () {
    const pad = (x,n=2,s='0') => (s.repeat(n)+x).slice(-n);
    const time2day = t => t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());
    const defaultDate = t => t? new Date(t) : new Date();
    const wday = x=>['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(x).getDay()];

    function time2date(time, day) {
        if (!time)
            throw new Error('time2date: time is required');
        if (!day)
            day = time2day(new Date());

        // TODO make sure the date is in the past
        if (day.match(/^\d\d-\d\d$/))
            day = new Date().getFullYear()+'-'+day;

        if (typeof time === 'object')
            time = time.getHours() + ':' + time.getMinutes();

        if (time.match(/^\d\d:\d\d$/))
            time = time + ':00';
       
        const str = day + ' ' + time; 
        const ret = new Date(str);
        if (Number.isNaN(ret.getTime()))
            throw new Error('invalid date spec '+str);

        return ret;
    }

    function Record (raw) {
        if (typeof raw !== 'object')
             throw new Error('Record must be an object');

        this.text = raw.text;
        this.time = defaultDate(raw.time);

        const score = (raw.score === undefined)
            ? 1
            : Number.parseInt(raw.score);
        if (Number.isNaN(score))
            throw new Error('score must be a number, or undefined (default = 1)');

        this.score = score;
        this.fun   = raw.fun && raw.fun !== '0' ? 1 : 0;

        this.day = function() {
            return time2day(this.time);
        };
    }

    function Day (date) {
        this.day = date;
        this.rec = [];
        this.stats = {};
        this.wday = function() { return wday(this.day) };
        this.addRecord = function(rec) {
              if (!(rec instanceof Record))
                  rec = new Record(rec);
            this.rec.push(rec);
        };
        this.addStat = function(raw) {
            if (!raw.time || !raw.name || raw.value === undefined)
                throw ("A daily value must have time, name, and value fields");

            if (!this.stats[raw.name])
                this.stats[raw.name] = [];
            this.stats[raw.name].push( raw );
        };
        this.score = function() {
            return this.rec.reduce( (a,x) => (x.score||0)+a, 0 );
        };
        this.fun  = function() {
            return this.rec.reduce( (a,x) => (x.fun||0)+a, 0 );
        };
        this.load = function(raw) {
            this.day = raw.day;
            // console.log('Loading data for '+raw.day+' with '+(raw.rec || []).length+' records');
            for (let rec of (raw.rec || [])) {
                this.addRecord(rec);
            }
            for (let name in (raw.stats || {})) {
                // TODO validate & deep copy
                this.stats[name] = raw.stats[name];
            }
            return this;
        };
    }

    function PFC () {
        this.days = {};

        let onUpdate = (_=>_);
        this.onUpdate = function(cb) {
            onUpdate = cb || (_=>_);
            return this;
        };

        this.getDay = function(day) {
            return this.days[day] = this.days[day] || new Day(day);
        };

        this.addRecord = function(raw) {
            const rec = new Record(raw);
            const day = rec.day();
            this.getDay(day).addRecord(rec);
            onUpdate(rec, day, this); // signature?
        };
        this.addStat = function(raw) {
            // TODO value types
            raw.time = defaultDate(raw.time);
            const day = raw.day || time2day(raw.time);
            this.getDay(day).addStat(raw);
            onUpdate(undefined, day, this);
        };

        this.getDays = function() {
            return Object.keys(this.days).sort();
        };

        this.getDetails = function(day) {
            return this.days[day] || new Day(day);
        };

        this.load = function(raw) {
            if (!raw)
                return this;
            if (typeof raw != 'object')
                raw = JSON.parse(raw);

            if (Array.isArray(raw)) {
                for (let item of raw)
                    this.addRecord(item);
            } else {
                for (let i in raw.days) {
                    // console.log("Loading day "+i);
                    // TODO validate
                    this.days[i] = new Day(i).load(raw.days[i]);
                }
                // TODO other fields
            }

            return this;
        };

        // TODO toJSON
        this.save = function() {
            return this;
        };
    }

    // For instanceof'ing
    PFC.Record    = Record;
    PFC.Day       = Day;
    // some utility
    PFC.time2date = time2date;
    PFC.time2day = time2day;

    return PFC;
})();

if (typeof module === 'object' && typeof module.exports === 'object' ) {
    // we're being exported
    module.exports = PFC;
}
