/*import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('colorTheme');
                  if (savedTheme) {
                    document.documentElement.classList.add(savedTheme);
                    
                    // Set initial CSS variables
                    var root = document.documentElement;
                    root.style.setProperty("--theme-primary", "var(--" + savedTheme + "-primary)");
                    root.style.setProperty("--theme-primary-lighter", "var(--" + savedTheme + "-primary-lighter)");
                    root.style.setProperty("--theme-primary-darker", "var(--" + savedTheme + "-primary-darker)");
                    root.style.setProperty("--theme-gradient", "var(--" + savedTheme + "-gradient)");
                    root.style.setProperty("--theme-dark-gradient", "var(--" + savedTheme + "-dark-gradient)");
                    root.style.setProperty("--theme-gradient2", "var(--" + savedTheme + "-gradient2)");
                    root.style.setProperty("--theme-gradient2-dark", "var(--" + savedTheme + "-gradient2-dark)");
                    root.style.setProperty("--theme-50", "var(--" + savedTheme + "-primary-50)");
                    root.style.setProperty("--theme-100", "var(--" + savedTheme + "-primary-100)");
                    root.style.setProperty("--theme-200", "var(--" + savedTheme + "-primary-200)");
                    root.style.setProperty("--theme-300", "var(--" + savedTheme + "-primary-300)");
                    root.style.setProperty("--theme-400", "var(--" + savedTheme + "-primary-400)");
                    root.style.setProperty("--theme-700", "var(--" + savedTheme + "-700)");
                    root.style.setProperty("--theme-950", "var(--" + savedTheme + "-primary-950)");
                    root.style.setProperty("--theme-800", "var(--" + savedTheme + "-primary-800)");
                    root.style.setProperty("--theme-600", "var(--" + savedTheme + "-primary-600)");
                    root.style.setProperty("--theme-light-bg", "var(--" + savedTheme + "-primary-50)");
                    root.style.setProperty("--theme-oklch-gradient", "var(--" + savedTheme + "-gradient2)");
                    root.style.setProperty("--theme-oklch-gradient-dark", "var(--" + savedTheme + "-gradient2-dark)");
                  }
                } catch (e) { console.error('Theme initialization error:', e); }
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} */
