'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "440b9286998ac6f15356865cd5e67ce1",
"assets/AssetManifest.bin.json": "409089f1feda08f613ee1b022d7f1034",
"assets/AssetManifest.json": "afe49fe43d34d5179ac0e6e522360842",
"assets/assets/fonts/San-Francisco-Pro/SFProText-Bold.ttf": "d6079ef01292c4bc84dce33988641530",
"assets/assets/fonts/San-Francisco-Pro/SFProText-BoldItalic.ttf": "37ad4cdd6c17c64d2c7805bc426e45c0",
"assets/assets/fonts/San-Francisco-Pro/SFProText-Heavy.ttf": "6c498791e52ee77eedea219f291f638d",
"assets/assets/fonts/San-Francisco-Pro/SFProText-HeavyItalic.ttf": "36abf927285c38b9ef6bb1069bbc4de6",
"assets/assets/fonts/San-Francisco-Pro/SFProText-Light.ttf": "359f126c743e77d113cdc1ddda32534b",
"assets/assets/fonts/San-Francisco-Pro/SFProText-LightItalic.ttf": "27193296e16e65cac9cae9a11199b6b2",
"assets/assets/fonts/San-Francisco-Pro/SFProText-Medium.ttf": "a260cbc18870da144038776461d9df28",
"assets/assets/fonts/San-Francisco-Pro/SFProText-MediumItalic.ttf": "597d7713b611c3ac9b78b0b073d236a6",
"assets/assets/fonts/San-Francisco-Pro/SFProText-Regular.ttf": "85bd46c1cff02c1d8360cc714b8298fa",
"assets/assets/fonts/San-Francisco-Pro/SFProText-RegularItalic.ttf": "90ad050f9579d382bd5fe2e2b85bba26",
"assets/assets/fonts/San-Francisco-Pro/SFProText-Semibold.ttf": "1a131c948d598ecec700d37d168a15b5",
"assets/assets/fonts/San-Francisco-Pro/SFProText-SemiboldItalic.ttf": "5f7b2454efc9b815951433f0770c7f6c",
"assets/assets/icons/app-logo.png": "a8733d15ed04de1db02ec91a1598d778",
"assets/assets/icons/camera.png": "e59d7f2d514ea8600c4070a15716bf78",
"assets/assets/icons/dd-logo.png": "61788bd886783ae552cd7e6116e3ac57",
"assets/assets/icons/dd-logo.svg": "ce4dd0abd3e6200995c97dc21790be69",
"assets/assets/icons/diamond-dd.svg": "719980417a935526d361fd5cbe25bfe6",
"assets/assets/icons/diamond-dn.svg": "3fa123acde1b0c4dcc0da3bf6ff51f52",
"assets/assets/icons/dstu-logo.svg": "4b9a109bdd4ac634b6f4def4573007d2",
"assets/assets/icons/favicon.jpg": "8d48625b03197e3cb2c9fca7d629aaec",
"assets/assets/icons/stars.png": "34554ebf49a1a169d6388c8d73dcd2d4",
"assets/assets/icons/vk-logo.svg": "031b06c8e5efe2fd924601c6d8dfd27e",
"assets/FontManifest.json": "5489afa2845d519706e646ae5b72b729",
"assets/fonts/MaterialIcons-Regular.otf": "9ce5565cd9e2ce8a6dcf06da78189295",
"assets/NOTICES": "c6d08fc6e027956a3f94676f8e31fb11",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "64edb91684bdb3b879812ba2e48dd487",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "f87e541501c96012c252942b6b75d1ea",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "4124c42a73efa7eb886d3400a1ed7a06",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "c8f94dea26f097b4e70be956f2ccfdea",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "01c05debfe7bfa1e9f07d72f964351d9",
"icons/Icon-512.png": "af14fca767cf2f5aacb0bf0928270b93",
"icons/Icon-maskable-192.png": "01c05debfe7bfa1e9f07d72f964351d9",
"icons/Icon-maskable-512.png": "af14fca767cf2f5aacb0bf0928270b93",
"index.html": "84cb78e9420be7973d8f17e85c1bdaa8",
"/": "84cb78e9420be7973d8f17e85c1bdaa8",
"main.dart.js": "97e005b4a1e7ff0e1a8761f78d174df8",
"manifest.json": "d59a72955ffe8ead7bf75cd8c641a626",
"version.json": "49025e8af3a78a49ed9a2245d79b584b"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
