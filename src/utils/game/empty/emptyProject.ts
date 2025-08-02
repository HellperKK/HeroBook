import type { Project } from "../Project";

export const emptyProject: Project = {
    version: "2.0.0",
    settings: {
        author: "",
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
            btnColor: "#000000",
            btnFont: "system-ui",
            background: "#ffffff",
            page: "#ffffff",
        },
    },
    categories: [{
        name: "no category",
        visible: true,
        pages: [],
    }],
};
