import { useEffect } from "react";

const GoogleAd = () => {
  const client = import.meta.env.VITE_APP_ADSENSE_CLIENT;
  const slot = import.meta.env.VITE_APP_ADSENSE_SLOT;

  useEffect(() => {
    const loadAds = () => {
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        window.adsbygoogle.push({});
      }
    };
    loadAds();
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default GoogleAd;
