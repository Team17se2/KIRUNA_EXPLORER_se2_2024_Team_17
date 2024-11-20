const URL = "http://localhost:3001/api";

// API USERS CALL
// function to getusers
function getUsers() {
  // call GET /api/users
  return new Promise((resolve, reject) => {
    fetch(URL + "/users", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((users) => {
            resolve(users);
          });
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}
//function to login
async function login(credentials) {
  // call POST /api/sessions
  let response = await fetch(URL + "/sessions", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logout() {
  // call DELETE /api/sessions/current
  await fetch(URL + "/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
}
// funzione per ottenere le informazioni dell'utente loggato
async function getUserInfo() {
  // call GET /api/sessions/current
  const response = await fetch(URL + "/sessions/current", {
    credentials: "include",
  });

  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

// API DOCUMENTS CALL 

const addDocument = (title, idStakeholder, scale, issuance_Date, language, pages, description, idtype, locationType, latitude, longitude, area_coordinates) => {
  console.log("ADD DOCUMENT");
  return new Promise((resolve, reject) => {
    fetch(URL + "/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, idStakeholder, scale, issuance_Date, language, pages, description, idtype, locationType, latitude, longitude, area_coordinates }),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          response.json().then((message) => {
            reject(message);
          });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });

};
const addDocumentArea = (title, idStakeholder, scale, issuance_Date, language, pages, description, idtype, idLocation) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, idStakeholder, scale, issuance_Date, language, pages, description, idtype, idLocation }),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          response.json().then((message) => {
            reject(message);
          });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};
const getAllDocuments = () => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/documents", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((documents) => {
            resolve(documents);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};

const getDocumentById = (documentId) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/documents/" + documentId, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((document) => {
            resolve(document);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};



// API TYPES DOCUMENTS CALL

const getAllTypesDocument = () => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/types", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((types) => {
            resolve(types);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};
const getTypeDocument = async (id) => {
  const response = await fetch(URL + "/types/" + id, {
    credentials: "include",
  });
  if (response.ok) {
    return await response.json();
  } else {
    return await response.json().error;
  }
};


// API DOCUMENT CONNECTIONS CALL
const getAllDocumentConnections = () => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/document-connections", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((connections) => {
            resolve(connections);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};
const getDocumentConnection = (id) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/document-connections/" + id, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((connection) => {
            resolve(connection);
          }
          );
        } else {
          response.json().then((message) => {
            reject(message);
          });
        }
      }
      )
  });
};

const createDocumentConnection = (IdDocument1, IdDocument2, connection_type) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/document-connections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ IdDocument1: IdDocument1, IdDocument2: IdDocument2, IdConnection: connection_type }),
      credentials: "include",

    }).then((response) => {
      if (response.ok) {
        resolve(response.json());
      } else {
        response.json().then((message) => {
          reject(message);
        });
      }
    }).catch(() => {
      reject({ error: "Cannot communicate with the server!" });
    });
  });
};

const updateDocument = (Id_document,title,idStakeholder, scale, issuance_Date,language,pages,description, idtype ) => { 
  return new Promise((resolve, reject) => { 
    fetch(URL + "/documents/"+Id_document, { 
      method: "PATCH", 
      headers: { 
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify({ title,idStakeholder, scale, issuance_Date,language,pages,description, idtype}), 
      credentials: "include", 
    }) 
      .then((response) => { 
        if (response.ok) { 
          resolve(response.json()); 
        } else { 
          response.json().then((message) => { 
            reject(message); 
          }); 
        } 
      }) 
      .catch(() => { 
        reject({ error: "Cannot communicate with the server." }); 
      }); 
  }); 
 
};

// PATCH to update the connections

// API STAKEHOLDERS CALL

const getAllStakeholders = () => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/stakeholders", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((stakeholders) => {
            resolve(stakeholders);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response!" });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server!" });
      });
  });
};

const getStakeholder = (id) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/stakeholders/" + id, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((stakeholder) => {
            resolve(stakeholder);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};

// API LOCATIONS CALL
const getAllLocations = () => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/locations", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((locations) => {
            resolve(locations);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
}
const getAllLocationsArea = () => {
  
  return new Promise((resolve, reject) => {
    fetch(URL + "/locations/area", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((locations) => {
            resolve(locations);
          }
          );
        } else {
          response.json().then((message) => {
            reject(message);
          });
        }
      }
      );
  });
};

const getLocationById = (id) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/locations/" + id, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((location) => {
            resolve(location);
          });
        } else {
          response.json().then((message) => {
            reject(message);
          });
        }
      });
  });
};

const updateLocationDocument = (id, location_type, latitude, longitude, area_coordinates) => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/locations/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location_type, latitude, longitude, area_coordinates }),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          response.json().then((message) => {
            reject(message);
          });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};

const getAllTypeConnections = () => {
  return new Promise((resolve, reject) => {
    fetch(URL + "/connections", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((typeConnections) => {
            resolve(typeConnections);
          });
        } else {
          response
            .json()
            .then((message) => {
              reject(message);
            })
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            });
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }
      );
  });
};

const getDocumentResources = async (id) => {
  return new Promise((resolve, reject) => {
    fetch(URL + '/documents/'+ id + '/resources',{
      credentials: "include",
    })
    .then(res => {
      if (res.ok) {
        res.json().then(files => {
          resolve(files);
        });
      } else {
        resolve(res.status);
      }
    });
  });
}

const addResourcesToDocument = (idDocument, files) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    // Check if files is an array (handling multiple files)
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        formData.append('files', file); // Append each file individually
      });
    } else {
      console.error("No files provided for upload.");
      reject({ error: "No files provided for upload." });
      return;
    }

    formData.append('idDocument', idDocument); // Add the document ID to the form data

    // Make the fetch request
    fetch(URL+ `/documents/`+idDocument+`/resources`, {
      method: "POST",
      body: formData,
      credentials: "include", // Include cookies if needed
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Return the JSON response
        } else {
          // Return the response's error message if available
          return response.json().then((message) => {
            throw new Error(message.error || "Upload failed");
          });
        }
      })
      .then((data) => {
        console.log("Files uploaded successfully:", data);
        resolve(data); // Resolve with the successful response data
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        reject({ error: error.message || "Cannot communicate with the server." });
      });
  });
};


const addArea = (areaName, area_coordinates,center_lat,center_lng) => {

  return new Promise((resolve, reject) => {
    fetch(URL + `/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        location_type: "Area",
        center_lat,
        center_lng,
        area_coordinates,
        areaName,
      }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          // Reject if response is not OK
          return response.json().then((message) => reject(message));
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      });
  });
};


const API = { getUsers, login, logout, getUserInfo, getAllTypesDocument, getTypeDocument, getAllStakeholders, getStakeholder, addDocument, createDocumentConnection, getAllDocumentConnections, getDocumentConnection, getAllDocuments, getDocumentById, getAllLocations, updateLocationDocument, getLocationById, getAllTypeConnections,updateDocument,getAllLocationsArea,addDocumentArea, getDocumentResources, addResourcesToDocument, addArea};

export default API;
