import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef, useMemo } from 'react';
import { Delaunay } from 'd3-delaunay';
import { FractureParams } from './Controls';

interface FractureCanvasProps {
    imageUrl: string;
    params: FractureParams;
}

export const FractureCanvas = forwardRef<{ download: () => void; share: () => Promise<void> }, FractureCanvasProps>(
    ({ imageUrl, params }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);

        // Load image
        useEffect(() => {
            const img = new Image();
            img.src = imageUrl;
            img.crossOrigin = 'anonymous';
            img.onload = () => setSourceImage(img);
        }, [imageUrl]);

        // Generate Points
        const points = useMemo(() => {
            if (!sourceImage) return { pts: [], effectiveWidth: 0, effectiveHeight: 0 };
            const { width, height } = sourceImage;
            const pts: [number, number][] = [];

            // Effective Dimensions for Voronoi generation
            // To stretch X, we generate points in compressed X.
            // To stretch Y, we generate points in compressed Y.
            // Rotation adds complexity.

            // Simplified approach:
            // 1. Generate points in a space scaled by 1/elongation
            // 2. We will transform these points back during drawing.

            const elX = params.elongationX || 1;
            const elY = params.elongationY || 1;

            // Rotation Bounding Box Logic
            // To ensure we cover the entire image when rotated, we need to generate points 
            // over a square with side length = hypotenuse of the image.
            const diag = Math.sqrt(width * width + height * height);

            // The "Space" dimensions we generate in
            const spaceSize = diag * 1.5; // Extra buffer
            const effectiveWidth = spaceSize / elX;
            const effectiveHeight = spaceSize / elY;

            // Offset so (0,0) in our generated space effectively maps to the center of the image
            // But voronoi generation starts at 0,0. 
            // We will generate in 0..effectiveWidth, 0..effectiveHeight
            // And then when transforming, we shift center to center.

            // Use seeded random or simple random, but we need enough points.
            // Since area is larger, we should scale shardCount? 
            // User expects "shardCount" pieces visible. 
            // If we generate mostly off-screen points, user sees fewer shards.
            // So we should scale up shard count based on area ratio?
            // Area ratio ~ (diag*diag) / (width*height) ~ 2.
            // Let's multiply shardCount by 2.5 to be safe.
            const count = Math.floor(params.shardCount * 2.5);

            for (let i = 0; i < count; i++) {
                pts.push([Math.random() * effectiveWidth, Math.random() * effectiveHeight]);
            }
            return { pts, effectiveWidth, effectiveHeight };
        }, [params.shardCount, sourceImage ? sourceImage.width : 0, sourceImage ? sourceImage.height : 0, params.elongationX, params.elongationY]); // Removed rotation dependency to keep points stable during rotation? No, rotation should prob change points or we rotate drawing context.

        // Helper to get canvas as blob
        const getCanvasBlob = async (): Promise<Blob | null> => {
            const canvas = canvasRef.current;
            if (!canvas) return null;

            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 0.9);
            });
        };

        // Expose download and share methods
        useImperativeHandle(ref, () => ({
            download: () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const link = document.createElement('a');
                link.download = 'fractured-image.jpg';
                link.href = canvas.toDataURL('image/jpeg', 0.9);
                link.click();
            },
            share: async () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                // Check if Web Share API is available and supports files
                if (navigator.share && navigator.canShare) {
                    try {
                        const blob = await getCanvasBlob();
                        if (!blob) return;

                        const file = new File([blob], 'fractured-image.jpg', { type: 'image/jpeg' });
                        
                        // Check if we can share this file
                        if (navigator.canShare({ files: [file] })) {
                            await navigator.share({
                                files: [file],
                                title: 'Fractured Image',
                                text: 'Check out this fractured image!'
                            });
                            return;
                        }
                    } catch (error) {
                        // User cancelled or error occurred, fallback to download
                        console.log('Share cancelled or failed, falling back to download');
                    }
                }

                // Fallback to download
                const link = document.createElement('a');
                link.download = 'fractured-image.jpg';
                link.href = canvas.toDataURL('image/jpeg', 0.9);
                link.click();
            }
        }));

        // Draw Loop
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas || !sourceImage) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const { width, height } = sourceImage;

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }

            // If no points (0 shards), just draw the original image and exit
            if (!points.pts.length) {
                ctx.drawImage(sourceImage, 0, 0, width, height);
                return;
            }

            const elX = params.elongationX || 1;
            const elY = params.elongationY || 1;

            const delaunay = Delaunay.from(points.pts);
            const voronoi = delaunay.voronoi([0, 0, points.effectiveWidth, points.effectiveHeight]);

            // Rotation: deg to rad
            const rotRad = (params.rotation || 0) * (Math.PI / 180);

            // Center of the generated space
            const cx_space = points.effectiveWidth / 2;
            const cy_space = points.effectiveHeight / 2;

            // Center of the image (screen)
            const cx_img = width / 2;
            const cy_img = height / 2;

            // 2. Draw background (source image)
            ctx.drawImage(sourceImage, 0, 0, width, height);

            // 3. Draw each cell
            for (let i = 0; i < points.pts.length; i++) {
                const cell = voronoi.cellPolygon(i);
                if (!cell) continue;

                // Stable Randoms
                const seed = i * 1337;
                const rand1 = Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
                const rand2 = Math.cos(seed) * 10000 - Math.floor(Math.cos(seed) * 10000);
                const rand3 = Math.abs(Math.sin(seed * 0.5)); // 0-1

                // Scatter rotation (randomness) - range: -scatter to +scatter
                const scatterRange = (params.scatter || 0) * (Math.PI / 180);
                const scatterRot = (Math.sin(seed * 2) * scatterRange);

                // Check Stability
                const isStable = rand3 < (params.stability / 100);

                ctx.save();

                // TRANSFORM CLIP PATH
                ctx.beginPath();

                const transformPoint = (px: number, py: number) => {
                    // 1. Scale
                    let sx = (px - cx_space) * elX;
                    let sy = (py - cy_space) * elY;

                    // 2. Rotate Space (Global Rotation)
                    if (rotRad !== 0) {
                        const rx = sx * Math.cos(rotRad) - sy * Math.sin(rotRad);
                        const ry = sx * Math.sin(rotRad) + sy * Math.cos(rotRad);
                        sx = rx;
                        sy = ry;
                    }

                    // 3. Translate to Screen Center
                    return [sx + cx_img, sy + cy_img];
                };

                // Check if cell is within view (optimization)
                // We can just draw and let clip handle it, but for 2.5x points, many are offscreen.
                // Canvas clipping is cheap enough.

                const start = transformPoint(cell[0][0], cell[0][1]);
                ctx.moveTo(start[0], start[1]);

                for (let j = 1; j < cell.length; j++) {
                    const pt = transformPoint(cell[j][0], cell[j][1]);
                    ctx.lineTo(pt[0], pt[1]);
                }
                ctx.closePath();
                ctx.clip();


                if (!isStable) {
                    // Apply Fracturing Transforms
                    const intensity = params.intensity;
                    const scale = 1.0 + (rand1 * 0.02 * intensity);
                    // Boosted offset
                    const tx = (rand1 - 0.5) * intensity * 15;
                    const ty = (rand2 - 0.5) * intensity * 15;

                    // Center for individual shard scaling/rotation
                    const [siteX, siteY] = points.pts[i];
                    const [scx, scy] = transformPoint(siteX, siteY);

                    ctx.translate(scx, scy);

                    // Apply Scatter Rotation
                    if (scatterRot !== 0) {
                        ctx.rotate(scatterRot);
                    }

                    ctx.scale(scale, scale);
                    ctx.translate(-scx, -scy);
                    ctx.translate(tx, ty);
                }

                // Draw the image
                ctx.drawImage(sourceImage, 0, 0, width, height);

                ctx.restore();

                // Draw Gap (Stroke)
                if (params.gap > 0 && !isStable) {
                    ctx.lineWidth = params.gap;
                    ctx.strokeStyle = params.gapColor;

                    ctx.beginPath();
                    const startS = transformPoint(cell[0][0], cell[0][1]);
                    ctx.moveTo(startS[0], startS[1]);
                    for (let j = 1; j < cell.length; j++) {
                        const ptS = transformPoint(cell[j][0], cell[j][1]);
                        ctx.lineTo(ptS[0], ptS[1]);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }

        }, [sourceImage, points, params]);

        return (
            <canvas
                ref={canvasRef}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
            />
        );
    }
);
