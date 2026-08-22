// treeLayout will override the default tree's layout if used
var layoutInfo = {
    startTab: "none", // Set to "none" so the game starts on the main map instead of inside a layer
    startNavTab: "tree-tab", // Keeps the main navigation focused on the tree layout
	showTree: true,
    treeLayout: ""
}

// Defines the layout of the tree with rows and layers
var testTree = [
    ["p"] // Row 0 contains only the Prestige (p) layer. This fixes the missing button bug!
]

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
