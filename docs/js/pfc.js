(function (window) {
    function Record (raw) {
        if (typeof raw !== 'object')
             throw new Error('Record must be an object');

        this.text = raw.descr;
        this.time = raw.time || new Date();

        const score = (raw.score === undefined) 
            ? 1 
            : Number.parseInt(raw.score);
        if (Number.isNaN(score)) 
            throw new Error('score must be a number, or undefined (default = 1)');
        this.score = score;

        this.day = function() {
            return this.time.toISOString().split('T')[0];
        };
    };

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
    };

    function PFC () {
        this.days = {};

        this.addRecord = function(raw) {
            const rec = new Record(raw);
            const day = rec.day();
            if (!this.days[day]) {
                this.days[day] = new Day(day);
            };
            this.days[day].addRecord(rec);
        };

        this.getDays = function() {
            return Object.keys(this.days).sort();
        };

        this.getDetails = function(day) {
            return this.days[day] || new Day(day);
        };
    };

    if (typeof module === 'object' && typeof module.exports === 'object' ) {
        // we're being exported
        module.exports = PFC;
    } else if (window) {
        window.PFC = PFC;
    } else {
        throw new Error("Don't know how to export");
    };
})(this);
