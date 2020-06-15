import { HtmlBuilder } from './Util.HtmlBuilder';
import { ChillpointStyles as Styles, ChillpointStyles } from './Chillpoint.Styles';
import { Terrain } from './Util.Terrain';
import { Camera } from './Util.Camera';
import { Meeples } from './Util.Meeples';
import { Forest } from './Util.Forest';
import { Weebles } from './Util.Weebles';

export namespace ChillpointEntry {
	export function initialize_client() {
		const body = HtmlBuilder.assign_to_element(document.body, {
			style: {
				margin: 0,
				fontSize: 20,
				position: "relative",
				overflowX: "hidden",
				overflowY: "hidden",
			},

		});

		const tests = {
			terrain: () => {
				Terrain.render(body, Camera.default_camera, 32, {});
			},
			forest_small: () => {
				Terrain.render(body, Camera.default_camera, 32, ChillpointStyles.blurred);
				Forest.render(body, Camera.default_camera);
			},
			forest_big: () => {
				Terrain.render(body, Camera.default_camera, 32, {});
				Forest.render(body, Camera.default_camera);
			},
			meeples: () => {
				Terrain.render(body, Camera.default_camera, 32, {});
				Meeples.render(body, Camera.default_camera);
			},
		};

		const url = new URL(window.location.href);
		const test_name = url.searchParams.get("test") as keyof typeof tests;

		tests[test_name]();

		const uiOutline = HtmlBuilder.create_child(body, {
			type: "div",
			style: {

				width: "100%",
				height: "100%",
				position: "absolute",
				left: 0,
				top: 0,
				gridTemplateAreas: `
					"t t t"
					". a ."
					"f f f"
				`,
				zIndex: 1,
			},
		});

		// const header = HtmlBuilder.create_child(uiOutline, {
		// 	type: "div",
		// 	style: {
		// 		gridArea: "h",
		// 		gridTemplateAreas: `
		// 			"t ."
		// 		`,

		// 		...Styles.centered,

		// 		backgroundColor: "green",
		// 		borderRadius: "5px",
		// 		padding: "0.5em",
		// 	},
		// });
		// HtmlBuilder.create_child(header, {
		// 	type: "div",
		// 	style: {
		// 		...Styles.text,
		// 		gridArea: "t",
		// 	},
		// 	attributes: {
		// 		innerHTML: "chill_point",
		// 	},
		// });

		const footer = HtmlBuilder.create_child(uiOutline, {
			type: "div",
			style: {
				gridArea: "f",
				gridTemplateAreas: `
					"w c s"
				`
			},
		});

		const warning = HtmlBuilder.create_child(uiOutline, {
			type: "div",
			style: {
				gridArea: "w",
			},
		});

		const app = HtmlBuilder.create_child(uiOutline, {
			type: "div",
			style: {
				gridArea: "a",
			},
		});

		const socials = HtmlBuilder.create_child(uiOutline, {
			type: "div",
			style: {
				gridArea: "s",
			},
		});
	}
}

// 👇 Client entry point
ChillpointEntry.initialize_client();