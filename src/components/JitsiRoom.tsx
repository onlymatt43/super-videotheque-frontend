import { JitsiMeeting } from '@jitsi/react-sdk';

const JitsiRoom = ({ roomName, userName }: { roomName: string, userName: string }) => {
  return (
    <div style={{ height: '800px', width: '100%' }}>
      <JitsiMeeting
        domain="meet.onlymatt.ca"
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: false,
          startScreenSharing: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: userName,
          email: '' 
        }}
        onApiReady={() => {
          // Jitsi est prêt
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
        }}
      />
    </div>
  );
};

export default JitsiRoom;