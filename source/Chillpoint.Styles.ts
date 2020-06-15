import { Style } from "./Util.HtmlBuilder";

export namespace ChillpointStyles {

	export const centered: Style = {
		display: "grid",
		justifyItems: "center",
		alignItems: "center",
	};

	export const text: Style = {
		textAlign: "center",
		fontFamily: "lato",
	};

	export const blurred: Style = {
		filter: "blur(5px)",
	};
}