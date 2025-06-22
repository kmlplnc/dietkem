import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import './VideoCallPanel.css';

interface VideoCallPanelProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: number;
  roomUrl?: string;
  isClient?: boolean;
}

// Browser support check function
const checkBrowserSupport = (): boolean => {
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const hasRTCPeerConnection = !!window.RTCPeerConnection;
  const hasWebRTC = !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection);
  
  return hasGetUserMedia && hasRTCPeerConnection && hasWebRTC;
};

// Browser detection
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = 'unknown';
  let version = 'unknown';

  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : 'unknown';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
    const match = userAgent.match(/Edge\/(\d+)/);
    version = match ? match[1] : 'unknown';
  }

  return { browser, version };
};

const VideoCallPanel: React.FC<VideoCallPanelProps> = ({
  isOpen,
  onClose,
  consultationId,
  roomUrl,
  isClient = false
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [browserSupported, setBrowserSupported] = useState<boolean | null>(null);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Check browser support
      const supported = checkBrowserSupport();
      setBrowserSupported(supported);
      
      if (!supported) {
        setError('browser_not_supported');
        setIsLoading(false);
        return;
      }

      // Load Jitsi Meet
      loadJitsiMeet();
    }
  }, [isOpen, roomUrl]);

  const loadJitsiMeet = () => {
    if (!roomUrl) {
      setError('no_room_url');
      setIsLoading(false);
      return;
    }

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
        setError('jitsi_load_failed');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } catch (err) {
      console.error('Error loading Jitsi Meet:', err);
      setError('jitsi_load_failed');
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
          DEFAULT_LOCAL_DISPLAY_NAME: isClient ? 'Danışan' : 'Diyetisyen',
          DEFAULT_REMOTE_DISPLAY_NAME: 'Katılımcı',
          MOBILE_APP_PROMO: false,
          MAXIMUM_ZOOMING_COEFFICIENT: 1.0,
          MINIMUM_ZOOMING_COEFFICIENT: 0.25,
          SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
          TILE_VIEW_MAX_COLUMNS: 2
        },
        userInfo: {
          displayName: isClient ? 'Danışan' : 'Diyetisyen',
          email: '',
          moderator: !isClient
        }
      };

      // Initialize Jitsi Meet
      const api = new (window as any).JitsiMeetExternalAPI(domain, options);
      apiRef.current = api;

      // Event listeners
      api.addEventListeners({
        readyToClose: () => {
          console.log('Jitsi Meet ready to close');
          onClose();
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
          onClose();
        },
        audioMuteStatusChanged: (data: any) => {
          console.log('Audio mute status changed:', data);
        },
        videoMuteStatusChanged: (data: any) => {
          console.log('Video mute status changed:', data);
        }
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing Jitsi Meet:', err);
      setError('jitsi_init_failed');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (apiRef.current) {
      try {
        apiRef.current.dispose();
      } catch (err) {
        console.error('Error disposing Jitsi Meet:', err);
      }
    }
    onClose();
  };

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case 'browser_not_supported':
        return 'Tarayıcınız video görüşmeyi desteklemiyor. Lütfen modern bir tarayıcı kullanın.';
      case 'no_room_url':
        return 'Oda URL\'si bulunamadı. Lütfen tekrar deneyin.';
      case 'jitsi_load_failed':
        return 'Jitsi Meet yüklenemedi. Lütfen internet bağlantınızı kontrol edin.';
      case 'jitsi_init_failed':
        return 'Video görüşme başlatılamadı. Lütfen tekrar deneyin.';
      default:
        return 'Bilinmeyen bir hata oluştu.';
    }
  };

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Bilinmeyen';
  };

  if (!isOpen) return null;

  return (
    <div className="video-call-panel-overlay">
      <div className="video-call-panel">
        <div className="video-call-header">
          <h3>{t('videoCall')}</h3>
          <button onClick={handleClose} className="close-button">
            ✕
          </button>
        </div>

        <div className="video-call-content">
          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t('loadingVideoCall')}</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h4>Video Görüşme Hatası</h4>
              <p>{getErrorMessage(error)}</p>
              
              {error === 'browser_not_supported' && (
                <div className="browser-info">
                  <p><strong>Mevcut Tarayıcı:</strong> {getBrowserInfo()}</p>
                  <p><strong>Önerilen Tarayıcılar:</strong></p>
                  <ul>
                    <li>Google Chrome (80+)</li>
                    <li>Mozilla Firefox (75+)</li>
                    <li>Microsoft Edge (80+)</li>
                    <li>Safari (13+)</li>
                  </ul>
                  <div className="browser-links">
                    <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">
                      Chrome İndir
                    </a>
                    <a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener noreferrer">
                      Firefox İndir
                    </a>
                    <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer">
                      Edge İndir
                    </a>
                  </div>
                </div>
              )}

              <div className="alternative-contact">
                <h5>Alternatif İletişim Yöntemleri:</h5>
                <ul>
                  <li>📞 Telefon: +90 XXX XXX XX XX</li>
                  <li>📱 WhatsApp: +90 XXX XXX XX XX</li>
                  <li>📧 Email: diyetisyen@dietkem.com</li>
                </ul>
              </div>

              <button 
                onClick={() => window.open(roomUrl, '_blank')}
                className="open-external-button"
              >
                Jitsi Meet'i Yeni Sekmede Aç
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <div 
              ref={jitsiContainerRef} 
              className="jitsi-container"
              style={{ height: '600px', width: '100%' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallPanel; 