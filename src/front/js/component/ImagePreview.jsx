import React, { useState } from 'react';
import '../../styles/ImagePreview.css';

const ImagePreview = () => {
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        // Validar que se haya seleccionado un archivo
        if (!file) {
            setPreview('');
            return;
        }

        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecciona un archivo de imagen válido (jpg, png, etc)');
            setPreview('');
            return;
        }

        // Validar tamaño (ejemplo: máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen no debe superar los 5MB');
            setPreview('');
            return;
        }

        // Crear la previsualización
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="mb-3">
            <div className="mb-3">
                <input 
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {preview && (
                <div className="preview-container mt-3">
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="img-preview"
                    />
                </div>
            )}
        </div>
    );
};

export default ImagePreview;