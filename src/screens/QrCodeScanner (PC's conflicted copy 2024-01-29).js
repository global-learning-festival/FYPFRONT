import React, { useEffect } from 'react';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeVerifier = () => {
  useEffect(() => {
    const docReady = (fn) => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(fn, 1);
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    };

    const onScanSuccess = (decodedText, decodedResult) => {
      window.open(decodedText, '_blank');
    };

    const qrboxFunction = (viewfinderWidth, viewfinderHeight) => {
      const minEdgeSizeThreshold = 250;
      const edgeSizePercentage = 0.75;
      const minEdgeSize = viewfinderWidth > viewfinderHeight ? viewfinderHeight : viewfinderWidth;
      const qrboxEdgeSize = Math.floor(minEdgeSize * edgeSizePercentage);

      if (qrboxEdgeSize < minEdgeSizeThreshold) {
        if (minEdgeSize < minEdgeSizeThreshold) {
          return { width: minEdgeSize, height: minEdgeSize };
        } else {
          return {
            width: minEdgeSizeThreshold,
            height: minEdgeSizeThreshold,
          };
        }
      }

      return { width: qrboxEdgeSize, height: qrboxEdgeSize };
    };

    docReady(() => {
      const html5QrcodeScanner = new Html5QrcodeScanner('reader', {
        fps: 144,
        qrbox: qrboxFunction,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      });

      html5QrcodeScanner.render(onScanSuccess);
    });

    return () => {};
  }, []);

  return (
    <>
      <div className="container mx-auto my-8 text-center">
        <h1 className="text-2xl font-bold">QRCode Scanner</h1>
      </div>

      <section className="container mx-auto">
        <div className="flex min-h-screen justify-center items-center">
          <div className="w-full md:w-1/3">
            <main>
              <div id="reader"></div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default QRCodeVerifier;