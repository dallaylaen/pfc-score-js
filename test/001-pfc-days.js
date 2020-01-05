"use strict";
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

const PFC = require( '../lib/pfc.js' );


describe( 'PFC.time2date', () => {
    it ('converts dates to dates', done => {
        const dateEq = (x,y) => expect( x.getTime() ).to.equal( y.getTime() );
        const time2date = PFC.time2date;

        dateEq( time2date( '12:35', '11-07' ), new Date('2020-11-07 12:35:00') );

        dateEq( time2date( '12:35' ), new Date(PFC.time2day(new Date())+' 12:35:00') );

        done();
    });
});
describe( 'PFC.Day', () => {
    it ('has wday', done => {
        const day = new PFC.Day('2019-11-02');
        expect( day.wday() ).to.equal('Sat');
        done();
    });
});

describe( 'PFC', () => {
    it ('has some basic accessors', done => {
        const pfc = new PFC();

        pfc.addRecord({text: "lazy"});
        pfc.addRecord({text: "lazy 2", score: 0});
        pfc.addRecord({text: "lazy 3", fun:   1});

        const days = pfc.getDays();
        expect( days.length ).to.equal(1);
        expect( days[0] ).to.match( /^\d{4}-\d\d-\d\d$/ );

        const thisday = pfc.getDetails( days[0] );
        expect( thisday.score() ).to.equal(2);
        expect( thisday.fun() ).to.equal(1);

        done();
    });

    it('can add daily values', done => {
        // TODO
        const pfc = new PFC();

        pfc.addStat({time: new Date(), name: 'weight', value: 99});
        pfc.addStat({time: new Date(), name: 'weight', value: 98});

        done();
    });

    it ('can save/load', done => {
        const pfc = new PFC();

        pfc.addRecord({text: "lazy"});
        pfc.addRecord({text: "other lazy"});
        pfc.addStat({time: new Date(), name: 'weight', value: 99});

        const data = pfc.save();

        const raw  = JSON.parse( JSON.stringify ( data ));

        expect( typeof raw ).to.equal('object');

        const other = new PFC();
        expect( other.load(undefined) ).to.equal(other);
        expect( other.load( raw ) ).to.equal(other);

        expect( other.getDays() ).to.deep.equal( pfc.getDays() );

        const date = pfc.getDays()[0];

        const day1 = pfc.getDetails(date);
        const day2 = other.getDetails(date);

        expect( day2.score() ).to.equal( day1.score() );

        // whitebox testing sucks
        expect( day2.stats.weight[0].value ).to.equal( 99 );
        expect( day2.rec.length ).to.equal(2);
        expect( day2.rec[0].time ).to.be.instanceof( Date );
        expect( day2.rec[0] ).to.be.instanceof( PFC.Record );

        expect( day2.rec[0].text ).to.equal( day1.rec[0].text );
        expect( day2.rec[0].score ).to.equal( day1.rec[0].score );
        expect( ''+day2.rec[0].time ).to.equal( ''+day1.rec[0].time );

        done();
    });

    it ('has on update callback', done => {
        const pfc = new PFC();

        const trace = [];
        expect( pfc.onUpdate( r=>trace.push(r) )).to.equal(pfc);

        pfc.addRecord({});

        expect( trace.length ).to.equal(1);

        done();
    });
});

