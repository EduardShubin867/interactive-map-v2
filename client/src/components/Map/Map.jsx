import { MapContainer, ImageOverlay, useMap } from 'react-leaflet'
import { useState } from 'react'

import { useLocation } from 'react-router-dom'

import MarkersRender from './MarkersRender/MarkersRender'
import Controls from './Controls/Controls'
import { useAuth } from '../../context/AuthContext'

import 'leaflet/dist/leaflet.css'
import './mapStyles.css'
import './scss/Map.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

const Map = ({ customImage }) => {
    const { isAdmin } = useAuth()

    const [mapEdit, setMapEdit] = useState(true)
    const location = useLocation().pathname.slice(1)

    const bounds = [
        [0, 0],
        [9, 16],
    ]

    const center = [2.5, 7.2]

    const handleSwitchChange = () => {
        setMapEdit(!mapEdit) // Инвертируем текущее состояние
    }

    return (
        <div id="map">
            <MapContainer
                center={center}
                zoom={8}
                maxZoom={12}
                minZoom={8}
                scrollWheelZoom={true}
            >
                <ImageOverlay url={customImage} bounds={bounds} />
                <MarkersRender mapEdit={mapEdit} location={location} />

                {isAdmin ? (
                    <Controls
                        mapEdit={mapEdit}
                        handleSwitchChange={handleSwitchChange}
                        location={location}
                    />
                ) : null}
                <PanRestrict bounds={bounds} />
            </MapContainer>
        </div>
    )
}

// Ограничение перемещения за пределы карты
function PanRestrict({ bounds }) {
    const map = useMap()
    map.setMaxBounds(bounds)
    map.on('drag', () => {
        if (
            map.getBounds().getNorth() < bounds[0][0] ||
            map.getBounds().getEast() < bounds[0][1] ||
            map.getBounds().getSouth() > bounds[1][0] ||
            map.getBounds().getWest() > bounds[1][1]
        ) {
            map.panInsideBounds(bounds)
        }
    })

    return null
}

export default Map
