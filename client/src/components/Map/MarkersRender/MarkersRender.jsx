import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import uuid from 'react-uuid'

import MarkerPopup from './MarkerPopup/MarkerPopup'
import MarkerPopupEdit from './MarkerPopupEdit/MarkerPopupEdit'

import {
    selectAllMarkers,
    fetchMarkers,
} from '../../../features/marker/markerSlice'

import '../Controls/MarkerColorOptions/markerColor.css'

const MarkersRender = ({ mapEdit, location }) => {
    const dispatch = useDispatch()

    const markers = useSelector(selectAllMarkers)

    const markerStatus = useSelector((state) => state.marker.status)

    useEffect(() => {
        if (markerStatus === 'idle') {
            dispatch(fetchMarkers(location))
        }
    }, [markerStatus, dispatch, location])

    const markerIcon = (icon, color) => {
        return L.icon({
            iconUrl: `/assets/images/icons/${icon}.svg`,
            iconSize: [32, 32],
            className: `marker-color--${color}`,
        })
    }

    return markers.map((marker, index) => (
        <Marker
            key={uuid()}
            index={index}
            position={marker.position}
            icon={markerIcon(marker.icon, marker.color)}
        >
            <Popup minWidth="310" maxWidth="310" maxHeight="auto">
                {mapEdit ? (
                    <MarkerPopupEdit marker={marker} location={location} />
                ) : (
                    <MarkerPopup marker={marker} />
                )}
            </Popup>
        </Marker>
    ))
}

export default MarkersRender
