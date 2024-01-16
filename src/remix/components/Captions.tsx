import { useEffect, useRef } from "react"

export default function Captions() {
  const wsRef = useRef<WebSocket>()

  async function captureAudio(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted");
      return stream;    
    } catch (error) {
      console.error("Error accessing the microphone", error);
      throw error;
    }
  }

  function handleAudioStream(stream: MediaStream, webSocket: WebSocket) {
    const context = new AudioContext({
      sampleRate: 48000
    });
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(4096, 1, 1);
    
    // Connect the source to the processor and the processor to the destination
    source.connect(processor);
    processor.connect(context.destination);
    
    processor.onaudioprocess = (event: AudioProcessingEvent) => {
      const input = event.inputBuffer.getChannelData(0);
      const buffer = new Int16Array(input.length);
      for (let i = 0; i < input.length; ++i) {
        // This assumes 16-bit PCM audio
        buffer[i] = Math.min(1, input[i]) * 0x7FFF;
      }
      
      // Now convert Int16Array to byte array
      const byteArray = new Int8Array(buffer.buffer);
      
      if (webSocket.readyState === WebSocket.OPEN) {
        console.log('sending byte array')
        webSocket.send(byteArray);
      }
    };
  }

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8080/ws")
    wsRef.current.onopen = async () => {
      console.log("socket opened")
      const stream = await captureAudio()
      handleAudioStream(stream, wsRef.current!)
    }
    wsRef.current.onmessage = (msg) => {
      console.log('got msg', msg.data)
    }
  }, [])

  return (
    <div></div>
  )
}
