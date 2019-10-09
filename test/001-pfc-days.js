"use strict";
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

const PFC = require( '../docs/js/pfc.js' );

describe( 'PFC', () => {
    it ('has some basic accessors', done => {
        const pfc = new PFC();

        pfc.addRecord({descr: "lazy"});

        done();
    });
});

