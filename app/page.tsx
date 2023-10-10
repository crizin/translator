'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [source, setSource] = useState('');
  const [translated, setTranslated] = useState('');
  const [reverseTranslated, setReverseTranslated] = useState('');
  const [abortController, setAbortController] = useState(new AbortController());
  const [responseTime, setResponseTime] = useState<number>();

  useEffect(() => {
    if (source === '') {
      return;
    }

    const timer = setTimeout(() => {
      (async () => {
        if (abortController) {
          abortController.abort();
        }

        const newAbortController = new AbortController();
        setAbortController(newAbortController);

        try {
          setTranslated('Translating...');
          setReverseTranslated('Translating...');

          console.debug('fetching...');

          const requested = performance.now();
          const res = await fetch('translate', {
            signal: newAbortController.signal,
            method: 'POST',
            body: JSON.stringify({ source }),
          });

          setResponseTime(performance.now() - requested);

          const data = await res.json();
          setTranslated(data.translated);
          setReverseTranslated(data.reverseTranslated);
        } catch (e: any) {
          if (e.name === 'AbortError') {
            console.debug('Fetch aborted!');
          } else {
            console.error('An unexpected error occurred:', e);
          }
        }
      })();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [source]);

  return (
    <>
      <div className="grid grid-cols-3 gap-5 mx-5">
        <div className="col-span-3 md:col-span-1">
          <textarea
            className="bg-stone-900 text-stone-300 outline-0 rounded-lg p-3 w-full h-[25vh] md:h-80"
            autoFocus
            defaultValue={source}
            placeholder="Try entering a sentence in Korean or English."
            onChange={(e) => setSource(e.target.value)}
          ></textarea>
        </div>
        <div className="col-span-3 md:col-span-1">
          <textarea className="bg-gray-800 text-stone-100 outline-0 rounded-lg p-3 w-full h-[25vh] md:h-80" value={translated} readOnly></textarea>
        </div>
        <div className="col-span-3 md:col-span-1">
          <textarea className="bg-gray-800 text-stone-100 outline-0 rounded-lg p-3 w-full h-[25vh] md:h-80" value={reverseTranslated} readOnly></textarea>
        </div>
      </div>
      {responseTime && <div className="text-stone-500 text-sm mx-5">Fetched on {(responseTime / 1000).toFixed(2)}s</div>}
    </>
  );
}
