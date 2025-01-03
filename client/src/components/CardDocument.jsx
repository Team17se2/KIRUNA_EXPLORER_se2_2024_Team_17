import { useContext, useEffect, useState } from "react";
import { Badge, Button, Card, Placeholder } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../API";
import PropTypes from 'prop-types';
import AppContext from "../AppContext";

function CardDocument({ document, locationType, latitude, longitude, handleMarkerClick, setSelectedDocument, isLogged, area }) {

  //check prototype
  const navigate = useNavigate();
  const viewMode = useContext(AppContext).viewMode.viewMode;
  const setViewMode = useContext(AppContext).viewMode.setViewMode;

  const [resource, setResource] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [scales, setScales] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [typeConnections, setTypeConnections] = useState({});
  const [documentTypes, setDocumentTypes] = useState([]);
  const [attachedDocuments, setAttachedDocuments] = useState([]);

  
  const crypto = window.crypto || window.msCrypto;
  let array = new Uint32Array(1);


  const getIcon = () => {
    let iconPath = '';
    if (Array.isArray(document?.IdStakeholder) && document?.IdStakeholder.length > 0) {
      iconPath = `src/icon/${document?.IdStakeholder[0].Color ? document?.IdStakeholder[0].Color : '8A9FA4'}/${documentTypes[document?.IdType - 1]?.iconsrc ? documentTypes[document?.IdType - 1]?.iconsrc : 'other.svg'}`;
    } else {
      iconPath = `src/icon/${stakeholders[document?.IdStakeholder - 1]?.color}/${documentTypes[document?.IdType - 1]?.iconsrc}`;
    }
    return iconPath;
  };

  const handleConnectedDocument = async (id) => {
    const doc = await API.getDocumentById(id);
    const stakeholders = await API.getStakeholderByDocumentId(doc?.IdDocument);
    handleMarkerClick({ ...doc, IdStakeholder: stakeholders });
  };



  const getDocumentTypeName = (id) => {
    const type = documentTypes.find((t) => t.id === id);
    console.log('Finding type for id:', id, 'Result:', type);
    return type ? type.type : 'Unknown';
  };

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const types = await API.getAllTypesDocument();
        setDocumentTypes(types);
        setLoading(false);

      } catch (err) {
        console.error(err);
      }
    };
    const fetchStakeholders = async () => {
      try {
        const stakeholders = await API.getAllStakeholders();
        setStakeholders(stakeholders);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchResources = async () => {
      try {
        const res = await API.getDocumentResources(document?.IdDocument);
        setResource(res);
        setLoading(false);
      } catch (err) {
        if (err === 404) {
          setResource([]);
        } else {
          console.error(err);
        }
      }
    };
    const fetchAttachedDocuments = async () => {
      try {
        const docs = await API.getDocumentAttachments(document?.IdDocument);
        setAttachedDocuments(docs);
        setLoading(false);
        return docs;
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };


    const fetchDocuments = async () => {
      try {
        const res = await API.getAllDocuments();
        setDocuments(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    const getAllTypeConnections = async () => {
      try {
        const res = await API.getAllTypeConnections();
        const typeConnectionId = res.reduce((acc, conn) => {
          acc[conn.IdConnection] = conn;
          return acc;
        }, {});
        setTypeConnections(typeConnectionId);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchScales = async () => {
      try {
        const res = await API.getScales();
        const scalesArray = [];
        res.forEach(scale => {
          scalesArray[scale.id] = scale;
        });
        setScales(scalesArray);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchDocumentConnections = async () => {
      try {
        const res = await API.getDocumentConnection(document?.IdDocument);
        setConnections(res);
        setLoading(false);
      }
      catch (err) {
        console.error(err);
      }
    };

    setLoading(true);
    fetchStakeholders();
    fetchDocumentConnections();
    fetchResources();
    fetchAttachedDocuments();
    fetchScales();
    fetchDocuments();
    getAllTypeConnections();
    fetchDocumentTypes();
    
  }, [document?.IdDocument]);



  const handleModifyDocument = () => {
    if (document) {
      navigate(`/documents/modify-document/${document?.IdDocument}`, { state: { document: document, location: (locationType == "Point") ? { lat: latitude, lng: longitude, type: locationType } : { area: area, type: locationType }, type: locationType } });
    }
  };

  return (
    loading ? (
      <Card>
        <Button
          variant="close"
          onClick={() => setSelectedDocument(null)}
          style={{
            position: 'absolute',
            top: '2%',
            right: '2%'
          }}
        />
        <Card.Header className='document px-4'>
          <Placeholder as={Card.Title} animation="wave">
            <Placeholder xs={6} />
          </Placeholder>
        </Card.Header>
        <Card.Body className='document-card text-start'>
          <div className='d-flex'>

            <div className='col-6 m-1'>

              <Placeholder as={Card.Text} animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="wave">
                <Placeholder xs={6} />
              </Placeholder>

              <Placeholder as={Card.Text} animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="wave">
                <Placeholder xs={10} />
              </Placeholder>

              <Placeholder as='strong' animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
              <div style={{ overflowY: "auto", maxHeight: "70px" }}>
                <Placeholder as='a' animation="wave">
                  <Placeholder xs={10} />
                </Placeholder>
                <Placeholder as='a' animation="wave">
                  <Placeholder xs={10} />
                </Placeholder>
                <Placeholder as='a' animation="wave">
                  <Placeholder xs={10} />
                </Placeholder>
                <Placeholder as='a' animation="wave">
                  <Placeholder xs={10} />
                </Placeholder>
                <Placeholder as='a' animation="wave">
                  <Placeholder xs={10} />
                </Placeholder>
              </div>
            </div>
            <div className="m-1 col-6">
              <Placeholder as={Card.Text} animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as='p' animation="wave">
                <Placeholder xs={10} />
                <Placeholder xs={10} />
                <Placeholder xs={10} />
                <Placeholder xs={10} />
                <Placeholder xs={10} />
                <Placeholder xs={10} />
                <Placeholder xs={10} />
                <Placeholder xs={10} />
                <Placeholder xs={10} />
              </Placeholder>
            </div>
          </div>
        </Card.Body>
        {isLogged && (
          <Card.Footer className=' text-end' >
            <Placeholder.Button variant='dark' xs={3} aria-hidden="true" />
          </Card.Footer>
        )}
      </Card>
    ) : (

      <Card
        style={{
          minHeight: '650px'
        }}
      >
        <Button
          variant="close"
          onClick={() => {
            setSelectedDocument(null);
          }}
          style={{
            position: 'absolute',
            top: '2%',
            right: '2%'
          }}
        />
        <Card.Header className='px-4 d-flex align-items-center'>
          <img alt="Document Icon" src={getIcon()} style={{ height: '50px' }} />
          <Card.Title className="my-3 mx-5 col"><strong>{document?.Title}</strong></Card.Title>
        </Card.Header>
        <Card.Body className='document-card text-start' style={{ overflowY: 'auto', maxHeight: '520px' }}>
          <div className='d-flex'>

            <div className='col-6 m-1'>

              <Card.Text style={{ fontSize: '16px' }}><strong>Date:</strong> {document?.Issuance_Date}</Card.Text>

              <Card.Text style={{ fontSize: '16px' }}><strong>Scale Name:</strong> {scales[document?.IdScale] ? scales[document?.IdScale].scale_text : ""}</Card.Text>
              {document?.IdScale> 4 ? (
                <Card.Text style={{ fontSize: '16px' }}>
                  <strong>Scale Number: </strong>
                  {scales[document?.IdScale]?.scale_number}
                </Card.Text>
              ) : null}

              {document?.Language &&
                <Card.Text style={{ fontSize: '16px' }}>
                  <strong>Language: </strong>{document?.Language}
                </Card.Text>}
              {document?.IdType &&
                <Card.Text style={{ fontSize: '16px' }}>
                  <strong>Type: </strong>{getDocumentTypeName(document?.IdType)}
                </Card.Text>}

              {document?.IdStakeholder && stakeholders &&
                <Card.Text style={{ fontSize: '16px' }}>
                  <strong>Stakeholders: </strong> {
                    Array.isArray(document.IdStakeholder)
                      ? document.IdStakeholder
                        .map((stakeholder) => stakeholder.Name || "Unknown")
                        .join(", ") // Join the names into a comma-separated string
                      : "Unknown"
                  }</Card.Text>}

                  {document?.Pages!=null && 
                    <Card.Text style={{ fontSize: '16px' }}>
                      <strong>Pages:</strong> {document?.Pages}
                    </Card.Text>
                  }

              <strong>Connections:</strong> {connections.length}
              {connections.length > 0 && (
                <div
                  className="mb-3 me-2"
                  style={{
                    overflowY: "auto",
                    maxHeight: "80px",
                    overflowX: "auto",
                  }}
                >
                  {connections.map((conn) => (
                    <p
                      key={conn.IdConnection}
                      style={{
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                        margin: "0", // Remove all margins
                        padding: "0", // Remove any padding
                        width: '100px',
                      }}
                    >
                      <span>{typeConnections[conn.IdConnection]?.Type || "Unknown"} - </span>
                      <span
                        className="link"
                        role="button"
                        onClick={() =>
                          conn.IdDocument1 === document?.IdDocument
                            ? handleConnectedDocument(conn.IdDocument2)
                            : handleConnectedDocument(conn.IdDocument1)
                        }
                        onKeyDown={() => { }}
                        onFocus={() => { }}
                      >
                        {documents.find((doc) =>
                          conn.IdDocument1 === document?.IdDocument
                            ? doc.IdDocument === conn.IdDocument2
                            : doc.IdDocument === conn.IdDocument1
                        )?.Title || "Unknown"}
                      </span>
                    </p>
                  ))}
                </div>
              )}

              <Card.Text style={{ fontSize: '16px' }}>
                <strong>Original Attachments :</strong><br></br>
                <div style={{ overflowY: "auto", maxHeight: "100px" }}>
                  {attachedDocuments.length > 0 ? (
                    attachedDocuments.map((res, index) => (
                      <>
                        <a href={`http://localhost:3001${res.url}`} target="_blank" key={index+ crypto.getRandomValues(array)} style={{ fontSize: '13px' }} ><u>{res.filename}</u></a>
                        <br></br>
                      </>
                    ))
                  ) : (
                    <span style={{ fontSize: '13px' }}>No Attachments added</span>
                  )}
                </div>
              </Card.Text>


              <Card.Text style={{ fontSize: '16px' }}>
                <strong>Original Resource:</strong><br></br>
                <div style={{ overflowY: "auto", maxHeight: "100px" }}>
                  {resource.length > 0 ? (
                    resource.map((res, index) => (
                      <>
                        <a href={`http://localhost:3001${res.url}`} target="_blank" key={index+crypto.getRandomValues(array)} style={{ fontSize: '13px' }} ><u>{res.filename}</u></a>
                        <br></br>
                      </>
                    ))

                  ) : (
                    <span style={{ fontSize: '13px' }}>No original resource added</span>
                  )}
                </div>
              </Card.Text>
            </div>

            <div className="m-1 col">
              {/* Description */}
              <strong style={{ fontSize: '16px' }}>Description:</strong>
              <Card.Text style={{ marginTop: '5px', height: '300px', overflowY: 'auto', fontSize: '16px' }}>{document?.Description}</Card.Text>
              {/* Location Badge */}
              {isLogged &&
                <div className="d-flex justify-content-center">
                  <Badge bg='light' className="p-3 mt-4" style={{ color: 'black', fontWeight: 'normal' }}>
                    {locationType == 'Point' ? (
                      <>
                        <Card.Text style={{ fontSize: '16px' }}>
                          <strong>Latitude:</strong> {latitude}
                        </Card.Text>
                        <Card.Text style={{ fontSize: '16px' }}>
                          <strong>Longitude:</strong> {longitude}
                        </Card.Text>
                      </>
                    ) : (
                        <Card.Text style={{ fontSize: '16px' }}>
                          <strong>Area:</strong> {area?.Area_Name}
                        </Card.Text>
                    )
                    }
                  </Badge>
                </div>
              }
            </div>
          </div>
        </Card.Body>
        <Card.Footer className='d-flex justify-content-between align-items-center' >
          <div>
            {viewMode !== 'map' && <Button variant="outline-secondary" size='sm' className='rounded-pill px-2 mx-1' onClick={() => setViewMode('map')}>View on Map</Button>}
            {viewMode !== 'list' && <Button variant="outline-secondary" size='sm' className='rounded-pill px-2 mx-1' onClick={() => setViewMode('list')}>View on List</Button>}
            {viewMode !== 'diagram' && <Button variant="outline-secondary" size='sm' className='rounded-pill px-2 mx-1' onClick={() => setViewMode('diagram')}>View on Diagram</Button>}
          </div>
          {isLogged && (
            <Button id="modify-document" variant="secondary" className='btn-document rounded-pill px-4' onClick={handleModifyDocument}>Modify</Button>
          )}
        </Card.Footer>
      </Card>
    )
  );
}

CardDocument.propTypes = {
  document: PropTypes.object.isRequired,
  locationType: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  handleMarkerClick: PropTypes.func.isRequired,
  setSelectedDocument: PropTypes.func.isRequired,
  isLogged: PropTypes.bool.isRequired,
  area: PropTypes.string,
};
Document.propTypes = {
  IdDocument: PropTypes.number.isRequired,
  Title: PropTypes.string.isRequired,
  Issuance_Date: PropTypes.string.isRequired,
  IdScale: PropTypes.number.isRequired,
  Language: PropTypes.string,
  IdStakeholder: PropTypes.array,
  Pages: PropTypes.number,
  Description: PropTypes.string.isRequired,
  AreaName: PropTypes.string,
};

export default CardDocument;