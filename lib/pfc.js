'use strict';

const PFC = (function () {
    const pad = (x,n=2,s='0') => (s.repeat(n)+x).slice(-n);

    function Record (raw) {
        if (typeof raw !== 'object')
             throw new Error('Record must be an object');

        this.text = raw.text;
        this.time = raw.time ? new Date(raw.time) : new Date();

        const score = (raw.score === undefined)
            ? 1
            : Number.parseInt(raw.score);
        if (Number.isNaN(score))
            throw new Error('score must be a number, or undefined (default = 1)');

        this.score = score;

        this.day = function() {
            const t = this.time;
            return t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());
        };
    }

    function Day (date) {
        this.day = date;
        this.rec = [];
        this.addRecord = function(rec) {
            this.rec.push(rec);
        };
        this.score = function() {
            let score = 0;
            this.rec.forEach( rec => score += rec.score );
            return score;
        };
    }

    function PFC () {
        this.days = {};

        let onUpdate = (_=>_);
        this.onUpdate = function(cb) {
            onUpdate = cb || (_=>_);
            return this;
        };

        this.addRecord = function(raw) {
            const rec = new Record(raw);
            const day = rec.day();
            if (!this.days[day]) {
                this.days[day] = new Day(day);
            }
            this.days[day].addRecord(rec);
            onUpdate(rec, day, this); // signature?
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

            for (let item of raw)
                this.addRecord(item);

            return this;
        };

        this.save = function() {
            return this.getDays().map(d=>this.getDetails(d).rec)
            .reduce((a,b)=>a.concat(b));
        };
    }

    return PFC;
})();

if (typeof module === 'object' && typeof module.exports === 'object' ) {
    // we're being exported
    module.exports = PFC;
}
