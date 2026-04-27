import { decode } from "../src/index.js";
const p = document.querySelector("p");

function print(errorQuery) {
	if (errorQuery) {
		const output = decode(errorQuery);
		if (output === errorQuery) {
			p.textContent = "-- No error message found in dictionary. --";
			return;
		}
		p.textContent = output;
	}
}

document
	.getElementById("error")
	.addEventListener("input", (event) => print(event.target.value));
document.getElementById("error").focus();
