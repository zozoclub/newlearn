// AudioBuffer를 WAV 포맷으로 변환하는 함수
export const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferView = new DataView(new ArrayBuffer(length));
  let offset = 0;

  /* WAV 파일 헤더 작성 */
  const writeString = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      bufferView.setUint8(offset++, s.charCodeAt(i));
    }
  };

  const write16 = (value: number) => {
    bufferView.setUint16(offset, value, true);
    offset += 2;
  };

  const write32 = (value: number) => {
    bufferView.setUint32(offset, value, true);
    offset += 4;
  };

  writeString("RIFF"); // ChunkID
  write32(length - 8); // ChunkSize
  writeString("WAVE"); // Format
  writeString("fmt "); // Subchunk1ID
  write32(16); // Subchunk1Size (PCM)
  write16(1); // AudioFormat (PCM)
  write16(numOfChan); // NumChannels
  write32(buffer.sampleRate); // SampleRate
  write32(buffer.sampleRate * numOfChan * 2); // ByteRate
  write16(numOfChan * 2); // BlockAlign
  write16(16); // BitsPerSample
  writeString("data"); // Subchunk2ID
  write32(buffer.length * numOfChan * 2); // Subchunk2Size

  // PCM 데이터 작성
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      const sample = buffer.getChannelData(channel)[i] * 0x7fff; // [-1, 1] 범위의 float을 16bit int로 변환
      bufferView.setInt16(offset, sample, true);
      offset += 2;
    }
  }

  return new Blob([bufferView], { type: "audio/wav" });
};

// WAV 변환 함수
export const convertToWav = async (
  blob: Blob,
  targetSampleRate: number = 16000
): Promise<Blob> => {
  return new Promise((resolve) => {
    const audioContext = new (window.AudioContext || window.AudioContext)();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;

      // 원본 오디오 데이터를 AudioBuffer로 디코딩
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // 기존 샘플링 레이트
      const originalSampleRate = audioBuffer.sampleRate;

      // 필요한 경우 다운샘플링 진행
      if (originalSampleRate !== targetSampleRate) {
        const offlineContext = new OfflineAudioContext(
          audioBuffer.numberOfChannels,
          audioBuffer.duration * targetSampleRate,
          targetSampleRate
        );

        // 원본 오디오 데이터를 OfflineAudioContext로 복사하여 샘플링 레이트 변환
        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        source.start(0);

        const renderedBuffer = await offlineContext.startRendering();

        // WAV 변환 후 반환
        const wavBlob = audioBufferToWav(renderedBuffer);
        resolve(wavBlob);
      } else {
        // 이미 16000Hz일 경우 그대로 반환
        const wavBlob = audioBufferToWav(audioBuffer);
        resolve(wavBlob);
      }
    };

    reader.readAsArrayBuffer(blob);
  });
};
