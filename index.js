import patch from "./patch.js";
import h from "./h.js";
const myVnode = h("ul", {}, [h("li", { key: "A" }, "A"), h("li", { key: "B" }, "B"), h("li", { key: "C" }, "C"), h("li", { key: "D" }, "D")]);

const myVnode3 = h("ul", {}, [
    h("li", { key: "E" }, "E"),
    h("li", { key: "A" }, "A"),
    h("li", { key: "F" }, "F"),
    h("ul", { key: "C" }, [h("li", { key: "C" }, "C"), h("li", { key: "T" }, "T"), h("li", { key: "FW" }, "FW")]),
    h("ul", { key: "BI" }, [h("li", { key: "FAA" }, "FAA")]),
    h("li", { key: "Q" }, "Q"),
]);
const container = document.getElementById("container");
console.log(container);
patch(container, myVnode);
const but = document.getElementById("but");
but.onclick = function () {
    patch(myVnode, myVnode3);
};
