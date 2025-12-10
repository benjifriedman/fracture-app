import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import './ImageUploader.css';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    hasImage: boolean;
}

export function ImageUploader({ onImageUpload, hasImage }: ImageUploaderProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onImageUpload(acceptedFiles[0]);
        }
    }, [onImageUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        multiple: false
    });

    // If there's already an image, we render a smaller, floating drop zone or just handle it differently.
    // For now, let's make it a discrete overlay if hasImage is true, or full screen if not.

    return (
        <div
            {...getRootProps()}
            className={`image-uploader ${hasImage ? 'compact' : 'full'} ${isDragActive ? 'active' : ''}`}
        >
            <input {...getInputProps()} />
            <div className="uploader-content">
                <Upload className="icon" size={hasImage ? 24 : 48} />
                {isDragActive ? (
                    <p>Drop the image here...</p>
                ) : (
                    <p>{hasImage ? 'Drop new image to replace' : 'Drag & drop an image, or click to select'}</p>
                )}
            </div>
        </div>
    );
}
