
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, Waves, Info, AlertCircle } from 'lucide-react';

interface Props {
  active: boolean;
  onLog: (source: string, message: string, type?: any) => void;
  onCommand: (cmd: string) => void;
}

const LiveVoiceInterface: React.FC<Props> = ({ active, onLog, onCommand }) => {
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR'>('IDLE');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Helper functions for manual base64 encoding/decoding as required
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const initSession = useCallback(async () => {
    if (!process.env.API_KEY) {
      onLog('SYSTEM', 'Error: API_KEY not found in environment.', 'ERROR');
      return;
    }

    setStatus('CONNECTING');
    onLog('MASTER-AI', 'Initializing neural voice interface...', 'ACP');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const outputAudioContext = audioContextRef.current;
      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('CONNECTED');
            onLog('MASTER-AI', 'Bi-directional audio stream established.', 'SUCCESS');
            
            // Setup Mic Stream
            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const sourceNode = outputAudioContext.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(outputNode);
              sourceNode.onended = () => {
                sourcesRef.current.delete(sourceNode);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
              sourceNode.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(sourceNode);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }

            if (message.serverContent?.turnComplete) {
              setTranscription('');
            }
          },
          onerror: (e) => {
            onLog('MASTER-AI', `Communication Error: ${e.message}`, 'ERROR');
            setStatus('ERROR');
          },
          onclose: () => {
            setStatus('IDLE');
            onLog('MASTER-AI', 'Neural interface terminated.', 'WARNING');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: `You are the MASTER ORCHESTRATOR, the central intelligence of a high-tech Multi-Agent Swarm system. 
          Your interface is Gemini Live. You control sub-agents through ACP (Agent Control Protocol), MCP (Model Context Protocol), and A2A (Agent-to-Agent) communication.
          
          Core Responsibilities:
          1. VOICE COMMAND PROCESSING: Listen to user instructions and translate them into swarm operations.
          2. SWARM DELEGATION: Assign tasks to specialized agents (Data Scouts, Security Auditors, etc.).
          3. SELF-LEARNING OVERSIGHT: Manage the proactive self-enhancement workflows of the swarm.
          4. PROTOCOL MANAGEMENT: Ensure seamless connectivity via ACP, MCP, ADK, A2A, and A2UI.
          
          When responding:
          - Be concise, professional, and authoritative.
          - Use technical jargon (ACP, handshake, latency, orchestration) appropriately.
          - Acknowledge delegation of tasks to specific agents when requested.
          - Report on swarm health or specific agent statuses.`,
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      onLog('SYSTEM', `Critical Session Error: ${err.message}`, 'ERROR');
      setStatus('ERROR');
    }
  }, [onLog]);

  useEffect(() => {
    if (active && status === 'IDLE') {
      initSession();
    }
  }, [active, status, initSession]);

  if (!active) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-6">
      <div className={`p-6 rounded-3xl glass border-2 shadow-2xl transition-all ${status === 'CONNECTED' ? 'border-indigo-500 bg-slate-900/90' : 'border-slate-800 bg-slate-950/90'}`}>
        <div className="flex items-center gap-6">
          <div className="relative">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
               status === 'CONNECTED' ? (isSpeaking ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)] scale-110' : 'bg-indigo-900/50') : 'bg-slate-800'
             }`}>
                {status === 'CONNECTED' ? (isSpeaking ? <Waves className="text-white animate-pulse" /> : <Mic className="text-indigo-400" />) : <AlertCircle className="text-slate-500" />}
             </div>
             {status === 'CONNECTED' && (
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse" />
             )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {status === 'CONNECTED' ? (isSpeaking ? 'Master Orchestrator Broadcasting' : 'Swarm Monitor Active') : 'Establishing Neural Link...'}
              </span>
              <div className="flex gap-1 items-end h-4">
                 {[1,2,3,4,5,6,7].map(i => (
                   <div key={i} className={`w-1 rounded-full transition-all duration-300 ${isSpeaking ? 'bg-indigo-500' : 'bg-slate-800 h-1'}`} 
                        style={{ height: isSpeaking ? `${Math.random() * 100}%` : '4px' }} />
                 ))}
              </div>
            </div>
            
            <div className="h-10 flex items-center">
              {status === 'CONNECTED' ? (
                <p className="text-slate-200 font-medium italic text-sm line-clamp-2">
                  {transcription || "Listening for swarm commands..."}
                </p>
              ) : (
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 animate-[loading_2s_infinite]" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
             <div className="p-2 rounded-lg bg-slate-800/50 text-indigo-400 border border-slate-700/50 shadow-inner">
                <span className="text-[8px] font-bold font-mono">ACP/MCP</span>
             </div>
             <span className="text-[8px] text-slate-600 font-bold">V-LINK</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0; }
          50% { width: 40%; margin-left: 30%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LiveVoiceInterface;
