// Load the mod files after the core definitions are available.
for (let file in modInfo.modFiles) {
    let script = document.createElement("script");
    script.setAttribute("src", "js/" + modInfo.modFiles[file] + "?v=0.9.1");
    script.async = false;
    document.head.insertBefore(script, document.getElementById("temp"));
}

