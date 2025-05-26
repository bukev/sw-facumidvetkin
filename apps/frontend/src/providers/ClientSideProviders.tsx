'use client';
import { Animator, AnimatorGeneralProvider, BleepsProvider, BleepsProviderSettings, Dots, GridLines, MovingLines } from '@arwes/react';

export function ClientSideProviders({ children }: { children: React.ReactNode }) {
  const bleepsSettings: BleepsProviderSettings = {
    master: { volume: 0.35 },
    bleeps: {
      hover: {
        category: 'background',
        sources: [
          { src: '/hover.webm', type: 'audio/webm' },
          { src: '/hover.mp3', type: 'audio/mpeg' }
        ]
      },
      click: {
        category: 'interaction',
        sources: [
          { src: '/click.webm', type: 'audio/webm' },
          { src: '/click.mp3', type: 'audio/mpeg' }
        ]
      }
    }
  }

  const bgColor = '#02060C'
  const primaryColor = '#C2CCDB'

  return (
    <AnimatorGeneralProvider>
      <BleepsProvider {...bleepsSettings}>
        <Animator active>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: bgColor,
              opacity: .8,
              height: '100%',
              filter: 'blur(20px)'
            }}
          >
            <MovingLines lineColor={primaryColor} />
          </div>
        </Animator>
        {children}
      </BleepsProvider>
    </AnimatorGeneralProvider>
  );
}
