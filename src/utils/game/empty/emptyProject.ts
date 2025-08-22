import type { Project } from "../Project";

export const emptyProject: Project = {
	version: "2.0.0",
	settings: {
		firstPage: 1,
		author: "",
		folderName: "",
		gameTitle: "",
		texts: {
			play: "Play",
			continue: "Continue",
			quit: "Quit",
			menu: "Menu",
		},
		expert: false,
		format: {
			textColor: "#000000",
			textFont: "system-ui",
			btnColor: "#65417e",
			btnTextColor: "#ffffff",
			btnFont: "system-ui",
			background: "#6499a9",
			page: "#cefaf2ff",
		},
	},
	pages: [
		{
			id: 1,
			name: "Start page",
			content: [
				{ id:1, type: "text", content: "What to you whant for dessert ?" },
				{ id:2,type: "choice", text: "Vanilla ice cream", pageId: 2 },
				{ id:3,type: "choice", text: "Cheesecake", pageId: 3 },
				{ id:4,type: "choice", text: "Brownie", pageId: 4 },
			],
		},
		{
			id: 2,
			name: "Vanilla ice cream",
			content: [
				{ id:1,type: "text", content: "Your are quite classical" },
				{ id:2,type: "choice", text: "Go back", pageId: 1 },
			],
		},
		{
			id: 3,
			name: "Cheesecake",
			content: [
				{ id:1, type: "text", content: "OMG the best dessert!" },
				{ id:2, type: "choice", text: "Go back", pageId: 1 },
			],
		},
		{
			id: 4,
			name: "Brownie",
			content: [
				{ id:1, type: "text", content: "You should count your calories..." },
				{ id:2, type: "choice", text: "Go back", pageId: 1 },
			],
		},
	],
};
