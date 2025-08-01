export const ttsRead = (content: string) => {
	const synth = window.speechSynthesis;
	const utterThis = new SpeechSynthesisUtterance(content);
	synth.speak(utterThis);
};
