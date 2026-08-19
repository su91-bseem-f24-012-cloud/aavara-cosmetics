# Product photos go here

Drop your real product photos in this folder (e.g. `charcoal-face-wash.jpg`),
then reference them in `src/App.jsx` inside the `RAW_PRODUCTS` array like this:

{ name: "Charcoal Deep-Clean Face Wash", image: "/images/charcoal-face-wash.jpg", ... }

Any product without an `image` field automatically falls back to the
illustrated placeholder, so you can add real photos gradually, one product
at a time. Square photos (1:1) work best since the product cards are square.
