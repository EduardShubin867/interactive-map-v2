import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast, Bounce } from 'react-toastify'
import axios from 'axios'

const URL = 'http://localhost:3001'

const toastConfig = {
    position: 'bottom-left',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    transition: Bounce,
}

export const fetchMarkers = createAsyncThunk(
    'markers/fetchMarkers',
    async (location) => {
        const response = await axios.get(`${URL}/markers/${location}`)

        return response.data
    }
)

export const addNewMarker = createAsyncThunk(
    'markers/addNewMarker',
    async (newMarker) => {
        const formData = new FormData()

        newMarker.images.forEach((img, index) => {
            formData.append(`image[${index}]`, img.file, img.file.name)
        })

        // Добавляем данные в FormData
        formData.append('id', newMarker.id)
        formData.append('name', newMarker.name)
        formData.append('icon', newMarker.icon)
        formData.append('description', newMarker.description)
        formData.append('img', JSON.stringify(newMarker.img))
        formData.append('position', JSON.stringify(newMarker.position))
        formData.append('color', newMarker.color)
        formData.append('location', newMarker.location)

        try {
            const response = await fetch(`${URL}/markers`, {
                method: 'POST',
                body: formData,
                'Content-Type':
                    'multipart/form-data; boundary=' + formData._boundary,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const responseData = await response.json()
            return responseData
        } catch (error) {
            console.error('Error processing request:', error)
            throw error
        }
    }
)

export const updateMarker = createAsyncThunk(
    'markers/updateMarker',
    async (marker) => {
        const formData = new FormData()

        marker.images.forEach((img, index) => {
            formData.append(`image[${index}]`, img.file, img.file.name)
        })

        // Добавляем данные в FormData
        formData.append('id', marker.id)
        formData.append('name', marker.name)
        formData.append('description', marker.description)
        formData.append('img', JSON.stringify(marker.img))
        formData.append('location', marker.location)

        try {
            const response = await fetch(`${URL}/markers`, {
                method: 'PUT',
                body: formData,
                'Content-Type':
                    'multipart/form-data; boundary=' + formData._boundary,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const responseData = await response.json()
            return responseData
        } catch (error) {
            console.error('Error processing request:', error)
            throw error
        }
    }
)

export const deleteMarker = createAsyncThunk(
    'markers/deleteMarker',
    async (marker) => {
        const response = await axios.delete(
            `${URL}/markers/${marker.id}/${marker.location}`
        )
        return response.data
    }
)

export const markersSlice = createSlice({
    name: 'marker',
    initialState: {
        markers: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers(builder) {
        builder
            // Получение маркеров
            .addCase(fetchMarkers.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchMarkers.fulfilled, (state, action) => {
                state.status = 'succeeded'

                state.markers = state.markers.concat(action.payload)
            })
            .addCase(fetchMarkers.rejected, (state, action) => {
                state.status = 'failed'

                state.error = action.error.message
            })
            // Добавление маркера
            .addCase(addNewMarker.fulfilled, (state, action) => {
                state.markers.push(action.payload.newMarker)
                toast.success(
                    `Маркер ${action.payload.newMarker.name} успешно добавлен`,
                    toastConfig
                )
            })
            // Обновление маркера
            .addCase(updateMarker.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(updateMarker.fulfilled, (state, action) => {
                state.status = 'idle'
                const { id, name, description, img } = action.payload.marker
                const existingMarker = state.markers.find(
                    (marker) => marker.id === id
                )
                if (existingMarker) {
                    existingMarker.name = name
                    existingMarker.description = description
                    existingMarker.img = img
                }
                toast.success(`Маркер ${name} успешно обновлен`, toastConfig)
            })
            // Удаление маркера
            .addCase(deleteMarker.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(deleteMarker.fulfilled, (state, action) => {
                state.status = 'succeeded'

                state.markers = state.markers.filter(
                    (marker) => marker.id !== action.payload.id
                )

                toast.success(
                    `Маркер ${action.payload.name} успешно удален`,
                    toastConfig
                )
            })
    },
})

export const selectAllMarkers = (state) => state.marker.markers

export default markersSlice.reducer
