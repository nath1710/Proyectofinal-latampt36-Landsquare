import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../component/Card.jsx';
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
        price: '',
        size: 0,
        title: '',
        user: {},
        user_id: 0
    })

    const [title, setTitle] = useState('')
    const [images, setImages] = useState([])
    const [price, setPrice] = useState(0)
    const [size, setSize] = useState(0)
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [user, setUser] = useState({})
    const [userID, setUserID] = useState(null)

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
                price: body.price,
                size: body.size,
                title: body.title,
                user: body.user,
                user_id: body.user_id
            });
            setTitle(body.title)
            setImages(body.images)
            setPrice(body.price)
            setSize(body.size)
            setLocation(body.location)
            setDescription(body.description)
            setUser(body.user)
            setUserID(body.user_id)

            console.log('BODYYYYYYY', body)
            console.log('ANNOUNCEMENT', announcementData)
            console.log('bbbbbtitle', body.title)
            console.log('title', title)
            console.log('bbbbbimages', body.images)
            console.log('images', images)
            console.log('bbbbUSERIDDD', body.user_id)
            console.log('USERIDDD', userID)

        } catch (error) {
            console.error('Error fetching announcement:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }

        getUserAnnouncements()
    }

    const getUserAnnouncements = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(process.env.BACKEND_URL + `/api/user/${userID}/announcements`, {
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

    return (
        <main className='d-flex flex-column gap-3 align-items-center justify-content-center mt-5'>
            <div className='container d-flex align-items-center justify-content-between'>
                <h3 className='m-0'>Publicación</h3>
                <Link to='/land-settings' className='p-1'>
                    <button type='button' className='btn btn-success'>Editar Publicación</button>
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
                            <Link to='/post' className='d-flex justify-content-center'>
                                <button type='button' className='btn btn-primary'>Publicar</button>
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
                    <div className='d-flex flex-wrap gap-2 align-items-center justify-content-start'>
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

export default Announcement;