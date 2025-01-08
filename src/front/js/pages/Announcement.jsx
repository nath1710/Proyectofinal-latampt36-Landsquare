import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../component/Card.jsx';
import GoogleMaps from '../component/GoogleMaps.jsx';
import '../../styles/randomStyles.css';

const Announcement = () => {
    const { store, actions } = useContext(Context)
    const navigate = useNavigate()
    const [userData, setUserData] = useState({ id: null, email: '', isActive: false, name: '', photoProfile: '', phoneNumber: '', country: '', address: '' })
    const [announcementData, setAnnouncementData] = useState({
        creation_date: '',
        description: '',
        id: 0,
        images: [],
        location: '',
        longitude: 0,
        latitude: 0,
        price: '',
        size: 0,
        title: '',
        user: {},
        user_id: 0
    })

    const [userAnnouncements, setUserAnnouncements] = useState([])
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAnnouncement = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(process.env.BACKEND_URL + `/api/announcement/${params.id}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Error al cargar la publicación');
            }

            const body = await response.json();
            setAnnouncementData({
                creation_date: body.creation_date,
                description: body.description,
                id: body.id,
                images: body.images,
                location: body.location,
                longitude: body.longitude,
                latitude: body.latitude,
                price: body.price,
                size: body.size,
                title: body.title,
                user: body.user,
                user_id: body.user_id
            });

        } catch (error) {
            console.error('Error fetching announcement:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const getUserAnnouncements = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(process.env.BACKEND_URL + `/api/user/${announcementData.user_id}/announcements`, {
                method: 'GET',
                headers: {
                    'Content-type': 'Application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar los anuncios');
            }

            const body = await response.json();
            setUserAnnouncements(body.announcements);
            console.log('USER ANNOUNCEMENTSSSS', userAnnouncements)

        } catch (error) {
            console.error('Error fetching announcements:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAnnouncement()
    }, [])

    useEffect(() => {
        if (announcementData.user_id == 0) {
            return
        }
        getUserAnnouncements()
    }, [announcementData])

    return (
        <main className='d-flex flex-column gap-3 align-items-center justify-content-center mt-5'>
            <div className='container d-flex align-items-center justify-content-between'>
                <h3 className='m-0'>Publicación</h3>
                {store.token ?
                    <Link to={`/land-settings/${announcementData.id}`} className='p-1'>
                        <button type='button' className='btn btn-success'>Editar Publicación</button>
                    </Link>
                    : null
                }
            </div>

            {/* CAROUSEL */}
            <div id='announcementImages' className='carousel slide col-8' data-bs-ride='carousel'>
                <div className='carousel-inner'>
                    {announcementData.images.map((item, index) => (
                        <div key={index} className={`carousel-item ${index == 0 ? 'active' : null}`}>
                            <img src={item} className='d-block w-100 rounded' alt='...' />
                        </div>
                    ))}
                </div>
                <button className='carousel-control-prev' type='button' data-bs-target='#announcementImages' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Previous</span>
                </button>
                <button className='carousel-control-next' type='button' data-bs-target='#announcementImages' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Next</span>
                </button>
            </div>

            {/* DESCRIPCIÓN DEL TERRENO */}
            <div className='row bg-white d-flex flex-wrap h-100 overflow-hidden' style={{ maxHeight: '100vh' }}>
                <div className='col-md-6 mt-3 ps-3 bg-white text-dark d-flex flex-column' style={{ overflowY: "auto" }}>
                    <h4 className=''>{announcementData.title}</h4>
                    <h5 className=''>${announcementData.price} • {announcementData.size}m<sup>2</sup></h5>
                    <h5 className=''>Localización: <small>{announcementData.location}</small></h5>
                    <h6 className=''>Descripción:</h6>
                    <p className=''>{announcementData.description}</p>
                </div>

                {/* GoogleMaps */}
                <div className='d-flex col-md-6' style={{ height: '400px' }}><GoogleMaps /></div>

            </div>

            {userAnnouncements.length !== 0 ? (
                <div className='bg-white vw-100 pb-3 px-5'>
                    <h2 className='text-secondary text-center my-2'>Otras Publicaciones de {announcementData.user.name}</h2>
                    <div className='d-flex flex-wrap gap-2 align-items-center justify-content-evenly'>
                        {userAnnouncements.map((item) => (
                            <Card
                                key={item.id}
                                announcementID={item.id}
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
            ) : null
            }
        </main >
    );
};

export default Announcement;