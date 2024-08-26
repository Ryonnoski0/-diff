import vnode from "./vnode.js";

export default function (oldVnode, newVnode) {
    //如果是真实节点
    if (oldVnode.sel === undefined) {
        const id = oldVnode.id ? "#" + oldVnode.id : "";
        const c = oldVnode.className ? "." + oldVnode.className.split(" ").join(".") : "";
        const tagName = oldVnode.tagName.toLowerCase();

        oldVnode = vnode(tagName + id + c, {}, [], undefined, oldVnode);
    }
    if (sameVnode(newVnode, oldVnode)) {
        patchVnode(oldVnode, newVnode);
    } else {
        //创建新的dom
        createDomTree(newVnode);
        oldVnode.elm.parentNode.insertBefore(newVnode.elm, oldVnode.elm);
        //删除旧的
        oldVnode.elm.parentNode.removeChild(oldVnode.elm);
    }
}
function sameVnode(newVnode, oldVnode) {
    return oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel;
}
function updateChildren(parentEml, oldCh, newCh) {
    let newStartIndex = 0; //新前指针
    let oldStartIndex = 0; //新后指针
    let newEndIndex = newCh.length - 1; //新后指针
    let oldEndIndex = oldCh.length - 1; //旧后指针
    let newStartVnode = newCh[newStartIndex]; //新前Vnode
    let oldStartVnode = oldCh[oldStartIndex]; //旧前Vnode
    let newEndVnode = newCh[newEndIndex]; //新后Vnode
    let oldEndVnode = oldCh[oldEndIndex]; //旧后Vnode
    let keyMap = null;
    /**
     * diff算法，规则
     * 匹配指针规则
     * 1. 新前旧前
     * 2. 新后旧后
     * 3. 新后旧前
     * 4. 新前旧后
     * 如果匹配到了继续匹配，如果没匹配到，进行下一个匹配规则
     * 如果全部匹配都没匹配到，循环旧节点查找新元素
     */
    while (newEndIndex >= newStartIndex && oldEndIndex >= oldStartIndex) {
        if (newStartVnode == undefined) {
            newStartVnode = newCh[++newStartIndex];
        } else if (newEndVnode == undefined) {
            newEndVnode = newCh[--newEndIndex];
        } else if (oldStartVnode == undefined) {
            oldStartVnode = oldCh[++oldStartIndex];
        } else if (oldEndVnode == undefined) {
            oldEndVnode = oldCh[--oldEndIndex];
        } else if (sameVnode(newStartVnode, oldStartVnode)) {
            console.log("命中1");
            patchVnode(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIndex];
            newStartVnode = newCh[++newStartIndex];
        } else if (sameVnode(newEndVnode, oldEndVnode)) {
            console.log("命中2");
            patchVnode(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIndex];
            newEndVnode = newCh[--newEndIndex];
        } else if (sameVnode(newEndVnode, oldStartVnode)) {
            console.log("命中3", oldStartIndex, oldEndIndex);
            patchVnode(oldStartVnode, newEndVnode);
            parentEml.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
            oldStartVnode = oldCh[++oldStartIndex];
            newEndVnode = newCh[--newEndIndex];
        } else if (sameVnode(newStartVnode, oldEndVnode)) {
            console.log("命中4");
            patchVnode(oldEndVnode, newStartVnode);
            parentEml.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIndex];
            newStartVnode = newCh[++newStartIndex];
        } else {
            //循环查找
            if (!keyMap) {
                keyMap = {};
                for (let i = oldStartIndex; i <= oldEndIndex; i++) {
                    const key = oldCh[i].key;
                    if (keyMap != undefined) {
                        keyMap[key] = i;
                    }
                }
            }
            const indexInOld = keyMap[newStartVnode.key];
            if (indexInOld == undefined) {
                //如果不存在说明是新的
                parentEml.insertBefore(createDomTree(newStartVnode), oldStartVnode.elm);
            } else {
                //如果存在就移动
                patchVnode(oldCh[indexInOld], newStartVnode);
                parentEml.insertBefore(oldCh[indexInOld].elm, oldStartVnode.elm);
                oldCh[indexInOld] = undefined;
            }
            newStartVnode = newCh[++newStartIndex];
        }
    }

    if (oldStartIndex > oldEndIndex) {
        console.log("oldIndex指针先走完");
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            parentEml.appendChild(createDomTree(newCh[i]));
        }
    } else {
        console.log("newIndex指针先走完", newEndVnode);
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            if (oldCh[i]) {
                parentEml.removeChild(oldCh[i].elm);
            }
        }
    }
}
function patchVnode(oldVnode, newVnode) {
    if (oldVnode === newVnode) return;
    if (!isCh(newVnode)) {
        if (newVnode.text === oldVnode.text) return;
        oldVnode.elm.innerText = newVnode.text;
    } else {
        if (isCh(oldVnode)) {
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
            if (newVnode.elm === undefined) {
                newVnode.elm = oldVnode.elm;
            }
        } else {
            oldVnode.elm.innerHTML = "";
            //创建新的dom
            let dom = createDomTree(newVnode);
            oldVnode.elm.appendChild(dom);
        }
    }
}

//是否有子节点
function isCh(vnode) {
    return vnode.text == undefined && (vnode.children != undefined || vnode.children.length != 0);
}
// 创建dom树
function createDomTree(vnode) {
    let domTree = document.createElement(vnode.sel);
    //如果没有子节点直接走
    if (!isCh(vnode)) {
        domTree.innerText = vnode.text;
    } else if (Array.isArray(vnode.children) && vnode.children.length) {
        //递归创建dom树
        for (let i = 0; i < vnode.children.length; i++) {
            let newDom = createDomTree(vnode.children[i]);
            domTree.appendChild(newDom);
        }
    }
    vnode.elm = domTree;
    return vnode.elm;
}
