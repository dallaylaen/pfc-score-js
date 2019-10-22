"use strict";
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

const PFC = require( '../lib/pfc.js' );

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

