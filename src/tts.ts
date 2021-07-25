import { Readable, PassThrough } from "stream";
import { ResultReason, SpeechConfig, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";

export type Language = "ja-JP" | "en-US";

export type Voice = "ja-JP-KeitaNeural" | "ja-JP-NanamiNeural";

export default (subscriptionKey: string, serviceRegion = "japaneast", language: Language = "ja-JP", voice: Voice = "ja-JP-NanamiNeural") => {
  const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  speechConfig.speechSynthesisLanguage = language;
  speechConfig.speechSynthesisVoiceName = voice;

  return (text: string) => {
    const synthesizer = new SpeechSynthesizer(speechConfig);

    return new Promise<Readable>((resolve, reject) => {
      synthesizer.speakTextAsync(text, (result) => {
        synthesizer.close();
        if (result.reason === ResultReason.SynthesizingAudioCompleted) {
          const bufferStream = new PassThrough();
          bufferStream.end(Buffer.from(result.audioData));
          resolve(bufferStream);
        } else {
          reject(result.errorDetails);
        }
      }, (error) => {
        synthesizer.close();
        reject(error);
      });
    });
  };
};
