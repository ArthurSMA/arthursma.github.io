# ArthurSMA.dev — MagoDev Portfolio

Estrutura organizada para GitHub Pages:

```txt
assets/
  DevProfileArthurS.jpeg
  DevProfileArthurS-*.webp
  favicon.ico
  favicon-*.png
  apple-touch-icon.png
  styles.css
  main.js
  three-hero.js
index.html
README.md
```

## Notas de performance

- Three.js é carregado dinamicamente apenas quando a tela suporta melhor a animação.
- Em celulares pequenos, `prefers-reduced-motion` ou dispositivos com pouca memória, o canvas 3D é reduzido ou desativado.
- A foto profissional usa `picture` com WebP responsivo e fallback JPG otimizado.
- CSS e JS foram separados em `assets/` para manter `index.html` focado na apresentação.
