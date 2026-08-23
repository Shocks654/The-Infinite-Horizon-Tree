// treeLayout will override the default tree's layout if used
var layoutInfo = {
    startTab: "none", // Keeps the main tree map loaded on launch
    startNavTab: "tree-tab", // Keeps the navigation focused on the tree tab
	showTree: true,
    treeLayout: ""
}

// THIS FIXES THE ROW BUG: Tells the map engine exactly where layer "p" is!
var testTree = [
    ["p"] // Row 0 contains only your Prestige ("p") layer
]

// Register the main tree tab within the game engine
addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "", // Left completely blank to ensure proper back button functionality
    leftTab: true,
})

