import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Link } from "react-router-dom";
import '../../styles/ImagePreview.css';
import GoogleMaps from "../component/GoogleMaps.jsx";
import postPhoto from '../../img/post-photo.jpg';

const Post = () => {
    const { store, actions } = useContext(Context);
    const [userID, setUserId] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [size, setSize] = useState(0);
    const [images, setImages] = useState([]);

    // Estado para almacenar las URLs de Cloudinary
    const [cloudinaryUrls, setCloudinaryUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const [userData, setUserData] = useState({ id: null, name: '', country: '', address: '', photo_profile: '', phone_number: '' })
    const [error, setError] = useState(''); // Para los errores en la previsualización de las imágenes
    const [image, setImage] = useState(''); // Cloudinary: Creamos estado local que guarde la url de la imagen subida
    const [formStatus, setFormStatus] = useState({ loading: false, ready: false, message: null });
    const navigate = useNavigate();
    const MAX_FILES = 5;

    const isFormValid = () => {
        if (!title || !description || !price || !location || !size || !images) {
            setFormStatus({ loading: false, ready: false, message: 'All fields are required.' });
            return false;
        }
        return true;
    };

    //Me parece que no es necesaria esta función...
    const handlePrivateData = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/user", {
                method: "GET",
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${store.token}`
                }
            })
            const body = await response.json()
            setUserId(body.id)
            setUserData({
                id: body.id,
                name: body.name,
                country: body.country,
                address: body.address,
                photo_profile: body.photo_profile,
                phone_number: body.phone_number
            })
        } catch (error) {
            console.log(error)
        }
    };

    const createAnnouncement = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setFormStatus({ ...formStatus, loading: true, ready: false });

        try {
            // Primero subimos las imágenes a Cloudinary
            const uploadedUrls = await uploadAllImages();

            // Luego enviamos toda la información al backend
            const response = await fetch(process.env.BACKEND_URL + '/api/lands-post/', {
                method: 'POST',
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
                    images: uploadedUrls // Enviamos las URLs de Cloudinary
                })
            });

            const data = await response.json();
            if (response.ok) {
                setFormStatus({
                    loading: false,
                    ready: true,
                    message: '¡Publicación creada exitosamente! Serás redirigido a tu perfil.'
                });
            } else {
                setFormStatus({
                    loading: false,
                    ready: false,
                    message: data.message || 'Error al crear la publicación'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setFormStatus({
                loading: false,
                ready: false,
                message: 'Error del servidor. Por favor intenta más tarde.'
            });
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
                setFormStatus({ ...formStatus, message: "No se encontraron resultados para esta dirección." });
            }
        } catch (error) {
            console.error("Error al geocodificar la dirección:", error);
            setFormStatus({ ...formStatus, message: "Error al procesar la dirección. Intente nuevamente." });
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        if (images.length + files.length > MAX_FILES) {
            setError(`Solo puedes subir un máximo de ${MAX_FILES} imágenes`);
            return;
        }

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona archivos de imagen válidos (jpg, png, etc)');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Cada imagen no debe superar los 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    url: reader.result,
                    name: file.name,
                    file: file // Guardamos el archivo para subirlo después
                }]);
                setError('');
            };
            reader.readAsDataURL(file);
        });
        event.target.value = '';
    };

    const handleDelete = (idToDelete) => {
        setImages(prev => prev.filter(preview => preview.id !== idToDelete));
        setCloudinaryUrls(prev => prev.filter(url => url.id !== idToDelete));
    };

    const uploadToCloudinary = async (file) => { //BUSCAR uploadCloudinary
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', store.preset_name);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${store.cloud_name}/image/upload`,
                {
                    method: 'POST',
                    body: data
                }
            );
            const result = await response.json();
            return result.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            return null;
        }
    };

    // Función para subir todas las imágenes seleccionadas a Cloudinary
    const uploadAllImages = async () => {
        setIsUploading(true);
        const urls = [];

        try {
            for (const image of images) {
                const url = await uploadToCloudinary(image.file);
                if (url) {
                    urls.push({
                        id: image.id,
                        url: url
                    });
                }
            }
            setCloudinaryUrls(urls);
            return urls.map(item => item.url); // Retornamos solo las URLs para el backend
        } catch (error) {
            console.error('Error uploading images:', error);
            setError('Error al subir las imágenes');
            return [];
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (formStatus.ready) {
            const timer = setTimeout(() => navigate('/profile'), 1000);
            return () => clearTimeout(timer);
        }
    }, [formStatus.ready, navigate]);

    useEffect(() => {
        if (store.token === undefined && localStorage.getItem('token') == undefined) {
            navigate('/login')
            return;
        } if (store.token) {
            handlePrivateData()
        }
    }, [])

    return (
        <main className='img-post py-5 auth-background d-flex flex-column gap-3 align-items-center justify-content-center text-dark' style={{ backgroundImage: `url(${postPhoto}` }}>
            <div className='post-section'>
                <form onSubmit={createAnnouncement}>
                    <div className='box-post'>
                        <div className='w-100'>
                            <h1>Publicar un Terreno</h1>
                            <p className='text-secondary fw-semibold'>Los campos marcados con <span style={{ color: 'rgba(178,35,35,255)' }}>*</span> son obligatorios</p>
                            <div className='mb-3'>
                                <label htmlFor='InputTitle' className='form-label'>Título &nbsp;
                                    <span style={{ color: 'rgba(178,35,35,255)', fontWeight: 'bold' }} >*</span> </label>
                                <input
                                    type='text'
                                    onChange={(e) => setTitle(e.target.value)}
                                    className='form-control'
                                    id='InputTitle'
                                />
                            </div>

                            <div className="mb-3">
                                <div className="mb-3">
                                    <label htmlFor='inputImages' className='form-label'>Imágenes (Máximo 5)</label>
                                    <input
                                        type='file'
                                        className='form-control'
                                        accept='image/*'
                                        onChange={(e) => {
                                            handleFileChange(e)
                                            //uploadCloudinary(e)
                                        }}
                                        multiple
                                    />
                                </div>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                {/*images && (
                                <div className="preview-container mt-3">
                                    <img
                                        src={images}
                                        className="img-preview"
                                    />
                                </div>
                            )*/}
                                {images.length > 0 && (
                                    <div className="mt-3 text-nowrap d-flex gap-3" style={{ overflowX: "auto" }}>
                                        {images.map(preview => (
                                            <div key={preview.id} className="">
                                                <div className="preview-image-container">
                                                    <img
                                                        src={preview.url}
                                                        alt={preview.name}
                                                        className="preview-item"
                                                        style={{ height: "200px" }}
                                                    />
                                                    <button
                                                        className="delete-btn btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(preview.id)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <small className="text-muted d-block mt-1">
                                                    {/* {preview.name} */}
                                                </small>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>


                            <div className='mb-3'>
                                <label htmlFor='InputLocation' className='form-label'>Localización</label>
                                <div className="input-group">
                                    <input
                                        type='text'
                                        onChange={(e) => setLocation(e.target.value)}
                                        className='form-control'
                                        placeholder="Ingresa una dirección"
                                        id='InputLocation'
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => handleGeocode(location)}
                                    >
                                        Validar Dirección
                                    </button>
                                </div>
                                <small className="form-text text-muted">
                                    Ingresa una dirección y presiona "Validar Dirección" para obtener las coordenadas.
                                </small>
                            </div>
                            <div className='d-flex mb-3 border border-light-subtle border-3 rounded' style={{ height: "300px" }}><GoogleMaps location={{ lat: latitude, lng: longitude }} /></div>

                            <div className='d-flex flex-wrap row'>
                                <div className='mb-3 col-md-6'>
                                    <label htmlFor='InputPrice' className='form-label'>Precio</label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                            type='number'
                                            min='1'
                                            onChange={(e) => setPrice(e.target.value)}
                                            className='form-control'
                                            id='InputPrice'
                                        />
                                    </div>
                                </div>
                                <div className='mb-3 col-md-6'>
                                    <label htmlFor='InputSize' className='form-label'>Tamaño</label>
                                    <div className="input-group">
                                        <input
                                            type='number'
                                            min='1'
                                            onChange={(e) => setSize(e.target.value)}
                                            className='form-control'
                                            id='InputSize'
                                        />
                                        <span className="input-group-text">m<sup>2</sup></span>
                                    </div>
                                </div>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor='InputDescription' className='form-label'>Descripción del Terreno &nbsp;
                                    <span style={{ color: 'rgba(178,35,35,255)', fontWeight: 'bold' }} >*</span> </label>
                                <textarea
                                    onChange={(e) => setDescription(e.target.value)}
                                    className='form-control'
                                    id='InputDescription'
                                    rows="3">
                                </textarea>
                            </div>
                            {(formStatus.loading || isUploading) ? (
                                <div className='d-flex align-items-center gap-2'>
                                    <div className='spinner-border text-primary' role='status'>
                                        <span className='visually-hidden'>Cargando...</span>
                                    </div>
                                    <span>{isUploading ? 'Subiendo imágenes...' : 'Creando publicación...'}</span>
                                </div>
                            ) : (
                                <div className='d-flex justify-content-evenly'>
                                    <Link to="/Profile">
                                        <button className="cancel-button btn btn-danger">Cancelar</button>
                                    </Link>
                                    <button
                                        type='submit'
                                        className='signup-button btn btn-primary'
                                        disabled={images.length === 0}
                                    >
                                        Enviar
                                    </button>
                                </div>
                            )}
                            {formStatus.message && (
                                <div
                                    className={`mt-3 alert ${formStatus.message.includes('successfull') ? 'alert-danger' : 'alert-success'}`}
                                    role='alert'
                                >
                                    {formStatus.message}
                                </div>
                            )}
                        </div>
                    </div >
                </form >
            </div >
        </main >
    );
};

export default Post;