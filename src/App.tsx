import React, { useState, useCallback, useRef } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Controls, FractureParams } from './components/Controls';
import { FractureCanvas } from './components/FractureCanvas';
import './App.css';

const DEFAULT_PARAMS: FractureParams = {
    shardCount: 0,
    intensity: 0,
    gap: 0,
    stability: 100,
    elongationY: 1.0,
    elongationX: 1.0,
    rotation: 0,
    scatter: 0,
    gapColor: '#000000'
};

function App() {
    const [image, setImage] = useState<string | null>(null);
    const canvasRef = useRef<{ download: () => void; share: () => Promise<void> }>(null);
    const [params, setParams] = useState<FractureParams>(DEFAULT_PARAMS);

    const handleReset = () => {
        setParams(DEFAULT_PARAMS);
    };

    const handleImageUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        setImage(url);
    };

    const handleDownload = () => {
        canvasRef.current?.download();
    };

    const handleShare = async () => {
        await canvasRef.current?.share();
    };

    return (
        <div className="app-container">
            <main className="main-content">
                {!image ? (
                    <div className="empty-state">
                        <h1 className="title">Fracture</h1>
                        <p className="subtitle">Upload an image to shatter it.</p>
                        <div className="upload-container">
                            <ImageUploader onImageUpload={handleImageUpload} hasImage={false} />
                        </div>
                    </div>
                ) : (
                    <div className="workspace">
                        <ImageUploader onImageUpload={handleImageUpload} hasImage={true} />
                        <Controls
                            params={params}
                            setParams={setParams}
                            onDownload={handleDownload}
                            onShare={handleShare}
                            onReset={handleReset}
                        />

                        <div className="canvas-wrapper">
                            <FractureCanvas
                                ref={canvasRef}
                                imageUrl={image}
                                params={params}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
