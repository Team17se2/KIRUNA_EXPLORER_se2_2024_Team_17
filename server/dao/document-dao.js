"use strict";

/* Data Access Object (DAO) module for accessing document infomration */

const db = require("../db/db");
const Document = require("../models/document"); // Import the Document class

/**
 * Adds a new document to the database.
 *
 * @function addDocument
 * @param {String} title - Title of the document.
 * @param {Number} idStakeholder - Unique identifier of the stakeholder associated with the document.
 * @param {String} scale - The scale of the document (e.g., 'National', 'Regional').
 * @param {String} issuance_Date - The issuance date of the document in 'MM/DD/YYYY' format.
 * @param {String} language - Language of the document (e.g., 'English').
 * @param {Number} pages - The number of pages in the document.
 * @param {String} description - A brief description of the document's contents.
 * @param {Number} idtype - Unique identifier of the document type.
 * @param {Number} idlocation - The location of a specific document
 * @returns {Promise<Number>} Resolves with newly object.
 */
exports.addDocument = (title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Document (Title, IdStakeholder, Scale, Issuance_Date, Language, Pages, Description, IdType, IdLocation) VALUES (?,?,?,?,?,?,?,?,?)";
    db.run(
      sql,[title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation,],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        const newdocument = new Document(this.lastID,title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation);
        resolve(newdocument);
      }
    );
    //here possibile call to add link
  });
};
// here other function es get document

/**
 * Updating the georeferencing location of a document.
 * @param {Number} documentId - ID of the document to update.
 * @param {Number} idLocation - New georeferencing location ID of the document.
 * @returns {Promise<Boolean>} Resolves to true if the geolocation was updated successfully, false otherwise.
 */
exports.updateDocumentGeolocation = (documentId, idLocation) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Document SET IdLocation = ? WHERE IdDocument = ?";
    db.run(sql, [idLocation, documentId], function (err) {
      if (err) {
        reject(new Error("Failed to update document geolocation."));
        return;
      }
      resolve(true);
    });
  });
};

/**
 * Updating the document id of a document.
 * @param {Number} documentId - ID of the document to update.
 * @returns {Promise<Boolean>} resolved with the new object update.
 */
exports.updateDocument = (documentId, title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Document SET Title = ?, IdStakeholder = ?, Scale = ?, Issuance_Date = ?, Language = ?, Pages = ?, Description = ?, IdType = ?, IdLocation = ? WHERE IdDocument = ?";
    db.run(sql, [title,idStakeholder,scale,issuance_Date,language,pages,description,idtype,idlocation,documentId], function (err) {
      if (err) {
        reject(new Error("Failed to update document."));
        return;
      }
      resolve(true);
    });
  })};
