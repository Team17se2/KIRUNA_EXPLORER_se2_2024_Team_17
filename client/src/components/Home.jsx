import { useState, useEffect, useContext } from 'react';
import MyNavbar from './MyNavbar';
import MapComponent from './Map';
import { Button, ToggleButtonGroup, ToggleButton, ListGroup, Spinner, Card, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa'; // Import document icon
import API from '../API'; // Import API module
import context from 'react-bootstrap/esm/AccordionContext';
import { Form } from 'react-bootstrap';
import AppContext from '../AppContext';
import '../App.css';
import { Modal } from 'react-bootstrap';


function Home(props) {
  const [viewMode, setViewMode] = useState('map');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [numberofconnections, setNumberofconnections] = useState(0);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [srcicon, setSrcicon] = useState("");
  const [showAddConnection, setShowAddConnection] = useState(false);

  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [connectionType, setConnectionType] = useState('');
  const [typeConnections, setTypeConnections] = useState({});
  const [selectDocumentSearch, setSelectDocumentSearch] = useState('');

  
  
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const isLogged = context.loginState.loggedIn;

  // get all documents, locations and stakeholders
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await API.getAllDocuments();
        setDocuments(res);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchDocumentTypes = async () => {
      try {
        const res = await API.getAllTypesDocument();
        console.log('Document Types:', res);

        setDocumentTypes(res);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchLocations = async () => {
      setLoading(true);
      API.getAllLocations()
        .then((res) => {
          // Convert the array into an object with IdLocation as the key
          const locationsById = res.reduce((acc, location) => {
            acc[location.IdLocation] = location;
            return acc;
          }, {});
          // Set the transformed object to state
          setLocations(locationsById);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
    const getAllTypeConnections = async () => {
      try {
          const res = await API.getAllTypeConnections();

          const typeConnectionId = res.reduce((acc, conn) => {
              acc[conn.IdConnection] = conn;
              return acc;
          }, {});
          setTypeConnections(typeConnectionId);
      } catch (err) {
          console.error(err);
      }
    };

    const fetchStakeholders = async () => {
      try {
        const res = await API.getAllStakeholders();
        setStakeholders(res);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchDocuments(), fetchLocations(), fetchStakeholders(), fetchDocumentTypes(),getAllTypeConnections()])
      .then(() => setLoading(false))
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleToggle = (value) => {
    setViewMode(value);
    setSelectedDocument(null);
  };

  const handleDocumentClick = async (doc) => {
    // Fetch the number of connections for the selected document
    const res = await API.getDocumentConnection(doc.IdDocument);
    console.log('Connections:', res);
    setNumberofconnections(res.length);
    setSelectedDocument(doc);
    setSrcicon("src/icon/" + documentTypes[doc.IdType].iconsrc);
    console.log("src/icon/" + documentTypes[doc.IdType].iconsrc);

  };

  const handleModifyClick = () => {
    if (selectedDocument) {
      navigate(`documents/modify-document/${selectedDocument.IdDocument}`);
    }
  };
  const handleAddConnection = async() => {
    console.log(selectDocumentSearch);
    if (selectedDocument && connectionType) {
        console.log(connectionType);
        await API.createDocumentConnection(selectedDocument.IdDocument,selectDocumentSearch.IdDocument , connectionType);
        // now i have to call again the document to update the connections
        const res = await API.getDocumentConnection(selectedDocument.IdDocument);
        setSelectedDocument('');
        setConnectionType('');
        setShowAddConnection(false);
    } else {
        alert("Please complete all fields to add a connection.");
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSelectDocumentSearch(searchValue);

    // Filter documents that match the input
    if (searchValue.length > 0) {
    const filtered = documents.filter((doc) =>
        doc.Title.toLowerCase().includes(searchValue.toLowerCase()) && doc.IdDocument != selectedDocument.IdDocument
    );
    setFilteredDocuments(filtered);
    } else {
    setFilteredDocuments([]);
    }
  };
  const handleSelectionDocument = (doc) => {
    console.log("ho modificato");
    console.log(doc);
    setSelectDocumentSearch(doc);
    setFilteredDocuments([]);
  }
  const closeModal = () => {
    setShowAddConnection(false);
    selectDocumentSearch('');
  }

  return (
    <>
      {isLogged &&
        <div className=' d-flex justify-content-center mt-3'>
          <ToggleButtonGroup type="radio" name="options" value={viewMode} onChange={handleToggle}>
            <ToggleButton id="tbg-map" value="map" variant='' className='px-4'>Map</ToggleButton>
            <ToggleButton id="tbg-list" value="list" variant='' className='px-4'>List</ToggleButton>
          </ToggleButtonGroup>
        </div>
      }

      <Container fluid className='justify-content-center mt-3' style={{ width: '95vw' }} >
        {viewMode === 'map' ? (
          loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (

            <>
              <MapComponent locations={locations} documents={documents} setSelectedLocation={setSelectedLocation} />

              {isLogged &&
                <Container fluid className='align-items-end mt-1'>
                  {selectedLocation ? (
                    <>
                      <div className='mt-4'>
                        <div className=' d-flex justify-content-center'>
                          <Card className='text-start form p-3'>
                            <Button variant="link" style={{ color: 'black', position: 'absolute', right: '0px', top: '0px' }} onClick={() => setSelectedLocation(null)}>
                              <i className="bi bi-x h2"></i>
                            </Button>
                            <div className='m-3'>
                              <h4>Selected Location:</h4>
                              <p>Latitude: {selectedLocation.lat.toFixed(4)}, Longitude: {selectedLocation.lng.toFixed(4)}</p>
                            </div>
                            <div className='text-center'>
                              <Button
                                variant="dark"
                                className='py-1 rounded-pill btn-document'
                                size="sm"
                                onClick={() => navigate('documents/create-document', { state: { location: selectedLocation } })}
                                disabled={!selectedLocation} // Disable button if no location is selected
                              >
                                <h6>
                                  Add document
                                </h6>
                              </Button>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h6 className="text-muted">Select a location on the map to create a new document or select a document to edit it.</h6>
                    </>
                  )}
                </Container>
              }
            </>
          )

        ) : (
          <>
            <Card className="mt-3">
              <div className='d-flex p-3'>
                <div className='me-3' style={{ width: '30%', overflowY: 'auto', maxHeight: '600px' }}>
                  {loading ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    <Card>
                      <Card.Header>Document List</Card.Header>
                      <ListGroup>
                        {documents.map((doc, index) => (
                          <ListGroup.Item
                            key={index}
                            onClick={() => handleDocumentClick(doc)}
                            style={{ cursor: 'pointer', fontWeight: selectedDocument === doc ? 'bold' : 'normal' }}
                          >
                            {doc.Title}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card>
                  )}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <Card className="mb-3" style={{ height: '400px' }}>
                    {selectedDocument ? (
                      <>
                        <Card.Header>
                          <strong>{selectedDocument.Title}</strong>
                          <img src={srcicon} alt="Document Icon" style={{ float: 'right', width: '24px', height: '24px' }} />
                        </Card.Header>
                        <Card.Body>
                          <Card.Text>
                            <strong>Description:</strong> {selectedDocument.Description} <br />
                            <strong>Scale:</strong> {selectedDocument.Scale} <br />
                            <strong>Issuance Date:</strong> {selectedDocument.Issuance_Date} <br />
                            <strong>Location:</strong> Lat: {locations[selectedDocument.IdLocation].Latitude.toFixed(2)} Long: {locations[selectedDocument.IdLocation].Longitude.toFixed(2)} <br />
                            <strong>StakeHolder:</strong> {stakeholders[selectedDocument.IdStakeholder - 1].name} <br />
                            <strong>Language:</strong> {selectedDocument.Language} <br />
                            <strong>Pages:</strong> {selectedDocument.Pages} <br />
                            <strong>Type:</strong> {documentTypes[selectedDocument.IdType - 1].type} <br />
                            <strong>Number of connections:</strong> {numberofconnections} <br />
                          </Card.Text>

                        </Card.Body>
                        <Card.Footer>
                          <div className="text-center my-3">
                            <Button variant="success " className="me-2" onClick={() => setShowAddConnection(true)}>
                                Add Connection
                            </Button>
                            <Button variant="primary" className="me-2" onClick={handleModifyClick}>Modify</Button>
                          </div>
                        </Card.Footer>
                      </>
                    ) : (
                      <div className="text-muted">Select a document to view its specifications.</div>
                    )}
                  </Card>
                </div>
              </div>
              <Modal show={showAddConnection} centered onHide={() => setShowAddConnection(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Connection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formDocument" style={{ position: 'relative' }}>
                        <Form.Label>Document</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter document name"
                            value={selectDocumentSearch?.Title || ""}
                            onChange={handleSearchChange}
                            autoComplete="off" // Prevents browser autocomplete
                        />

                        {/* Render the dropdown list of suggestions */}
                        {filteredDocuments.length > 0 && (
                            <ListGroup style={{ position: 'absolute', top: '100%', zIndex: 1, width: '100%' }}>
                            {filteredDocuments.map((doc) => (
                                <ListGroup.Item
                                key={doc.IdDocument}
                                action
                                onClick={() => handleSelectionDocument(doc)}
                                >
                                {doc.Title}
                                </ListGroup.Item>
                            ))}
                            </ListGroup>
                        )}
                    </Form.Group>
                    <Form.Group controlId="connectionTypeSelect" className="mb-3">
                        <Form.Label>Connection Type</Form.Label>
                        <Form.Select
                            value={connectionType}
                            onChange={(e) => setConnectionType(e.target.value)}
                        >
                            <option value="">Select connection type</option>
                            {Object.values(typeConnections).map((type) => (
                                <option key={type.IdConnection} value={type.IdConnection}>
                                    {type.Type}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => closeModal()}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddConnection}>
                        Add Connection
                    </Button>
                </Modal.Footer>
            </Modal>
            </Card>
            <div className='text-end mt-4 me-5'>
              <Button
                variant="dark"
                className='rounded-pill btn-document py-1'
                size="lg"
                onClick={() => navigate('documents/create-document', { state: { location: selectedLocation } })}
              >
                <h6>
                  Add new document
                </h6>
              </Button>
            </div>
          </>
        )}
      </Container>

    </>
  );
}

export default Home;
