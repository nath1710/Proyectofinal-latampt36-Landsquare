import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Link } from "react-router-dom";
import '../../styles/ImagePreview.css';

const EditProfile = () => {
    const { store, actions } = useContext(Context);
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const countries = store.countries || [];
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [photo_profile, setPhotoProfile] = useState('');
    //const [userData, setUserData] = useState({ id: null, name: '', country: '', address:'' , photo_profile: '', phone_number: '' })
    const [error, setError] = useState(''); // Para los errores en la previsualización de las imágenes
    const [image, setImage] = useState(''); // Cloudinary: Creamos estado local que guarde la url de la imagen subida
    const [formStatus, setFormStatus] = useState({ loading: false, ready: false, message: null });
    const navigate = useNavigate();

    const isFormValid = () => {
        if (!name || !country) {
            setFormStatus({ loading: false, ready: false, message: 'The fields Name and Country are always required.' });
            return false;
        }
        return true;
    };

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
            setId(body.id)
            setName(body.name)
            setCountry(body.country)
            setAddress(body.address)
            setPhoneNumber(body.phone_number)
            setPhotoProfile(body.photo_profile)
            /*setUserData({ 
                id: body.id, 
                name: body.name,
                country: body.country, 
                address: body.address, 
                photo_profile: body.photo_profile, 
                phone_number: body.phone_number
            })*/
        } catch (error) {
            console.log(error)
        }
    };

    const editUser = async (e) => {
        e.preventDefault();
        console.log('🟡🔴🔵', id, name, country, address, phone_number, photo_profile, '🟡🔴🔵', image)
        if (!isFormValid()) return;
        setFormStatus({ ...formStatus, loading: true, ready: false });

        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/settings/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${store.token}`
                },
                body: JSON.stringify({ name, country, address, photo_profile, phone_number })
            });

            const data = await response.json();
            if (response.ok) {
                setFormStatus({ loading: false, ready: true, message: 'Edit successfull! You will be redirected to your profile.' });
            } else {
                setFormStatus({ loading: false, ready: false, message: data.message || 'Error updating user' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setFormStatus({ loading: false, message: 'Server error. Please try again later.' });
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) { // Valida que se haya seleccionado un archivo
            setPhotoProfile('');
            return;
        }

        if (!file.type.startsWith('image/')) { // Valida que sea una imagen
            setError('Por favor selecciona un archivo de imagen válido (jpg, png, etc)');
            setPhotoProfile('');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // Valida el tamaño (ejemplo: máximo 5MB)
            setError('La imagen no debe superar los 5MB');
            setPhotoProfile('');
            return;
        }

        const reader = new FileReader(); // Crea la previsualización
        reader.onloadend = () => {
            setPhotoProfile(reader.result);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const uploadCloudinary = async (e) => {            //2 Preparamos para recibir el evento al ejecutarse la función async
        const files = e.target.files            //3 recuperamos el array de e.target.files
        const data = new FormData()             //4 Creamos/Instanciamos un FormData objeto con nombre data
        data.append('file', files[0])           //5 Utilizando metodo append() agregamos al data el archivo desde files[0]
        data.append('upload_preset', store.preset_name)  //6 Como prop "upload preset" le pasamos la variable de la linea 6 (punto 16.2).

        try {
            //10 enviamos el pedido de upload con el data en body 
            const response = await fetch(`https://api.cloudinary.com/v1_1/${store.cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();     //11 Traducimos la respuesta de JSON
            setImage(file.secure_url);              //13 Recuperamos la url de la imagen en estado local
            setPhotoProfile(file.secure_url)
            console.log('🟢 File.secure_url: ', file.secure_url, '🟢 image: ', image, '🟢 photo_profile: ', photo_profile)
            //await actions.sendPhoto(file.secure_url) //15 Enviamos la url a un action para hacer algo en back. Lo dejamos bloqueado para que no de error de importacion de Context actions o de la función.
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    useEffect(() => {
        if (formStatus.ready) {
            const timer = setTimeout(() => navigate('/profile'), 1000);
            return () => clearTimeout(timer);
        }
    }, [formStatus.ready, navigate]);

    useEffect(() => {
        actions.getCountries();
    }, []);


    useEffect(() => {
        if (store.token === undefined && localStorage.getItem('token') == undefined) {
            navigate('/login')
            return;
        } if (store.token) {
            handlePrivateData()
            /*setName(userData.name)
            setCountry(userData.country)
            setAddress(userData.address)
            setPhoneNumber(userData.phone_number)
            setPhotoProfile(userData.photo_profile)*/
        }
    }, [])

    return (
        <main className=' edit-section auth-background d-flex flex-column gap-3 align-items-center justify-content-center text-dark'>
            <h1>Editar Perfil</h1>
            <form onSubmit={editUser}>
                <div className='edit-form box-form'>
                    <div className='cd1'>
                        <p style={{ color: 'rgba(178,35,35,255)', fontWeight: 'bold' }}>Los campos marcados con un * son obligatorios</p>
                        <div className='mb-3'>
                            <label htmlFor='InputName' className='form-label'>Nombre &nbsp;
                                <span style={{ color: 'rgba(178,35,35,255)', fontWeight: 'bold' }} >*</span> </label>
                            <input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='form-control'
                                id='InputName'
                            />
                        </div>

                        <div className="mb-3">
                            <div className="mb-3">
                                <label htmlFor='inputPhotoProfile' className='form-label'>Foto de Perfil</label>
                                <input
                                    type='file'
                                    className='form-control'
                                    accept='image/*'
                                    onChange={(e) => {
                                        uploadCloudinary(e)
                                        handleFileChange()
                                    }}

                                />
                            </div>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            {photo_profile && (
                                <div className="preview-container mt-3">
                                    <img
                                        src={photo_profile}
                                        alt="Preview"
                                        className="img-preview"
                                    />
                                </div>
                            )}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='inputCountry' className='form-label'>País &nbsp;
                                <span style={{ color: 'rgba(178,35,35,255)', fontWeight: 'bold' }} >*</span> </label>
                            <select
                                id='inputCountry'
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className='form-select'
                            >
                                <option value=''>Selecciona un país</option>
                                {countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='mb-3'>
                            <label htmlFor='InputAddress' className='form-label'>Dirección</label>
                            <input
                                type='text'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className='form-control'
                                id='InputAddress'
                            />
                        </div>

                        <div className='mb-3 inputNumberUpDownRemoved'>
                            <label htmlFor='InputPhoneNumber' className='form-label'>Número de Teléfono</label>
                            <input
                                type='number'
                                min='10'
                                value={phone_number}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className='form-control'
                                id='InputPhoneNumber'
                            />
                        </div>

                        {formStatus.loading ? (
                            <div className='spinner-border text-primary' role='status'>
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                        ) : (
                            <div className='d-flex justify-content-evenly'>
                                <Link to="/Profile">
                                    <button className="cancel-button btn btn-danger">Cancelar</button>
                                </Link>
                                <button type='submit' className='signup-button btn btn-primary'>Enviar</button>
                            </div>
                        )}
                        {formStatus.message && (
                            <div
                                className={`alert mt-3 ${formStatus.message.includes('successfull') ? 'alert-success' : 'alert-danger'}`}
                                role='alert'
                            >
                                {formStatus.message}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </main >
    );
};

export default EditProfile;
