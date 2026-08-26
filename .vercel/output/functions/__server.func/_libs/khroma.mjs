import { Qn as adjustChannel, nr as Utils, tr as Color } from "./@streamdown/mermaid+[...].mjs";
//#region node_modules/khroma/dist/methods/channel.js
var channel = (color, channel) => {
	return Utils.lang.round(Color.parse(color)[channel]);
};
//#endregion
//#region node_modules/khroma/dist/methods/transparentize.js
var transparentize = (color, amount) => {
	return adjustChannel(color, "a", -amount);
};
//#endregion
export { channel as n, transparentize as t };
