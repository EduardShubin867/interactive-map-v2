import { Helmet, HelmetProvider } from 'react-helmet-async'

import customImage from '../img/FOKAS2k.png'
import Map from '../components/Map/Map'

const KrasnoeBedstvie = () => {
    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Красное Бедствие | Интерактивная карта</title>
                </Helmet>
                <Map customImage={customImage} />
            </HelmetProvider>
        </>
    )
}

export default KrasnoeBedstvie
