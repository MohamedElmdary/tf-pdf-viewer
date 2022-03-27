import { renderPdf } from "./lib";

const loader = document.getElementById("loader");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const canvas = document.createElement("canvas");
document.body.append(canvas);

async function main() {
  // initia loading
  _setDisable(true);
  loader.classList.remove("loader");
  const { renderPage, pages } = await renderPdf({
    canvas,
    path: "https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf",
  });
  loader.classList.add("loader");

  async function _renderPage(n: number) {
    try {
      _setDisable(true);
      loader.classList.remove("loader");
      await renderPage(n);
      loader.classList.add("loader");
      _setDisable(false);
    } catch {
      loader.classList.add("loader");
      _setDisable(false);
    }
  }

  function _setDisable(loading: boolean) {
    if (loading) {
      previous.setAttribute("disabled", "disabled");
      next.setAttribute("disabled", "disabled");
      return;
    }

    if (page === 1) {
      previous.setAttribute("disabled", "disabled");
    } else {
      previous.removeAttribute("disabled");
    }

    if (page === pages) {
      next.setAttribute("disabled", "disabled");
    } else {
      next.removeAttribute("disabled");
    }
  }

  let page: number = 1;

  await _renderPage(page);

  next.addEventListener("click", async () => {
    await _renderPage(++page);
  });

  previous.addEventListener("click", async () => {
    await _renderPage(--page);
  });
}

main();
