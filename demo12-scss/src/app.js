// 同步加载
// import "./style1.scss";
// import "./style2.scss";


window.addEventListener("click", function () {
  // 试试异步加载? 查看控制台试试
  const style1 = import("./style1.scss");
  const style2 = import("./style2.scss");
});