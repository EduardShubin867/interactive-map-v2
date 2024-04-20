import { useState, useEffect, useRef } from 'react'
import { Form, Button, Container, Alert } from 'react-bootstrap'
import {
    MDBContainer,
    MDBPopover,
    MDBPopoverBody,
    MDBPopoverHeader,
    MDBSwitch,
} from 'mdb-react-ui-kit'
import L from 'leaflet'
import { useDispatch } from 'react-redux'
import uuid from 'react-uuid'

import NewMarker from './NewMarker/NewMarker'
import ImagesUpload from '../MarkersRender/MarkerPopupEdit/ImagesUpload/ImagesUpload'
import { addNewMarker } from '../../../features/marker/markerSlice'
import MarkerIcon from './MarkerIcon/MarkerIcon'
import MarkerColorOptions from './MarkerColorOptions/MarkerColorOptions'

const Controls = ({ mapEdit, handleSwitchChange, location }) => {
    const containerRef = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (containerRef.current) {
            L.DomEvent.disableClickPropagation(containerRef.current)
            L.DomEvent.disableScrollPropagation(containerRef.current)
        }
    }, [])

    const [newPosition, setNewPosition] = useState(null)
    const [newMarkerName, setNewMarkerName] = useState('')
    const [newMarkerDescription, setNewMarkerDescription] = useState('')
    const [newMarkerImage, setNewMarkerImage] = useState(null)
    const [newMarkerIcon, setNewMarkerIcon] = useState('location_on_black_24dp')
    const [validated, setValidated] = useState(false)
    const [error, setError] = useState('')
    const [imageError, setImageError] = useState(true)
    const [color, setColor] = useState('black')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    //Add marker handle function
    const handleAddMarker = async (event) => {
        event.preventDefault()
        setValidated(true)

        if (event.currentTarget.checkValidity() === false) {
            return
        }

        if (!newPosition) {
            return
        }

        if (imageError) {
            return
        }

        const newMarker = {
            id: uuid(),
            name: newMarkerName,
            icon: newMarkerIcon,
            description: newMarkerDescription,
            img: newMarkerImage.map((img) => `/assets/images/${img.name}`),
            images: newMarkerImage,
            position: newPosition,
            color: color,
            location: location,
        }

        try {
            setAddRequestStatus('pending')
            await dispatch(addNewMarker(newMarker)).unwrap()

            setNewMarkerName('')
            setNewMarkerDescription('')
            setNewMarkerImage(null)
            setNewMarkerIcon('location_on_black_24dp')
            setNewPosition(null)
            setValidated(false)
            setError('')
        } catch (error) {
            console.error('Failed to save marker: ', error)
        } finally {
            setAddRequestStatus('idle')
        }
    }

    useEffect(() => {
        if (!newPosition) {
            setError('Пожалуйста, установите маркер')
        } else {
            setError('')
        }
    }, [newPosition])

    useEffect(() => {
        if (!(newMarkerImage && !(newMarkerImage.length === 0))) {
            setImageError(true)
        } else {
            setImageError(false)
        }
    }, [newMarkerImage])

    return (
        <div>
            {mapEdit ? (
                <NewMarker
                    newPosition={newPosition}
                    setNewPosition={setNewPosition}
                    newMarkerIcon={newMarkerIcon}
                    newMarkerName={newMarkerName}
                    newMarkerDescription={newMarkerDescription}
                    newMarkerImg={newMarkerImage}
                    color={color}
                />
            ) : null}
            <div className="leaflet-top leaflet-right" ref={containerRef}>
                <div className="leaflet-control leaflet-bar control-switch">
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                        }}
                    >
                        <MDBSwitch
                            id="adminSwitch"
                            checked={mapEdit}
                            onChange={handleSwitchChange}
                        />
                    </div>
                    {mapEdit ? (
                        <MDBPopover
                            color="secondary"
                            btnChildren="Добавить маркер"
                            placement="bottom"
                            className="mt-2"
                            btnClassName="control-btn mt-2"
                            poperStyle={{
                                width: '350px',
                                maxHeight: '800px',
                                overflowY: 'auto',
                            }}
                        >
                            <MDBPopoverHeader>Добавить маркер</MDBPopoverHeader>
                            <MDBPopoverBody>
                                <Container className="marker-control">
                                    <Form
                                        noValidate
                                        validated={validated}
                                        onSubmit={handleAddMarker}
                                    >
                                        <Form.Group
                                            className="mb-3"
                                            controlId="newMarkerName"
                                        >
                                            <Form.Label>
                                                Иконка маркера
                                            </Form.Label>
                                            <MDBContainer className="d-flex justify-content-center mb-1">
                                                <MarkerIcon
                                                    setNewMarkerIcon={
                                                        setNewMarkerIcon
                                                    }
                                                    newMarkerIcon={
                                                        newMarkerIcon
                                                    }
                                                    color={color}
                                                />
                                            </MDBContainer>
                                            <MarkerColorOptions
                                                color={color}
                                                setColor={setColor}
                                            />
                                        </Form.Group>

                                        <Form.Group
                                            className="mb-3"
                                            controlId="newMarkerName"
                                        >
                                            <Form.Label>
                                                Название маркера
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newMarkerName}
                                                onChange={(e) =>
                                                    setNewMarkerName(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Пожалуйста, введите название
                                                маркера.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="newMarkerDescription"
                                        >
                                            <Form.Label>Описание</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={newMarkerDescription}
                                                onChange={(e) =>
                                                    setNewMarkerDescription(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Пожалуйста, введите описание
                                                маркера.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group
                                            className="mb-3"
                                            controlId="newMarkerImage"
                                        >
                                            <Form.Label>
                                                Загрузить картинку
                                            </Form.Label>
                                            <ImagesUpload
                                                images={newMarkerImage}
                                                setImages={setNewMarkerImage}
                                            />
                                            {imageError && (
                                                <Alert
                                                    variant="danger"
                                                    className="mt-2"
                                                >
                                                    Пожалуйста, загрузите
                                                    изображение.
                                                </Alert>
                                            )}
                                        </Form.Group>
                                        {error && (
                                            <Alert variant="danger">
                                                {error}
                                            </Alert>
                                        )}
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="mb-3"
                                            disabled={
                                                addRequestStatus ===
                                                    'pending' && false
                                            }
                                        >
                                            Добавить маркер
                                        </Button>
                                    </Form>
                                </Container>
                            </MDBPopoverBody>
                        </MDBPopover>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Controls
