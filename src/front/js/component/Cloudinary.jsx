import React from 'react'
import { useState } from 'react'

const Cloudinary = (props) => {

    const preset_name = "landsquare";                         //16 Pegamos el "name" rescatado en el punto 24
    const cloud_name = "dgbakagwe"                          //16.2 Pegamos el cloud_name rescatado en punto 20

    const [ image, setImage ] = useState('');       //12 Creamos estado local que guarde la url de la imagen subida
    const [ loading, setLoading ] = useState(false) //7 Creamos un estado local con valor incial boolean "false" para saber si la imagen esta cargando.

    const uploadImage = async (e)=>{            //2 Preparamos para recibir el evento al ejecutarse la función async
        const files = e.target.files            //3 recuperamos el array de e.target.files
        const data = new FormData()             //4 Creamos/Instanciamos un FormData objeto con nombre data
        data.append('file', files[0])           //5 Utilizando metodo append() agregamos al data el archivo desde files[0]
        data.append('upload_preset',preset_name)  //6 Como prop "upload preset" le pasamos la variable de la linea 6 (punto 16.2).

        setLoading(true)                        //8 Ponemos en true el estado local que indica que la imagen esta cargándose.

        try {
            //10 enviamos el pedido de upload con el data en body 
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            const file = await response.json();     //11 Traducimos la respuesta de JSON
            setImage(file.secure_url);              //13 Recuperamos la url de la imagen en estado local
            console.log('🟢 File.secure_url: ', file)
            console.log('🟢 File.secure_url: ', file.secure_url)
            console.log('🟢 image: ', image)
            setLoading(false);                      //14 Dejamos el loading en false para que intente mostrar la magen
            //await actions.sendPhoto(file.secure_url) //15 Enviamos la url a un action para hacer algo en back. Lo dejamos bloqueado para que no de error de importacion de Context actions o de la función.
        } catch (error) {
            console.error('Error uploading image:', error);
            setLoading(false);
        }

    }

    return (
        <div>
            
            <label htmlFor='inputPictures' className='form-label'>Carga algunas imágenes (5 max) &nbsp;
            <span style={{ color: 'rgba(178,35,35,255)', fontWeight: 'bold' }} >*</span></label>
            <input 
                className='form-control'
                type='file'
                name='file'
                value={props.pictures}
                accept= 'image/png, image/jpeg'
                onChange={(e) => {
                    uploadImage(e)
                    console.log('🔴 Image:', image)
                    props.setPics(image)
                }}
                id='inputPictures'
                multiple 
                required />
            {/*1 - El siguiente input type file envia la imagen por el evento al handler uploadImage */}
            
            <br></br>

            <input
                type="file"
                name="file"
                placeholder='Upload an image'
                accept='image/png, image/jpeg'
                multiple
                required
                onChange={(e)=>{
                    uploadImage(e)
                    console.log('XXXXX',image)
                    props.setPics(image)
                }}
            />

            {/* ------------------------------------------------------------------------------------ */}


            {loading ? (
                <h4 className='mb-2'>Cargando...</h4>
            ) : (
                <div className='col-12 mt-2'>
                    <img src={image} style={{ width: 'inherit' }}/>
                </div>
            )}

        </div>
    );
}

export default Cloudinary