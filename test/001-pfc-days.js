"use strict";
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

const PFC = require( '../docs/js/pfc.js' );

describe( 'PFC', () => {
    it ('has some basic accessors', done => {
        const pfc = new PFC();

        pfc.addRecord({descr: "lazy"});

        const days = pfc.getDays();
        expect( days.length ).to.equal(1);
        expect( days[0] ).to.match( /^\d{4}-\d\d-\d\d$/ );

        const thisday = pfc.getDetails( days[0] );
        expect( thisday.score() ).to.equal(1);

        done();
    });
});

