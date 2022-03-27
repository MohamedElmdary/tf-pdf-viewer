declare const pdfjsLib: any;

const renderPdf = (function () {
  let doc: any;
  let options: Options;
  let ctx: CanvasRenderingContext2D;

  function renderPage(n: number): Promise<void> {
    let page: any;
    let viewport: any;

    return doc
      .getPage(n)
      .then((_page) => (page = _page))
      .then(() => page.getViewport({ scale: options.scale || 1 }))
      .then((_viewport) => (viewport = _viewport))
      .then(() => {
        options.canvas.height = options.height || viewport.height;
        options.canvas.width = options.width || viewport.width;
      })
      .then(() => {
        return page.render({
          canvasContext: ctx,
          viewport,
        });
      })
      .then();
  }

  interface Options {
    path: string;
    canvas: HTMLCanvasElement;
    scale?: number;
    width?: number;
    height?: number;
  }

  return (_options: Options) => {
    options = _options;

    if (!_options || !_options.canvas || !_options.path) {
      throw new Error("`Options` is required.");
    }

    ctx = options.canvas.getContext("2d");

    return pdfjsLib
      .getDocument(options.path)
      .promise.then((_doc) => (doc = _doc))
      .then(() => {
        return {
          doc,
          options,
          ctx,
          renderPage,
          pages: doc.numPages,
        };
      }) as Promise<{
      doc: any;
      options: Options;
      ctx: CanvasRenderingContext2D;
      renderPage: typeof renderPage;
      pages: number;
    }>;
  };
})();

export { renderPdf };
