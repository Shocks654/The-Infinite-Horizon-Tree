// treeLayout will override the default tree's layout if used
var layoutInfo = {
    startTab: "c",
    startNavTab: "tree-tab",

	showTree: true,

    //treeLayout: ""
}

// A testTree határozza meg, hogy melyik réteg melyik sorban van a térképen
var testTree = [
    ["c"], // 0. sor: Prestige (c)
    ["b"]  // 1. sor: Boosters (b) -> pontosan a Prestige alá kerül!
]

addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
    style() {return  {'background-color': '#222222'}},
})
