import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { Link, useNavigate } from "react-router-dom";
import Card from "../component/Card.jsx";
import '../../styles/randomStyles.css';

const Profile = () => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate()
    const [userData, setUserData] = useState({ id: null, email: '', isActive: false, name: '', photoProfile: '', phoneNumber: '', country: '', address: '' })
    const [userAnnouncements, setUserAnnouncements] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handlePrivateData = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/user', {
                method: 'GET',
                headers: {
                    'Content-type': 'Application/json',
                    Authorization: `Bearer ${store.token}`
                }
            })
            const body = await response.json()
            setUserData({
                id: body.id,
                email: body.email,
                name: body.name,
                isActive: body.is_active,
                photoProfile: body.photo_profile,
                phoneNumber: body.phone_number,
                country: body.country,
                address: body.address
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getUserAnnouncements = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(process.env.BACKEND_URL + `/api/user/${userData.id}/announcements`, {
                method: 'GET',
                headers: {
                    'Content-type': 'Application/json',
                    Authorization: `Bearer ${store.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar los anuncios');
            }

            const body = await response.json();
            setUserAnnouncements(body.announcements);

        } catch (error) {
            console.error('Error fetching announcements:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (store.token === undefined && localStorage.getItem('token') == undefined) {
            navigate('/login')
            return;
        } if (store.token) {
            handlePrivateData()
            console.log('TOKENNNNN', store.token)
            console.log('USER IDDD', userData.id)
        }
    }, [store.token])

    useEffect(() => {
        console.log('TOKENNNNN', store.token)
        console.log('USER IDDD', userData.id)
        getUserAnnouncements()
    }, [userData])
    /*
        useEffect(() => {
            if (localStorage.getItem('token')) {
                actions.setToken(localStorage.getItem('token'))
            }
        }, [])
    */
    return (
        <main className='d-flex flex-column gap-3 align-items-center justify-content-center mt-5'>
            <div className='container d-flex align-items-center justify-content-between'>
                <h3 className='m-0'>Profile</h3>
                <Link to="/settings" className="p-1">
                    <button type="button" className="btn btn-success">Editar Perfil</button>
                </Link>
            </div>

            <div className='container mb-3 bg-white rounded text-dark'>
                <div className='row p-2'>
                    <div className='col-md-4 p-0'>
                        <img src={userData.photoProfile} className='img-fluid rounded' alt='...' />
                    </div>
                    <div className='col-md-8 d-flex flex-column justify-content-center'>
                        <h5 className=''>{userData.name}</h5>
                        <h6 className=''>+{userData.phoneNumber}</h6>
                        <h6 className=''><small className='text-body-secondary'>{userData.country}</small></h6>
                        <h6 className=''><small className='text-body-secondary'>{userData.address}</small></h6>
                        <Link to="/favorites" className='mb-2'>
                            <button type="button" className="btn btn-danger">Favoritos <i className="fa-regular fa-heart"></i></button>
                        </Link>
                        <Link to="/publish-land" className=''>
                            <button type="button" className="btn btn-success">Publicar <i className="fa-regular fa-square-plus"></i></button>
                        </Link>
                    </div>
                </div>
            </div>
            {userAnnouncements.length === 0 ? (
                <div className='container gap-2 mb-3 p-2 bg-white rounded d-flex flex-wrap align-items-center justify-content-between'>
                    <div className="card" style={{ width: '15rem', height: '15rem' }}>
                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                            <h5 className="card-title text-center text-secondary">Haz tu primera Publicación</h5>
                            <Link to="/post" className='d-flex justify-content-center'>
                                <button type="button" className="btn btn-primary">Publicar</button>
                            </Link>
                        </div>
                    </div>
                    <div className="card border-0 grandiente-blanco-gris" style={{ width: '15rem', height: '15rem' }}>
                        <div className="card-body">
                        </div>
                    </div>
                    <div className="card border-0 grandiente-blanco-gris" style={{ width: '15rem', height: '15rem' }}>
                        <div className="card-body">
                        </div>
                    </div>
                    <div className="card border-0 grandiente-blanco-gris" style={{ width: '15rem', height: '15rem' }}>
                        <div className="card-body">
                        </div>
                    </div>
                    <div className="card border-0 grandiente-blanco-gris" style={{ width: '15rem', height: '15rem' }}>
                        <div className="card-body">
                        </div>
                    </div>
                    <div className="card border-0 grandiente-blanco-gris" style={{ width: '15rem', height: '15rem' }}>
                        <div className="card-body">
                        </div>
                    </div>
                    <div className="card border-0 grandiente-blanco-gris" style={{ width: '15rem', height: '15rem' }}>
                        <div className="card-body">
                        </div>
                    </div>
                    <div className="card border-0 grandiente-blanco-gris" style={{ width: '15rem', height: '15rem' }}>
                        <div className="card-body">
                        </div>
                    </div>
                </div>

            ) : (
                <div className='container bg-white rounded'>
                    <h1 className='text-secondary text-center my-2'>Tus Publicaciones</h1>
                    <div className='gap-2 mb-3 p-2 d-flex flex-wrap align-items-center justify-content-between'>
                        {userAnnouncements.map((item) => (
                            <Card
                                key={item.id}
                                imgURL={item.images?.[0] || '/placeholder-image.jpg' /* Falta cambiar esta ruta*/}
                                price={item.price}
                                size={item.size}
                                address={item.location}
                                imgOwner={item.user?.photo_profile || '/placeholder-profile.jpg'}
                                owner={item.user?.name || 'Usuario'}
                                info={item.description}
                            />
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
};

export default Profile;