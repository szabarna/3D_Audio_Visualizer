import { useEffect, useRef } from "react";

const AudioCanvas = ({ analyser }: { analyser: AnalyserNode | null}) => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

      const draw = () => {
        animationRef.current = requestAnimationFrame(draw);
        
        if (!analyser || !ctx || !canvas) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

          ctx.fillStyle = "rgba(0, 0, 0, 0.0)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / bufferLength) * 1.75;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = `rgb(0, ${barHeight + 100}, ${barHeight + 5})`;
            ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth;
          }
    }

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser]);

  return <canvas ref={canvasRef} />;
};

export default AudioCanvas;
