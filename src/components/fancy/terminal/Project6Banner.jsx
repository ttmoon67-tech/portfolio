import GridScan from '@/components/fancy/terminal/GridScan'

export default function Project6Banner() {
  return (
    <div className="w-full relative" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#0a0a0f' }}>
      {/* GridScan background */}
      <div className="absolute inset-0">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#4a3f5c"
          scanColor="#9eb2eb"
          scanOpacity={0.7}
          gridScale={0.1}
          lineStyle="solid"
          lineJitter={0.1}
          scanDirection="pingpong"
          noiseIntensity={0.01}
          scanGlow={0.5}
          scanSoftness={2}
          scanDuration={2}
          scanDelay={2}
          scanOnClick={false}
        />
      </div>

      {/* Centered white text */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <h1
          className="text-white tracking-widest text-center"
          style={{
            fontFamily: "'Alibaba PuHuiTi', 'PingFang SC', 'Microsoft YaHei', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(1rem, 2.5vw, 2.25rem)',
            letterSpacing: '0.15em',
          }}
        >
          Awakened Lion Universe
        </h1>
      </div>
    </div>
  )
}
