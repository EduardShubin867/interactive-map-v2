import { Helmet, HelmetProvider } from 'react-helmet-async'

const Vzvod = () => {
    return (
        <HelmetProvider>
            <div>
                <Helmet>
                    <title>Мрачный взвод | Интерактивная карта</title>
                </Helmet>
            </div>
        </HelmetProvider>
    )
}

export default Vzvod
