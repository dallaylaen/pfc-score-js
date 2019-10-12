"use strict";
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

const PFC = require( '../lib/pfc.js' );

describe( 'PFC', () => {
    it ('has some basic accessors', done => {
        const pfc = new PFC();

        pfc.addRecord({text: "lazy"});

        const days = pfc.getDays();
        expect( days.length ).to.equal(1);
        expect( days[0] ).to.match( /^\d{4}-\d\d-\d\d$/ );

        const thisday = pfc.getDetails( days[0] );
        expect( thisday.score() ).to.equal(1);

        done();
    });

    it ('can save/load', done => {
        const pfc = new PFC();

        pfc.addRecord({text: "lazy"});

        const data = pfc.save();

        const raw  = JSON.parse( JSON.stringify ( data ));

        expect( typeof data ).to.equal('object');

        const other = new PFC();
        expect( other.load(undefined) ).to.equal(other);
        expect( other.load( pfc.save() ) ).to.equal(other);

        expect( other.getDays() ).to.deep.equal( pfc.getDays() );

        // expect( other ).to.deep.equal( pfc );
        
        done();
    });
});

