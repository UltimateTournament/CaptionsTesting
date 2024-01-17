import { useEffect, useRef } from "react"

async function getMicrophone() {
  const userMedia = await navigator.mediaDevices.getUserMedia({
    audio: {
      sampleRate: 44100,
    },
  });

  return new MediaRecorder(userMedia, {
    mimeType: "audio/webm; codecs=opus"
  });
}

async function openMicrophone(microphone: MediaRecorder, socket: WebSocket) {
  await microphone.start(100);

  microphone.onstart = () => {
    console.log("client: microphone opened");
    document.body.classList.add("recording");
  };

  microphone.onstop = () => {
    console.log("client: microphone closed");
    document.body.classList.remove("recording");
  };

  microphone.ondataavailable = (e) => {
    const data = e.data;
    console.log("client: sent data to websocket");
    socket.send(data);
  };
}

async function closeMicrophone(microphone: MediaRecorder) {
  microphone.stop();
}

export default function Captions() {
  const wsRef = useRef<WebSocket>()

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8080/ws")
    wsRef.current.onopen = async () => {
      console.log("socket opened")
      const mic = await getMicrophone()
      await openMicrophone(mic, wsRef.current!)
    }
    wsRef.current.onmessage = (msg) => {
      console.log('got msg', msg.data)
    }
  }, [])

  return (
    <div></div>
  )
}
