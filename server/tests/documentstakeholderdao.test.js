"use strict";

const documentStakeholderDao = require("../dao/document-stakeholder-dao");
const db = require("../db/db");
jest.mock("../db/db");

const mockDbRun = (error = null, changes = 0) => {
  db.run.mockImplementation((sql, params, callback) => {
    callback.call({ changes }, error);
  });
};

const mockDbAll = (error = null, result = []) => {
  db.all.mockImplementation((sql, params, callback) => {
    callback(error, result);
  });
};

describe("documentStakeholderDao", () => {
  describe("addStakeholderToDocument", () => {
    const documentId = 1;
    const stakeholderId = 2;

    it("should add a stakeholder to a document successfully", async () => {
      mockDbRun(null);
      const result = await documentStakeholderDao.addStakeholderToDocument(
        documentId,
        stakeholderId
      );
      expect(result).toBe(true);
    });

    it("should reject if there is a database error", async () => {
      mockDbRun(new Error("DB error"));
      await expect(
        documentStakeholderDao.addStakeholderToDocument(
          documentId,
          stakeholderId
        )
      ).rejects.toThrow("DB error");
    });
  });

  describe("getStakeholdersByDocument", () => {
    const documentId = 1;
    const mockStakeholders = [
      { IdStakeholder: 1, Name: "Testttttt", Color: "0x000000" },
      { IdStakeholder: 2, Name: "Debuggggg", Color: "0x123000" },
    ];

    it("should return stakeholders for a given document", async () => {
      mockDbAll(null, mockStakeholders);
      const stakeholders =
        await documentStakeholderDao.getStakeholdersByDocument(documentId);
      expect(stakeholders).toEqual(mockStakeholders);
    });

    it("should reject if there is a database error", async () => {
      mockDbAll(new Error("DB error"));
      await expect(
        documentStakeholderDao.getStakeholdersByDocument(documentId)
      ).rejects.toThrow("DB error");
    });
  });

  describe("getDocumentsByStakeholder", () => {
    const stakeholderId = 1;
    const mockDocuments = [
      {
        IdDocument: 1,
        Title: "Document 1",
        Description: "Description 1",
        Issuance_Date: "2023-01-01",
        Language: "English",
      },
      {
        IdDocument: 2,
        Title: "Document 2",
        Description: "Description 2",
        Issuance_Date: "2023-02-01",
        Language: "English",
      },
    ];

    it("should return documents for a given stakeholder", async () => {
      mockDbAll(null, mockDocuments);
      const documents = await documentStakeholderDao.getDocumentsByStakeholder(
        stakeholderId
      );
      expect(documents).toEqual(mockDocuments);
    });

    it("should reject if there is a database error", async () => {
      mockDbAll(new Error("DB error"));
      await expect(
        documentStakeholderDao.getDocumentsByStakeholder(stakeholderId)
      ).rejects.toThrow("DB error");
    });
  });

  describe("clearStakeholdersFromDocument", () => {
    const documentId = 1;

    it("should successfully clear stakeholders when rows exist", async () => {
      mockDbRun(null, 2);
      const result = await documentStakeholderDao.clearStakeholdersFromDocument(
        documentId
      );
      expect(result).toBe(true);
    });

    it("should return false when no rows are deleted", async () => {
      mockDbRun(null, 0);
      const result = await documentStakeholderDao.clearStakeholdersFromDocument(
        documentId
      );
      expect(result).toBe(false);
    });

    it("should reject if there is a database error", async () => {
      mockDbRun(new Error("DB error"));
      await expect(
        documentStakeholderDao.clearStakeholdersFromDocument(documentId)
      ).rejects.toThrow("DB error");
    });
  });
});
