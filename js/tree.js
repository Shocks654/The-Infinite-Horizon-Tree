// treeLayout will override the default tree's layout if used
var layoutInfo = {
    startTab: "none", // Set to "none" because the layer position is handled inside the prestige file
    startNavTab: "tree-tab", // Keeps the main navigation focused on the tree layout
	showTree: true,
    treeLayout: ""
}

// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
})

// Register the main tree tab within the game engine
addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "", // Left blank to allow proper back navigation
    leftTab: true,
})
