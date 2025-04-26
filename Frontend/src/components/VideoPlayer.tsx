import React from 'react';
import ReactPlayer from 'react-player';

export interface VideoPlayerProps {
  src: string;
  className?: string;
  controls?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  preload?: 'auto' | 'metadata' | 'none';
}

export default function VideoPlayer({
  src,
  className,
  controls = true,
  crossOrigin = 'anonymous',
  preload = 'metadata',
  ...rest
}: VideoPlayerProps) {
  return (
    <div className={className} style={{ position: 'relative', paddingTop: '56.25%' }}>
      <ReactPlayer
        url={src}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        controls={controls}
        config={{
          file: {
            attributes: {
              crossOrigin,
              preload,
            },
          },
        }}
        {...rest}
      />
    </div>
  );
}
