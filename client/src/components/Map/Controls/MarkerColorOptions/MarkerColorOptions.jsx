import { MDBContainer } from 'mdb-react-ui-kit'
import uuid from 'react-uuid'

const MarkerColorOptions = ({ color, setColor }) => {
    const colorOptions = ['black', 'white', 'blue', 'yellow', 'skyblue']

    const handleSelectedStyle = (newColor) => {
        if (newColor === color) {
            return 'marker-icon-selected'
        }
        return ''
    }
    return (
        <MDBContainer className="row justify-content-center">
            {colorOptions.map((color, index) => {
                return (
                    <MDBContainer
                        key={uuid()}
                        className={`col-lg-2 col-md-${
                            index === 0 ? '12' : '6'
                        } marker-color-option marker-color-option--${color} ${handleSelectedStyle(
                            color
                        )}`}
                        onClick={() => setColor(color)}
                    />
                )
            })}
        </MDBContainer>
    )
}

export default MarkerColorOptions
