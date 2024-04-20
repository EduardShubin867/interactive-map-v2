import uuid from 'react-uuid'

const MarkerIcon = ({ setNewMarkerIcon, newMarkerIcon, color }) => {
    const iconOptions = [
        'location_on_black_24dp',
        'map-pin',
        'house',
        'location_city_black_24dp',
    ]

    const handleSelectedStyle = (icon) => {
        if (newMarkerIcon === icon) {
            return 'marker-icon-selected'
        }
        return ''
    }

    return iconOptions.map((icon) => {
        return (
            <img
                key={uuid()}
                src={`/assets/images/icons/${icon}.svg`}
                alt={`${icon}`}
                className={`img-fluid marker-icon-options marker-color--${color} ${handleSelectedStyle(
                    icon
                )}`}
                onClick={() => setNewMarkerIcon(icon)}
            />
        )
    })
}

export default MarkerIcon
