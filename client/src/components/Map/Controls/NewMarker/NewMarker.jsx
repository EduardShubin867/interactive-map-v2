import { Marker, Popup, useMapEvents } from 'react-leaflet'
import {
    MDBCarousel,
    MDBCarouselItem,
    MDBContainer,
    MDBTypography,
} from 'mdb-react-ui-kit'
import L from 'leaflet'
import uuid from 'react-uuid'

import '../MarkerColorOptions/markerColor.css'

const NewMarker = ({
    newPosition,
    setNewPosition,
    newMarkerIcon,
    newMarkerName,
    newMarkerDescription,
    newMarkerImg,
    color,
}) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng
            setNewPosition([lat, lng])
        },
    })

    const markerIcon = L.icon({
        iconUrl: `/assets/images/icons/${newMarkerIcon}.svg`,
        iconSize: [32, 32],
        className: `marker-color--${color}`,
    })

    return newPosition ? (
        <Marker position={newPosition} icon={markerIcon}>
            <Popup className="marker-popup">
                <MDBContainer className="d-block justify-content-center p-0 new-marker-popup">
                    <MDBTypography
                        tag="h3"
                        className={`text-center m-2 ${
                            newMarkerName ? '' : 'text-placeholder'
                        }`}
                    >
                        {newMarkerName ? newMarkerName : 'Название'}
                    </MDBTypography>

                    <hr className="hr hr-blurry mt-1 mb-2" />

                    {newMarkerImg && newMarkerImg.length > 0 ? (
                        newMarkerImg.length > 1 ? (
                            <MDBCarousel showControls>
                                {newMarkerImg.map((img, index) => {
                                    return (
                                        <MDBCarouselItem
                                            itemId={index + 1}
                                            key={uuid()}
                                        >
                                            <img
                                                src={img.data_url}
                                                className="img-fluid"
                                                alt="..."
                                            />
                                        </MDBCarouselItem>
                                    )
                                })}
                            </MDBCarousel>
                        ) : (
                            <img
                                src={
                                    newMarkerImg ? newMarkerImg[0].data_url : ''
                                }
                                className="img-fluid"
                                alt="..."
                            />
                        )
                    ) : (
                        <div className="grey-box-placeholder" />
                    )}
                    <MDBContainer
                        fluid
                        className={`mt-2 mb-2 pr-1 pl-1 ${
                            newMarkerDescription ? '' : 'text-placeholder'
                        }`}
                    >
                        {newMarkerDescription
                            ? newMarkerDescription
                            : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
                    </MDBContainer>
                </MDBContainer>
            </Popup>
        </Marker>
    ) : null
}

export default NewMarker
