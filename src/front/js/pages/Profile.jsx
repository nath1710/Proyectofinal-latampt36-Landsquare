import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { Link, useNavigate } from 'react-router-dom';
import CardUser from '../component/CardUser.jsx';
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
        }
    }, [store.token])

    useEffect(() => {
        getUserAnnouncements()
    }, [userData])

    return (
        <main className='d-flex flex-column gap-3 align-items-center justify-content-center mt-5'>
            <div className='profile-section container d-flex align-items-center justify-content-between'>
                <h3 className='m-0'>Profile</h3>
                <Link to='/settings' className='p-1'>
                    <button type='button' className='btn btn-success'>Editar Perfil</button>
                </Link>
            </div>

            <div className='col-6 rounded mb-3 bg-white text-dark'>
                <div className='row p-2'>
                    <div className='col-md-4 d-flex justify-content-center align-items-center'>
                        <img src={userData.photoProfile} className='img-fluid rounded' alt='...' />
                    </div>
                    <div className='col-md-4 d-flex flex-column justify-content-center align-items-center'>
                        <h5 className=''>{userData.name}</h5>
                        <h6 className=''>+{userData.phoneNumber}</h6>
                        <h6 className=''><small className='text-body-secondary'>{userData.country}</small></h6>
                        <h6 className=''><small className='text-body-secondary'>{userData.address}</small></h6>
                    </div>
                    <div className='col-md-4 d-flex flex-column justify-content-center align-items-center'>
                        <Link to='/favorites' className='mb-2'>
                            <button type='button' className='btn btn-danger'>Favoritos <i className='fa-regular fa-heart'></i></button>
                        </Link>
                        <Link to='/publish-land' className=''>
                            <button type='button' className='btn btn-success'>Publicar <i className='fa-regular fa-square-plus'></i></button>
                        </Link>
                    </div>
                </div>
            </div>
            {userAnnouncements.length === 0 ? (
                <div className='d-flex flex-wrap gap-2 align-items-center justify-content-center bg-white py-3'>
                    <div className='card' style={{ width: '18rem', height: '21rem' }}>
                        <div className='card-body d-flex flex-column align-items-center justify-content-center'>
                            <h5 className='card-title text-center text-secondary'>Haz tu primera Publicación</h5>
                            <Link to='/publish-land' className='d-flex justify-content-center'>
                                <button type='button' className='btn btn-success'>Publicar</button>
                            </Link>
                        </div>
                    </div>
                    <div className='card border-0 grandiente-blanco-gris' style={{ width: '18rem', height: '21rem' }}>
                        <div className='card-body'>
                        </div>
                    </div>
                    <div className='card border-0 grandiente-blanco-gris' style={{ width: '18rem', height: '21rem' }}>
                        <div className='card-body'>
                        </div>
                    </div>
                    <div className='card border-0 grandiente-blanco-gris' style={{ width: '18rem', height: '21rem' }}>
                        <div className='card-body'>
                        </div>
                    </div>
                    <div className='card border-0 grandiente-blanco-gris' style={{ width: '18rem', height: '21rem' }}>
                        <div className='card-body'>
                        </div>
                    </div>
                    <div className='card border-0 grandiente-blanco-gris' style={{ width: '18rem', height: '21rem' }}>
                        <div className='card-body'>
                        </div>
                    </div>
                    <div className='card border-0 grandiente-blanco-gris' style={{ width: '18rem', height: '21rem' }}>
                        <div className='card-body'>
                        </div>
                    </div>
                    <div className='card border-0 grandiente-blanco-gris' style={{ width: '18rem', height: '21rem' }}>
                        <div className='card-body'>
                        </div>
                    </div>
                </div>

            ) : (
                <div className='bg-white vw-100 pb-3 px-5'>
                    <h1 className='text-secondary text-center my-2'>Tus Publicaciones</h1>
                    <div className='d-flex flex-wrap gap-2 align-items-center justify-content-evenly'>
                        {userAnnouncements.map((item) => (
                            <CardUser
                                key={item.id}
                                announcementID={item.id}
                                imgURL={item.images?.[0] || '../../img/placeholder-image.jpg'}
                                price={item.price}
                                size={item.size}
                                address={item.location}
                                imgOwner={item.user?.photo_profile || '../../img/placeholder-profile.jpg'}
                                owner={item.user?.name || 'Usuario'}
                                ownerPhoneNumber={item.user?.phone_number}
                                ownerEmail={item.user?.email}
                                info={item.description}
                                title={item.title}
                            />
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
};

export default Profile;