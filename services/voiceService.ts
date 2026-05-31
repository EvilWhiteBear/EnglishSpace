import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

const API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY ?? '';
const NOVA_VOICE_ID = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID ?? 'xhu8HSCv1JYrhLx4m8UG';
const EN_VOICE_ID = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_EN ?? '21m00Tcm4TlvDq8ikWAM';

const audioCache: Record<string, string> = {};
let currentSound: Audio.Sound | null = null;

async function setupAudio() {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
  });
}

export async function stopSpeaking(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch {}
    currentSound = null;
  }
}

async function speak(
  text: string,
  voiceId: string,
  stability = 0.65,
  similarityBoost = 0.80,
  style = 0.20,
): Promise<void> {
  if (!API_KEY || !text.trim()) return;
  try {
    const cacheKey = `${voiceId}_${text.slice(0, 60)}`;
    let audioUri = audioCache[cacheKey];

    if (!audioUri) {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability,
              similarity_boost: similarityBoost,
              style,
              use_speaker_boost: true,
            },
          }),
        }
      );
      if (!response.ok) return;

      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      bytes.forEach(b => { binary += String.fromCharCode(b); });
      const base64 = btoa(binary);
      const fileUri = `${FileSystem.cacheDirectory}nova_${Date.now()}.mp3`;
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      audioUri = fileUri;
      audioCache[cacheKey] = fileUri;
    }

    await stopSpeaking();
    await setupAudio();
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: true, volume: 1.0 }
    );
    currentSound = sound;
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        currentSound = null;
      }
    });
  } catch {
    // Silent fallback — do not crash the app
  }
}

// Nova speaks Russian
export async function novaSpeak(text: string): Promise<void> {
  const clean = text
    .replace(/\*\*/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[🌟⭐✨🚀💫]/g, '')
    .trim()
    .slice(0, 300);
  await speak(clean, NOVA_VOICE_ID, 0.65, 0.80, 0.20);
}

// Pronounces an English word
export async function pronounceWord(word: string): Promise<void> {
  await speak(word, EN_VOICE_ID, 0.90, 0.85, 0.0);
}

// Teaches a word: Russian context + English pronunciation twice
export async function teachWord(params: {
  english: string;
  russian: string;
}): Promise<void> {
  await novaSpeak(params.russian);
  await new Promise(r => setTimeout(r, 500));
  await pronounceWord(params.english);
  await new Promise(r => setTimeout(r, 400));
  await pronounceWord(params.english);
}

export async function isVoiceAvailable(): Promise<boolean> {
  if (!API_KEY) return false;
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': API_KEY },
    });
    return res.ok;
  } catch {
    return false;
  }
}
