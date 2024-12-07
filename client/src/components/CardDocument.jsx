import { useEffect, useState } from "react";
import { Badge, Button, Card, Placeholder } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../API";
import PropTypes from 'prop-types';

function CardDocument ({document, locationType, latitude, longitude, setShowCard, setSelectedDocument, isLogged, viewMode, area, numberofconnections}) {

  //check prototype
  const navigate = useNavigate();
  
  const [resource, setResource] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [scales, setScales] = useState([]);
  const [documents, setDocuments] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState([]); 
  const [typeConnections, setTypeConnections] = useState({}); 
  

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
          const res = await API.getDocumentResources(document.IdDocument);
          setResource(res);
      } catch (err) {
        console.log(err);
        if(err === 404) {
          setResource([]);
        } else {
          console.error(err);
        }
      }
      setLoading(false);
    };
    const fetchStakeholders = async () => {
      setLoading(true);
      try {
        const res = await API.getAllStakeholders();
        setStakeholders(res);
        console.log(res);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    const fetchDocuments = async () => { 
      try { 
        const res = await API.getAllDocuments(); 
        setDocuments(res); 
      } catch (err) { 
        console.error(err); 
      } 
    }; 
    const getAllTypeConnections = async () => { 
      try { 
        console.log("get all type connections"); 
        const res = await API.getAllTypeConnections(); 
        console.log(res); 
 
        const typeConnectionId = res.reduce((acc, conn) => { 
          acc[conn.IdConnection] = conn; 
          return acc; 
        }, {}); 
        setTypeConnections(typeConnectionId); 
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
      } catch (err) { 
          console.error(err); 
      } 
    };
    const fetchDocumentConnections = async () => { 
      try { 
        const res = await API.getDocumentConnection(document.IdDocument); 
        console.log("Document connections"); 
        console.log(res); 
        setConnections(res); 
      } 
      catch (err) { 
        console.error(err); 
      } 
    }; 
    fetchDocumentConnections();
    fetchResources();
    fetchStakeholders();
    fetchScales();
    fetchDocuments(); 
    getAllTypeConnections();
  }, [document?.IdDocument]);

  
 
  const handleModifyDocument = () => {
    if (document) {
      console.log(locationType);
      navigate(`/documents/modify-document/${document.IdDocument}`, { state: { document: document , location: (locationType=="Point") ? {lat: latitude, lng: longitude,type:locationType} : {area: area,type:locationType}, type:locationType } });
    }
  };
  console.log(document);
  
  return (
    loading ? (
      <Card>
      <Button 
        variant="close"
        onClick={() => {
          if(viewMode == 'map') {
          setShowCard(false);
          }
          setSelectedDocument(null);
        }} 
        style={{ 
          position: 'absolute', 
          top: '2%', 
          right: '2%' 
          }} 
          />
      <Card.Header className='document px-4'>
        <Placeholder as={Card.Title} animation="wave">
          <Placeholder xs={6}  />
        </Placeholder>
      </Card.Header>
      <Card.Body className='document-card text-start'>
        <div className='d-flex'>

          <div className='col-6 m-1'>

            <Placeholder as={Card.Text} animation="wave">
              <Placeholder xs={6}  />
            </Placeholder>
            <Placeholder as={Card.Text} animation="wave">
              <Placeholder xs={6}  />
            </Placeholder>
                        
            <Placeholder as={Card.Text} animation="wave">
              <Placeholder xs={6}  />
            </Placeholder>
            <Placeholder as={Card.Text} animation="wave">
              <Placeholder xs={6}  />
            </Placeholder>
            <Placeholder as={Card.Text} animation="wave">
              <Placeholder xs={10}  />
            </Placeholder>
            
            <Placeholder as='strong' animation="wave">
              <Placeholder xs={6}  />
            </Placeholder>
            <div style={{ overflowY: "auto",maxHeight : "70px"}}>
              <Placeholder as='a' animation="wave">
                <Placeholder xs={10}  />
              </Placeholder>
              <Placeholder as='a' animation="wave">
                <Placeholder xs={10}  />
              </Placeholder>
              <Placeholder as='a' animation="wave">
                <Placeholder xs={10}  />
              </Placeholder>
              <Placeholder as='a' animation="wave">
                <Placeholder xs={10}  />
              </Placeholder>
              <Placeholder as='a' animation="wave">
                <Placeholder xs={10}  />
              </Placeholder>
            </div>
            <div className="text-center mt-4">                
              {isLogged &&
                locationType == 'Point' ? (
                  <>
                  <Placeholder as='strong' animation="wave">
                    <Placeholder xs={6}  />
                  </Placeholder><br></br>
                  <Placeholder as='strong' animation="wave">
                    <Placeholder xs={6}  />
                  </Placeholder>
                </>  
                ) : (
                  <>
                    <Placeholder as='strong' animation="wave">
                      <Placeholder xs={6}  />
                    </Placeholder>
                  </>
                  ) 
                }
            </div>
          </div>
          <div className="m-1 col-6"> 
            <Placeholder as={Card.Text} animation="wave">
              <Placeholder xs={6}  />
            </Placeholder>
            <Placeholder as='p' animation="wave">
              <Placeholder xs={10}  />
              <Placeholder xs={10}  />
              <Placeholder xs={10}  />
              <Placeholder xs={10}  />
              <Placeholder xs={10}  />
              <Placeholder xs={10}  />
              <Placeholder xs={10}  />
              <Placeholder xs={10}  />
              <Placeholder xs={10}  />
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
      style= {{
          minHeight:'650px'
        }}
    >
      <Button 
        variant="close"
        onClick={() => {
          if(viewMode == 'map') {
          setShowCard(false);
          }
          setSelectedDocument(null);
        }} 
        style={{ 
          position: 'absolute', 
          top: '2%', 
          right: '2%' 
          }} 
          />
      <Card.Header className='document px-4'>
        <Card.Title><strong>{document?.Title}</strong></Card.Title>
      </Card.Header>
      <Card.Body className='document-card text-start'>
        <div className='d-flex'>

          <div className='col-6 m-1'>

            <Card.Text style={{ fontSize: '16px' }}><strong>Date:</strong> {document?.Issuance_Date}</Card.Text>
            <Card.Text style={{ fontSize: '16px' }}><strong>Scale Name:</strong> {scales[document?.IdScale] ? scales[document?.IdScale].scale_text : ""}</Card.Text>
            {scales[document?.IdScale] && scales[document?.IdScale].scale_number !== '' ? (
              <Card.Text style={{ fontSize: '16px' }}>
                <strong>Scale Number: </strong>
                {scales[document?.IdScale].scale_number}
              </Card.Text>
            ) : null}            
            {document?.Language && <Card.Text style={{ fontSize: '16px' }}><strong>Language:</strong> {document?.Language}</Card.Text>}
            {document?.IdStakeholder && stakeholders && <Card.Text style={{ fontSize: '16px' }}><strong>Stakeholder :</strong> {
              document.IdStakeholder && Array.isArray(document.IdStakeholder)
              ? document.IdStakeholder
                  .map((stakeholder) => stakeholder.Name || "Unknown")
                  .join(", ") // Join the names into a comma-separated string
              : "Unknown"
            }</Card.Text>}
            {document?.Pages && <Card.Text style={{ fontSize: '16px' }}><strong>Pages:</strong> {document?.Pages}</Card.Text>}
            <Card.Text style={{ fontSize: '16px'}}><strong>Connections:</strong> {numberofconnections}</Card.Text> 
            {numberofconnections > 0 && ( 
              <Card.Text style={{ fontSize: '16px'}}> 
              <strong>Connected to:</strong>  
              <br></br> 
              {connections.map((conn) => ( 
                <span key={conn.IdConnection}> 
                  {conn.IdDocument1 === document?.IdDocument 
                    ? `${documents.find( 
                        (doc) => doc.IdDocument === conn.IdDocument2 
                      )?.Title || "Unknown"} - ${ 
                        typeConnections[conn.IdConnection]?.Type || "Unknown" 
                      }` 
                    : `${documents.find( 
                        (doc) => doc.IdDocument === conn.IdDocument1 
                      )?.Title || "Unknown"} - ${ 
                        typeConnections[conn.IdConnection]?.Type || "Unknown" 
                      }`} 
                  <br /> 
                </span> 
              ))} 
            </Card.Text> 
            )} 
            <Card.Text style={{ fontSize: '16px' }}> 
              <strong>Original Resource:</strong><br></br> 
              <div style={{ overflowY: "auto",maxHeight : "100px"}}> 
                {resource.length > 0 ? ( 
                  resource.map((res, index) => ( 
                    <> 
                      <a href={`http://localhost:3001${res.url}`} target="_blank" key={index} style={{fontSize:'13px'}} ><u>{res.filename}</u></a> 
                      <br></br> 
                    </> 
                  )) 
                 
                ): ( 
                  <span style={{fontSize:'13px'}}>No original resource added</span> 
                )} 
              </div> 
              </Card.Text> 
            {isLogged && 
              <Badge bg='light' className="p-3 mt-4" style={{color:'black', fontWeight:'normal'}}> 
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
                <> 
                <Card.Text style={{ fontSize: '16px'}}> 
                <strong>Area:</strong> {area?.Area_Name} 
                </Card.Text> 
                </> 
                )  
              } 
              </Badge> 
            } 
          </div> 
          <div className="m-1">  
            <strong style={{fontSize:'16px'}}>Description:</strong> 
            <Card.Text style={{marginTop:'5px',height: '300px', overflowY: 'auto' , fontSize: '16px' }}>{document?.Description}</Card.Text> 
          </div> 
        </div> 
      </Card.Body> 
      {isLogged && ( 
        <Card.Footer className=' text-end' > 
          <Button variant="secondary" className='btn-document rounded-pill px-3' onClick={handleModifyDocument}>Modify</Button> 
        </Card.Footer> 
      )} 
    </Card> 
  ) 
  );
} 

CardDocument.propTypes = {
  document: PropTypes.object.isRequired,
  locationType: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  setShowCard: PropTypes.func.isRequired,
  setSelectedDocument: PropTypes.func.isRequired,
  isLogged: PropTypes.bool.isRequired,
  viewMode: PropTypes.string,
  area: PropTypes.string,
  numberofconnections: PropTypes.number, // Ensure this matches the expected type
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