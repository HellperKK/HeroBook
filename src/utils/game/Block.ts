export type Block =
	| {
			type: "text";
			content: string;
	  }
	| {
			type: "image";
			path: string;
	  }
	| {
			type: "audio";
			path: string;
			autoplay: boolean;
	  }
	| {
			type: "sound";
			path: string;
			autoplay: boolean;
	  }
	| {
			type: "video";
			path: string;
	  }
	| {
			type: "choice";
			text: string;
            pageId: number;
	  };
