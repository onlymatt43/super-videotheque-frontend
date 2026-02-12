import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const JitsiRoom = ({ roomName, userName }: { roomName: string, userName: string }) => {
  return (
    <div style={{ height: '800px', width: '100%' }}>
      <JitsiMeeting
        domain="meet.jit.si" // Plus tard, tu pourras mettre ton propre serveur Ubuntu ici
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
        }}
        userInfo={{
          displayName: userName,
          email: '' 
        }}
        onApiReady={(externalApi) => {
          // Ici tu peux contrôler la réunion (ex: couper tous les micros)
          console.log("Jitsi est prêt !");
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
        }}
      />
    </div>
  );
};

export default JitsiRoom;