import React, { useEffect, useState } from "react";
import emailjs from '@emailjs/browser';

const EmailModal = (props) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [emailOwner, setEmailOwner] = useState(props.ownerEmail)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [message, setMessage] = useState(`Hola ${props.owner}, he encontrado '${props.title}' en Landsquare.com y me gustaría obtener más información al respecto. Gracias.`)

    const [isLoading, setIsLoading] = useState(false);

    const initializeEmailJS = () => {
        // Inicializa EmailJS con tu Public Key
        emailjs.init('Llt4Zze9ol3aIwYLL');
    };

    useEffect(() => {
        initializeEmailJS();
    }, []);

    const handleSendEmail = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!name || !email || !phoneNumber || !message) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido');
            return;
        }

        setIsLoading(true);

        // Prepare template parameters
        const templateParams = {
            to_email: emailOwner,
            to_name: props.owner,
            from_name: name,
            from_email: email,
            phone_number: phoneNumber,
            message: message,
            property_title: props.title,
            property_price: props.price,
            property_address: props.address,
            property_size: props.size,
            url: 'landsquare.com/announcement/id'
        };

        try {
            // Send email using EmailJS
            const result = await emailjs.send(
                'service_wlh848j', // Email service ID from EmailJS
                'template_hb5lgi8', // Email template ID from EmailJS
                templateParams
            );

            if (result.status === 200) {
                alert('Correo enviado exitosamente');

                // Reset form fields
                setName('');
                setEmail('');
                setPhoneNumber('');
                setMessage(`Hola ${props.owner}, he encontrado '${props.title}' en Landsquare.com y me gustaría obtener más información al respecto. Gracias.`);

                // Close modal
                const modalElement = document.getElementById('sendEmailModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
            }
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            alert('Hubo un error al enviar el correo. Por favor, intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal fade" id={`sendEmailModal${props.announcementID}`} tabindex='-1' aria-labelledby='sendEmailModalLabel' aria-hidden='true'>
            <div className='modal-dialog modal-dialog-scrollable'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h1 className='modal-title text-center fs-5' id='sendEmailModalLabel'>{props.title}</h1>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body fs-6'>
                        <div className='d-flex justify-content-center gap-3 mb-3'>
                            <img
                                className='rounded border border-light-subtle'
                                src={props.imgOwner}
                                alt=''
                                style={{ maxHeight: '100px' }} />
                            <div className='d-flex flex-column justify-content-center'>
                                <span className='fs-5'>{props.owner}</span>
                                <span className=''>{props.ownerPhoneNumber}</span>
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='inputName' className='form-label'>Nombre Completo</label>
                            <input
                                type='text'
                                className='form-control'
                                id='inputName'
                                placeholder='Nombre Completo'
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='inputEmail' className='form-label'>E-mail</label>
                            <input
                                type='email'
                                className='form-control'
                                id='inputEmail'
                                placeholder='E-mail'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                        <div className='mb-3 inputNumberUpDownRemoved'>
                            <label htmlFor='inputPhoneNumber' className='form-label'>Número de Teléfono</label>
                            <input
                                type='number'
                                className='form-control'
                                id='inputPhoneNumber'
                                placeholder='Número de Teléfono'
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                value={phoneNumber}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='inputMessage' className='form-label'>Mensaje</label>
                            <textarea
                                className='form-control'
                                id='inputMessage'
                                rows='3'
                                onChange={(e) => setMessage(e.target.value)}
                                value={message}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button
                            type='button'
                            className='btn btn-secondary'
                            data-bs-dismiss='modal'
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type='button'
                            className='btn btn-success'
                            onClick={handleSendEmail}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                                    Enviando...
                                </>
                            ) : 'Enviar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default EmailModal;