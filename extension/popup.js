/*
 * uget-chrome-wrapper is an extension to integrate uGet Download manager
 * with Google Chrome, Chromium, Vivaldi and Opera in Linux and Windows.
 *
 * Copyright (C) 2016  Gobinath
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var current_browser;

try {
	current_browser = browser;
	current_browser.runtime.getBrowserInfo().then(
		function(info) {
			if (info.name === 'Firefox') {
				// Do nothing
			}
		}
	);
} catch (ex) {
	console.log('No firefox');
	current_browser = chrome;
}

function saveChanges() {
	var keywords = document.getElementById("keywords").value;
	var interrupt = document.getElementById('chk-interrupt').checked;

	localStorage["uget-keywords"] = keywords;

	current_browser.runtime.getBackgroundPage(function(backgroundPage) {
		backgroundPage.updateKeywords(keywords);
		backgroundPage.setInterruptDownload(interrupt, true);
	});

	window.close();
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
	// Show the system status
	current_browser.runtime.getBackgroundPage(function(backgroundPage) {
		var message = backgroundPage.getInfo().replace(/<[^>]*>?/g, '');
		var label = 'error';
		if (message.toLowerCase().startsWith("info")) {
			label = 'info';
		} else if (message.toLowerCase().startsWith("warn")) {
			label = 'warn';
		}
		document.getElementById(label).innerHTML = message;
	});

	let interrupt = (localStorage["uget-interrupt"] == "true");
	document.getElementById('save').addEventListener('click', saveChanges);
	document.getElementById('keywords').value = localStorage["uget-keywords"];
	document.getElementById('chk-interrupt').checked = interrupt;
});