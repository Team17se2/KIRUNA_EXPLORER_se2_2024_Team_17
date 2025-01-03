import request from "supertest";
import { app } from "../index.js";
const locationDao = require("../dao/location-dao.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
let documentId;
describe("Document API with Session Authentication", () => {
  let agent;

  const documentData = {
    title: "Sample Title",
    idStakeholder: [1, 2],
    IdScale: 1,
    issuance_Date: "04/2019",
    language: "English",
    pages: 50,
    description: "A description for the document",
    idtype: 2,
    locationType: "Point",
    latitude: 19,
    longitude: 23,
    area_coordinates: "",
  };

  beforeAll(async () => {
    agent = request.agent(app);

    const loginResponse = await agent.post("/api/sessions").send({
      username: "mario@test.it",
      password: process.env.TEST_USER_PASSWORD,
    });
    expect(loginResponse.status).toBe(200);
  });

  it("should retrieve all documents", async () => {
    const response = await agent.get("/api/documents");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should create a new document with valid data", async () => {
    
    const response = await agent.post("/api/documents").send(documentData);
    expect(response.status).toBe(201);

    documentId = response.body.IdDocument || response.body.idDocument;
    expect(documentId).toBeDefined();
  });

  it("should return 400 for a document with invalid data", async () => {
    const response = await agent
      .post("/api/documents")
      .send({ ...documentData, idtype:''  });
    expect(response.status).toBe(400);
  });

  it("should return 500 if error to insert location", async () => {
    // Mocking locationDao to simulate failure in location insertion
    locationDao.addLocation = jest.fn().mockResolvedValue(null);

    const response = await agent
      .post("/api/documents")
      .send({ ...documentData, locationType: ''  });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to add location.");
  });

  it("should update an existing document", async () => {

    const updateResponse = await agent
      .patch(`/api/documents/${documentId}`)
      .send(documentData);
    expect(updateResponse.status).toBe(200);

    const retrieveResponse = await agent.get(`/api/documents/${documentId}`);
    console.log(retrieveResponse.body);
    expect(retrieveResponse.status).toBe(200);
  });

  it("should return 404 for a non-existent document ID", async () => {
    const nonExistentDocumentId = 9999;
    const response = await agent.get(`/api/documents/${nonExistentDocumentId}`);
    expect(response.status).toBe(404);
  });

  it("should retrieve a document by ID", async () => {
    const response = await agent.get(`/api/documents/${documentId}`);
    if (response.status === 200) {
      expect(response.body).toHaveProperty("IdDocument", documentId);
      expect(response.body).toHaveProperty("Title");
    } else {
      expect(response.status).toBe(404);
    }
  });

  it("should return 400 for not insert all data", async () => {
    const updateResponse = await agent
      .patch(`/api/documents/${documentId}`)
      .send({ ...documentData, idtype:'', title:'' });
    expect(updateResponse.status).toBe(400);
  });
});

describe("Document Search API", () => {
  it("should retrieve all documents", async () => {
    const response = await request(app).get("/api/documents");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  it("should return 404 if document title not found", async () => {
    const response = await request(app).get(
      "/api/documents/title/NonExistentTitle"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Document not found");
  });
});
describe("Define Geolocated Area API", () => {
  let authenticatedAgent;

  beforeAll(async () => {
    authenticatedAgent = request.agent(app);

    const loginResponse = await authenticatedAgent.post("/api/sessions").send({
      username: "mario@test.it",
      password: process.env.TEST_USER_PASSWORD,
    });

    expect(loginResponse.status).toBe(200); // Ensure login is successful
  });

  it("should create a new geolocated area", async () => {
    const newArea = {
      location_type: "Area",
      center_lat: 40.7128,
      center_lng: 74.006,
      area_coordinates: JSON.stringify([
        { lat: 40.7128, lng: 74.006 },
        { lat: 40.7127, lng: 74.0059 },
      ]),
      areaName: "Test Area", // Ensure correct naming
    };
    locationDao.addLocation = jest.fn().mockResolvedValue(1);

    const response = await authenticatedAgent
      .post("/api/locations")
      .send(newArea);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Location added successfully."
    );
  });

  it("should return 400 if area coordinates are missing", async () => {
    const incompleteArea = { location_type: "Area", areaName: "Test Area" };

    const response = await authenticatedAgent
      .post("/api/locations")
      .send(incompleteArea);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "For 'Area' locationType, areaCoordinates are required."
    );
  });
});

describe("Get All Document Areas API", () => {
  let agent;

  beforeAll(async () => {
    agent = request.agent(app);

    const loginResponse = await agent.post("/api/sessions").send({
      username: "mario@test.it",
      password: process.env.TEST_USER_PASSWORD,
    });
    expect(loginResponse.status).toBe(200);
  });

  it("should retrieve all geolocated areas", async () => {
    const response = await request(app).get("/api/locations/area");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should handle errors if location retrieval fails", async () => {
    // Simulate failure (e.g., mock a database failure)
    locationDao.getLocationsArea = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/locations/area");
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Internal server error");
  });
});
describe("Resources API and resources API ", () => {
  let agent;
  beforeAll(async () => {
    agent = request.agent(app);

    const loginResponse = await agent.post("/api/sessions").send({
      username: "mario@test.it",
      password: process.env.TEST_USER_PASSWORD,
    });
    expect(loginResponse.status).toBe(200);
  });
  it("should upload a file successfully", async () => {
    // Perform the file upload request
    const response = await agent
      .post("/api/documents/" + documentId + "/resources")
      .attach("files", path.resolve(__dirname, "mock_file/testfile.txt"))
      .attach("files", path.resolve(__dirname, "mock_file/test2file.txt"))
      .set("Content-Type", "multipart/form-data");

    // Validate the response
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Files uploaded successfully!");
    expect(response.body.documentId).toBe(documentId);
  });

  it("should return the list of files for a document", async () => {
    const response = await agent.get(`/api/documents/${documentId}/resources`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it("should delete a file successfully", async () => {
    const filename = "testfile.txt";

    // Mock the file system behavior to simulate existing file
    //const filePath = path.join(__dirname, "uploads", documentId, filename);

    const response = await agent.delete(
      `/api/documents/${documentId}/resources/${filename}`
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("File deleted successfully.");
  });

  it("should return 404 if the file does not exist", async () => {
    const documentId = "nonExistentDocumentId";
    const filename = "nonExistentFile.txt";

    const response = await agent.delete(
      `/api/documents/${documentId}/resources/${filename}`
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("File not found.");
  });

  it("should return 500 if there is an error deleting the file", async () => {
    const filename = "test2file.txt";

    // Mock the file system behavior to simulate existing file

    // Mock fs.unlink to simulate an error
    jest.spyOn(fs, "unlink").mockImplementation((path, callback) => {
      callback(new Error("Simulated unlink error"));
    });

    const response = await agent.delete(
      `/api/documents/${documentId}/resources/${filename}`
    );

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to delete the file.");
  });
  it("should upload a attachment successfully", async () => {
    // Perform the file upload request
    const response = await agent
      .post("/api/documents/" + documentId + "/attachments")
      .attach("files", path.resolve(__dirname, "mock_file/testfile.txt"))
      .attach("files", path.resolve(__dirname, "mock_file/test2file.txt"))
      .set("Content-Type", "multipart/form-data");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Attachments uploaded successfully!");
    expect(response.body.documentId).toBe(documentId);
  });
  it("should return the list of attachments for a document", async () => {
    const response = await agent.get(
      `/api/documents/${documentId}/attachments`
    );
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });
  it("should return 404 if the file does not exist", async () => {
    const response = await agent.delete(
      "/api/documents/9999/attachments/testfile.txt"
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Attachment not found." });
  });

  it("should return 500 if file deletion fails", async () => {
    fs.unlink.mockImplementation((path, callback) =>
      callback(new Error("Deletion error"))
    );
    const response = await agent.delete(
      `/api/documents/${documentId}/attachments/testfile.txt`
    );
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Failed to delete the attachment.",
    });
  });

  it("should return 200 for successful file deletion", async () => {
    fs.unlink.mockImplementation((path, callback) => callback(null));
    const response = await agent.delete(
      `/api/documents/${documentId}/attachments/testfile.txt`
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Attachment deleted successfully.",
    });
  });
});
