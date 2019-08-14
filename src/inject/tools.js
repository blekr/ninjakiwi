import html2canvas from 'html2canvas';

export function takePhoto() {
  return new Promise(resolve => {
    console.log('-----calling')
    html2canvas(document.body).then(canvas => resolve(canvas.toDataURL()));
  });
}
