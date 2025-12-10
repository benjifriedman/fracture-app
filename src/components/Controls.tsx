import React from 'react';
import { Settings, Download, Share2 } from 'lucide-react';
import './Controls.css';

export interface FractureParams {
    shardCount: number;
    intensity: number;
    gap: number;
    stability: number; // 0-100
    elongationY: number;
    elongationX: number;
    rotation: number; // 0-360 degrees
    scatter: number; // 0-180 degrees (random rotation per shard)
    gapColor: string;
}

interface ControlsProps {
    params: FractureParams;
    setParams: (params: FractureParams) => void;
    onDownload: () => void;
    onShare: () => Promise<void>;
    onReset: () => void;
    disabled?: boolean;
}

export function Controls({ params, setParams, onDownload, onShare, onReset, disabled }: ControlsProps) {
    const [isSharing, setIsSharing] = React.useState(false);

    const handleChange = (key: keyof FractureParams, value: number | string) => {
        setParams({ ...params, [key]: value });
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            await onShare();
        } finally {
            setIsSharing(false);
        }
    };

    const supportsShare = typeof navigator !== 'undefined' && navigator.share && navigator.canShare;

    return (
        <div className={`controls-panel ${disabled ? 'disabled' : ''}`}>
            <div className="controls-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Settings size={20} />
                    <h3>Adjustments</h3>
                </div>
                <button
                    onClick={onReset}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'var(--color-text-muted)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    Reset
                </button>
            </div>

            <div className="control-group">
                <label>
                    Shards
                    <span className="value">{params.shardCount}</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={params.shardCount}
                    onChange={(e) => handleChange('shardCount', parseInt(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>
                    Refraction
                    <span className="value">{params.intensity.toFixed(1)}</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="150"
                    step="0.5"
                    value={params.intensity}
                    onChange={(e) => handleChange('intensity', parseFloat(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>
                    Gap Width
                    <span className="value">{params.gap}px</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={params.gap}
                    onChange={(e) => handleChange('gap', parseFloat(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>
                    Stability (Unchanged)
                    <span className="value">{params.stability}%</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={params.stability}
                    onChange={(e) => handleChange('stability', parseInt(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>
                    Gap Color
                    <span className="value" style={{ color: params.gapColor }}>{params.gapColor}</span>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="color"
                        value={params.gapColor}
                        onChange={(e) => handleChange('gapColor', e.target.value)}
                        style={{ width: '100%', height: '40px', cursor: 'pointer', border: 'none', background: 'none' }}
                    />
                </div>
            </div>

            <div className="control-group">
                <label>
                    Y-Axis Elongation
                    <span className="value">{params.elongationY.toFixed(1)}</span>
                </label>
                <input
                    type="range"
                    min="0.1"
                    max="26"
                    step="0.1"
                    value={params.elongationY}
                    onChange={(e) => handleChange('elongationY', parseFloat(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>
                    X-Axis Elongation
                    <span className="value">{params.elongationX.toFixed(1)}</span>
                </label>
                <input
                    type="range"
                    min="0.1"
                    max="26"
                    step="0.1"
                    value={params.elongationX}
                    onChange={(e) => handleChange('elongationX', parseFloat(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>
                    Direction (Rotation)
                    <span className="value">{params.rotation}°</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={params.rotation}
                    onChange={(e) => handleChange('rotation', parseInt(e.target.value))}
                />
            </div>

            <div className="control-group">
                <label>
                    Scatter (Random Rotate)
                    <span className="value">{params.scatter}°</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={params.scatter}
                    onChange={(e) => handleChange('scatter', parseInt(e.target.value))}
                />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                {supportsShare && (
                    <button 
                        className="share-btn" 
                        onClick={handleShare} 
                        disabled={disabled || isSharing}
                    >
                        <Share2 size={20} />
                        {isSharing ? 'Sharing...' : 'Share Image'}
                    </button>
                )}
                <button 
                    className="download-btn" 
                    onClick={onDownload} 
                    disabled={disabled}
                >
                    <Download size={20} />
                    {supportsShare ? 'Download' : 'Download Image'}
                </button>
            </div>
        </div>
    );
}
