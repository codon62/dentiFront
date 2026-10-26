import html2pdf from 'html2pdf.js';
const isIe = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
const getSettings = (pageBreak, fileName, margin) => {
  const name = fileName || 'print';
  const settings = {
    margin: margin || [15, 0, 15, 0],
    filename: isIe ? `${name}.pdf` : name,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scrollY: 0,
      scale: 1,
      dpi: 300,
      letterRendering: true,
      useCORS: true,
      allowTaint: false, // useCORS를 true로 설정 시 반드시 allowTaint를 false로 설정해야 함
    },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  };
  if (pageBreak) {
    settings.pagebreak = { mode: 'avoid-all' };
  }
  return settings;
};

const methods = {
  htmlToPdf: (location, fileName, margin) => {
    html2pdf().set(getSettings(true, fileName, margin)).from(location).save();
  },
  htmlToPdfNotBreak: (location, fileName) => {
    html2pdf().set(getSettings(false, fileName)).from(location).save();
  },
  htmlToPdfPrint: (location, margin) => {
    html2pdf()
      .set(getSettings(true, null, margin))
      .from(location)
      .toPdf()
      .get('pdf')
      .then(function (pdfObj) {
        pdfObj.autoPrint();
        isIe ? window.navigator.msSaveBlob(pdfObj.output('bloburl'), 'print.pdf') : window.open(pdfObj.output('bloburl'));
      });
  },
  htmlToPdfPrintNotBreak: location => {
    html2pdf()
      .set(getSettings(false))
      .from(location)
      .toPdf()
      .get('pdf')
      .then(function (pdfObj) {
        pdfObj.autoPrint();
        isIe ? window.navigator.msSaveBlob(pdfObj.output('bloburl'), 'print.pdf') : window.open(pdfObj.output('bloburl'));
      });
  },
  htmlToPdfDownload: async location => {
    return await html2pdf()
      .set(getSettings(true))
      .from(location)
      .toPdf()
      .get('pdf')
      .then(async function (pdfObj) {
        return pdfObj.output('blob');
      });
  },
};

export default {
  install(Vue) {
    Vue.prototype.$htmlToPdf = methods.htmlToPdf;
    Vue.prototype.$htmlToPdfNotBreak = methods.htmlToPdfNotBreak;
    Vue.prototype.$htmlToPdfPrint = methods.htmlToPdfPrint;
    Vue.prototype.$htmlToPdfPrintNotBreak = methods.htmlToPdfPrintNotBreak;
    Vue.prototype.$htmlToPdfDownload = methods.htmlToPdfDownload;
  },
};
