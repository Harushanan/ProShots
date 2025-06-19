import React, { useState, useRef, useEffect, useCallback } from "react";

const ImageModal = ({ imageUrl, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const zoomIn = useCallback(() => setZoom(prev => Math.min(prev + 0.2, 3)), []);
  const zoomOut = useCallback(() => setZoom(prev => Math.max(prev - 0.2, 0.5)), []);
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  
  const handleMouseDown = useCallback((e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [zoom, position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || zoom <= 1) return;
    
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      
      const maxX = (imageRect.width * zoom - containerRect.width) / 2;
      const maxY = (imageRect.height * zoom - containerRect.height) / 2;
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    });
  }, [isDragging, zoom, startPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    cancelAnimationFrame(animationFrameRef.current);
  }, []);

  
  const handleTouchStart = useCallback((e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  }, [zoom, position]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || zoom <= 1) return;
    
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const newX = e.touches[0].clientX - startPos.x;
      const newY = e.touches[0].clientY - startPos.y;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      
      const maxX = (imageRect.width * zoom - containerRect.width) / 2;
      const maxY = (imageRect.height * zoom - containerRect.height) / 2;
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    });
  }, [isDragging, zoom, startPos]);

 
  useEffect(() => {
    if (zoom > 1) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
        cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [zoom, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 select-none"
      onClick={onClose}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
    
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
     
        <div className="absolute -inset-20 bg-gradient-to-r from-violet-600 to-blue-500 opacity-30 blur-3xl rounded-full animate-aura-spin"></div>
        
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(124,_58,_237,_0.1)_0%,_transparent_70%)] animate-pulse-slow"></div>
        
      
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className={`absolute rounded-full bg-gradient-to-br ${[
                'from-pink-500/20 to-rose-500/20',
                'from-blue-400/20 to-cyan-400/20',
                'from-purple-400/20 to-indigo-400/20'
              ][i]} blur-xl`}
              style={{
                width: `${100 + i * 80}px`,
                height: `${100 + i * 80}px`,
                top: `${20 + i * 20}%`,
                left: `${10 + i * 25}%`,
                animation: `float-orb ${15 + i * 5}s ease-in-out infinite alternate`,
                animationDelay: `${i * 2}s`
              }}
            ></div>
          ))}
        </div>
        
      
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      
      <div
        ref={containerRef}
        className="relative bg-gray-900/80 border border-gray-700/30 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30 group backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
       
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-gradient-to-br from-red-500 to-red-700 text-white p-2 rounded-full shadow-lg hover: transition-all duration-300 hover:scale-110 hover:rotate-180 focus:outline-none focus:ring-2 "
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      
        <div className="p-3 flex flex-col items-center">
          <div 
            className="overflow-hidden rounded-lg border border-gray-700/50 bg-gray-800/50 touch-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Zoomable preview"
              className="block transition-transform duration-300 ease-out max-h-[70vh] will-change-transform"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center'
              }}
              draggable="false"
            />
          </div>

          {/* Zoom controls */}
          <div className="mt-4 flex items-center gap-3 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700/30 shadow-inner">
            <button 
              onClick={zoomOut}
              className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Zoom out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <div className="text-sm font-medium text-gray-300 min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </div>
            
            <button 
              onClick={zoomIn}
              className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Zoom in"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <div className="h-6 w-px bg-gray-600 mx-1"></div>
            
            <button 
              onClick={resetZoom}
              className="px-3 py-1 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-md shadow-blue-500/20"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes aura-spin {
          0% { transform: rotate(0deg) scale(1); opacity: 0.2; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 0.3; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.2; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        
        @keyframes float-orb {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(5vw, 3vh) rotate(5deg); }
          66% { transform: translate(-4vw, 5vh) rotate(-5deg); }
          100% { transform: translate(2vw, -2vh) rotate(3deg); }
        }
        
        .animate-aura-spin {
          animation: aura-spin 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ImageModal;