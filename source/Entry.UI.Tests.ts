import { HtmlBuilder } from './Util.HtmlBuilder';
import { ChillpointStyles as Styles, ChillpointStyles } from './Chillpoint.Styles';
import { Terrain } from './Util.Terrain';
import { Camera } from './Util.Camera';
import { Meeples } from './Util.Meeples';
import { Forest } from './Util.Forest';
import { Weebles } from './Util.Weebles';
import { Editor } from './Util.Editor';
import { PeerAdvertising } from './Util.PeerAdvertising';
import { PeerConnection } from './Util.PeerConnection';
import { modelTests } from "./Model.Tests";

/**
 *	👨‍🔬 Test front-end UI features using different named environments
 */
export namespace UITests {
	export function initialize_client() {

		modelTests();

		const body = HtmlBuilder.assign_to_element(document.body, {
			style: {
				margin: 0,
				fontSize: 20,
				position: "relative",
				overflowX: "hidden",
				overflowY: "hidden",
			},
		});

		const camera: Camera.Transform = {
			"camera_position": [[0, 15]],
			"camera_size": [[7 * window.innerWidth / window.innerHeight, 7]],
		}

		const tests = {
			terrain: () => {
				Terrain.render(body, camera, 32, {});
			},
			forest_small: () => {
				Terrain.render(body, camera, 32, ChillpointStyles.blurred);
				Forest.render(body, camera);
			},
			forest_big: () => {
				Terrain.render(body, camera, 32, {});
				Forest.render(body, camera);
			},
			meeples: () => {
				Terrain.render(body, camera, 32, {});
				Meeples.render(body, camera);
			},
			editor: () => {
				Terrain.render(body, camera, 32, ChillpointStyles.blurred);
				Editor.render(body);
			},
			register_peer: async () => {
				PeerAdvertising.advertise_peer({
					identifier: `${Math.random()}`.slice(2, 8),
					role: "web",
				});
				const info = HtmlBuilder.create_child(body, {
					type: "div",
					attributes: { innerHTML: "Registering peer!" },
					style: { color: "white" },
				});
				setInterval(async () => {
					HtmlBuilder.assign_to_element(info, {
						attributes: { innerHTML: `${JSON.stringify(await PeerAdvertising.available_peers())}` },
					});
				}, 1000);
			},
			peer_example: PeerConnection.example,
		};

		const url = new URL(window.location.href);
		const test_name = url.searchParams.get("test") as keyof typeof tests;

		tests[test_name]();

		const ui_outline = HtmlBuilder.create_child(body, {
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

		const footer = HtmlBuilder.create_child(ui_outline, {
			type: "div",
			style: {
				gridArea: "f",
				gridTemplateAreas: `
					"w c s"
				`
			},
		});

		const warning = HtmlBuilder.create_child(ui_outline, {
			type: "div",
			style: {
				gridArea: "w",
			},
		});

		const app = HtmlBuilder.create_child(ui_outline, {
			type: "div",
			style: {
				gridArea: "a",
			},
		});

		const socials = HtmlBuilder.create_child(ui_outline, {
			type: "div",
			style: {
				gridArea: "s",
			},
		});
	}
}

// 👇 Client entry point
UITests.initialize_client();