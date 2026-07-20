# TwoTales Çini Mağazası

Geleneksel İznik ve Kütahya çinilerini sergileyen React + Vite tabanlı tek sayfa uygulaması.

## Yerel geliştirme

Node.js ve Yarn kurulu olmalıdır.

```bash
yarn install
yarn dev
```

Production çıktısını doğrulamak için:

```bash
yarn lint
yarn build
yarn preview
```

## Vercel'e dağıtım

Depoyu Vercel'e bağlayın. Vercel projeyi Vite olarak otomatik algılar ve şu ayarları kullanır:

- Build Command: `yarn build`
- Output Directory: `dist`
- Environment Variables: Gerekmiyor

`vercel.json`, tek sayfa uygulamasındaki doğrudan URL isteklerini `index.html` dosyasına yönlendirir.

Komut satırından dağıtmak için proje kökünde `vercel` komutunu da çalıştırabilirsiniz.

[Vercel'in Vite dağıtım dokümantasyonu](https://vercel.com/docs/frameworks/frontend/vite)
