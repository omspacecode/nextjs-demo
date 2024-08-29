import React, { useEffect } from "react";

interface TrustpilotWidgetProps {
  locale: string;
  templateId: string;
  businessUnitId: string;
  styleHeight: string;
  styleWidth: string;
  theme: string;
  stars: string;
  reviewLanguages: string;
}

const TrustpilotWidget: React.FC<TrustpilotWidgetProps> = ({
  locale,
  templateId,
  businessUnitId,
  styleHeight,
  styleWidth,
  theme,
  stars,
  reviewLanguages,
}) => {
  useEffect(() => {
    // Inject required styles and scripts
    const injectStyleAndScripts = () => {
      const linkFont = document.createElement("link");
      linkFont.rel = "stylesheet";
      linkFont.href = "https://use.typekit.net/joc5gch.css";
      document.head.appendChild(linkFont);

      const scriptTrustpilot = document.createElement("script");
      scriptTrustpilot.type = "text/javascript";
      scriptTrustpilot.src = "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
      document.head.appendChild(scriptTrustpilot);

      const scriptFontAwesome = document.createElement("script");
      scriptFontAwesome.type = "text/javascript";
      scriptFontAwesome.src = "https://kit.fontawesome.com/65e820d6f9.js";
      scriptFontAwesome.crossOrigin = "anonymous";
      document.head.appendChild(scriptFontAwesome);
    };

    injectStyleAndScripts();
  }, []);

  return (
    <div
      className="trustpilot-widget"
      data-locale={locale}
      data-template-id={templateId}
      data-businessunit-id={businessUnitId}
      data-style-height={styleHeight}
      data-style-width={styleWidth}
      data-theme={theme}
      data-stars={stars}
      data-review-languages={reviewLanguages}
    >
      <a href="https://www.trustpilot.com/review/www.turbopass.de" target="_blank" rel="noopener">
        Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotWidget;
