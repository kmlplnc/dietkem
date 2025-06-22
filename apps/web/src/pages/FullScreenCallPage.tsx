import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { toast } from 'react-hot-toast';
import './FullScreenCallPage.css';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const FullScreenCallPage = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: allConsultations, isLoading: consultationLoading, error: consultationError } = trpc.consultations.getAll.useQuery();
  
  const consultation = allConsultations?.find(c => c.id === Number(consultationId));
  
  const endVideoCallMutation = trpc.consultations.endVideoCall.useMutation();
  const createDailyRoomMutation = trpc.consultations.createDailyRoom.useMutation();

  // Browser support check
  const checkBrowserSupport = (): boolean => {
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasRTCPeerConnection = !!window.RTCPeerConnection;
    const hasWebRTC = !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection);
    
    return hasGetUserMedia && hasRTCPeerConnection && hasWebRTC;
  };

  useEffect(() => {
    if (consultationLoading || consultationError || !consultation) return;

    if (consultation.status !== 'in_progress') {
      toast.error('Bu görüşme aktif değil veya süresi dolmuş.');
      window.close();
      navigate('/dietitian-panel');
      return;
    }

    // Check browser support
    if (!checkBrowserSupport()) {
      setError('Tarayıcınız video görüşmeyi desteklemiyor.');
      setIsLoading(false);
      return;
    }

    const initializeCall = async () => {
      try {
        // Check if room already exists
        if (consultation.room_url) {
          console.log('Using existing room URL:', consultation.room_url);
          setRoomUrl(consultation.room_url);
          loadJitsiMeet(consultation.room_url);
        } else {
          console.log('Creating new room for consultation:', consultation.id);
          const result = await createDailyRoomMutation.mutateAsync({
            consultation_id: consultation.id
          });
          setRoomUrl(result.roomUrl);
          loadJitsiMeet(result.roomUrl);
        }
      } catch (error) {
        console.error('Failed to create/get room:', error);
        setError('Görüşme odası oluşturulamadı.');
        setIsLoading(false);
      }
    };

    initializeCall();
  }, [consultation, consultationLoading, consultationError, navigate, createDailyRoomMutation]);

  const loadJitsiMeet = (roomUrl: string) => {
    try {
      // Extract room name from URL
      const roomName = roomUrl.split('/').pop() || `dietkem-consultation-${consultationId}`;
      
      // Load Jitsi Meet External API
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => {
        initializeJitsiMeet(roomName);
      };
      script.onerror = () => {
        setError('Jitsi Meet yüklenemedi.');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } catch (err) {
      console.error('Error loading Jitsi Meet:', err);
      setError('Jitsi Meet yüklenemedi.');
      setIsLoading(false);
    }
  };

  const initializeJitsiMeet = (roomName: string) => {
    try {
      if (!jitsiContainerRef.current) return;

      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: true,
          enableClosePage: false,
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
          ],
          disableAudioLevels: true,
          enableWelcomePage: false,
          enableLobbyChat: false,
          enableForcedReload: false,
          enableInsecureRoomNameWarning: false,
          enableAutomaticUrlCopy: false,
          enableRemb: true,
          enableTcc: true,
          openBridgeChannel: 'websocket',
          clientHeight: '100%',
          clientWidth: '100%',
          maxFullResolutionParticipants: 2,
          resolution: 720,
          constraints: {
            video: {
              height: {
                ideal: 720,
                max: 720,
                min: 180
              }
            }
          }
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          SHOW_MEETING_TIMER: true,
          SHOW_DEEP_LINKING_IMAGE: false,
          SHOW_PARTICIPANTS_COUNT: true,
          AUTHENTICATION_ENABLE: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          TOOLBAR_TIMEOUT: 4000,
          DEFAULT_BACKGROUND: '#474747',
          DEFAULT_LOCAL_DISPLAY_NAME: 'Diyetisyen',
          DEFAULT_REMOTE_DISPLAY_NAME: 'Danışan',
          MOBILE_APP_PROMO: false,
          MAXIMUM_ZOOMING_COEFFICIENT: 1.0,
          MINIMUM_ZOOMING_COEFFICIENT: 0.25,
          SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
          TILE_VIEW_MAX_COLUMNS: 2
        },
        userInfo: {
          displayName: 'Diyetisyen',
          email: '',
          moderator: true
        }
      };

      // Initialize Jitsi Meet
      const api = new window.JitsiMeetExternalAPI(domain, options);
      apiRef.current = api;

      // Event listeners
      api.addEventListeners({
        readyToClose: () => {
          console.log('Jitsi Meet ready to close');
          handleEndCall();
        },
        participantLeft: () => {
          console.log('Participant left');
        },
        participantJoined: () => {
          console.log('Participant joined');
        },
        videoConferenceJoined: () => {
          console.log('Video conference joined');
          setIsLoading(false);
        },
        videoConferenceLeft: () => {
          console.log('Video conference left');
          handleEndCall();
        },
        audioMuteStatusChanged: (data: any) => {
          console.log('Audio mute status changed:', data);
        },
        videoMuteStatusChanged: (data: any) => {
          console.log('Video mute status changed:', data);
        }
      });

    } catch (err) {
      console.error('Error initializing Jitsi Meet:', err);
      setError('Jitsi Meet başlatılamadı.');
      setIsLoading(false);
    }
  };

  const handleEndCall = async () => {
    try {
      if (consultation) {
        await endVideoCallMutation.mutateAsync({ consultation_id: consultation.id });
      }
      toast.success('Görüşme sonlandırıldı. Bu sekme kapanacak.', { duration: 2000 });
      setTimeout(() => window.close(), 2000);
    } catch (error) {
      console.error('Error ending call:', error);
      window.close();
    }
  };

  useEffect(() => {
    return () => {
      if (apiRef.current) {
        try {
          apiRef.current.dispose();
        } catch (err) {
          console.error('Error disposing Jitsi Meet:', err);
        }
      }
    };
  }, []);

  if (isLoading || createDailyRoomMutation.isLoading) {
    return <div className="call-page-loading">Görüşme Yükleniyor...</div>;
  }

  if (consultationError) {
    return <div className="call-page-error">Hata: {consultationError.message}</div>;
  }

  if (!consultation) {
    return <div className="call-page-error">Görüşme bulunamadı.</div>;
  }

  if (error) {
    return (
      <div className="call-page-error">
        <h3>Video Görüşme Hatası</h3>
        <p>{error}</p>
        <button onClick={() => window.close()}>Kapat</button>
      </div>
    );
  }

  if (createDailyRoomMutation.error) {
    return <div className="call-page-error">Oda oluşturma hatası: {createDailyRoomMutation.error.message}</div>;
  }

  return <div ref={jitsiContainerRef} className="fullscreen-jitsi-container" />;
};

export default FullScreenCallPage; 