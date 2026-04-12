import { Persona } from '@renderer/components/persona'
import { useState, useRef, useEffect } from 'react'

const RealtimePage = () => {
  const [state, setState] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'asleep'>(
    'idle'
  )

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const audioElRef = useRef<HTMLAudioElement | null>(null)
  // Saved so we can explicitly stop the OS-level mic track on disconnect
  const localStreamRef = useRef<MediaStream | null>(null)
  // Auto-close timer — OpenAI caps sessions at 30 min, we close at 20 to be safe
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Setup an audio player silently on the page to play back OpenAI's response streams
  useEffect(() => {
    const audioEl = document.createElement('audio')
    audioEl.autoplay = true
    audioElRef.current = audioEl
    return () => {
      audioEl.remove()
      stopConnection()
    }
  }, [])

  const startConnection = async () => {
    setState('thinking')

    try {
      // Fetch ephemeral token from Main Process securely
      const tokenRes = await window.api.getRealtimeToken()
      if (!tokenRes.success || !tokenRes.client_secret)
        throw new Error(tokenRes.error || 'Failed to get token')
      const EPHEMERAL_KEY = tokenRes.client_secret

      // 2. Setup standard RTCPeerConnection
      const pc = new RTCPeerConnection()
      pcRef.current = pc

      // Setup Remote Audio (play the incoming audio via our element)
      pc.ontrack = (e) => {
        if (audioElRef.current) {
          audioElRef.current.srcObject = e.streams[0]
        }
      }

      // Setup Local Audio (get microphone and add it to our connection)
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = ms // keep ref so stopConnection can release the OS mic
      pc.addTrack(ms.getTracks()[0])

      //  Setup a Data Channel
      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc

      dc.addEventListener('message', (e) => {
        const realtimeEvent = JSON.parse(e.data)

        // Dynamically update the Persona UI based on OpenAI events!
        if (realtimeEvent.type === 'response.audio.delta') {
          setState('speaking') // The AI is responding
        }
        if (realtimeEvent.type === 'response.done') {
          setState('listening') // The AI stopped responding, listening for you
        }
      })

      // Detect silent drops from OpenAI's side (timeout, server error, network blip)
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          stopConnection()
        }
      }

      // Auto-close after 20 min of continuous session — prevents zombie connections
      inactivityTimerRef.current = setTimeout(() => stopConnection(), 20 * 60 * 1000)

      // Connect via Session Description Protocol (SDP) Exchange
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const baseUrl = 'https://api.openai.com/v1/realtime'
      const model = 'gpt-realtime-mini-2025-12-15'

      // Complete WebRTC handshake providing our Ephemeral Key
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          'Content-Type': 'application/sdp'
        },
        body: offer.sdp
      })

      const answerSdp = await sdpResponse.text()
      const answer = { type: 'answer' as RTCSdpType, sdp: answerSdp }
      await pc.setRemoteDescription(answer)

      // Successfully authenticated and streaming audio
      setState('listening')
    } catch (err) {
      console.error('Failed to connect to Realtime API', err)
      setState('idle')
    }
  }

  const stopConnection = () => {
    // Stop the OS-level mic indicator — closing the PC alone does not release it
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    pcRef.current?.close()
    dcRef.current?.close()
    // Clear the auto-close timer if disconnect was triggered manually or by state change
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
    // Null all refs so stale handles can't be reused after reconnect
    localStreamRef.current = null
    pcRef.current = null
    dcRef.current = null
    inactivityTimerRef.current = null
    setState('idle')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <Persona state={state} variant="opal" className="size-64 mb-12 drop-shadow-xl" />

      <div className="flex gap-4">
        {state === 'idle' ? (
          <button
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-semibold transition drop-shadow text-white flex items-center gap-2"
            onClick={startConnection}
          >
            Connect Voice
          </button>
        ) : (
          <button
            className="px-6 py-3 bg-red-500/80 hover:bg-red-500 rounded-full font-semibold text-white transition drop-shadow"
            onClick={stopConnection}
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  )
}

export default RealtimePage
