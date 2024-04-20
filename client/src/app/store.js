import { configureStore } from '@reduxjs/toolkit'
import markerReducer from '../features/marker/markerSlice'

export default configureStore({
    reducer: {
        marker: markerReducer,
    },
})
