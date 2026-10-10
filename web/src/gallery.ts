// Photo gallery content. To add a photo: drop the original in src/assets/photos,
// run `npm run photos`, then add an entry here (slug = lowercased file name,
// non-alphanumerics as hyphens, e.g. IMG_1234.jpeg → img-1234).

import sizes from './gallery-sizes.json'

export type Photo = {
  slug: string
  caption: string
  alt: string
  // Shown in the "From the trail" strip on the home page.
  featured?: boolean
}

const entries: Photo[] = [
  { slug: 'img-0976', featured: true, caption: 'Last light on the ridge', alt: 'Silhouette of a hiker in a sun hat standing on a rocky ridge at sunset, pines and distant mountains behind' },
  { slug: '1000002471', featured: true, caption: 'Finishing the Crazy Mountain 100', alt: 'Chris smiling under the Crazy Mountain 100 finish banner, holding a finisher buckle in a grassy field' },
  { slug: '4931145433163682413', featured: true, caption: 'Catching air in fresh snow', alt: 'Snowboarder mid-air off a rocky outcrop on a snowy, foggy slope' },
  { slug: 'img-1063', featured: true, caption: 'Bugling before sunrise', alt: 'Silhouette of a hunter blowing an elk bugle against a deep blue pre-dawn sky with a bright planet' },
  { slug: 'img-2927', caption: "Made light work of Lone Peak (I'm actually dying inside)", alt: 'Chris running a dirt road in a race bib, throwing a shaka, with Lone Peak behind' },
  { slug: 'img-0465', caption: 'Night miles', alt: 'Trail runner with a headlamp and running vest climbing a steep forest trail at night beside a rope line' },
  { slug: 'img-1603', caption: 'Sunrise from the trail', alt: 'Red and orange sunrise over layered forested mountains, seen from a trail through the pines' },
  { slug: 'img-0705', caption: 'Backcountry tour after a big storm', alt: 'Chris on skis with poles raised, grinning in deep snow among heavily snow-covered firs' },
  { slug: 'img-1612', caption: 'Bad kitty came way too close', alt: 'A mountain lion half-hidden behind downed logs on a forested hillside with yellow autumn leaves' },
  { slug: 'img-1220', caption: 'Moose in the willows', alt: 'A young moose browsing on bare willow branches in late winter' },
  { slug: 'img-1438', caption: 'Great gray owl', alt: 'A great gray owl perched between ponderosa pine trunks' },
  { slug: 'img-1413', caption: 'Elk in the neighborhood', alt: 'Selfie of Chris in a cap with elk grazing among the trees behind him' },
  { slug: 'img-1444', caption: 'Bird dog in the huckleberries', alt: 'A German shorthaired pointer peeking through a huckleberry bush, tongue out' },
  { slug: 'img-1448', caption: 'Huckleberry haul', alt: 'A hand over a zip-top bag half full of freshly picked huckleberries on a rocky trail' },
  { slug: 'img-1572-still', caption: 'Chasing a bull thru the timber', alt: 'Sunlit aspens and downed timber in the forest where a bull elk was moving through' },
  { slug: 'img-7470', caption: 'About to get my race on', alt: 'Chris carrying a snowboard past snow-covered firs and cabins' },
  { slug: 'img-7473', caption: 'Maple syrup and bread are the best race prizes', alt: 'Chris smiling at night in front of a lit ski run, holding a bottle of maple syrup and a paper bag of bread' },
  { slug: 'img-1106', caption: 'My co-worker', alt: 'Selfie of Chris with his German shorthaired pointer sitting beside a desk and laptop' },
]

const base = `${import.meta.env.BASE_URL}photos/`
const dims = sizes as Record<string, { w: number; h: number }>

export const photos = entries
  .filter((p) => dims[p.slug])
  .map((p) => ({
    ...p,
    small: `${base}${p.slug}-sm.webp`,
    large: `${base}${p.slug}-lg.webp`,
    width: dims[p.slug].w,
    height: dims[p.slug].h,
  }))

export type GalleryPhoto = (typeof photos)[number]
