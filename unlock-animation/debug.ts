export const debugLog = {
  opened: () => console.log('🎬 UnlockAnimation opened - starting sequence'),
  closed: () => console.log('🎬 UnlockAnimation closed - resetting'),
  closing: () => console.log('🎬 UnlockAnimation closing'),
  phase: (phase: string) => console.log(`📍 Phase: ${phase}`),
  timing: (timing: number[]) => console.log('⏱️ Animation timing:', timing),
};

export const DebugPhaseIndicator = ({ 
  animationPhase, 
  isDevelopment 
}: { 
  animationPhase: string; 
  isDevelopment: boolean;
}) => {
  if (!isDevelopment) return null;

  return (
    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-mono">
      {animationPhase.toUpperCase()}
    </div>
  );
};