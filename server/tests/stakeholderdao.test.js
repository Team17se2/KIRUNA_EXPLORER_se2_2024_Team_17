'use strict';

const stakeholderDao = require('../dao/stakeholder-dao');
const db = require('../db/db');
jest.mock('../db/db'); // Mock the db module

describe('stakeholderDao', () => {

    describe('getStakeholders', () => {
        let mockRows, mockStakeholders;

        beforeEach(() => {
            // Mock data representing rows returned from the database
            mockRows = [
                { IdStakeholder: 1, Name: 'Stakeholder1', Color: '#FF5733' },
                { IdStakeholder: 2, Name: 'Stakeholder2', Color: '#33FF57' },
            ];

            // Expected array of stakeholder instances
            const Stakeholder = require('../models/stakeholder');
            mockStakeholders = mockRows.map(row => new Stakeholder(row.IdStakeholder, row.Name, row.Color));
        });

        it('should return all stakeholders', async () => {
            db.all.mockImplementation((sql, params, callback) => {
                callback(null, mockRows); // Simulate db returning rows
            });

            const stakeholders = await stakeholderDao.getStakeholders();
            expect(stakeholders).toEqual(mockStakeholders);
        });

        it('should reject if there is a database error', async () => {
            db.all.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'), null);
            });

            await expect(stakeholderDao.getStakeholders()).rejects.toThrow('DB error');
        });
    });

    describe('getStakeholderById', () => {
        let id, mockRow, mockStakeholder;

        beforeEach(() => {
            id = 1;

            // Mock row returned from database
            mockRow = { IdStakeholder: id, Name: 'Stakeholder1', Color: '#FF5733' };

            // Expected stakeholder instance
            const Stakeholder = require('../models/stakeholder');
            mockStakeholder = new Stakeholder(mockRow.IdStakeholder, mockRow.Name, mockRow.Color);
        });

        it('should return the stakeholder if the ID exists', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, mockRow); // Simulate db returning a valid row
            });

            const stakeholder = await stakeholderDao.getStakeholderById(id);
            expect(stakeholder).toEqual(mockStakeholder);
        });

        it('should return error if the ID does not exist', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, undefined); // Simulate db returning no row
            });

            const result = await stakeholderDao.getStakeholderById(id);
            expect(result).toEqual({ error: 'Stakeholder not found.' });
        });

        it('should reject if there is a database error', async () => {
            db.get.mockImplementation((sql, params, callback) => {
                callback(new Error('DB error'), null);
            });

            await expect(stakeholderDao.getStakeholderById(id)).rejects.toThrow('DB error');
        });
    });
    describe('addStakeholder', () => {
        let stakeholderName='New Stakeholder';
        it('should add a new stakeholder successfully', async () => {
            const mockLastId = 1; // Simulate the last inserted ID

            // Mock db.run to simulate insertion and return the lastID
            db.run.mockImplementation(function (sql, params, callback) {
                callback.call({ lastID: mockLastId }, null); // simulating the last inserted ID
            });

            // Call the addStakeholder function and verify the result
            const result = await stakeholderDao.addStakeholder(stakeholderName);
            console.log("RESULT");
            console.log(result);
            // Assert that the result is the mocked lastID
            expect(result).toBe(mockLastId);
        });

        it('should reject if there is a database error', async () => {
            const mockError = new Error('DB error');
            db.run.mockImplementation((sql, params, callback) => {
                callback(mockError); // Simulate error during insertion
            });

            await expect(stakeholderDao.addStakeholder(stakeholderName)).rejects.toThrow('DB error');
        });
    });
});
