import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Link, useParams } from 'react-router-dom';
import '../../styles/ImagePreview.css';
import GoogleMaps from '../component/GoogleMaps.jsx';
import postPhoto from '../../img/post-photo.jpg';

const EditAnnouncement = () => {
    const { store, actions } = useContext(Context);
    const [user, setUser] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [size, setSize] = useState(0);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // Para imágenes ya guardadas
    const [newImages, setNewImages] = useState([]); // Para nuevas imágenes
    const [deletedImages, setDeletedImages] = useState([]); // Para tracking de imágenes eliminadas
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(''); // Para los errores en la previsualización de las imágenes
    const [formStatus, setFormStatus] = useState({ loading: false, ready: false, message: null });

    const params = useParams();
    const navigate = useNavigate();
    const MAX_FILES = 5;

    const [alerts, setAlerts] = useState({
        form: null,
        images: null,
        location: null,
        upload: null
    });

    const isFormValid = () => {
        if (!title || !description || !price || !location || !size || !images) {
            showAlert('form', 'All fields are required.')
            return false;
        }
        return true;
    };

    const getAnnouncement = async () => {
        try {
            setError(null);

            const response = await fetch(process.env.BACKEND_URL + `/api/announcement/${params.id}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Error al cargar la publicación');
            }

            const body = await response.json();
            if (store.user?.id !== body.user?.id) {
                navigate('/unauthorized');
                return;
            }
            setDescription(body.description)
            setLocation(body.location)
            setLongitude(body.longitude)
            setLatitude(body.latitude)
            setPrice(body.price)
            setSize(body.size)
            setTitle(body.title)
            setUser(body.user)
        } catch (error) {
            console.error('Error fetching announcement:', error);
            setError(error.message);
        } finally {
            setIsUploading(false);
        }
    }

    // Función para cargar las imágenes existentes
    const loadExistingImages = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + `/api/announcement/${params.id}`, {
                method: 'GET'
            });

            if (!response.ok) throw new Error('Error al cargar las imágenes');

            const data = await response.json();
            const existingImgs = data.images.map(url => ({
                id: Date.now() + Math.random(),
                url: url,
                isExisting: true
            }));

            setExistingImages(existingImgs);
            setImages(existingImgs);
        } catch (error) {
            console.error('Error loading images:', error);
            setError('Error al cargar las imágenes existentes');
        }
    };

    const updateAnnouncement = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;
        setIsUploading(true);

        try {
            // Subir nuevas imágenes a Cloudinary
            const newUploadedUrls = await uploadNewImages();

            // Combinar URLs existentes (no eliminadas) con nuevas URLs
            const remainingExistingUrls = existingImages
                .filter(img => !deletedImages.includes(img.url))
                .map(img => img.url);

            const allImages = [...remainingExistingUrls, ...newUploadedUrls];

            // Actualizar el anuncio con todas las imágenes
            const response = await fetch(process.env.BACKEND_URL + '/api/land-settings/' + params.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${store.token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    price: parseFloat(price),
                    location,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    size: parseFloat(size),
                    images: allImages
                })
            });

            if (response.status === 403) {
                setError('No tienes permisos para editar este anuncio.');
                navigate('/unauthorized');
                return;
            }

            if (!response.ok) throw new Error('Error al actualizar el anuncio');

            navigate('/announcement/' + params.id);
        } catch (error) {
            console.error('Error:', error);
            setError('Error al actualizar el anuncio');
        } finally {
            setIsUploading(false);
        }
    };

    const handleGeocode = async (address) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAPeDUU2nXnDk3pF4Xa2d3dOuNbPABkPzg`
            );
            const data = await response.json();

            if (data.results.length > 0) {
                const locationData = data.results[0].geometry.location;
                setLatitude(locationData.lat)
                setLongitude(locationData.lng)
                console.log(locationData)
            } else {
                setFormStatus({ ...formStatus, message: 'No se encontraron resultados para esta dirección.' });
            }
        } catch (error) {
            console.error('Error al geocodificar la dirección:', error);
            setFormStatus({ ...formStatus, message: 'Error al procesar la dirección. Intente nuevamente.' });
        }
    };

    // Manejador de archivos nuevos
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files)

        if (images.length + files.length > MAX_FILES) {
            showAlert('images', `Solo puedes tener un máximo de ${MAX_FILES} imágenes`)
            return
        }

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                showAlert('images', 'Por favor selecciona archivos de imagen válidos')
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                showAlert('images', 'Cada imagen no debe superar los 5MB')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                const newImage = {
                    id: Date.now() + Math.random(),
                    url: reader.result,
                    file: file,
                    isExisting: false
                }

                setNewImages(prev => [...prev, newImage])
                setImages(prev => [...prev, newImage])
            };
            reader.readAsDataURL(file)
        });

        event.target.value = ''
    }

    // Manejador de eliminación de imágenes
    const handleDelete = (idToDelete) => {
        const imageToDelete = images.find(img => img.id === idToDelete);

        if (imageToDelete.isExisting) {
            setDeletedImages(prev => [...prev, imageToDelete.url]);
            setExistingImages(prev => prev.filter(img => img.id !== idToDelete));
        } else {
            setNewImages(prev => prev.filter(img => img.id !== idToDelete));
        }

        setImages(prev => prev.filter(img => img.id !== idToDelete));
    };

    // Función para subir nuevas imágenes a Cloudinary
    const uploadNewImages = async () => {
        setIsUploading(true);
        const uploadedUrls = [];

        try {
            for (const image of newImages) {
                const data = new FormData();
                data.append('file', image.file);
                data.append('upload_preset', store.preset_name);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${store.cloud_name}/image/upload`,
                    {
                        method: 'POST',
                        body: data
                    }
                );

                const result = await response.json();
                uploadedUrls.push(result.secure_url);
            }

            return uploadedUrls;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            setError('Error al subir las imágenes nuevas');
            return [];
        } finally {
            setIsUploading(false);
        }
    };

    const clearAlert = (type) => {
        setTimeout(() => {
            setAlerts(prev => ({ ...prev, [type]: null }))
        }, 5000)
    }

    const showAlert = (type, message, isError = true) => {
        setAlerts(prev => ({
            ...prev,
            [type]: { message, isError }
        }));
        clearAlert(type)
    }

    //Componente para las alertas
    const AlertMessage = ({ type }) => {
        const alert = alerts[type];
        if (!alert) return null;

        return (
            <div
                className={`alert ${alert.isError ? 'alert-danger' : 'alert-success'} mt-2`}
                role="alert"
            >
                {alert.message}
            </div>
        );
    };

    useEffect(() => {
        if (formStatus.ready) {
            const timer = setTimeout(() => navigate('/announcement/' + params.id), 1000);
            return () => clearTimeout(timer);
        }
    }, [formStatus.ready, navigate]);

    useEffect(() => {
        getAnnouncement()
        loadExistingImages()
    }, [])


    return (
        <main className='img-post py-5 auth-background d-flex flex-column gap-3 align-items-center justify-content-center text-dark' style={{ backgroundImage: `url(${postPhoto}` }}>
            <div className='post-section'>
                <form onSubmit={updateAnnouncement}>
                    <div className='box-post'>
                        <div className='w-100'>
                            <h1>Editar Publicación</h1>
                            <p className='text-secondary fw-semibold'>Los campos marcados con <span style={{ color: 'rgba(178,35,35,255)' }}>*</span> son obligatorios</p>

                            <div className='mb-3'>
                                <label htmlFor='InputTitle' className='form-label'>Título &nbsp;
                                    <span style={{ color: 'rgba(178,35,35,255)', fontWeight: 'bold' }} >*</span> </label>
                                <input
                                    type='text'
                                    onChange={(e) => setTitle(e.target.value)}
                                    className='form-control'
                                    id='InputTitle'
                                    value={title}
                                />
                            </div>

                            <div className='mb-3'>
                                <div className='mb-3'>
                                    <label htmlFor='inputImages' className='form-label'>Imágenes (Máximo 5)</label>
                                    <input
                                        type='file'
                                        className='form-control'
                                        accept='image/*'
                                        onChange={(e) => {
                                            handleFileChange(e) //Verificar (e) o ()
                                        }}
                                        multiple
                                    />
                                </div>

                                {/* Images Alert */}
                                <AlertMessage type="images" />

                                {images.length > 0 && (
                                    <div className='mt-3 text-nowrap d-flex gap-3' style={{ overflowX: 'auto' }}>
                                        {images.map(preview => (
                                            <div key={preview.id} className=''>
                                                <div className='preview-image-container'>
                                                    <img
                                                        src={preview.url}
                                                        alt='Preview'
                                                        className='preview-item'
                                                        style={{ height: '200px' }}
                                                    />
                                                    <button
                                                        className='delete-btn btn btn-danger btn-sm'
                                                        onClick={() => handleDelete(preview.id)}
                                                        type='button'
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                {/*
                                                <small className='text-muted d-block mt-1 visually-hidden'>
                                                    {preview.isExisting ? 'Imagen existente' : 'Nueva imagen'}
                                                </small>
                                                */}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='InputLocation' className='form-label'>Localización</label>
                                <div className='input-group'>
                                    <input
                                        type='text'
                                        onChange={(e) => setLocation(e.target.value)}
                                        className='form-control'
                                        placeholder='Ingresa una dirección'
                                        id='InputLocation'
                                        value={location}
                                    />
                                    <button
                                        type='button'
                                        className='btn btn-outline-secondary'
                                        onClick={() => handleGeocode(location)}
                                    >
                                        Validar Dirección
                                    </button>
                                </div>

                                {/* Location Alert */}
                                <AlertMessage type="location" />
                                {/*
                                <small className='form-text text-muted'>
                                    Ingresa una dirección y presiona 'Validar Dirección' para obtener las coordenadas.
                                </small>
                                */}
                            </div>

                            <div className='d-flex mb-3 border border-light-subtle border-3 rounded' style={{ height: '300px' }}><GoogleMaps location={{ lat: latitude, lng: longitude }} /></div>

                            <div className='d-flex flex-wrap row'>
                                <div className='mb-3 col-md-6'>
                                    <label htmlFor='InputPrice' className='form-label'>Precio</label>
                                    <div className='input-group'>
                                        <span className='input-group-text'>$</span>
                                        <input
                                            type='number'
                                            min='1'
                                            onChange={(e) => setPrice(e.target.value)}
                                            className='form-control'
                                            id='InputPrice'
                                            value={price}
                                        />
                                    </div>
                                </div>
                                <div className='mb-3 col-md-6'>
                                    <label htmlFor='InputSize' className='form-label'>Tamaño</label>
                                    <div className='input-group'>
                                        <input
                                            type='number'
                                            min='1'
                                            onChange={(e) => setSize(e.target.value)}
                                            className='form-control'
                                            id='InputSize'
                                            value={size}
                                        />
                                        <span className='input-group-text'>m<sup>2</sup></span>
                                    </div>
                                </div>
                            </div>

                            {/* Nuevas alertas */}
                            <div className='mb-3'>
                                <label htmlFor='InputDescription' className='form-label'>Descripción del Terreno &nbsp;
                                    <span style={{ color: 'rgba(178,35,35,255)', fontWeight: 'bold' }} >*</span> </label>
                                <textarea
                                    onChange={(e) => setDescription(e.target.value)}
                                    className='form-control'
                                    id='InputDescription'
                                    rows='3'
                                    value={description}
                                >
                                </textarea>
                            </div>

                            {/* Form Alert */}
                            <AlertMessage type='form' />

                            <div className='d-flex justify-content-evenly mt-4'>
                                <Link to='/Profile'>
                                    <button className='cancel-button btn btn-danger'>Cancelar</button>
                                </Link>
                                <button
                                    type='submit'
                                    className='signup-button btn btn-primary'
                                    disabled={images.length === 0 || isUploading}
                                >
                                    {isUploading ? 'Subiendo...' : 'Enviar'}
                                </button>
                            </div>

                            {/* Upload Progress Alert */}
                            {isUploading && (
                                <div className='d-flex align-items-center gap-2 mt-3 justify-content-center'>
                                    <div className='spinner-border text-primary' role='status'>
                                        <span className='visually-hidden'>Cargando...</span>
                                    </div>
                                    <span>Subiendo imágenes...</span>
                                </div>
                            )}

                            {/* Upload Alert */}
                            <AlertMessage type="upload" />

                        </div>
                    </div >
                </form >
            </div >
        </main >
    );
};

export default EditAnnouncement;