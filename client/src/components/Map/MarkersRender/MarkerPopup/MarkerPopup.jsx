import {
    MDBCarousel,
    MDBCarouselItem,
    MDBContainer,
    MDBTypography,
} from 'mdb-react-ui-kit'
import uuid from 'react-uuid'

const MarkerPopup = ({ marker }) => {
    return (
        <MDBContainer className="d-block justify-content-center p-0">
            <MDBTypography tag="h3" className="text-center m-2">
                {marker.name}
            </MDBTypography>

            {marker.img.length > 1 ? (
                <MDBCarousel showControls>
                    {marker.img.map((img, index) => {
                        return (
                            <MDBCarouselItem itemId={index + 1} key={uuid()}>
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
            <MDBContainer fluid className="mt-2 mb-2 pr-1 pl-1">
                {marker.description}
            </MDBContainer>
        </MDBContainer>
    )
}

export default MarkerPopup
