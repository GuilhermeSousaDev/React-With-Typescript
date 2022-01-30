import React, { useCallback, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';

interface IProps {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<IProps> = ({ onFileUploaded }) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);
    
        onFileUploaded(file)

    }, [onFileUploaded]);
    const { getInputProps, getRootProps } = useDropzone({ onDrop, accept: 'image/*' })

    return(
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept='image/*' />
            {
                selectedFileUrl ? 
                <img src={selectedFileUrl} alt="Imagem do Estabelecimento" /> : 
                <p>
                    <FiUpload />
                    Imagem do Estabelecimento
                </p>
            }
        </div>
    )
}

export default Dropzone;