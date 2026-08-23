// treeLayout will override the default tree's layout if used
var layoutInfo = {
    startTab: "none", // Must be set to "none" because the layer position is handled inside the prestige file
    startNavTab: "tree-tab", // Keeps the main navigation focused on the tree layout
	showTree: true,
    treeLayout: ""
}

// THIS FIXES THE 'ROW' BUG: The engine needs this list to know how to draw the map rows!
var testTree = [
    ["p"] // Row 0 contains only your Prestige ("p") layer
]

// Register the main tree tab within the game engine
addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "", // Left blank to allow proper back navigation via the arrow key
    leftTab: true,
})
