// 转换参数为对象
export default function vnode(sel, data, children, text, elm) {
    let key = data.key;
    return { sel, data, key, children, text, elm };
}
