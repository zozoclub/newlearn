export const preventScroll = () => {
  document.body.style.position = "fixed";
  document.body.style.overflowY = "scroll";
};

export const allowScroll = () => {
  document.body.style.position = "";
  document.body.style.overflowY = "";
};
