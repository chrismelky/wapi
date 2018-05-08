'use strict';

const registrationService = require('../../services/registration-service');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
//const Db = require('../../config/db');

describe('Registration Service',() => {
    describe('Register',() => {
        it('Should return promise',() => {
            let userInfo = {mobileNumber:'123456'};
            let registerResult = registrationService.register(userInfo);
            expect(registerResult.then).to.be.a('function');
            expect(registerResult.catch).to.be.a('function');
        });
    });

    describe('ResendVerificationCode', () => {
        let userInfo = {mobileNumber:'123456'};
        it('Should return promise',() => {
            let resendCodeResult= registrationService.resendVerificationCode(userInfo);
            expect(resendCodeResult.then).to.be.a('function');
            expect(resendCodeResult.catch).to.be.a('function');
        });
    });

    describe('Verify', () => {
        let userInfo = {mobileNumber:'1234567890', requestVerificationCode:'123456'};
        it('Should return promise',() => {
            let resendCodeResult= registrationService.verify(userInfo);
            expect(resendCodeResult.then).to.be.a('function');
            expect(resendCodeResult.catch).to.be.a('function');
        });
    });

});

