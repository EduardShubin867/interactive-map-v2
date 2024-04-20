import ImageUploading from 'react-images-uploading'
import { MDBContainer, MDBBtn } from 'mdb-react-ui-kit'

const ImagesUpload = ({ images, setImages }) => {
    const maxNumber = 69
    const onChange = (imageList, addUpdateIndex) => {
        setImages(
            imageList.map((img, index) => {
                let name

                if (addUpdateIndex) {
                    let number = false
                    for (let value of addUpdateIndex) {
                        if (index === value) {
                            number = value
                            break
                        }
                    }

                    name = !(number === false) ? img.file.name : img.name
                } else {
                    name = img.name
                }

                return {
                    data_url: img.data_url,
                    name: name,
                    file: img.file,
                }
            })
        )
    }
    return (
        <MDBContainer>
            <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
                acceptType={['jpg']}
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) =>
                    // write your building UI
                    imageList.length > 0 ? (
                        <div>
                            <MDBContainer
                                className={`row justify-content-center gy-1 gx-2 mx-auto`}
                                style={{
                                    width: '100%',
                                    minHeight: '200px',
                                    height: '100%',
                                    paddingTop: '6px',
                                    paddingBottom: '6px',
                                    borderRadius: '5px',
                                    boxShadow:
                                        '0px 0px 5px 2px rgba(168,166,166,0.75) inset',
                                }}
                                {...dragProps}
                            >
                                {imageList.map((image, index) => (
                                    <MDBContainer
                                        key={index}
                                        className="col-md-6 mt-1 "
                                    >
                                        <img
                                            src={image.data_url}
                                            alt=""
                                            className="img-fluid"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => onImageUpdate(index)}
                                        />
                                        <div className="d-grid mt-1">
                                            <MDBBtn
                                                outline
                                                color="danger"
                                                onClick={() =>
                                                    onImageRemove(index)
                                                }
                                            >
                                                Удалить
                                            </MDBBtn>
                                        </div>
                                    </MDBContainer>
                                ))}
                                <MDBContainer
                                    className="col-md-6 mt-1 d-flex justify-content-center align-items-center"
                                    onClick={onImageUpload}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="far fa-square-plus fa-7x" />
                                </MDBContainer>
                            </MDBContainer>
                            <div
                                className="d-grid mt-1"
                                style={{ height: '35px' }}
                            >
                                <MDBBtn
                                    color="danger"
                                    onClick={onImageRemoveAll}
                                >
                                    Удалить всё
                                </MDBBtn>
                            </div>
                        </div>
                    ) : (
                        <MDBContainer
                            style={{
                                width: '100%',
                                height: '250px',
                                background: '#E7E2E0',
                                borderStyle: 'dashed',
                                borderColor: '#CCC8C7',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                            onClick={onImageUpload}
                            {...dragProps}
                        />
                    )
                }
            </ImageUploading>
        </MDBContainer>
    )
}

export default ImagesUpload
