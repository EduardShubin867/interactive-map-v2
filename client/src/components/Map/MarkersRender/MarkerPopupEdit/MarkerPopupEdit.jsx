import { useState } from 'react'
import {
    MDBCarousel,
    MDBCarouselItem,
    MDBBtn,
    MDBContainer,
    MDBTypography,
    MDBInput,
    MDBTextArea,
} from 'mdb-react-ui-kit'
import uuid from 'react-uuid'
import { useDispatch } from 'react-redux'
import ImagesUpload from './ImagesUpload/ImagesUpload'

import {
    updateMarker,
    deleteMarker,
} from '../../../../features/marker/markerSlice'

const MarkerPopupEdit = ({ marker, location }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editImage, setEditImage] = useState(null)

    const dispatch = useDispatch()

    const handleEditClick = () => {
        setEditDescription(marker.description)
        setEditName(marker.name)
        setEditImage(
            marker.img.map((img) => {
                return { data_url: img, name: img.slice(15) }
            })
        )
        setIsEditing(!isEditing)
    }

    const handleCancelClick = () => {
        setEditDescription('')
        setEditName('')
        setEditImage('')
        setIsEditing(!isEditing)
    }

    const handleSaveClick = () => {
        dispatch(
            updateMarker({
                id: marker.id,
                name: editName,
                description: editDescription,
                img: editImage.map((img) => `/assets/images/${img.name}`),
                images: editImage.filter((imageFile) => {
                    return imageFile.file
                }),
                location,
            })
        ).unwrap()
        handleCancelClick()
    }

    const handleDeleteClick = () => {
        dispatch(deleteMarker({ id: marker.id, location })).unwrap()
    }

    return (
        <div className="d-flex justify-content-between">
            <MDBContainer className="d-block justify-content-center p-0">
                {isEditing ? (
                    <MDBInput
                        label
                        placeholder="Название"
                        id="marker-name"
                        className="edit-marker-name mb-1"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                    />
                ) : (
                    <MDBTypography tag="h3" className="text-center m-2">
                        {marker.name}
                    </MDBTypography>
                )}

                <hr className="hr hr-blurry mt-1 mb-2" />

                {isEditing ? (
                    <ImagesUpload images={editImage} setImages={setEditImage} />
                ) : marker.img.length > 1 ? (
                    <MDBCarousel showControls>
                        {marker.img.map((img, index) => {
                            return (
                                <MDBCarouselItem
                                    itemId={index + 1}
                                    key={uuid()}
                                >
                                    <img
                                        src={img}
                                        className="img-fluid"
                                        alt="..."
                                    />
                                </MDBCarouselItem>
                            )
                        })}
                    </MDBCarousel>
                ) : (
                    <img src={marker.img} className="img-fluid" alt="..." />
                )}

                {isEditing ? (
                    <MDBTextArea
                        id="marker-description"
                        className="small edit-marker-textarea mt-1"
                        rows="7"
                        defaultValue={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                    ></MDBTextArea>
                ) : (
                    <MDBContainer fluid className="mt-2 mb-2 pr-1 pl-1">
                        {marker.description}
                    </MDBContainer>
                )}
                <MDBContainer className="d-flex justify-content-between">
                    {isEditing ? (
                        <MDBBtn
                            outline
                            type="submit"
                            color="success"
                            className="m-1"
                            title="Сохранить"
                            onClick={handleSaveClick}
                        >
                            <i className="fas fa-save"></i>
                        </MDBBtn>
                    ) : (
                        <MDBBtn
                            outline
                            color="warning"
                            className="m-1"
                            title="Редактировать"
                            onClick={handleEditClick}
                        >
                            <i className="fas fa-pen"></i>
                        </MDBBtn>
                    )}
                    {isEditing ? (
                        <MDBBtn
                            outline
                            color="danger"
                            className="m-1"
                            title="Отмена"
                            onClick={handleCancelClick}
                        >
                            <i className="far fa-rectangle-xmark"></i>
                        </MDBBtn>
                    ) : null}
                    <MDBBtn
                        outline
                        color="danger"
                        className="m-1"
                        title="Удалить"
                        onClick={handleDeleteClick}
                    >
                        <i className="fas fa-trash-can"></i>
                    </MDBBtn>
                </MDBContainer>
            </MDBContainer>
        </div>
    )
}

export default MarkerPopupEdit
