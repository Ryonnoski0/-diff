import vnode from "./vnode.js";
// 创建虚拟dom
export default function h(sel, data, c) {
    if (arguments.length != 3) {
        throw new Error("参数必须是3个");
    }
    if (typeof c == "string" || typeof c == "number") {
        return vnode(sel, data, undefined, c, undefined);
    } else if (c instanceof Array) {
        let children = [];
        for (let i = 0; i < c.length; i++) {
            if (typeof c[i] != "object") {
                throw new Error(`数组中下标为 ${i} 的项不是一个对象，他是 "${c[i]}"类型为 ` + typeof c[i]);
            }
            children.push(c[i]);
        }
        return vnode(sel, data, children, undefined, undefined);
    } else if (typeof c == "object") {
        let children = [c];
        return vnode(sel, data, children, undefined, undefined);
    } else {
        throw new Error("h函数入参异常(第三个参数)");
    }
}
