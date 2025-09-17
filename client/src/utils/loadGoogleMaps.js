let loaderPromise;

export const loadGoogleMapsPlaces = async () => {
  if (window.google?.maps?.places) return window.google;
  if (loaderPromise) return loaderPromise;

  // eslint-disable-next-line no-undef
  const apiKey = process.env.GOOGLE_API;
  if (!apiKey) throw new Error('Missing GOOGLE_API environment variable');

  const existing = document.getElementById('google-maps-js');
  if (existing) {
    if (window.google?.maps?.places) return window.google;
    loaderPromise = new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window.google));
      existing.addEventListener('error', reject);
    });
    return loaderPromise;
  }

  const script = document.createElement('script');
  script.id = 'google-maps-js';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
  script.async = true;
  script.defer = true;

  loaderPromise = new Promise((resolve, reject) => {
    script.onload = () => resolve(window.google);
    script.onerror = reject;
  });

  document.head.appendChild(script);
  return loaderPromise;
};